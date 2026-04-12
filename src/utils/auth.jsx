import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { auth, db } from './firebase';
import { 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    createUserWithEmailAndPassword,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    getAuth
} from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    onSnapshot, 
    query, 
    where, 
    deleteDoc,
    updateDoc,
    getDocs
} from 'firebase/firestore';

const ALL_ROUTES = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/clientes', label: 'Clientes' },
    { path: '/leads', label: 'CRM & Funil (Leads)' },
    { path: '/prospeccao', label: 'Prospecção' },
    { path: '/reunioes', label: 'Agenda de Reuniões' },
    { path: '/trafego', label: 'Mídia & Performance' },
    { path: '/tracking', label: 'Tracking (UTMfy)' },
    { path: '/academy', label: 'Trilha de Onboarding' },
    { path: '/metas', label: 'Calendário de Metas' },
    { path: '/pesquisas', label: 'Pesquisas (NPS)' },
    { path: '/configuracoes', label: 'Configurações' },
    { path: '/financeiro', label: 'Financeiro' },
    { path: '/equipe', label: 'Gerenciar Equipe' },
    { path: '/tarefas', label: 'Tarefas da Equipe' },
    { path: '/docs', label: 'Docs & Senhas' },
    { path: '/whitelabel', label: 'White-Label (SaaS)' },
    { path: '/migrar', label: 'Migração de Dados' },
    { path: '/extrator', label: 'Extractor Landing' },
    { path: '/extrator-ferramenta', label: 'Extractor Tool' },
];

const ROLE_PRESETS = {
    ceo: ALL_ROUTES.map(r => r.path),
    cliente_admin: ALL_ROUTES.filter(r => !['/whitelabel'].includes(r.path)).map(r => r.path),
    gestor: ['/dashboard', '/clientes', '/leads', '/prospeccao', '/reunioes', '/trafego', '/tracking', '/academy', '/metas', '/tarefas'],
    financeiro: ['/dashboard', '/clientes', '/metas', '/configuracoes', '/financeiro'],
    sdr: ['/dashboard', '/clientes', '/leads', '/prospeccao', '/reunioes', '/tarefas'],
    designer: ['/dashboard', '/tarefas', '/docs', '/clientes'],
    cliente: ['/trafego', '/academy'],
    extrator: ['/extrator', '/extrator-ferramenta'],
};

