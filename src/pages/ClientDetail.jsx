import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Calendar, Lock, CheckSquare, Smile, Shield, ArrowLeft, BarChart2, Users, DollarSign, Clock, LayoutGrid, CheckCircle, PlayCircle, Plus, Map, Palette, Upload, Trash2, Image } from 'lucide-react';
import { useAuth } from '../utils/auth';

const ClientDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const isDesigner = user?.role === 'designer';
    const [activeTab, setActiveTab] = useState('onboarding');

    // Onboarding Trail Tracker
    const [onboardingSteps, setOnboardingSteps] = useState(() => {
        const saved = localStorage.getItem(`u3_onboarding_${id}`);
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, title: 'Reunião de Kickoff', desc: 'Apresentação da equipe e metas', done: false },
            { id: 2, title: 'Ativos Digitais (BM, Ads)', desc: 'Conseguir acessos ao Meta e Google Ads', done: false },
            { id: 3, title: 'Criação de Criativos / Copy', desc: 'Produzir peças para a campanha', done: false },
            { id: 4, title: 'Aprovação Final com Cliente', desc: 'Validar assets', done: false },
            { id: 5, title: 'Ativação das Campanhas', desc: 'Campanhas no ar', done: false }
        ];
    });

    useEffect(() => {
        localStorage.setItem(`u3_onboarding_${id}`, JSON.stringify(onboardingSteps));
    }, [onboardingSteps]);

    const toggleStep = (stepId) => {
        setOnboardingSteps(onboardingSteps.map(s =>
            s.id === stepId ? { ...s, done: !s.done } : s
        ));
    };

    // Load REAL Client Data
    const [client, setClient] = useState(null);
    const [clientTasks, setClientTasks] = useState([]);

    // Materiais do cliente
    const [materiais, setMateriais] = useState(() => {
        const saved = localStorage.getItem(`u3_materiais_${id}`);
        return saved ? JSON.parse(saved) : { briefing: '', logo: null, assets: [] };
    });

    useEffect(() => {
        localStorage.setItem(`u3_materiais_${id}`, JSON.stringify(materiais));
    }, [materiais, id]);

    const handleUploadAsset = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setMateriais(prev => ({
                    ...prev,
                    assets: [...prev.assets, { name: file.name, data: ev.target.result, uploadedAt: new Date().toLocaleDateString('pt-BR') }]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const handleUploadLogo = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setMateriais(prev => ({ ...prev, logo: { name: file.name, data: ev.target.result } }));
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        const clients = JSON.parse(localStorage.getItem('u3_clients_v2') || '[]');
        const found = clients.find(c => c.id.toString() === id);
        if (found) {
            setClient({
                name: found.name,
                status: found.status || 'ativo',
                start: found.start || new Date().toLocaleDateString('pt-BR'),
                mrr: found.mrr || '-',
                nps: found.nps || '-',
                responsible: found.responsavel || 'Gestor U3',
                phone: found.whatsapp || found.contato || '-',
                email: found.email || '-'
            });
        } else {
            setClient({
                name: 'Cliente Não Encontrado',
                status: 'cancelado',
                start: '-', mrr: '-', nps: '-', responsible: '-', phone: '-', email: '-'
            });
        }

        const tasks = JSON.parse(localStorage.getItem('u3_tarefas') || '[]');
        // Filter tasks by client name (if matched)
        const matchedTasks = tasks.filter(t => found && t.cliente.toLowerCase().includes(found.name.toLowerCase()));

        // If no tasks found, provide mock tasks
        if (matchedTasks.length > 0) {
            setClientTasks(matchedTasks.map(t => ({
                id: t.id, title: t.titulo,
                status: t.coluna === 'concluido' ? 'concluida' : t.coluna === 'pendente' ? 'pendente' : 'em_andamento',
                resp: t.responsavel, time: 'Dinâmico'
            })));
        } else {
            setClientTasks([
                { id: 1, title: 'Criar novas artes Meta Ads', status: 'pendente', resp: 'Equipe U3', time: '0h 0m' },
                { id: 2, title: 'Setup de Conta', status: 'em_andamento', resp: 'Gestor U3', time: '1h 20m' }
            ]);
        }
    }, [id]);

    const funnelStages = [
        { name: 'Leads (Topo)', count: 120, color: 'var(--border-color)' },
        { name: 'Qualificados (Meio)', count: 45, color: 'var(--warning)' },
        { name: 'Oportunidades (Fundo)', count: 15, color: 'var(--accent-color)' },
        { name: 'Vendas Fechadas', count: 4, color: 'var(--success)' }
    ];

    if (!client) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando dados do cliente...</div>;

    return (
        <div>
            <div className="page-header" style={{ marginBottom: 16 }}>
                <div>
                    <Link to="/clientes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: 12, fontSize: '0.9rem' }}>
                        <ArrowLeft size={16} /> Voltar para Clientes
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{client.name}</h2>
                        <span className={`badge ${client.status}`}>{client.status.toUpperCase()}</span>
                    </div>
                    <p className="text-muted" style={{ display: 'flex', gap: 16 }}>
                        <span>👤 {client.responsible}</span>
                        <span>📱 {client.phone}</span>
                        <span>✉️ {client.email}</span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-outline">Editar Ficha</button>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Calendar size={16} /> Agendar Mentoria
                    </button>
                </div>
            </div>

            <div className="tabs">
                {[
                    { id: 'resumo', label: 'Resumo & Dashboard' },
                    { id: 'materiais', label: 'Materiais & Briefing' },
                    { id: 'onboarding', label: 'Trilha de Onboarding' },
                    { id: 'crm', label: 'CRM & Funil' },
                    { id: 'midia', label: 'Mídia & Performance' },
                    { id: 'tarefas', label: 'Tarefas da Equipe' },
                    { id: 'cofre', label: 'Docs & Senhas' }
                ].map(tab => (
                    <div
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            <div className="tab-content" style={{ marginTop: 24 }}>
                {activeTab === 'resumo' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="grid-cards">
                            <div className="card">
                                <div className="card-title">Início Contrato</div>
                                <div className="card-value" style={{ fontSize: '1.5rem' }}>{client.start}</div>
                            </div>
                            {!isDesigner && (
                                <div className="card">
                                    <div className="card-title">Mensalidade (MRR)</div>
                                    <div className="card-value" style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>{client.mrr}</div>
                                </div>
                            )}
                            <div className="card">
                                <div className="card-title">Satisfação (NPS)</div>
                                <div className="card-value" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>{client.nps} / 10</div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Calendar size={18} /> Próximas Reuniões
                            </h3>
                            <table style={{ width: '100%' }}>
                                <thead><tr><th style={{ textAlign: 'left' }}>Data</th><th style={{ textAlign: 'left' }}>Título</th><th style={{ textAlign: 'left' }}>Status</th><th style={{ textAlign: 'left' }}>Link</th></tr></thead>
                                <tbody>
                                    <tr><td style={{ padding: '8px 0' }}>22/02/2026</td><td>Alinhamento Quinzenal</td><td><span className="badge ativo" style={{ background: 'transparent', border: '1px solid var(--accent-color)' }}>Agendada</span></td><td><a href="#" style={{ color: 'var(--accent-color)' }}>Google Meet</a></td></tr>
                                    <tr><td style={{ padding: '8px 0' }}>10/01/2026</td><td>Onboarding e Setup</td><td><span className="badge" style={{ backgroundColor: 'var(--success)', color: 'white' }}>Realizada</span></td><td>-</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'onboarding' && (
                    <div className="card">
                        <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckSquare size={18} /> Trilha de Onboarding
                        </h3>
                        <p className="text-muted" style={{ marginBottom: 24 }}>Acompanhe os passos iniciais deste cliente.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {onboardingSteps.map(step => (
                                <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, backgroundColor: 'var(--bg-tertiary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                                    <input type="checkbox" checked={step.done} onChange={() => toggleStep(step.id)} style={{ width: 20, height: 20, cursor: 'pointer' }} />
                                    <div style={{ flex: 1, textDecoration: step.done ? 'line-through' : 'none', opacity: step.done ? 0.6 : 1 }}>
                                        <div style={{ fontWeight: 600 }}>{step.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{step.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'crm' && (
                    <div className="card">
                        <h3 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Users size={18} /> Pipeline do Cliente
                        </h3>
                        <div className="grid-cards">
                            {funnelStages.map(stage => (
                                <div key={stage.name} className="card" style={{ borderTop: `4px solid ${stage.color}`, backgroundColor: 'var(--bg-tertiary)' }}>
                                    <div className="card-title" style={{ fontSize: '0.85rem' }}>{stage.name}</div>
                                    <div className="card-value" style={{ fontSize: '1.8rem', marginTop: 8 }}>{stage.count}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'midia' && (
                    <div className="card">
                        <h3 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <BarChart2 size={18} /> Resumo de Performance Mídia
                        </h3>
                        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                            <div className="card" style={{ backgroundColor: 'var(--bg-tertiary)' }}><div className="text-muted" style={{ fontSize: '0.85rem' }}>Investimento</div><div style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: 8 }}>R$ 1.250</div></div>
                            <div className="card" style={{ backgroundColor: 'var(--bg-tertiary)' }}><div className="text-muted" style={{ fontSize: '0.85rem' }}>Impressões</div><div style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: 8 }}>45.200</div></div>
                            <div className="card" style={{ backgroundColor: 'var(--bg-tertiary)' }}><div className="text-muted" style={{ fontSize: '0.85rem' }}>Cliques</div><div style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: 8 }}>1.204</div></div>
                            <div className="card" style={{ backgroundColor: 'var(--bg-tertiary)' }}><div className="text-muted" style={{ fontSize: '0.85rem' }}>Leads</div><div style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: 8, color: 'var(--success)' }}>120</div></div>
                        </div>
                    </div>
                )}

                {activeTab === 'tarefas' && (
                    <div className="card">
                        <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckCircle size={18} /> Tarefas da Equipe para {client.name}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {clientTasks.map(task => (
                                <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: 'var(--bg-tertiary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {task.status === 'concluida' ? <CheckCircle size={16} color="var(--success)" /> : <Clock size={16} color="var(--warning)" />}
                                            {task.title}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Resp: {task.resp}</div>
                                    </div>
                                    <span className={`badge ${task.status === 'concluida' ? 'ativo' : 'pendente'}`}>{task.status.toUpperCase().replace('_', ' ')}</span>
                                </div>
                            ))}
                        </div>
                        {clientTasks.length === 0 && (
                            <p className="text-muted">Nenhuma tarefa encontrada para este cliente.</p>
                        )}
                    </div>
                )}

                {activeTab === 'cofre' && (
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40 }}>
                        <Shield size={48} color="var(--accent-color)" style={{ marginBottom: 16 }} />
                        <h3 style={{ marginBottom: 8 }}>Cofre de Senhas</h3>
                        <p className="text-muted" style={{ textAlign: 'center', maxWidth: 400 }}>Acesso restrito. Somente usuários com permissão "Admin" ou "Gestor de Tráfego" podem ver as senhas cadastradas (BM, Google, WordPress, etc).</p>
                        <button className="btn btn-primary" style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Lock size={16} /> Desbloquear Cofre de {client.name}
                        </button>
                    </div>
                )}

                {/* ABA MATERIAIS & BRIEFING */}
                {activeTab === 'materiais' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Logo da Empresa */}
                        <div className="card">
                            <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Image size={18} /> Logotipo da Empresa
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                                {materiais.logo ? (
                                    <div style={{ position: 'relative' }}>
                                        <img src={materiais.logo.data} alt="Logo" style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 12, border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', padding: 8 }} />
                                        <button onClick={() => setMateriais(prev => ({ ...prev, logo: null }))} style={{ position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: '50%', backgroundColor: 'var(--danger)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                    </div>
                                ) : (
                                    <div style={{ width: 120, height: 120, borderRadius: 12, border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: 12 }}>
                                        Sem logo
                                    </div>
                                )}
                                <div>
                                    <label className="btn btn-outline" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                        <Upload size={14} /> {materiais.logo ? 'Trocar Logo' : 'Enviar Logo'}
                                        <input type="file" accept="image/*" onChange={handleUploadLogo} style={{ display: 'none' }} />
                                    </label>
                                    <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: 8 }}>PNG ou JPG, fundo transparente preferido</p>
                                </div>
                            </div>
                        </div>

                        {/* Briefing */}
                        <div className="card">
                            <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Palette size={18} /> Briefing de Design
                            </h3>
                            <p className="text-muted" style={{ marginBottom: 12, fontSize: '0.85rem' }}>Cole o briefing aqui: cores da marca, fontes, tom de voz, referências visuais, etc.</p>
                            <textarea
                                className="form-control"
                                rows="6"
                                value={materiais.briefing}
                                onChange={(e) => setMateriais(prev => ({ ...prev, briefing: e.target.value }))}
                                placeholder="Ex: Cores primárias: #1a1a2e e #e94560. Fonte: Montserrat Bold para títulos, Inter para corpo. Tom de voz: moderno, jovem, direto..."
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        {/* Assets / Materiais */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                                    <FileText size={18} /> Materiais e Arquivos
                                </h3>
                                <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                    <Upload size={14} /> Enviar Arquivo
                                    <input type="file" accept="image/*,.pdf" multiple onChange={handleUploadAsset} style={{ display: 'none' }} />
                                </label>
                            </div>

                            {materiais.assets.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
                                    {materiais.assets.map((asset, i) => (
                                        <div key={i} style={{ position: 'relative', backgroundColor: 'var(--bg-tertiary)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                            <img src={asset.data} alt={asset.name} onClick={() => window.open(asset.data, '_blank')} style={{ width: '100%', height: 120, objectFit: 'cover', cursor: 'pointer' }} />
                                            <div style={{ padding: '8px 10px' }}>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{asset.name}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Enviado em {asset.uploadedAt}</div>
                                            </div>
                                            <button onClick={() => setMateriais(prev => ({ ...prev, assets: prev.assets.filter((_, idx) => idx !== i) }))} style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', border: '2px dashed var(--border-color)', borderRadius: 12 }}>
                                    <Upload size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                                    <p>Nenhum material enviado ainda.</p>
                                    <p style={{ fontSize: '0.8rem' }}>Envie logos, guias de marca, criativos, flyers...</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ClientDetail;
