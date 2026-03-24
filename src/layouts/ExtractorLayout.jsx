import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../utils/auth';
import { LogOut, Database, User } from 'lucide-react';

const ExtractorLayout = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    // Proteção de Rota: Firebase Auth
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login?callback=' + encodeURIComponent(window.location.pathname));
        }
    }, [user, loading, navigate]);

    if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
            {/* Header Minimalista para o Produto Separado */}
            <header style={{ 
                height: 64, backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
                position: 'sticky', top: 0, zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/extrator')}>
                    <Database color="var(--accent-color)" size={24} />
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>U3 <span style={{ color: 'var(--accent-color)' }}>EXTRACTOR</span></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <User size={16} /> {user?.name}
                    </div>
                    <button 
                        onClick={logout}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', 
                            backgroundColor: 'transparent', border: '1px solid var(--border-color)',
                            borderRadius: 8, color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.85rem'
                        }}
                    >
                        <LogOut size={16} /> Sair
                    </button>
                </div>
            </header>

            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default ExtractorLayout;
