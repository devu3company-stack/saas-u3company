import { createContext, useContext, useState } from 'react';

// Usuários iniciais de fallback
const INITIAL_USERS = [
    { id: 1, email: 'demo@u3company.com', password: 'demo', name: 'Usuário Demonstração', role: 'ceo' },
    { id: 2, email: 'ceo@u3company.com', password: 'ceo', name: 'Administrador Oculto', role: 'ceo' },
    { id: 3, email: 'designer@u3company.com', password: 'designer123', name: 'Time de Design', role: 'designer' }
];

// Permissões por role — define quais rotas cada papel pode acessar
const PERMISSIONS = {
    ceo: [
        '/dashboard', '/clientes', '/leads', '/prospeccao', '/reunioes', '/trafego',
        '/tracking', '/academy', '/metas', '/pesquisas', '/configuracoes', '/financeiro',
        '/equipe', '/inbox', '/whatsapp-setup', '/fluxos', '/templates', '/tarefas', '/whitelabel'
    ],
    gestor: [
        '/dashboard', '/clientes', '/leads', '/prospeccao', '/reunioes', '/trafego',
        '/tracking', '/academy', '/inbox', '/fluxos', '/templates', '/metas', '/tarefas'
    ],
    financeiro: [
        '/dashboard', '/clientes', '/metas', '/configuracoes', '/financeiro'
    ],
    sdr: [
        '/dashboard', '/clientes', '/leads', '/prospeccao', '/reunioes', '/inbox', '/tarefas'
    ],
    cliente: [
        '/trafego', '/academy'
    ],
    designer: [
        '/dashboard', '/tarefas', '/docs', '/clientes'
    ],
};

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

    const login = (email, password) => {
        const found = usersList.find(u => u.email === email && u.password === password);
        if (!found) return { success: false, error: 'E-mail ou senha inválidos.' };

        const userData = { id: found.id, email: found.email, name: found.name, role: found.role };
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
        const perms = PERMISSIONS[user.role] || [];
        return perms.some(p => path.startsWith(p));
    };

    const getAllowedMenuItems = (items) => {
        if (!user) return [];
        const perms = PERMISSIONS[user.role] || [];
        return items.filter(item => perms.some(p => item.path.startsWith(p)));
    };

    const createUser = (newUser) => {
        const id = Date.now();
        const updatedUsers = [...usersList, { ...newUser, id }];
        setUsersList(updatedUsers);
        localStorage.setItem('u3_users_db', JSON.stringify(updatedUsers));
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
        <AuthContext.Provider value={{ user, login, logout, hasPermission, getAllowedMenuItems, usersList, createUser, deleteUser, PERMISSIONS }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { INITIAL_USERS as USERS, PERMISSIONS };
