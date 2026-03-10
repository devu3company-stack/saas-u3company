import { createContext, useContext, useState } from 'react';

// Todas as rotas disponíveis no sistema (para exibir como opções de permissão)
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

// Permissões padrão por role (preset que preenche ao selecionar cargo)
const ROLE_PRESETS = {
    ceo: ALL_ROUTES.map(r => r.path),
    gestor: ['/dashboard', '/clientes', '/leads', '/prospeccao', '/reunioes', '/trafego', '/tracking', '/academy', '/metas', '/tarefas'],
    financeiro: ['/dashboard', '/clientes', '/metas', '/configuracoes', '/financeiro'],
    sdr: ['/dashboard', '/clientes', '/leads', '/prospeccao', '/reunioes', '/tarefas'],
    designer: ['/dashboard', '/tarefas', '/docs', '/clientes'],
    cliente: ['/trafego', '/academy'],
};

// Usuários iniciais de fallback
const INITIAL_USERS = [
    { id: 1, email: 'demo@u3company.com', password: 'demo', name: 'Usuário Demonstração', role: 'ceo', customPermissions: null },
    { id: 2, email: 'ceo@u3company.com', password: 'ceo', name: 'Administrador Oculto', role: 'ceo', customPermissions: null },
    { id: 3, email: 'designer@u3company.com', password: 'designer123', name: 'Time de Design', role: 'designer', customPermissions: null }
];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [usersList, setUsersList] = useState(() => {
        const saved = localStorage.getItem('u3_users_db');
        return saved ? JSON.parse(saved) : INITIAL_USERS;
    });

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('u3_user');
        return saved ? JSON.parse(saved) : null;
    });

    const getUserPermissions = (targetUser) => {
        if (!targetUser) return [];
        // Se tem permissões customizadas, usa elas. Senão, usa o preset do role.
        if (targetUser.customPermissions && targetUser.customPermissions.length > 0) {
            return targetUser.customPermissions;
        }
        return ROLE_PRESETS[targetUser.role] || [];
    };

    const login = (email, password) => {
        const found = usersList.find(u => u.email === email && u.password === password);
        if (!found) return { success: false, error: 'E-mail ou senha inválidos.' };

        const userData = { id: found.id, email: found.email, name: found.name, role: found.role, customPermissions: found.customPermissions || null };
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
        const perms = getUserPermissions(fullUser);
        return perms.some(p => path.startsWith(p));
    };

    const getAllowedMenuItems = (items) => {
        if (!user) return [];
        const fullUser = usersList.find(u => u.id === user.id) || user;
        const perms = getUserPermissions(fullUser);
        return items.filter(item => perms.some(p => item.path.startsWith(p)));
    };

    const createUser = (newUser) => {
        const id = Date.now();
        const updatedUsers = [...usersList, { ...newUser, id }];
        setUsersList(updatedUsers);
        localStorage.setItem('u3_users_db', JSON.stringify(updatedUsers));
        return { success: true };
    };

    const updateUser = (id, updates) => {
        const updatedUsers = usersList.map(u => u.id === id ? { ...u, ...updates } : u);
        setUsersList(updatedUsers);
        localStorage.setItem('u3_users_db', JSON.stringify(updatedUsers));
        // Se alterou o usuario logado, atualiza sessao
        if (user && user.id === id) {
            const updatedUser = { ...user, ...updates };
            localStorage.setItem('u3_user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
        return { success: true };
    };

    const deleteUser = (id) => {
        if (id === 2 || id === 1) return { success: false, error: 'Usuários sistema não podem ser removidos' };
        const updatedUsers = usersList.filter(u => u.id !== id);
        setUsersList(updatedUsers);
        localStorage.setItem('u3_users_db', JSON.stringify(updatedUsers));
        return { success: true };
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, hasPermission, getAllowedMenuItems, usersList, createUser, updateUser, deleteUser, getUserPermissions, PERMISSIONS: ROLE_PRESETS, ALL_ROUTES }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { INITIAL_USERS as USERS, ROLE_PRESETS as PERMISSIONS, ALL_ROUTES };
