import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Calendar, Lock, CheckSquare, Smile, Shield } from 'lucide-react';

const ClientDetail = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('resumo');

    // Dados Mockados para o Demo
    const client = {
        name: 'AlphaTech Solutions',
        status: 'ativo',
        start: '10/01/2026',
        mrr: 'R$ 2.500',
        nps: 9.5
    };

    return (
        <div>
            <div className="page-header" style={{ marginBottom: 16 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{client.name}</h2>
                        <span className={`badge ${client.status}`}>{client.status.toUpperCase()}</span>
                    </div>
                    <p className="text-muted">Visão de Cliente 360°</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-outline">Editar Ficha</button>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Calendar size={16} /> Agendar
                    </button>
                </div>
            </div>

            <div className="tabs">
                {[
                    { id: 'resumo', label: 'Resumo Geral' },
                    { id: 'reunioes', label: 'Reuniões' },
                    { id: 'contratos', label: 'Contratos / Docs' },
                    { id: 'cofre', label: 'Cofre & Links' },
                    { id: 'tarefas', label: 'Tarefas' },
                    { id: 'nps', label: 'NPS' }
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

            <div className="tab-content">
                {activeTab === 'resumo' && (
                    <div className="grid-cards">
                        <div className="card">
                            <div className="card-title">Início Contrato</div>
                            <div className="card-value" style={{ fontSize: '1.5rem' }}>{client.start}</div>
                        </div>
                        <div className="card">
                            <div className="card-title">Mensalidade (MRR)</div>
                            <div className="card-value" style={{ fontSize: '1.5rem' }}>{client.mrr}</div>
                        </div>
                        <div className="card">
                            <div className="card-title">Satisfação Média</div>
                            <div className="card-value" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>{client.nps} / 10</div>
                        </div>
                    </div>
                )}

                {activeTab === 'reunioes' && (
                    <div className="card">
                        <h3 style={{ marginBottom: 16 }}>Histórico e Próximas Reuniões</h3>
                        <table style={{ width: '100%' }}>
                            <thead><tr><th>Data</th><th>Título</th><th>Status</th><th>Link</th></tr></thead>
                            <tbody>
                                <tr><td>22/02/2026</td><td>Alinhamento Mensal</td><td><span className="badge ativo" style={{ background: 'transparent', border: '1px solid var(--accent-color)' }}>Agendada</span></td><td>Meet</td></tr>
                                <tr><td>10/01/2026</td><td>Onboarding</td><td><span className="badge" style={{ backgroundColor: 'var(--success)', color: 'white' }}>Realizada</span></td><td>-</td></tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'contratos' && (
                    <div className="card">
                        <h3 style={{ marginBottom: 16 }}>Documentos Anexados</h3>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ padding: 16, border: '1px solid var(--border-color)', borderRadius: 8, textAlign: 'center', width: 140 }}>
                                <FileText size={40} color="var(--text-muted)" style={{ marginBottom: 8 }} />
                                <div style={{ fontSize: '0.8rem' }}>Contrato_Assinado.pdf</div>
                            </div>
                            <div style={{ padding: 16, border: '1px dashed var(--border-color)', borderRadius: 8, textAlign: 'center', width: 140, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                + Upload
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'cofre' && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <h3>Cofre do Cliente (Protegido)</h3>
                            <button className="btn btn-outline" style={{ fontSize: '0.8rem' }}><Lock size={14} /> Novo Acesso</button>
                        </div>
                        <table style={{ width: '100%' }}>
                            <thead><tr><th>Plataforma</th><th>Usuário</th><th>Senha</th><th>Ações</th></tr></thead>
                            <tbody>
                                <tr><td>Meta Ads</td><td>admin@cliente.com</td><td>••••••••••</td><td><button className="btn btn-outline" style={{ padding: '4px 8px' }}>Revelar</button></td></tr>
                                <tr><td>Google Ads</td><td>marketing@cliente.com</td><td>••••••••••</td><td><button className="btn btn-outline" style={{ padding: '4px 8px' }}>Revelar</button></td></tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'tarefas' && (
                    <div className="card">
                        <h3 style={{ marginBottom: 16 }}>Pendências e Tarefas</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ padding: 12, backgroundColor: 'var(--bg-tertiary)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <CheckSquare size={20} color="var(--text-muted)" />
                                    <span>Cobrar relatório de mídia</span>
                                </div>
                                <span className="badge cancelado">Vencido</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'nps' && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                            <h3>Respostas de NPS</h3>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>9.5</div>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>Nota: 10</strong>
                                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>01/02/2026</span>
                                </div>
                                <p className="text-muted" style={{ marginTop: 8, fontStyle: 'italic' }}>"Excelente atendimento e resultados consistentes!"</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ClientDetail;
