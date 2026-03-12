import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ============================================================
// URL DO BACKEND — FONTE ÚNICA DE VERDADE PARA TODOS OS DADOS
// ============================================================
const API_BASE = import.meta.env.VITE_API_BASE || 'https://saas-u3company.onrender.com';

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

const ROLE_PRESETS = {
    ceo: ALL_ROUTES.map(r => r.path),
    cliente_admin: ALL_ROUTES.filter(r => r.path !== '/whitelabel').map(r => r.path),
    gestor: ['/dashboard', '/clientes', '/leads', '/prospeccao', '/reunioes', '/trafego', '/tracking', '/academy', '/metas', '/tarefas'],
    financeiro: ['/dashboard', '/clientes', '/metas', '/configuracoes', '/financeiro'],
    sdr: ['/dashboard', '/clientes', '/leads', '/prospeccao', '/reunioes', '/tarefas'],
    designer: ['/dashboard', '/tarefas', '/docs', '/clientes'],
    cliente: ['/trafego', '/academy'],
};

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

    // ============================================================
    // NAMESPACE
    // ============================================================
    const getNamespace = useCallback((overrideUser) => {
        const u = overrideUser || user;
        if (!u) return 'shared';
        if (u.id === 1) return 'demo';
        if (u.role === 'cliente_admin' || u.tenantId) return `tenant_${u.tenantId || u.id}`;
        return 'shared';
    }, [user]);

    // ============================================================
    // SAVE USERS — SEMPRE SALVA NO BACKEND + CACHE LOCAL
    // ============================================================
    const saveUsers = useCallback((users) => {
        setUsersList(users);
        localStorage.setItem('u3_users_db', JSON.stringify(users));
        fetch(`${API_BASE}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ users })
        }).catch(() => { });
    }, []);

    // ============================================================
    // setData — SALVA NO BACKEND (FONTE DE VERDADE) + CACHE LOCAL
    // ============================================================
    const setData = useCallback((key, value, overrideNamespace = null) => {
        const namespace = overrideNamespace || getNamespace();
        const localKey = `${namespace}__${key}`;

        // Cache local para UX rápida
        try { localStorage.setItem(localKey, JSON.stringify(value)); } catch {}

        // BACKEND = FONTE DE VERDADE
        fetch(`${API_BASE}/api/data/${namespace}/${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value })
        }).catch(() => { });
    }, [getNamespace]);

    // ============================================================
    // getData — BUSCA DO BACKEND PRIMEIRO, CACHE LOCAL COMO FALLBACK
    // Retorna cache local IMEDIATAMENTE para não bloquear a UI,
    // mas SEMPRE faz fetch no backend e atualiza via evento se houver diferença.
    // ============================================================
    const getData = useCallback((key, fallback = null, overrideNamespace = null) => {
        const namespace = overrideNamespace || getNamespace();
        const localKey = `${namespace}__${key}`;

        // PASSO 1: Dispara busca no backend IMEDIATAMENTE (assíncrono)
        fetch(`${API_BASE}/api/data/${namespace}/${key}`)
            .then(r => r.json())
            .then(data => {
                if (data.success && data.value !== null) {
                    const newValue = JSON.stringify(data.value);
                    const currentCache = localStorage.getItem(localKey);
                    // Atualiza cache local e notifica componentes SE o backend tiver dados diferentes
                    if (currentCache !== newValue) {
                        localStorage.setItem(localKey, newValue);
                        window.dispatchEvent(new CustomEvent('u3_data_updated', {
                            detail: { key, namespace, value: data.value }
                        }));
                    }
                }
            }).catch(() => { });

        // PASSO 2: Retorna cache local para renderização IMEDIATA (sem esperar backend)
        try {
            const cached = localStorage.getItem(localKey);
            if (cached !== null) {
                try { return JSON.parse(cached); } catch { return cached; }
            }
        } catch { }

        // PASSO 3: Fallback padrão
        if (fallback === null) return null;
        if (typeof fallback === 'string') {
            try { return JSON.parse(fallback); } catch { return fallback; }
        }
        return fallback;
    }, [getNamespace]);

    // ============================================================
    // SYNC USERS NO BOOT — UMA ÚNICA VEZ
    // ============================================================
    useEffect(() => {
        const syncUsersOnBoot = async () => {
            try {
                const r = await fetch(`${API_BASE}/api/users`);
                const data = await r.json();

                if (data.success && Array.isArray(data.users) && data.users.length > 0) {
                    setUsersList(data.users);
                    localStorage.setItem('u3_users_db', JSON.stringify(data.users));
                }
            } catch { }
        };
        syncUsersOnBoot();
    }, []);

    // ============================================================
    // USERS LIST FILTRADA POR TENANT
    // ============================================================
    const filteredUsersList = usersList.filter(u => {
        if (!user) return false;
        if (user.id === 1) return u.id === 1 || !u.tenantId;
        if (user.role === 'ceo' || user.role === 'gestor') return true;
        if (user.role === 'cliente_admin' || user.tenantId) {
            const myTenantId = user.tenantId || user.id;
            return u.id === myTenantId || u.tenantId === myTenantId;
        }
        return true;
    });

    // ============================================================
    // AUTH FUNCS
    // ============================================================
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
            id: found.id, email: found.email, name: found.name,
            role: found.role, tenantId: found.tenantId || null,
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
            ? (user.tenantId || user.id) : null;
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

    const removeData = useCallback((key, overrideNamespace = null) => {
        const namespace = overrideNamespace || getNamespace();
        const localKey = `${namespace}__${key}`;
        localStorage.removeItem(localKey);
    }, [getNamespace]);

    const clearData = useCallback((overrideNamespace = null) => {
        const namespace = overrideNamespace || getNamespace();
        const prefix = `${namespace}__`;
        Object.keys(localStorage).filter(k => k.startsWith(prefix)).forEach(k => localStorage.removeItem(k));
    }, [getNamespace]);

    return (
        <AuthContext.Provider value={{
            user, login, logout, hasPermission, getAllowedMenuItems,
            usersList: filteredUsersList, createUser, updateUser, deleteUser, getUserPermissions,
            changePassword, PERMISSIONS: ROLE_PRESETS, ALL_ROUTES,
            getData, setData, removeData, clearData,
            getStorageKey: (key) => `${getNamespace()}__${key}`
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { INITIAL_USERS as USERS, ROLE_PRESETS as PERMISSIONS, ALL_ROUTES };
