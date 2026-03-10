import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Users, Target, Calendar, FileText, Settings, Search, Bell, TrendingUp, BarChart2, BookOpen, LineChart, MessageCircle, Inbox, GitBranch, FileCheck, Upload, LogOut, Menu, X, DollarSign, ListTodo, Layers, CheckCircle, Radar, Shield } from 'lucide-react';
import { useAuth } from '../utils/auth';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, getAllowedMenuItems, getData, setData } = useAuth();
  const [logo, setLogo] = useState(() => getData('u3_logo', ''));
  const fileInputRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false); // Close sidebar on route change in mobile
  }, [location.pathname]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setData('u3_logo', dataUrl);
      setLogo(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/clientes', label: 'Clientes', icon: <Users size={20} /> },
    { path: '/leads', label: 'CRM & Funil', icon: <Target size={20} /> },
    { path: '/prospeccao', label: 'Prospecção (API)', icon: <Search size={20} /> },
    { path: '/tarefas', label: 'Tarefas da Equipe', icon: <ListTodo size={20} /> },
    { path: '/reunioes', label: 'Agenda de Reuniões', icon: <Calendar size={20} /> },
    { path: '/financeiro', label: 'Financeiro', icon: <DollarSign size={20} /> },
    { path: '/tracking', label: 'Tracking (UTMfy)', icon: <Radar size={20} /> },
    { path: '/trafego', label: 'Mídia & Performance', icon: <LineChart size={20} /> },
    { path: '/academy', label: 'Trilha de Onboarding', icon: <BookOpen size={20} /> },
    { path: '/metas', label: 'Calendário de Metas', icon: <TrendingUp size={20} /> },
    { path: '/pesquisas', label: 'Pesquisas (NPS)', icon: <BarChart2 size={20} /> },
    { path: '/docs', label: 'Docs & Senhas', icon: <FileText size={20} /> },
    { path: '/whitelabel', label: 'White-Label (SaaS)', icon: <Layers size={20} /> },
    { path: '/equipe', label: 'Gerenciar Equipe', icon: <Shield size={20} /> },
    { path: '/configuracoes', label: 'Configurações', icon: <Settings size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Overlay do menu no mobile */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer', position: 'relative' }} title="Clique para trocar a logo">
          <input type="file" ref={fileInputRef} accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
          {logo ? (
            <img src={logo} alt="Logo" style={{ height: 36, maxWidth: 180, objectFit: 'contain' }} />
          ) : (
            <>
              <span style={{ color: 'var(--text-main)', marginRight: 8 }}>U3</span>
              <span style={{ color: 'var(--accent-color)' }}>CRM</span>
              <Upload size={14} color="var(--text-muted)" style={{ marginLeft: 8 }} />
            </>
          )}
        </div>
        <nav className="sidebar-nav">
          {getAllowedMenuItems(menuItems).map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}


        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="topbar-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="topbar-search">
            <Search size={20} color="var(--text-muted)" />
            <input type="text" placeholder="Buscar clientes, leads..." />
          </div>
          <div className="topbar-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--success)', padding: '4px 12px', backgroundColor: 'rgba(0, 208, 132, 0.1)', borderRadius: 20 }}>
              <CheckCircle size={12} /> <span className="hide-mobile">Sincronizado na Nuvem</span>
            </div>
            {user?.role !== 'cliente' && <Link to="/clientes?new=true" className="btn btn-primary add-button-mobile">Novo Cliente</Link>}
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, padding: 0, borderRadius: '50%' }}>
              <Bell size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user?.name?.[0] || 'A'}
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name || 'Admin'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{user?.role || 'admin'}</div>
              </div>
              <button onClick={() => { logout(); navigate('/login'); }} style={{ padding: 8, color: 'var(--text-muted)' }} title="Sair">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
