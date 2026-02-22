import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, DollarSign, Calendar, AlertTriangle, MessageSquare, CheckSquare, Activity, ArrowUpRight, ArrowDownRight, Users, Clock } from 'lucide-react';

const Dashboard = () => {
    const [leadsCount, setLeadsCount] = useState(0);
    const [tasksCount, setTasksCount] = useState({ pendentes: 0, atrasadas: 0, lista: [] });

    useEffect(() => {
        const savedLeads = JSON.parse(localStorage.getItem('u3_leads') || '[]');
        setLeadsCount(savedLeads.filter(l => l.status === 'Novo').length);

        const savedTasks = JSON.parse(localStorage.getItem('u3_tarefas') || '[]');
        const pendentes = savedTasks.filter(t => t.coluna === 'pendente' || t.coluna === 'em_andamento').length;
        const atrasadas = savedTasks.length > 0 ? 1 : 0; // Mockando atrasadas se tiver tarefa

        setTasksCount({
            pendentes,
            atrasadas,
            lista: savedTasks.slice(0, 3)
        });
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="page-header" style={{ marginBottom: 0 }}>
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Activity color="var(--accent-color)" /> Dashboard Geral
                    </h2>
                    <p className="text-muted">Visão consolidada da agência em tempo real</p>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <select className="form-control" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', minWidth: 150 }}>
                        <option>Hoje</option>
                        <option>Últimos 7 dias</option>
                        <option>Mês Atual</option>
                    </select>
                </div>
            </div>

            {/* Linha 1: KPIs Principais (Receita, Leads, Whats, Tarefas) */}
            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>

                {/* KPI: Receita / MRR */}
                <div className="card" style={{ borderLeft: '4px solid var(--success)', position: 'relative', overflow: 'hidden' }}>
                    <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        Receita (MRR)
                        <DollarSign size={18} color="var(--success)" />
                    </div>
                    <div className="card-value" style={{ fontSize: '1.8rem', marginTop: 8 }}>R$ 14.500</div>
                    <div style={{ marginTop: 8, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success)' }}>
                        <ArrowUpRight size={14} /> +12% vs Mês Anterior
                    </div>
                </div>

                {/* KPI: Leads (CRM) */}
                <div className="card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
                    <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        Novos Leads
                        <Users size={18} color="var(--accent-color)" />
                    </div>
                    <div className="card-value" style={{ fontSize: '1.8rem', marginTop: 8 }}>{leadsCount || 12}</div>
                    <div style={{ marginTop: 8, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success)' }}>
                        <ArrowUpRight size={14} /> Dinâmico via CRM
                    </div>
                </div>

                {/* KPI: WhatsApp */}
                <div className="card" style={{ borderLeft: '4px solid #4FC3F7' }}>
                    <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        Atendimentos (IA + Humano)
                        <MessageSquare size={18} color="#4FC3F7" />
                    </div>
                    <div className="card-value" style={{ fontSize: '1.8rem', marginTop: 8 }}>1.284</div>
                    <div style={{ marginTop: 8, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                        <Clock size={14} /> Tempo Médio de Resp: 2m 14s
                    </div>
                </div>

                {/* KPI: Equipe / Tarefas */}
                <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
                    <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        Tarefas Pendentes
                        <CheckSquare size={18} color="var(--warning)" />
                    </div>
                    <div className="card-value" style={{ fontSize: '1.8rem', marginTop: 8 }}>{tasksCount.pendentes}</div>
                    <div style={{ marginTop: 8, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--danger)' }}>
                        <ArrowDownRight size={14} /> {tasksCount.atrasadas} Atrasadas
                    </div>
                </div>
            </div>

            {/* Linha 2:  Painéis divididos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

                {/* Tarefas da Equipe (Kanban Preview) */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckSquare size={16} color="var(--text-muted)" /> Últimas Tarefas
                        </h3>
                        <Link to="/tarefas" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Ver Kanban</Link>
                    </div>
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {tasksCount.lista.length > 0 ? tasksCount.lista.map((t, idx) => (
                            <div key={idx} style={{ padding: 12, backgroundColor: 'var(--bg-tertiary)', borderRadius: 8, borderLeft: `3px solid var(--border-color)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>{t.titulo}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>👤 {t.responsavel || 'Equipe'} | {t.cliente}</div>
                                </div>
                                <span className="badge" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)', border: `1px solid var(--border-color)` }}>
                                    {t.coluna.toUpperCase().replace('_', ' ')}
                                </span>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Sem tarefas cadastradas</div>
                        )}
                    </div>
                </div>

                {/* Reuniões do Dia */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Calendar size={16} color="var(--text-muted)" /> Agenda de Hoje
                        </h3>
                        <span className="badge" style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}>3 reuniões</span>
                    </div>
                    <div style={{ padding: 16 }}>
                        {[
                            { id: 1, time: '10:00', client: 'AlphaTech Solutions', type: 'Proposta' },
                            { id: 2, time: '14:30', client: 'Construtora Silva', type: 'Alinhamento' },
                            { id: 3, time: '16:00', client: 'Loja Nova', type: 'Diagnóstico (Lead)' }
                        ].map(meet => (
                            <div key={meet.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{meet.time} - {meet.client}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{meet.type}</div>
                                </div>
                                <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>Link Meet</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Clientes em Risco / Alertas */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ff333310' }}>
                        <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)' }}>
                            <AlertTriangle size={16} /> Alertas Críticos (Churn Risk)
                        </h3>
                    </div>
                    <div style={{ padding: 16 }}>
                        {[
                            { id: 2, name: 'Imobiliária Prime', reason: 'NPS Baixo (Nota 5)', lastMeet: 'Há 25 dias' },
                            { id: 5, name: 'Eco Produtos', reason: 'Engajamento zero no Whats', lastMeet: 'Há 32 dias' }
                        ].map(client => (
                            <div key={client.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
                                <div>
                                    <Link to={`/clientes/${client.id}`} style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{client.name}</Link>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 4 }}>Motivo: {client.reason}</div>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>🗓 {client.lastMeet}</div>
                            </div>
                        ))}
                        <div style={{ marginTop: 16, textAlign: 'center' }}>
                            <Link to="/clientes" style={{ fontSize: '0.8rem', color: 'var(--accent-color)', textDecoration: 'none' }}>Ver todos os Clientes →</Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
