import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Users, Target, Calendar, FileText, Settings, Search, Bell, TrendingUp, BarChart2, BookOpen, LineChart, MessageCircle, Inbox, GitBranch, FileCheck, Upload, LogOut, Menu, X, DollarSign, ListTodo, Layers } from 'lucide-react';
import { useAuth } from '../utils/auth';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, getAllowedMenuItems } = useAuth();
  const [logo, setLogo] = useState(() => localStorage.getItem('u3_logo') || '');
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
      localStorage.setItem('u3_logo', dataUrl);
      setLogo(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/clientes', label: 'Clientes', icon: <Users size={20} /> },
    { path: '/leads', label: 'Leads', icon: <Target size={20} /> },
    { path: '/tarefas', label: 'Tarefas / Equipe', icon: <ListTodo size={20} /> },
    { path: '/reunioes', label: 'Agenda de Reuniões', icon: <Calendar size={20} /> },
    { path: '/financeiro', label: 'Financeiro', icon: <DollarSign size={20} /> },
    { path: '/trafego', label: 'Dashboard Tráfego', icon: <LineChart size={20} /> },
    { path: '/academy', label: 'Portal do Cliente', icon: <BookOpen size={20} /> },
    { path: '/metas', label: 'Calendário de Metas', icon: <TrendingUp size={20} /> },
    { path: '/pesquisas', label: 'Pesquisas (NPS)', icon: <BarChart2 size={20} /> },
    { path: '/whitelabel', label: 'White-Label (SaaS)', icon: <Layers size={20} /> },
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

          {user?.role !== 'cliente' && (
            <>
              {/* Separador WhatsApp */}
              <div style={{ padding: '12px 24px 4px', marginTop: 8 }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', fontWeight: 600 }}>WhatsApp & IA</span>
              </div>
              {getAllowedMenuItems([
                { path: '/inbox', label: 'Inbox (Chat)', icon: <Inbox size={20} /> },
                { path: '/whatsapp-setup', label: 'Conectar WhatsApp', icon: <MessageCircle size={20} /> },
                { path: '/fluxos', label: 'Editor de Fluxos', icon: <GitBranch size={20} /> },
                { path: '/templates', label: 'Templates', icon: <FileCheck size={20} /> },
              ]).map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </>
          )}
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
