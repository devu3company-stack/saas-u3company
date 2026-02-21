import { Link } from 'react-router-dom';
import { Target, DollarSign, Calendar, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
    return (
        <div>
            <div className="page-header">
                <h2>Dashboard Geral</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Mês Atual (Fev/26)</button>
                </div>
            </div>

            <div className="grid-cards">
                <div className="card">
                    <div className="card-title">Novos Clientes</div>
                    <div className="card-value" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>8 / 12</span>
                        <Target size={32} color="var(--accent-color)" />
                    </div>
                    <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--success)' }}>+ 2 essa semana</div>
                </div>

                <div className="card">
                    <div className="card-title">MRR Crescimento</div>
                    <div className="card-value" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>R$ 14.500</span>
                        <DollarSign size={32} color="#00C851" />
                    </div>
                    <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--success)' }}>Meta 20k (+72%)</div>
                </div>

                <div className="card">
                    <div className="card-title">Reuniões (Hoje)</div>
                    <div className="card-value" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>4</span>
                        <Calendar size={32} color="var(--text-muted)" />
                    </div>
                    <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--warning)' }}>2 Agendamentos</div>
                </div>

                <div className="card">
                    <div className="card-title">NPS Médio</div>
                    <div className="card-value" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>8.9</span>
                        <AlertTriangle size={32} color="var(--accent-color)" />
                    </div>
                    <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mês passado: 9.1</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem' }}>Reuniões de Hoje</h3>
                        <span className="badge" style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}>4 reuniões</span>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                        {[
                            { id: 1, time: '10:00', client: 'AlphaTech Solutions', type: 'Proposta' },
                            { id: 2, time: '14:30', client: 'Construtora Silva', type: 'Alinhamento' },
                            { id: 3, time: '16:00', client: 'Loja Nova', type: 'Diagnóstico (Lead)' }
                        ].map(meet => (
                            <div key={meet.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid var(--bg-primary)' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{meet.time} - {meet.client}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{meet.type}</div>
                                </div>
                                <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Link</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            Clientes em Risco <AlertTriangle size={16} color="var(--danger)" />
                        </h3>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                        {[
                            { id: 2, name: 'Imobiliária Prime', reason: 'NPS Baixo (5)', lastMeet: 'Há 25 dias' },
                            { id: 5, name: 'Eco Produtos', reason: 'Sem Reunião', lastMeet: 'Há 32 dias' }
                        ].map(client => (
                            <div key={client.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid var(--bg-primary)' }}>
                                <div>
                                    <Link to={`/clientes/${client.id}`} style={{ fontWeight: 600, color: 'var(--text-main)' }}>{client.name}</Link>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: 4 }}>{client.reason}</div>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{client.lastMeet}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
