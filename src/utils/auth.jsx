import { createContext, useContext, useState } from 'react';

// Usuários do sistema (mock — em produção viria do backend)
const USERS = [
    { id: 1, email: 'demo@u3company.com', password: 'demo', name: 'Usuário Demonstração', role: 'ceo' },
    { id: 2, email: 'ceo@u3company.com', password: 'ceo', name: 'Administrador Oculto', role: 'ceo' }
];

// Permissões por role — define quais rotas cada papel pode acessar
const PERMISSIONS = {
    ceo: [
        '/dashboard', '/clientes', '/leads', '/prospeccao', '/reunioes', '/trafego',
        '/academy', '/metas', '/pesquisas', '/configuracoes', '/financeiro',
        '/inbox', '/whatsapp-setup', '/fluxos', '/templates', '/tarefas', '/whitelabel'
    ],
    gestor: [
        '/dashboard', '/clientes', '/leads', '/prospeccao', '/reunioes', '/trafego',
        '/academy', '/inbox', '/fluxos', '/templates', '/metas', '/tarefas'
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
