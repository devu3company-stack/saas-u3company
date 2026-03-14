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
    { path: '/migrar', label: 'Migração de Dados' },
];

const ROLE_PRESETS = {
    ceo: ALL_ROUTES.map(r => r.path),
    // cliente_admin: ambiente isolado do tenant (não acessa whitelabel)
    cliente_admin: ALL_ROUTES.filter(r => !['/whitelabel'].includes(r.path)).map(r => r.path),
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
    // NAMESPACE — Isolamento por Tenant (Multi-Tenant)
    // CEO, gestor e equipe matriz → 'shared'
    // Usuário demo → 'demo'
    // cliente_admin e membros do tenant → 'tenant_<tenantId>'
    // ============================================================
    const getNamespace = useCallback((overrideUser) => {
        const u = overrideUser || user;
        if (!u) return 'shared';
        if (u.id === 1) return 'demo';
        // Tenant: cliente_admin OU qualquer membro com tenantId
        if (u.role === 'cliente_admin') return `tenant_${u.id}`;
        if (u.tenantId) return `tenant_${u.tenantId}`;
        // Matriz (CEO, gestor, SDR, etc.) → namespace compartilhado
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

        // Notifica outros componentes que ouvem este key/namespace
        window.dispatchEvent(new CustomEvent('u3_data_updated', {
            detail: { key, namespace, value }
        }));

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
    // CEO vê TODOS os usuários (para gerenciamento)
    // cliente_admin vê apenas si mesmo e membros do SEU tenant
    // Membro de tenant vê apenas membros do seu tenant
    // Outros papéis da matriz veem apenas a equipe da matriz
    // ============================================================
    const filteredUsersList = usersList.filter(u => {
        if (!user) return false;
        // CEO: vê tudo (gestão completa)
        if (user.role === 'ceo') return true;
        // cliente_admin: vê apenas seu tenant
        if (user.role === 'cliente_admin') {
            const myTenantId = user.id;
            return u.id === myTenantId || u.tenantId === myTenantId;
        }
        // Membro de tenant (tenantId definido): vê apenas seu tenant
        if (user.tenantId) {
            return u.id === user.tenantId || u.tenantId === user.tenantId;
        }
        // Equipe da matriz (gestor, SDR, etc.): vê equipe sem tenantId e sem cliente_admin
        return !u.tenantId && u.role !== 'cliente_admin';
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

        // Calcula o namespace deste usuário
        const newNamespace = getNamespace(userData);

        // Remove do localStorage dados cacheados de OUTROS namespaces (isolamento)
        // Isso impede que um cliente_admin veja dados cacheados do CEO (shared) e vice-versa
        try {
            const keysToRemove = Object.keys(localStorage).filter(k => {
                if (!k.includes('__')) return false; // não é chave de dados
                if (k === 'u3_user' || k === 'u3_users_db') return false; // preserva sessão e users
                const keyNs = k.split('__')[0];
                return keyNs !== newNamespace; // remove cache de outros namespaces
            });
            keysToRemove.forEach(k => localStorage.removeItem(k));
        } catch { }

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
        // Quem cria: cliente_admin → novos membros pertencem ao seu tenant
        // CEO/Matriz → pode criar cliente_admin (sem tenantId) ou membros da matriz
        const isTenantAdmin = user && (user.role === 'cliente_admin' || user.tenantId);
        const myTenantId = user?.tenantId || (user?.role === 'cliente_admin' ? user.id : null);
        // Membro do tenant não pode criar outro cliente_admin
        const role = isTenantAdmin && newUser.role === 'cliente_admin' ? 'gestor' : newUser.role;
        const tenantId = isTenantAdmin ? myTenantId : null; // null = equipe da matriz
        const updated = [...usersList, { ...newUser, id, role, tenantId }];
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

    // Namespace calculado ao vivo (reativo ao user)
    const currentNamespace = getNamespace();

    return (
        <AuthContext.Provider value={{
            user, login, logout, hasPermission, getAllowedMenuItems,
            usersList: filteredUsersList, createUser, updateUser, deleteUser, getUserPermissions,
            changePassword, PERMISSIONS: ROLE_PRESETS, ALL_ROUTES,
            getData, setData, removeData, clearData,
            getNamespace,
            namespace: currentNamespace,
            getStorageKey: (key) => `${currentNamespace}__${key}`
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { INITIAL_USERS as USERS, ROLE_PRESETS as PERMISSIONS, ALL_ROUTES };
