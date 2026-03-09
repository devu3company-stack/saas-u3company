import { useState } from 'react';
import { Layers, Plus, Copy, Palette, Globe, CheckCircle, Search, LayoutTemplate, MoreVertical, Shield } from 'lucide-react';

const WhiteLabel = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [templateModalOpen, setTemplateModalOpen] = useState(false);

    // Dados Mockados das Agências (Tenants) do SaaS
    const [agencies, setAgencies] = useState([
        { id: 1, name: 'U3 Company (Matriz)', domain: 'app.u3company.com', color: '#fff600', status: 'ativo', clients: 45, plan: 'Lifetime' },
        { id: 2, name: 'Marketing Pro', domain: 'crm.marketingpro.com.br', color: '#00D084', status: 'ativo', clients: 12, plan: 'Mensal - R$ 997' },
        { id: 3, name: 'Lead Machine Agency', domain: 'painel.leadmachine.com', color: '#EB144C', status: 'deploying', clients: 0, plan: 'Mensal - R$ 997' }
    ]);

    const handleCreateInstance = (e) => {
        e.preventDefault();
        const form = e.target;
        const newAgency = {
            id: Date.now(),
            name: form.agencyName.value,
            domain: form.domain.value,
            color: form.color.value,
            status: 'deploying',
            clients: 0,
            plan: form.plan.value,
        };
        setAgencies([...agencies, newAgency]);
        setModalOpen(false);
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2><Layers size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--accent-color)' }} /> Gerenciador de Instâncias (SaaS Web)</h2>
                    <p className="text-muted">Controle as licenças, duplique o painel e personalize cores para outras agências.</p>
                </div>
                <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
                    <button className="btn btn-outline" onClick={() => setTemplateModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <LayoutTemplate size={16} /> Mapeamento de Templates
                    </button>
                    <button className="btn btn-primary" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Copy size={16} /> Nova Licença (Duplicar)
                    </button>
                </div>
            </div>

            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
                <div className="card">
                    <div className="card-title">Licenças Ativas</div>
                    <div className="card-value" style={{ fontSize: '1.8rem' }}>{agencies.filter(a => a.status === 'ativo').length}</div>
                </div>
                <div className="card">
                    <div className="card-title">Instalando (Deploy)</div>
                    <div className="card-value" style={{ fontSize: '1.8rem', color: 'var(--warning)' }}>{agencies.filter(a => a.status === 'deploying').length}</div>
                </div>
                <div className="card">
                    <div className="card-title">MRR de Licenciamento</div>
                    <div className="card-value" style={{ fontSize: '1.8rem', color: 'var(--success)' }}>R$ 1.994</div>
                </div>
                <div className="card">
                    <div className="card-title">Clientes (End-Users)</div>
                    <div className="card-value" style={{ fontSize: '1.8rem' }}>{agencies.reduce((acc, curr) => acc + curr.clients, 0)}</div>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                    <h3>Painéis de Agências Licenciadas</h3>
                    <div className="topbar-search" style={{ margin: 0, backgroundColor: 'var(--bg-main)' }}>
                        <Search size={18} color="var(--text-muted)" />
                        <input type="text" placeholder="Buscar agência ou domínio..." />
                    </div>
                </div>

                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Agência / Empresa</th>
                            <th>Domínio (Branding)</th>
                            <th>Cor Principal</th>
                            <th>Plano Base</th>
                            <th>Usuários Finais</th>
                            <th>Status do Servidor</th>
                            <th style={{ textAlign: 'center' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agencies.map(agency => (
                            <tr key={agency.id}>
                                <td style={{ fontWeight: 600 }}>{agency.name}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                                        <Globe size={14} color="var(--text-muted)" />
                                        {agency.domain}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: agency.color, border: '1px solid var(--border-color)' }}></div>
                                        <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{agency.color}</span>
                                    </div>
                                </td>
                                <td><span className="badge" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>{agency.plan}</span></td>
                                <td>{agency.clients} clientes</td>
                                <td>
                                    {agency.status === 'ativo' ? (
                                        <span className="badge ativo" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} /> Online</span>
                                    ) : (
                                        <span className="badge em_andamento" style={{ backgroundColor: 'var(--warning)', color: 'black' }}>🔧 Deploying (Vercel)</span>
                                    )}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button className="btn btn-outline" style={{ padding: '4px 8px', border: 'none' }}><MoreVertical size={16} color="var(--text-muted)" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Nova Licença (White-Label) */}
            {modalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: 550, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}><Copy size={20} color="var(--accent-color)" /> Configurar Nova Instância SaaS</h3>
                        </div>

                        <form onSubmit={handleCreateInstance}>

                            <div className="responsive-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Nome da Agência / Empresa</label>
                                    <input name="agencyName" type="text" className="form-control" required placeholder="Ex: Agência Connect" autoFocus />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Plano Vendido</label>
                                    <select name="plan" className="form-control" required>
                                        <option>Mensal - R$ 997</option>
                                        <option>Anual - R$ 9.970</option>
                                        <option>Lifetime / Setup Único</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: 16 }}>
                                <label className="form-label">Domínio Personalizado (Subdomínio CNAME)</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ padding: '10px 16px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRight: 'none', borderRadius: '8px 0 0 8px', color: 'var(--text-muted)' }}>https://</span>
                                    <input name="domain" type="text" className="form-control" required placeholder="app.nomedaagencia.com.br" style={{ borderRadius: '0 8px 8px 0' }} />
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Aponte o CNAME do domínio acima para <strong>cname.vercel-dns.com</strong>.</p>
                            </div>

                            <div className="responsive-grid-2" style={{ marginTop: 16, borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Shield size={14} /> Credencial Admin (E-mail)</label>
                                    <input name="adminEmail" type="email" className="form-control" required placeholder="admin@agencia.com" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Shield size={14} /> Senha do Admin</label>
                                    <input name="adminPassword" type="password" className="form-control" required placeholder="********" />
                                </div>
                            </div>

                            <div style={{ marginTop: 24, backgroundColor: 'var(--bg-main)', padding: 16, borderRadius: 8, border: '1px dashed var(--border-color)' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: '0.9rem' }}><Palette size={16} /> Personalização Visual (White-Label)</h4>

                                <div className="responsive-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Cor Primária (Accent Color)</label>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <input name="color" type="color" className="form-control" defaultValue="#00D084" style={{ width: 60, padding: 0, height: 40, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} />
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Definirá botões e ícones.</span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Logotipo do Painel</label>
                                        <button type="button" className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>Upload PNG/SVG</button>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 32, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <Globe size={16} /> Fazer Deploy do Novo Servidor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {templateModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: 500 }}>
                        <h3 style={{ marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center' }}><LayoutTemplate size={20} color="var(--accent-color)" /> Mapeamento de Templates e Módulos</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
                            Determine quais módulos padrão serão ativados nas novas licenças White-Label.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {['CRM & Funil', 'Gestor de Tarefas', 'Mídia & Performance (Upload Meta)', 'Fluxos e IA', 'Relatórios Financeiros'].map((t, idx) => (
                                <div key={idx} style={{ padding: 12, border: '1px solid var(--border-color)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-main)' }}>
                                    <span style={{ fontWeight: 500 }}>{t}</span>
                                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent-color)', width: 18, height: 18 }} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-outline" onClick={() => setTemplateModalOpen(false)}>Fechar</button>
                            <button type="button" className="btn btn-primary" onClick={() => setTemplateModalOpen(false)}>Atualizar Templates</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhiteLabel;
