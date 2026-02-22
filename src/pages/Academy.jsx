import { useState } from 'react';
import { Target, MessageCircle, Calendar } from 'lucide-react';

const Academy = () => {
    const [selectedClient, setSelectedClient] = useState('AlphaTech Solutions');

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2>Academy / Onboarding U3</h2>
                    <p className="text-muted">Área de Treinamento e Passo a Passo (Portal do Cliente)</p>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginLeft: 'auto' }}>
                    <select
                        className="form-control"
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        style={{ minWidth: 200 }}
                    >
                        {JSON.parse(localStorage.getItem('u3_clients') || '[]').map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                        {JSON.parse(localStorage.getItem('u3_clients') || '[]').length === 0 && (
                            <>
                                <option>AlphaTech Solutions</option>
                                <option>Imobiliária Prime</option>
                                <option>Construtora Silva</option>
                            </>
                        )}
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 24 }}>
                <div>
                    {/* LTV e Resumo Estratégico */}
                    <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24, gap: 16 }}>
                        <div className="card" style={{ padding: 16 }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mês Atual de Contrato</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-color)' }}>Mês 1 / 6</div>
                        </div>
                        <div className="card" style={{ padding: 16 }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>LTV (Valor no Tempo)</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>R$ 15.000</div>
                        </div>
                        <div className="card" style={{ padding: 16 }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status do Projeto</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--success)' }}>On Track</div>
                        </div>
                    </div>

                    <div className="card" style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ margin: 0 }}>Comece por aqui (Onboarding obrigatório)</h3>
                            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Salvar Progresso</button>
                        </div>

                        <div style={{ width: '100%', backgroundColor: 'var(--bg-tertiary)', borderRadius: 8, overflow: 'hidden', height: 16, marginBottom: 8 }}>
                            <div style={{ width: '33%', height: '100%', backgroundColor: 'var(--accent-color)' }}></div>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Progresso: 33% (1 de 3 concluídos)</p>
                    </div>

                    {/* Timeline de Entregas por Mês */}
                    <div className="card" style={{ marginBottom: 24, padding: 0 }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Roadmap de Entregas (Mês a Mês)</h3>
                            <span className="badge" style={{ backgroundColor: 'var(--warning)', color: 'black' }}>Estratégia de Retenção</span>
                        </div>
                        <div style={{ padding: 24 }}>
                            {/* Mês 1 */}
                            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                                    <div style={{ width: 2, height: 40, backgroundColor: 'var(--accent-color)', marginTop: 8 }}></div>
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 4px', color: 'var(--accent-color)' }}>Mês 1: Setup & Kickoff</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configuração de BM, criação de anúncios iniciais e landing page de alta conversão.</p>
                                </div>
                            </div>

                            {/* Mês 2 */}
                            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'transparent', border: '2px solid var(--border-color)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                                    <div style={{ width: 2, height: 40, backgroundColor: 'var(--border-color)', marginTop: 8 }}></div>
                                </div>
                                <div style={{ opacity: 0.6 }}>
                                    <h4 style={{ margin: '0 0 4px', color: 'var(--text-main)' }}>Mês 2: Escala & Otimização</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Implementação de regras automáticas, teste A/B contínuo de criativos.</p>
                                </div>
                            </div>

                            {/* Mês 3 */}
                            <div style={{ display: 'flex', gap: 16 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'transparent', border: '2px solid var(--border-color)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                                </div>
                                <div style={{ opacity: 0.6 }}>
                                    <h4 style={{ margin: '0 0 4px', color: 'var(--text-main)' }}>Mês 3: Consolidação CRM</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Liberação de portal próprio avançado, funis e remarketing omni-channel.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="card">
                        <h3 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Sua Jornada</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <li style={{ color: 'var(--accent-color)', fontWeight: 600 }}>1. Onboarding</li>
                            <li style={{ color: 'var(--text-muted)' }}>2. Aprovação</li>
                            <li style={{ color: 'var(--text-muted)' }}>3. Resultados</li>
                            <li style={{ color: 'var(--text-muted)' }}>4. Suporte</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Academy;
