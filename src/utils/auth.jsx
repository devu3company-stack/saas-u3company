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
    useEffect(() => {
        fetch(`${API_BASE}/api/users`)
            .then(r => r.json())
            .then(data => {
                if (data.success && Array.isArray(data.users) && data.users.length > 0) {
                    setUsersList(data.users);
                    localStorage.setItem('u3_users_db', JSON.stringify(data.users));
                }
            })
            .catch(() => {
                // Backend offline: usa localStorage como fallback
                const saved = localStorage.getItem('u3_users_db');
                if (saved) {
                    try { setUsersList(JSON.parse(saved)); } catch { }
                }
            });
    }, []);

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
        if (user.id === 1) return u.id === 1; // Demo só vê a si mesmo
        if (user.role === 'cliente_admin' || user.tenantId) {
            const myTenantId = user.tenantId || user.id;
            return u.id === myTenantId || u.tenantId === myTenantId;
        }
        // Matriz (CEO, etc) vê apenas usuários da matriz (sem tenantId)
        return !u.tenantId && u.role !== 'cliente_admin';
    });

    const getData = useCallback((key, fallback = null) => {
        const namespace = getNamespace();
        const localKey = `${namespace}__${key}`;

        // 1. Retorna do cache local imediatamente (sem esperar a API)
        try {
            const cached = localStorage.getItem(localKey);
            if (cached !== null) {
                try { return JSON.parse(cached); } catch { return cached; }
            }
        } catch { }

        // 2. Dispara a busca async no backend para manter cache atualizado
        fetch(`${API_BASE}/api/data/${namespace}/${key}`)
            .then(r => r.json())
            .then(data => {
                if (data.success && data.value !== null) {
                    localStorage.setItem(localKey, JSON.stringify(data.value));
                }
            })
            .catch(() => { });

        // 3. Retorna o fallback APENAS se for a Matriz (shared) ou Demo
        // Para novos Tenants, retornamos vazio para garantir que o painel inicie limpo.
        if (namespace !== 'shared' && namespace !== 'demo') {
            if (typeof fallback === 'string' && fallback.startsWith('[')) return [];
            if (typeof fallback === 'string' && fallback.startsWith('{')) return {};
            return null;
        }

        if (fallback === null) return null;
        if (typeof fallback === 'string') {
            try { return JSON.parse(fallback); } catch { return fallback; }
        }
        return fallback;
    }, [getNamespace]);

    const setData = useCallback((key, value) => {
        const namespace = getNamespace();
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

    const removeData = useCallback((key) => {
        const namespace = getNamespace();
        const localKey = `${namespace}__${key}`;
        localStorage.removeItem(localKey);
    }, [getNamespace]);

    const clearData = useCallback(() => {
        const namespace = getNamespace();
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
