import { useState } from 'react';
import { Save, User, Link as LinkIcon, Webhook, Shield, Plus, Trash2, Lock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../utils/auth';

const Settings = () => {
    const { user, changePassword } = useAuth();
    const [activeTab, setActiveTab] = useState('conta');

    // Trocar Senha
    const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
    const [pwFeedback, setPwFeedback] = useState(null);

    const handleChangePw = (e) => {
        e.preventDefault();
        if (pwForm.next !== pwForm.confirm) {
            setPwFeedback({ ok: false, msg: 'As novas senhas não coincidem.' });
            return;
        }
        if (pwForm.next.length < 6) {
            setPwFeedback({ ok: false, msg: 'A nova senha precisa ter pelo menos 6 caracteres.' });
            return;
        }
        const result = changePassword(pwForm.current, pwForm.next);
        if (result.success) {
            setPwFeedback({ ok: true, msg: 'Senha alterada com sucesso! 🎉' });
            setPwForm({ current: '', next: '', confirm: '' });
        } else {
            setPwFeedback({ ok: false, msg: result.error });
        }
        setTimeout(() => setPwFeedback(null), 4000);
    };

    const tabs = ['conta', 'geral', 'integracoes'];
    const tabLabels = { conta: 'Minha Conta', geral: 'Geral', integracoes: 'Integrações (API)' };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Configurações</h2>
                    <p className="text-muted">Ajustes do sistema e integrações</p>
                </div>
            </div>

            <div className="tabs">
                {tabs.map(t => (
                    <div
                        key={t}
                        className={`tab ${activeTab === t ? 'active' : ''}`}
                        onClick={() => setActiveTab(t)}
                    >
                        {tabLabels[t]}
                    </div>
                ))}
            </div>

            {/* ABA: MINHA CONTA */}
            {activeTab === 'conta' && (
                <div className="grid-cards" style={{ gridTemplateColumns: 'minmax(300px, 500px)' }}>
                    {/* Info do usuário */}
                    <div className="card">
                        <h3 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <User size={20} color="var(--accent-color)" /> Perfil do Usuário
                        </h3>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: 12 }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.4rem', flexShrink: 0 }}>
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user?.name || '-'}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user?.email || '-'}</div>
                                <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--bg-tertiary)', padding: '2px 10px', borderRadius: 20, marginTop: 4, display: 'inline-block', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    {user?.role || 'usuário'}
                                </span>
                            </div>
                        </div>

                        {/* Form de troca de senha */}
                        <h4 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Lock size={16} color="var(--accent-color)" /> Alterar Senha
                        </h4>

                        {pwFeedback && (
                            <div style={{
                                padding: '12px 16px', borderRadius: 8, marginBottom: 16,
                                backgroundColor: pwFeedback.ok ? 'rgba(0, 208, 132, 0.1)' : 'rgba(235, 20, 76, 0.1)',
                                border: `1px solid ${pwFeedback.ok ? 'var(--success)' : 'var(--danger)'}`,
                                display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem'
                            }}>
                                {pwFeedback.ok ? <CheckCircle size={16} color="var(--success)" /> : <XCircle size={16} color="var(--danger)" />}
                                {pwFeedback.msg}
                            </div>
                        )}

                        <form onSubmit={handleChangePw} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Senha Atual</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    required
                                    value={pwForm.current}
                                    onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                                    placeholder="Digite sua senha atual"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nova Senha</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    required
                                    value={pwForm.next}
                                    onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))}
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirmar Nova Senha</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    required
                                    value={pwForm.confirm}
                                    onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                                    placeholder="Repita a nova senha"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center' }}>
                                <Lock size={16} /> Salvar Nova Senha
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'geral' && (
                <div className="grid-cards">
                    <div className="card">
                        <h3 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <User size={20} color="var(--accent-color)" /> Perfil da Empresa
                        </h3>
                        <div className="form-group">
                            <label className="form-label">Nome da Empresa</label>
                            <input type="text" className="form-control" defaultValue="U3 Company" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">E-mail de Contato Principal</label>
                            <input type="email" className="form-control" defaultValue="contato@u3company.com" />
                        </div>
                        <button className="btn btn-primary" style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Save size={16} /> Salvar Alterações
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'integracoes' && (
                <div className="grid-cards" style={{ gridTemplateColumns: 'minmax(300px, 1fr)' }}>
                    <div className="card">
                        <h3 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Webhook size={20} color="var(--accent-color)" /> Webhooks & Automações
                        </h3>
                        <div className="form-group">
                            <label className="form-label">Webhook URL (Entrada de Leads)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input type="text" className="form-control" readOnly value="https://api.u3company.com/v1/webhooks/leads/receive" />
                                <button className="btn btn-outline" style={{ padding: '0 16px' }}><LinkIcon size={16} /></button>
                            </div>
                            <p style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Integre esta URL com Make, Zapier ou RD Station para entrada automática.
                            </p>
                        </div>

                        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
                            <h4 style={{ marginBottom: 16 }}>Integração Flowbuilder Externo (Typebot/n8n)</h4>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>URL do seu Flowbuilder</label>
                                <input type="text" className="form-control" placeholder="https://bot.suaagencia.com/api/v1/receive..." />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