const INITIAL_USERS = [
    { id: 2, email: 'contato@u3company.com', password: 'ceo@2026', name: 'Administrador Principal', role: 'ceo', customPermissions: null }
];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    // ============================================================
    // SYNC USERS LIST (REAL-TIME) FROM FIRESTORE
    // ============================================================
    useEffect(() => {
        // Só liga a antena do banco de dados de usuários se já houver autenticação validada.
        // Evita que o Firebase expulse o Listener por Permission Denied (Missing Crachá no boot).
        if (!user || user.role === 'bloqueado') {
            setUsersList([]);
            return;
        }

        const q = query(collection(db, "crm_users"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const users = [];
            snapshot.forEach((doc) => {
                users.push({ ...doc.data(), id: doc.id });
            });
            // Fallback para usuários iniciais se o banco estiver vazio (Legacy Mode)
            if (users.length === 0) setUsersList(INITIAL_USERS);
            else setUsersList(users);
        }, (err) => console.error("Falha no Realtime da Equipe:", err));

        return () => unsubscribe();
    }, [user?.id]);

    // ============================================================
    // WATCH AUTH STATE
    // ============================================================
    useEffect(() => {
        // Safety timeout: se Firebase não responder em 5s, libera a UI
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000);

        let unsubscribe = () => {};
        try {
            unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    // PREEMPTIVE OPTIMISTIC LOGIN: Garante que apenas o Admin master entre imediatamente ignorando latência
                    const legacy = INITIAL_USERS.find(u => u.email === firebaseUser.email);
                    const isMasterAdmin = legacy !== undefined;

                    const optimisticUserData = {
                        name: legacy?.name || firebaseUser.displayName || 'Visitante (Bloqueado)',
                        role: legacy?.role || 'bloqueado', // NUNCA DEIXE CEO COMO FALLBACK ABERTO!
                        customPermissions: legacy?.customPermissions || null,
                        tenantId: legacy?.tenantId || null
                    };

                    // Destrava UI instantaneamente apenas se for a conta Mestre Confidencial (Legacy)
                    if (isMasterAdmin) {
                        setUser({ ...optimisticUserData, id: firebaseUser.uid, email: firebaseUser.email });
                    }
                    
                    setLoading(false);

                    // Puxa a ficha técnica verdadeira do perfil
                    try {
                        const userDoc = await getDoc(doc(db, "crm_users", firebaseUser.uid));
                        if (userDoc.exists()) {
                            // Se tem acesso oficial criado pela agência ou admin via CRM, deixa entrar:
                            setUser({ ...userDoc.data(), id: firebaseUser.uid, email: firebaseUser.email });
                        } else {
                            if (isMasterAdmin) {
                                // Se for nulo e for o contato admin oficial, reconstrói o passe mestre.
                                await setDoc(doc(db, "crm_users", firebaseUser.uid), optimisticUserData);
                            } else {
                                // AUTO-PROVISIONAMENTO DE AGÊNCIA
                                // Se o e-mail não foi criado pelo painel da plataforma mas apareceu no login,
                                // foi um Onboarding manual que o Dono do Saas criou escondido lá pelo Firebase Auth.
                                // Nasce não como bloqueado, mas sim como o Chefe Soberano de uma Nova Agência:
                                const newAgencyData = {
                                    name: firebaseUser.displayName || 'Nova Franquia / Agência',
                                    email: firebaseUser.email,
                                    role: 'cliente_admin',
                                    tenantId: null, // Como é a Agência Mãe do Tenant, o tenantId é a própria chave dele, então fica null.
                                    status: 'active'
                                };
                                await setDoc(doc(db, "crm_users", firebaseUser.uid), newAgencyData);
                                setUser({ ...newAgencyData, id: firebaseUser.uid });
                            }
                        }
                    } catch (err) {
                        console.error('Firestore sync em background falhou. Sessão instável.', err);
                    }
                } else {
                    setUser(null);
                    setLoading(false);
                }
            });
        } catch (err) {
            console.error('Erro ao inicializar Firebase Auth:', err);
            clearTimeout(timeout);
            setLoading(false);
        }

        return () => { clearTimeout(timeout); unsubscribe(); };
    }, []);

    const getNamespace = useCallback((overrideUser) => {
        const u = overrideUser || user;
        if (!u) return 'shared';
        if (u.role === 'ceo') return 'shared';
        if (u.role === 'cliente_admin') return `tenant_${u.id}`;
        if (u.tenantId) return `tenant_${u.tenantId}`;
        return 'shared';
    }, [user]);

    // ============================================================
    // AUTH ACTIONS
    // ============================================================
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            // MIGRATION HELPER & LAZY AUTH CREATION
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials') {
                
                // 1. CHECAGEM DE USUÁRIOS CHUMBADOS (LEGACY)
                const legacy = INITIAL_USERS.find(u => u.email === email && u.password === password);
                if (legacy) {
                    try {
                        const newCred = await createUserWithEmailAndPassword(auth, email, password);
                        const profile = {
                            name: legacy.name,
                            role: legacy.role,
                            customPermissions: legacy.customPermissions,
                            tenantId: legacy.tenantId || null,
                            migrated: true
                        };
                        await setDoc(doc(db, "crm_users", newCred.user.uid), profile);
                        return { success: true, user: newCred.user };
                    } catch (e) {
                        return { success: false, error: 'Erro na migração da conta Admin.' };
                    }
                }

                // 2. CHECAGEM DE USUÁRIOS CRIADOS PELO ADMIN / COLABORADORES DA AGÊNCIA (PENDING_AUTH)
                try {
                    const qPending = query(collection(db, "crm_users"), where("email", "==", email));
                    const snapshot = await getDocs(qPending);
                    
                    if (!snapshot.empty) {
                        // Encontra se algum documento desse email tem exatamente essa senha e pendência
                        let pendingDoc = null;
                        snapshot.forEach(doc => {
                            const data = doc.data();
                            if (data.password === password && data.status === 'pending_auth') {
                                pendingDoc = { ...data, docId: doc.id };
                            }
                        });

                        if (pendingDoc) {
                            // O usuário tem o registro! Criamos no Firebase Auth em tempo real:
                            const newCred = await createUserWithEmailAndPassword(auth, email, password);
                            const realUid = newCred.user.uid;
                            
                            // Movemos os atributos do documento temporário para o verdadeiro UID
                            await setDoc(doc(db, "crm_users", realUid), {
                                name: pendingDoc.name,
                                role: pendingDoc.role || 'membro',
                                customPermissions: pendingDoc.customPermissions || [],
                                tenantId: pendingDoc.tenantId || null, 
                                email: pendingDoc.email,
                                status: 'active'
                            });
                            
                            // Deletamos a "ficha temporária"
                            await deleteDoc(doc(db, "crm_users", pendingDoc.docId));
                            
                            return { success: true, user: newCred.user };
                        }
                    }
                } catch (pendingErr) {
                    console.error("Erro ao ativar colaborador: ", pendingErr);
                }
            }
            return { success: false, error: 'E-mail ou senha inválidos.' };
        }
    };

    const logout = () => signOut(auth);

    const createUser = async (userData) => {
        try {
            const isTenantAdmin = user && (user.role === 'cliente_admin' || user.tenantId);
            const myTenantId = user?.tenantId || (user?.role === 'cliente_admin' ? user.id : null);
            
            const role = isTenantAdmin && userData.role === 'cliente_admin' ? 'gestor' : userData.role;
            const tenantId = isTenantAdmin ? myTenantId : null;

            // CRIADOR INVISÍVEL (REST API): Usado para não sujar ou desligar a sessão do Admin que está efetuando a criação
            const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${import.meta.env.VITE_FIREBASE_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email,
                    password: userData.password,
                    returnSecureToken: true
                })
            });
            const authData = await res.json();
            
            if (authData.error) {
                let errorMsg = authData.error.message;
                if (errorMsg === 'EMAIL_EXISTS') errorMsg = 'E-mail rejeitado. Já existe alguém usando esse E-mail.';
                if (errorMsg === 'INVALID_EMAIL') errorMsg = 'E-mail com formato inválido.';
                if (errorMsg === 'WEAK_PASSWORD : Password should be at least 6 characters') errorMsg = 'Senha muito fraca, use pelo menos 6 letras/números.';
                return { success: false, error: errorMsg };
            }
            
            const realUid = authData.localId;

            // Grava a ficha técnica do Colaborador com o UID oficial e amarrado à Agência
            await setDoc(doc(db, "crm_users", realUid), {
                ...userData,
                role,
                tenantId,
                status: 'active'
            });

            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    const updateUser = async (id, updates) => {
        try {
            if (id === '2' && updates.password && user.id !== '2') {
                return { success: false, error: 'Ação Bloqueada.' };
            }
            const userRef = doc(db, "crm_users", id);
            await updateDoc(userRef, updates);
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    const deleteUser = async (id) => {
        try {
            if (id === user?.id) return { success: false, error: 'Não é possível excluir a si mesmo.' };
            await deleteDoc(doc(db, "crm_users", id));
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    const hasPermission = (path) => {
        if (!user) return false;
        const perms = user.customPermissions || ROLE_PRESETS[user.role] || [];
        return perms.some(p => path.startsWith(p));
    };

    const getAllowedMenuItems = (items) => {
        if (!user) return [];
        const perms = user.customPermissions || ROLE_PRESETS[user.role] || [];
        return items.filter(item => perms.some(p => item.path.startsWith(p)));
    };

    const getUserPermissions = (u) => {
        if (!u) return [];
        return u.customPermissions || ROLE_PRESETS[u.role] || [];
    };

    const currentNamespace = getNamespace();

    // ============================================================
    // DYNAMIC LOCALSTORAGE HELPERS
    // ============================================================
    const getData = useCallback((key, defaultValue) => {
        const raw = localStorage.getItem(`${currentNamespace}_${key}`);
        const valToParse = raw !== null ? raw : (defaultValue !== undefined ? defaultValue : null);
        try {
            if (valToParse === null) return null;
            return JSON.parse(valToParse);
        } catch (e) {
            return valToParse;
        }
    }, [currentNamespace]);

    const setData = useCallback((key, value) => {
        const strVal = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(`${currentNamespace}_${key}`, strVal);
        window.dispatchEvent(new CustomEvent('u3_data_updated', { detail: { key, value: strVal } }));
    }, [currentNamespace]);

    if (loading) return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main, #121212)', color: 'var(--text-main, #fff)', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-color, #facc15)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>Carregando...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <AuthContext.Provider value={{
            user, login, logout, hasPermission, getAllowedMenuItems,
            usersList, createUser, updateUser, deleteUser, getUserPermissions,
            PERMISSIONS: ROLE_PRESETS, ALL_ROUTES,
            namespace: currentNamespace,
            getNamespace,
            getData, setData
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { ROLE_PRESETS as PERMISSIONS, ALL_ROUTES };
