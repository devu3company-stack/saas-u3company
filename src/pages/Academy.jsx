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
                        <option>AlphaTech Solutions</option>
                        <option>Imobiliária Prime</option>
                        <option>Construtora Silva</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 24 }}>
                <div>
                    <div className="card" style={{ marginBottom: 24 }}>
                        <h3 style={{ marginBottom: 16 }}>Comece por aqui (Onboarding obrigatório)</h3>
                        <div style={{ width: '100%', backgroundColor: 'var(--bg-tertiary)', borderRadius: 8, overflow: 'hidden', height: 16, marginBottom: 8 }}>
                            <div style={{ width: '33%', height: '100%', backgroundColor: 'var(--accent-color)' }}></div>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Progresso: 33% (1 de 3 concluídos)</p>
                    </div>

                    <div className="card" style={{ marginBottom: 24, padding: 0 }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '1.2rem' }}>Trilha 1 — Onboarding (obrigatória)</h3>
                        </div>
                        <div style={{ padding: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 8px', borderBottom: '1px solid var(--border-color)' }}>
                                <input type="checkbox" checked readOnly style={{ width: 18, height: 18, accentColor: 'var(--accent-color)' }} />
                                <div>
                                    <h4 style={{ margin: 0 }}>Bem-vindo à U3</h4>
                                    <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Como funciona + canais oficiais.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 8px', borderBottom: '1px solid var(--border-color)' }}>
                                <input type="checkbox" readOnly style={{ width: 18, height: 18, accentColor: 'var(--accent-color)' }} />
                                <div>
                                    <h4 style={{ margin: 0 }}>Checklist de acessos</h4>
                                    <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Meta, Google, Site, etc.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 8px' }}>
                                <input type="checkbox" readOnly style={{ width: 18, height: 18, accentColor: 'var(--accent-color)' }} />
                                <div>
                                    <h4 style={{ margin: 0 }}>Envio de briefing</h4>
                                    <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Formulário interno para campanhas.</p>
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
