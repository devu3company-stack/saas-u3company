import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../utils/auth';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('demo@u3company.com');
    const [password, setPassword] = useState('demo');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        const result = login(email, password);
        if (result.success) {
            // Redireciona com base no role
            if (result.user.role === 'cliente') {
                navigate('/trafego');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="text-center mb-4">
                    <Lock size={48} color="var(--accent-color)" style={{ marginBottom: 16 }} />
                    <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: 8 }}>Entrar no CRM</h2>
                    <p className="text-muted">Acesso restrito U3 Company</p>
                </div>

                {error && (
                    <div style={{ padding: '10px 16px', backgroundColor: 'rgba(255,68,68,0.1)', border: '1px solid var(--danger)', borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)', fontSize: '0.85rem' }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">E-mail</label>
                        <input type="email" className="form-control" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Senha
                            <a href="#" style={{ color: 'var(--accent-color)', fontSize: '0.8rem' }}>Esqueceu?</a>
                        </label>
                        <input type="password" className="form-control" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
                        Acessar Plataforma
                    </button>
                </form>

                <div style={{ marginTop: 24, padding: 16, backgroundColor: 'var(--bg-tertiary)', borderRadius: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-main)' }}>Acesso de demonstração:</p>
                    <p>👑 Admin: <strong>demo@u3company.com</strong> / demo</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
