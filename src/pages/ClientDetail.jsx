import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Calendar, Lock, CheckSquare, Smile, Shield, ArrowLeft, BarChart2, Users, DollarSign, Clock, LayoutGrid, CheckCircle, PlayCircle, Plus } from 'lucide-react';

const ClientDetail = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('resumo');

    // Dados Mockados para o Demo
    const client = {
        name: id === '1' ? 'AlphaTech Solutions' : 'Imobiliária Prime',
        status: 'ativo',
        start: '10/01/2026',
        mrr: 'R$ 2.500',
        nps: 9.5,
        responsible: 'Gestor U3',
        phone: '(11) 99999-9999',
        email: 'contato@cliente.com'
    };

    const clientTasks = [
        { id: 1, title: 'Criar novas artes Meta Ads', status: 'pendente', resp: 'Design U3', time: '0h 0m 0s' },
        { id: 2, title: 'Ajustar Campanha Meta Ads', status: 'em_andamento', resp: 'Gestor U3', time: '0h 25m 40s' },
        { id: 3, title: 'Reunião Kickoff', status: 'concluida', resp: 'CEO U3', time: '1h 0m 0s' }
    ];

    const funnelStages = [
        { name: 'Leads (Topo)', count: 120, color: 'var(--border-color)' },
        { name: 'Qualificados (Meio)', count: 45, color: 'var(--warning)' },
        { name: 'Oportunidades (Fundo)', count: 15, color: 'var(--accent-color)' },
        { name: 'Vendas Fechadas', count: 4, color: 'var(--success)' }
    ];

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
                            <div className="card">
                                <div className="card-title">Mensalidade (MRR)</div>
                                <div className="card-value" style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>{client.mrr}</div>
                            </div>
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
                                <thead><tr><th>Data</th><th>Título</th><th>Status</th><th>Link</th></tr></thead>
                                <tbody>
                                    <tr><td>22/02/2026</td><td>Alinhamento Quinzenal</td><td><span className="badge ativo" style={{ background: 'transparent', border: '1px solid var(--accent-color)' }}>Agendada</span></td><td><a href="#" style={{ color: 'var(--accent-color)' }}>Google Meet</a></td></tr>
                                    <tr><td>10/01/2026</td><td>Onboarding e Setup</td><td><span className="badge" style={{ backgroundColor: 'var(--success)', color: 'white' }}>Realizada</span></td><td>-</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'crm' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="card">
                            <h3 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Users size={18} /> Funil de Conversão do Cliente
                            </h3>
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                {funnelStages.map((stage, idx) => (
                                    <div key={idx} style={{ flex: 1, minWidth: 150, padding: 24, backgroundColor: 'var(--bg-secondary)', borderRadius: 12, borderTop: `4px solid ${stage.color}` }}>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 8, height: 40 }}>{stage.name}</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stage.count}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: 16 }}>Últimos Negócios Fechados</h3>
                            <table style={{ width: '100%' }}>
                                <thead><tr><th>Cliente (Lead)</th><th>Produto/Serviço</th><th>Valor</th><th>Data</th></tr></thead>
                                <tbody>
                                    <tr><td>João Pedro</td><td>Consultoria Master</td><td style={{ color: 'var(--success)', fontWeight: 600 }}>R$ 1.500</td><td>18/02/2026</td></tr>
                                    <tr><td>Maria Fernanda</td><td>Mentoria Premium</td><td style={{ color: 'var(--success)', fontWeight: 600 }}>R$ 800</td><td>15/02/2026</td></tr>
                                    <tr><td>Empresa XYZ</td><td>Setup B2B</td><td style={{ color: 'var(--success)', fontWeight: 600 }}>R$ 4.200</td><td>02/02/2026</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'midia' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="grid-cards">
                            <div className="card">
                                <div className="card-title">Investimento Mês</div>
                                <div className="card-value" style={{ fontSize: '1.5rem' }}>R$ 2.450</div>
                            </div>
                            <div className="card">
                                <div className="card-title">Receita Gerada</div>
                                <div className="card-value" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>R$ 18.300</div>
                            </div>
                            <div className="card">
                                <div className="card-title">ROAS do Cliente</div>
                                <div className="card-value" style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>7.4x</div>
                            </div>
                            <div className="card">
                                <div className="card-title">CPL do Cliente</div>
                                <div className="card-value" style={{ fontSize: '1.5rem' }}>R$ 20,41</div>
                            </div>
                        </div>
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, border: '2px dashed var(--border-color)', backgroundColor: 'transparent' }}>
                            <BarChart2 size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
                            <h3>Visão Detalhada de Mídia</h3>
                            <p className="text-muted" style={{ marginBottom: 24 }}>Acesse o dashboard completo com o filtro deste cliente para análise gráfica profunda.</p>
                            <Link to="/trafego" className="btn btn-primary">Ir para Dashboard Geral de Tráfego</Link>
                        </div>
                    </div>
                )}

                {activeTab === 'tarefas' && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <CheckSquare size={18} /> Histórico e Pendências da Equipe
                            </h3>
                            <Link to="/tarefas" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Ver no Kanban Geral</Link>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {clientTasks.map(task => (
                                <div key={task.id} style={{ padding: 16, backgroundColor: 'var(--bg-tertiary)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        {task.status === 'concluida' ? <CheckCircle size={24} color="var(--success)" /> :
                                            task.status === 'em_andamento' ? <PlayCircle size={24} color="var(--warning)" /> :
                                                <Clock size={24} color="var(--text-muted)" />}
                                        <div>
                                            <div style={{ fontWeight: 600, textDecoration: task.status === 'concluida' ? 'line-through' : 'none', marginBottom: 4 }}>{task.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Responsável: <strong>{task.resp}</strong></div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⏱ {task.time}</span>
                                        <span className={`badge ${task.status === 'concluida' ? 'ativo' : task.status === 'em_andamento' ? 'em_andamento' : 'pausado'}`}
                                            style={task.status === 'em_andamento' ? { backgroundColor: 'var(--warning)', color: 'black' } : {}}>
                                            {task.status === 'em_andamento' ? 'EM ANDAMENTO' : task.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'cofre' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <h3><Shield size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> Cofre de Senhas Protegido</h3>
                                <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '4px 12px' }}><Lock size={14} /> Novo Acesso</button>
                            </div>
                            <table style={{ width: '100%' }}>
                                <thead><tr><th>Plataforma</th><th>Usuário</th><th>Senha</th><th>Ações</th></tr></thead>
                                <tbody>
                                    <tr><td>Meta Ads</td><td>admin@cliente.com</td><td>••••••••••</td><td><button className="btn btn-outline" style={{ padding: '4px 8px' }}>Revelar</button></td></tr>
                                    <tr><td>Google Ads</td><td>marketing@cliente.com</td><td>••••••••••</td><td><button className="btn btn-outline" style={{ padding: '4px 8px' }}>Revelar</button></td></tr>
                                    <tr><td>Email (Hospedagem)</td><td>contato@cliente.com</td><td>••••••••••</td><td><button className="btn btn-outline" style={{ padding: '4px 8px' }}>Revelar</button></td></tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                                <h3><FileText size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> Documentos Anexados</h3>
                                <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '4px 12px' }}><Plus size={14} /> Novo Arquivo</button>
                            </div>
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                <div style={{ padding: 16, border: '1px solid var(--border-color)', borderRadius: 8, textAlign: 'center', width: 140, backgroundColor: 'var(--bg-tertiary)' }}>
                                    <FileText size={40} color="var(--accent-color)" style={{ marginBottom: 8 }} />
                                    <div style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>Contrato_Assinado.pdf</div>
                                </div>
                                <div style={{ padding: 16, border: '1px solid var(--border-color)', borderRadius: 8, textAlign: 'center', width: 140, backgroundColor: 'var(--bg-tertiary)' }}>
                                    <FileText size={40} color="var(--accent-color)" style={{ marginBottom: 8 }} />
                                    <div style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>Briefing_Inicial.docx</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDetail;
