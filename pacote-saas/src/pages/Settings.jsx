import { useState } from 'react';
import { Save, User, Link as LinkIcon, Webhook, Shield, Plus, Trash2 } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('Geral');

    // Mock user roles
    const [users, setUsers] = useState([
        { id: 1, name: 'Admin Principal', email: 'contato@u3company.com', role: 'Admin' },
        { id: 2, name: 'Gestor de Tráfego 1', email: 'trafego@u3company.com', role: 'SDR/Gestor' },
        { id: 3, name: 'Financeiro', email: 'fin@u3company.com', role: 'Financeiro' },
    ]);
    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Configurações</h2>
                    <p className="text-muted">Ajustes do sistema e integrações</p>
                </div>
                <button className="btn btn-primary"><Save size={16} /> Salvar Alterações</button>
            </div>

            <div className="tabs">
                {['Geral', 'Usuários e Permissões', 'Integrações (API)'].map(t => (
                    <div
                        key={t}
                        className={`tab ${activeTab === t ? 'active' : ''}`}
                        onClick={() => setActiveTab(t)}
                    >
                        {t}
                    </div>
                ))}
            </div>

            {activeTab === 'Geral' && (
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
                    </div>
                </div>
            )}

            {activeTab === 'Usuários e Permissões' && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Shield size={20} color="var(--accent-color)" /> Controle de Acesso
                        </h3>
                        <button className="btn btn-outline" style={{ fontSize: '0.8rem' }}><Plus size={14} /> Convidar Usuário</button>
                    </div>

                    <p className="text-muted" style={{ marginBottom: 24, fontSize: '0.9rem' }}>
                        Usuários com nível <strong>Admin</strong> tem acesso total. O <strong>Gestor</strong> não acessa faturamento.
                        O <strong>Cliente</strong> só enxerga os dados do seu próprio contrato em Cliente 360°.
                    </p>

                    <div className="table-container" style={{ border: '1px solid var(--border-color)', borderRadius: 8 }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome do Usuário</th>
                                    <th>E-mail</th>
                                    <th>Tipo de Acesso</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <select className="form-control" style={{ padding: '6px 12px', fontSize: '0.85rem' }} defaultValue={u.role}>
                                                <option>Admin</option>
                                                <option>SDR/Gestor</option>
                                                <option>Financeiro</option>
                                                <option>Cliente (Visualizador)</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button className="btn btn-outline" style={{ padding: '6px 10px', color: 'var(--danger)', borderColor: 'var(--border-color)' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'Integrações (API)' && (
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
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>Integração Flowbuilder Externo (Typebot/n8n)</h4>

                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>URL do seu Flowbuilder (para onde mandar as mensagens)</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input type="text" className="form-control" placeholder="https://bot.suaagencia.com/api/v1/receive..." />
                                </div>
                                <p style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Se configurado, nós **não** vamos responder usando a IA Nativa do CRM, vamos encaminhar todos os Webhooks que a Evolution receber direto para esta URL do seu robô externo.
                                </p>
                            </div>

                            <div className="form-group" style={{ marginTop: 16 }}>
                                <label className="form-label" style={{ fontSize: '0.8rem' }}>Webhook de Retorno (Typebot ➔ CRM Humano)</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input type="text" className="form-control" readOnly value="https://api.u3company.com/v1/flow/handover" />
                                    <button className="btn btn-outline" style={{ padding: '0 16px' }}><LinkIcon size={16} /></button>
                                </div>
                                <p style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--success)' }}>
                                    No seu Flowbuilder, quando quiser passar para humano, faça um POST para esta URL enviando o `telefone`. Ele irá pausar o seu bot e jogar o cliente para a nossa tela de **Inbox (Chat)**.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Settings;
