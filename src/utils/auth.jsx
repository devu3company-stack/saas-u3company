import { createContext, useContext, useState } from 'react';

// Usuários do sistema (mock — em produção viria do backend)
const USERS = [
    { id: 1, email: 'admin@u3company.com', password: 'admin123', name: 'Admin Principal', role: 'admin' },
    { id: 2, email: 'trafego@u3company.com', password: 'trafego123', name: 'Gestor de Tráfego', role: 'gestor' },
    { id: 3, email: 'fin@u3company.com', password: 'fin123', name: 'Financeiro', role: 'financeiro' },
    { id: 4, email: 'cliente@alphatech.com', password: 'cliente123', name: 'AlphaTech Solutions', role: 'cliente' },
    { id: 5, email: 'cliente@prime.com', password: 'cliente123', name: 'Imobiliária Prime', role: 'cliente' },
];

// Permissões por role — define quais rotas cada papel pode acessar
const PERMISSIONS = {
    admin: [
        '/dashboard', '/clientes', '/leads', '/reunioes', '/trafego',
        '/academy', '/metas', '/pesquisas', '/configuracoes',
        '/inbox', '/whatsapp-setup', '/fluxos', '/templates'
    ],
    gestor: [
        '/dashboard', '/clientes', '/leads', '/reunioes', '/trafego',
        '/academy', '/inbox', '/fluxos', '/templates'
    ],
    financeiro: [
        '/dashboard', '/clientes', '/metas', '/configuracoes'
    ],
    cliente: [
        '/trafego', '/academy'
    ],
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('u3_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (email, password) => {
        const found = USERS.find(u => u.email === email && u.password === password);
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

    return (
        <AuthContext.Provider value={{ user, login, logout, hasPermission, getAllowedMenuItems, USERS, PERMISSIONS }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { USERS, PERMISSIONS };
