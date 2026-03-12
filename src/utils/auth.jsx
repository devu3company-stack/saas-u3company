import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ============================================================
// URL DO BACKEND (troque pela URL pública do seu servidor)
// Para desenvolvimento local: http://localhost:3001
// Em produção: URL do servidor onde o saas-backend roda
// ============================================================
const API_BASE = import.meta.env.VITE_API_BASE || 'https://saas-u3company.onrender.com';

// Todas as rotas disponíveis no sistema
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
];

// Permissões padrão por role
const ROLE_PRESETS = {
    ceo: ALL_ROUTES.map(r => r.path),
    cliente_admin: ALL_ROUTES.filter(r => r.path !== '/whitelabel').map(r => r.path),
    gestor: ['/dashboard', '/clientes', '/leads', '/prospeccao', '/reunioes', '/trafego', '/tracking', '/academy', '/metas', '/tarefas'],
    financeiro: ['/dashboard', '/clientes', '/metas', '/configuracoes', '/financeiro'],
    sdr: ['/dashboard', '/clientes', '/leads', '/prospeccao', '/reunioes', '/tarefas'],
    designer: ['/dashboard', '/tarefas', '/docs', '/clientes'],
    cliente: ['/trafego', '/academy'],
};

// Usuários iniciais de fallback
const INITIAL_USERS = [
    { id: 1, email: 'demo@u3company.com', password: 'demo', name: 'Usuário Demonstração', role: 'ceo', customPermissions: null },
    { id: 2, email: 'ceo@u3company.com', password: 'ceo', name: 'Administrador', role: 'ceo', customPermissions: null },
    { id: 3, email: 'designer@u3company.com', password: 'designer123', name: 'Time de Design', role: 'designer', customPermissions: null }
];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [usersList, setUsersList] = useState(() => {
        try {
            const saved = localStorage.getItem('u3_users_db');
            return saved ? JSON.parse(saved) : INITIAL_USERS;
        } catch { return INITIAL_USERS; }
    });

    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('u3_user');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    // Carrega usuários do backend ao iniciar
    // Carrega usuários do backend ao iniciar e realiza migrações de legado
    useEffect(() => {
        const syncUsers = async () => {
            try {
                const r = await fetch(`${API_BASE}/api/users`);
                const data = await r.json();

                if (data.success && Array.isArray(data.users)) {
                    // Usamos uma referência direta para evitar dependência do usersList
                    const currentLocalUsers = JSON.parse(localStorage.getItem('u3_users_db') || JSON.stringify(INITIAL_USERS));
                    const localHasCustom = currentLocalUsers.length > INITIAL_USERS.length;
                    const remoteHasCustom = data.users.length > INITIAL_USERS.length;

                    if (remoteHasCustom || (data.users.length > 0 && !localHasCustom)) {
                        console.log("📥 Recebendo usuários do servidor...");
                        setUsersList(data.users);
                        localStorage.setItem('u3_users_db', JSON.stringify(data.users));
                    } else if (localHasCustom && data.users.length <= INITIAL_USERS.length) {
                        console.log("📤 Sincronizando usuários locais (Backup)...");
                        // saveUsers já lida com o POST
                        saveUsers(currentLocalUsers);
                    }
                }
            } catch (err) {
                console.error("Erro ao sincronizar usuários:", err);
            }
        };

        syncUsers();
        
        // RECUPERAÇÃO DE DADOS LEGADOS (Uma única vez ao montar)
        const rescueLegacy = () => {
            const keysToRescue = ['clients_v2', 'tarefas', 'leads', 'users_db'];
            keysToRescue.forEach(key => {
                const legacy = localStorage.getItem(key);
                const u3Legacy = localStorage.getItem('u3_' + key);
                const val = legacy || u3Legacy;
                if (val) {
                    try {
                        const parsed = JSON.parse(val);
                        const finalKey = key === 'users_db' ? 'u3_users_db' : 'u3_' + key;
                        
                        if (key === 'users_db') {
                            const current = JSON.parse(localStorage.getItem('u3_users_db') || '[]');
                            const merged = [...current];
                            parsed.forEach(u => {
                                if (!merged.find(m => m.email === u.email)) merged.push(u);
                            });
                            saveUsers(merged);
                        } else {
                            //setData local + backend
                            const namespace = 'shared';
                            const localKey = `${namespace}__${finalKey}`;
                            localStorage.setItem(localKey, JSON.stringify(parsed));
                            fetch(`${API_BASE}/api/data/${namespace}/${finalKey}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ value: parsed })
                            }).catch(() => {});
                        }
                        console.log(`✅ Recuperado legado: ${key}`);
                        // Limpa o legado para não re-processar
                        localStorage.removeItem(key);
                        localStorage.removeItem('u3_' + key);
                    } catch (e) {}
                }
            });
        };
        rescueLegacy();

        window.__u3_force_sync = () => {
             // Força o envio da lista atual para o backend
             const currentList = JSON.parse(localStorage.getItem('u3_users_db') || '[]');
             saveUsers(currentList);
             return "Sincronização enviada!";
        };
    }, []); // IMPORTANTE: Array vazio para rodar apenas uma vez no boot e evitar loops infinitos

    // ============================================================
    // NAMESPACE: define em qual "pasta" da API o dado é salvo
    // - Demo: namespace "demo" → dados de demonstração isolados
    // - Tenant (cliente comprador): namespace "tenant_ID" → dados isolados desse cliente
    // - Matriz (ceo/gestor/designer/etc): namespace "shared" → TODOS compartilham os mesmos dados
    // ============================================================
    const getNamespace = useCallback((overrideUser) => {
        const u = overrideUser || user;
        if (!u) return 'shared';
        if (u.id === 1) return 'demo';
        if (u.role === 'cliente_admin' || u.tenantId) return `tenant_${u.tenantId || u.id}`;
        return 'shared'; // CEO, gestor, designer, SDR, financeiro → todos enxergam os mesmos dados
    }, [user]);

    // ============================================================
    // getData e setData — agora salvam NO BACKEND (compartilhado)
    // mas também mantêm cache em localStorage para não ter delay
    // ============================================================
    // Listagem de usuários filtrada para o contexto (visibilidade por tenant)
    const filteredUsersList = usersList.filter(u => {
        if (!user) return false;
        // Demo agora vê a si mesmo e a equipe matriz (facilitando testes)
        if (user.id === 1) return u.id === 1 || !u.tenantId;
        if (user.role === 'ceo' || user.role === 'gestor') return true; // CEO/Gestor vê tudo

        if (user.role === 'cliente_admin' || user.tenantId) {
            const myTenantId = user.tenantId || user.id;
            return u.id === myTenantId || u.tenantId === myTenantId;
        }
        return true;
    });

    const getData = useCallback((key, fallback = null, overrideNamespace = null) => {
        const baseNamespace = getNamespace();
        const namespace = overrideNamespace || baseNamespace;
        const localKey = `${namespace}__${key}`;

        // 1. Tenta Cache Local (Novo Formato)
        try {
            const cached = localStorage.getItem(localKey);
            if (cached !== null) {
                try { return JSON.parse(cached); } catch { return cached; }
            }
        } catch { }

        // 2. MIGRAÇÃO: Se não achou com prefixo, tenta o legado (sem prefixo)
        // Isso recupera o que o usuário já tinha criado antes da atualização do sistema
        if (namespace === 'shared' || namespace === 'demo' || namespace.startsWith('tenant_')) {
            try {
                const legacy = localStorage.getItem(key);
                if (legacy !== null) {
                    const parsed = JSON.parse(legacy);
                    // A migração ocorre apenas no cache local aqui para evitar loops de render
                    localStorage.setItem(localKey, legacy);
                    return parsed;
                }
            } catch { }
        }

        // 3. Busca Backend
        fetch(`${API_BASE}/api/data/${namespace}/${key}`)
            .then(r => r.json())
            .then(data => {
                if (data.success && data.value !== null) {
                    const newValue = JSON.stringify(data.value);
                    if (localStorage.getItem(localKey) !== newValue) {
                        localStorage.setItem(localKey, newValue);
                        window.dispatchEvent(new CustomEvent('u3_data_updated', { detail: { key, namespace, value: data.value } }));
                    }
                } else if (namespace === 'shared' && baseNamespace.startsWith('tenant_')) {
                    // FALLBACK DE MIGRAÇÃO: Se não achou no 'shared' mas o usuário é de um Tenant, 
                    // tenta buscar no namespace antigo do próprio tenant
                    fetch(`${API_BASE}/api/data/${baseNamespace}/${key}`)
                        .then(r2 => r2.json())
                        .then(data2 => {
                            if (data2.success && data2.value !== null) {
                                // Migra automaticamente para o shared para futuras consultas
                                setData(key, data2.value, 'shared');
                                window.dispatchEvent(new CustomEvent('u3_data_updated', { detail: { key, namespace: 'shared', value: data2.value } }));
                            }
                        });
                }
            })
            .catch(() => { });

        // 3. Fallback de Valor
        if (fallback === null) return null;
        if (typeof fallback === 'string') {
            try { return JSON.parse(fallback); } catch { return fallback; }
        }
        return fallback;
    }, [getNamespace, setData]);

    const setData = useCallback((key, value, overrideNamespace = null) => {
        const namespace = overrideNamespace || getNamespace();
        const localKey = `${namespace}__${key}`;

        // Salva no cache local imediatamente
        localStorage.setItem(localKey, JSON.stringify(value));

        // Salva no backend (async, sem bloquear a UI)
        fetch(`${API_BASE}/api/data/${namespace}/${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value })
        }).catch(() => {
            // Backend offline: dado já está no localStorage, tudo bem
        });
    }, [getNamespace]);

    const removeData = useCallback((key, overrideNamespace = null) => {
        const namespace = overrideNamespace || getNamespace();
        const localKey = `${namespace}__${key}`;
        localStorage.removeItem(localKey);
    }, [getNamespace]);

    const clearData = useCallback((overrideNamespace = null) => {
        const namespace = overrideNamespace || getNamespace();
        const prefix = `${namespace}__`;
        Object.keys(localStorage)
            .filter(k => k.startsWith(prefix))
            .forEach(k => localStorage.removeItem(k));
    }, [getNamespace]);

    // Compatibilidade: getStorageKey (legado)
    const getStorageKey = useCallback((key) => {
        return `${getNamespace()}__${key}`;
    }, [getNamespace]);

    // ============================================================
    // USERS
    // ============================================================
    const saveUsers = (users) => {
        setUsersList(users);
        localStorage.setItem('u3_users_db', JSON.stringify(users));
        fetch(`${API_BASE}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ users })
        }).catch(() => { });
    };

    const getUserPermissions = (targetUser) => {
        if (!targetUser) return [];
        if (targetUser.customPermissions && targetUser.customPermissions.length > 0) {
            return targetUser.customPermissions;
        }
        return ROLE_PRESETS[targetUser.role] || [];
    };

    const login = (email, password) => {
        const found = usersList.find(u => u.email === email && u.password === password);
        if (!found) return { success: false, error: 'E-mail ou senha inválidos.' };

        const userData = {
            id: found.id,
            email: found.email,
            name: found.name,
            role: found.role,
            tenantId: found.tenantId || null,
            customPermissions: found.customPermissions || null
        };
        localStorage.setItem('u3_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
    };

    const logout = () => {
        localStorage.removeItem('u3_user');
        setUser(null);
    };

    const hasPermission = (path) => {
        if (!user) return false;
        const fullUser = usersList.find(u => u.id === user.id) || user;
        return getUserPermissions(fullUser).some(p => path.startsWith(p));
    };

    const getAllowedMenuItems = (items) => {
        if (!user) return [];
        const fullUser = usersList.find(u => u.id === user.id) || user;
        const perms = getUserPermissions(fullUser);
        return items.filter(item => perms.some(p => item.path.startsWith(p)));
    };

    const createUser = (newUser) => {
        const id = Date.now();
        const tenantId = user && (user.role === 'cliente_admin' || user.tenantId)
            ? (user.tenantId || user.id)
            : null;
        const updated = [...usersList, { ...newUser, id, tenantId }];
        saveUsers(updated);
        return { success: true };
    };

    const updateUser = (id, updates) => {
        const updated = usersList.map(u => u.id === id ? { ...u, ...updates } : u);
        saveUsers(updated);
        if (user && user.id === id) {
            const updatedUser = { ...user, ...updates };
            localStorage.setItem('u3_user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
        return { success: true };
    };

    const deleteUser = (id) => {
        if (id === 1 || id === 2) return { success: false, error: 'Usuários sistema não podem ser removidos.' };
        saveUsers(usersList.filter(u => u.id !== id));
        return { success: true };
    };

    const changePassword = (currentPassword, newPassword) => {
        const fullUser = usersList.find(u => u.id === user?.id);
        if (!fullUser) return { success: false, error: 'Usuário não encontrado.' };
        if (fullUser.password !== currentPassword) return { success: false, error: 'Senha atual incorreta.' };
        return updateUser(user.id, { password: newPassword });
    };

    return (
        <AuthContext.Provider value={{
            user, login, logout, hasPermission, getAllowedMenuItems,
            usersList: filteredUsersList, createUser, updateUser, deleteUser, getUserPermissions,
            changePassword,
            PERMISSIONS: ROLE_PRESETS, ALL_ROUTES,
            getStorageKey, getData, setData, removeData, clearData
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { INITIAL_USERS as USERS, ROLE_PRESETS as PERMISSIONS, ALL_ROUTES };
