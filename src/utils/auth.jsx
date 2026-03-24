import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { auth, db } from './firebase';
import { 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    createUserWithEmailAndPassword,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from 'firebase/auth';
import { 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    onSnapshot, 
    query, 
    where, 
    deleteDoc,
    updateDoc
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
    { id: 2, email: 'ceo@u3company.com', password: 'ceo', name: 'Administrador Principal', role: 'ceo', customPermissions: null }
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
        const q = query(collection(db, "crm_users"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const users = [];
            snapshot.forEach((doc) => {
                users.push({ ...doc.data(), id: doc.id });
            });
            // Fallback para usuários iniciais se o banco estiver vazio (Legacy Mode)
            if (users.length === 0) setUsersList(INITIAL_USERS);
            else setUsersList(users);
        });

        return () => unsubscribe();
    }, []);

    // ============================================================
    // WATCH AUTH STATE
    // ============================================================
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Busca o perfil do usuário no Firestore
                const userDoc = await getDoc(doc(db, "crm_users", firebaseUser.uid));
                if (userDoc.exists()) {
                    setUser({ ...userDoc.data(), id: firebaseUser.uid, email: firebaseUser.email });
                } else {
                    // Se o usuário logou mas não tem doc no Firestore (ex: migration)
                    // Tenta achar na lista legado ou cria um básico
                    const legacy = INITIAL_USERS.find(u => u.email === firebaseUser.email);
                    const userData = {
                        name: legacy?.name || firebaseUser.displayName || 'Usuário',
                        role: legacy?.role || 'cliente',
                        customPermissions: legacy?.customPermissions || null,
                        tenantId: legacy?.tenantId || null
                    };
                    await setDoc(doc(db, "crm_users", firebaseUser.uid), userData);
                    setUser({ ...userData, id: firebaseUser.uid, email: firebaseUser.email });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
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
            // MIGRATION HELPER: Se o erro for 'user-not-found' e ele estiver na INITIAL_USERS, cria no Firebase
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
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
                        return { success: false, error: 'Erro na migração de conta.' };
                    }
                }
            }
            return { success: false, error: 'E-mail ou senha inválidos.' };
        }
    };

    const logout = () => signOut(auth);

    const createUser = async (userData) => {
        // No Firebase, criar outro usuário programaticamente via SDK cliente é restrito.
        // Simularemos salvando o perfil no Firestore. O usuário terá que se registrar ou o Admin criar via Console.
        // DICA: Em sistemas reais, usa-se Firebase Admin SDK ou Cloud Functions.
        // Criaremos um ID temporário ou pediremos o e-mail.
        try {
            // Apenas CEO e Admin de Tenant podem criar usuários
            const isTenantAdmin = user && (user.role === 'cliente_admin' || user.tenantId);
            const myTenantId = user?.tenantId || (user?.role === 'cliente_admin' ? user.id : null);
            
            const role = isTenantAdmin && userData.role === 'cliente_admin' ? 'gestor' : userData.role;
            const tenantId = isTenantAdmin ? myTenantId : null;

            // Para simplificar essa versão sem backend real de admin, criaremos apenas o perfil no Firestore.
            // O usuário terá que fazer o primeiro login para triggar a migração ou ser criado no console.
            const tempId = `temp_${Date.now()}`;
            await setDoc(doc(db, "crm_users", tempId), {
                ...userData,
                role,
                tenantId,
                status: 'pending_auth'
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

    const currentNamespace = getNamespace();

    if (loading) return null; // Previne flashing da UI

    return (
        <AuthContext.Provider value={{
            user, login, logout, hasPermission, getAllowedMenuItems,
            usersList, createUser, updateUser, deleteUser,
            PERMISSIONS: ROLE_PRESETS, ALL_ROUTES,
            namespace: currentNamespace,
            getNamespace
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { ROLE_PRESETS as PERMISSIONS, ALL_ROUTES };
