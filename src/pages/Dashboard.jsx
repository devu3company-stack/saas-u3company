import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, DollarSign, Calendar, AlertTriangle, MessageSquare, CheckSquare, Activity, ArrowUpRight, ArrowDownRight, Users, Clock, Smile } from 'lucide-react';
import { useAuth } from '../utils/auth';
import { useSyncedData } from '../utils/useSyncedData';

const Dashboard = () => {
    const { user } = useAuth();
    const isDesigner = user?.role === 'designer';

    const [savedClients] = useSyncedData('u3_clients_v2', []);
    const [savedLeads] = useSyncedData('u3_leads', []);
    const [savedTasks] = useSyncedData('u3_tarefas', []);

    const mrr = (savedClients || []).reduce((acc, c) => {
        if (c.status === 'ativo' && c.mrr) {
            const numberStr = String(c.mrr).replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
            return acc + (parseFloat(numberStr) || 0);
        }
        return acc;
    }, 0);

    const leadsCount = (savedLeads || []).filter(l => l.status === 'Novo' || l.status === 'Novo Lead').length;

    const allTasks = savedTasks || [];
    const pendentes = allTasks.filter(t => t.status === 'pendente' || t.status === 'em_andamento').length;
    const atrasadas = allTasks.filter(t => {
        if (t.status === 'concluida') return false;
        return new Date(t.dataEntrega) < new Date();
    }).length;
    const tasksCount = { pendentes, atrasadas, lista: allTasks.slice(0, 3) };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="page-header" style={{ marginBottom: 0, gap: 16 }}>
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.5rem' }}>
                        <Activity color="var(--accent-color)" /> Dashboard Geral
                    </h2>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>Visão consolidada da agência em tempo real</p>
                </div>
                <div className="filter-bar" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <select className="form-control" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', minWidth: 150, padding: '8px 12px' }}>
                        <option>Hoje</option>
                        <option>Últimos 7 dias</option>
                        <option>Mês Atual</option>
                    </select>
                </div>
            </div>

            {/* Linha 1: KPIs Principais */}
            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>

                {/* KPI: Receita / MRR (Oculto para Designer) */}
                {!isDesigner && (
                    <div className="card" style={{ borderLeft: '4px solid var(--success)', position: 'relative', overflow: 'hidden' }}>
                        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Receita (MRR)
                            <DollarSign size={18} color="var(--success)" />
                        </div>
                        <div className="card-value" style={{ fontSize: '1.8rem', marginTop: 8 }}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mrr)}
                        </div>
                        <div style={{ marginTop: 8, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                            Baseado em Clientes Ativos
                        </div>
                    </div>
                )}

                {/* KPI: Leads (CRM) */}
                <div className="card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
                    <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        Novos Leads
                        <Users size={18} color="var(--accent-color)" />
                    </div>
                    <div className="card-value" style={{ fontSize: '1.8rem', marginTop: 8 }}>{leadsCount}</div>
                    <div style={{ marginTop: 8, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success)' }}>
                        <ArrowUpRight size={14} /> Dinâmico via CRM
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

                {/* ADICIONAL: Extrator de Leads (UPGRADE) */}
                <Link to="/extrator" className="card" style={{ 
                    border: '1px dashed var(--accent-color)', 
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    gap: 8, cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s ease'
                }}>
                    <div style={{ padding: 8, backgroundColor: 'var(--accent-color)', borderRadius: '50%', color: 'white' }}>
                        <Rocket size={18} />
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-color)', fontSize: '0.9rem' }}>
                        + Adicione o Extrator de Leads
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Opcional)</div>
                </Link>
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
                                    {(t.status || t.coluna || '').toUpperCase().replace('_', ' ')}
                                </span>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Sem tarefas cadastradas</div>
                        )}
                    </div>
                </div>

                {/* NPS Geral (Exibido para Designer no lugar de Clientes em Risco / Mettings) */}
                {isDesigner ? (
                    <div className="card" style={{ padding: 0 }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Smile size={16} color="var(--text-muted)" /> NPS Médio (Design)
                            </h3>
                            <span className="badge" style={{ backgroundColor: 'var(--success)', color: 'black' }}>Zona de Qualidade</span>
                        </div>
                        <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>-</div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhum feedback coletado ainda</p>
                        </div>
                    </div>
                ) : (
                    <div className="card" style={{ padding: 0 }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Calendar size={16} color="var(--text-muted)" /> Agenda de Hoje
                            </h3>
                            <Link to="/reunioes" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Ver Agenda</Link>
                        </div>
                        <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            Nenhuma reunião agendada para hoje
                        </div>
                    </div>
                )}

                {/* Clientes em Risco / Alertas (Oculto para Designer) */}
                {!isDesigner && (
                    <div className="card" style={{ padding: 0 }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <AlertTriangle size={16} color="var(--text-muted)" /> Alertas Críticos
                            </h3>
                        </div>
                        <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            Tudo sob controle! Nenhum alerta crítico.
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;
