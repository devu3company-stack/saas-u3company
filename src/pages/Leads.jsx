import { useState } from 'react';
import { Target, MessageCircle, Calendar } from 'lucide-react';

const Leads = () => {
    const [pipeline, setPipeline] = useState([
        { id: 1, name: 'Marcos Silva', origem: 'Meta Ads', campanha: 'Black Friday', status: 'Novo' },
        { id: 2, name: 'Juliana Costa', origem: 'Google Search', campanha: 'Lead Gen', status: 'Diagnóstico' },
        { id: 3, name: 'Roberto Santos', origem: 'Site Orgânico', campanha: '-', status: 'Contato' }
    ]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Pipeline de Leads</h2>
                    <p className="text-muted">Entrada automática do tráfego</p>
                </div>
                <button className="btn btn-primary">Copiar Webhook URL</button>
            </div>

            <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 16 }}>
                {['Novo', 'Contato', 'Diagnóstico', 'Proposta', 'Fechado'].map(stage => (
                    <div key={stage} style={{ minWidth: 280, backgroundColor: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--border-color)' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                            {stage}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {pipeline.filter(l => l.status === stage).map(lead => (
                                <div key={lead.id} className="card" style={{ padding: 16, cursor: 'grab' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>{lead.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>{lead.origem} | {lead.campanha}</div>

                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid var(--bg-primary)', paddingTop: 12 }}>
                                        <button className="btn btn-outline" title="WhatsApp" style={{ padding: 6, borderRadius: '50%' }}>
                                            <MessageCircle size={14} />
                                        </button>
                                        <button className="btn btn-outline" title="Agendar Reunião" style={{ padding: 6, borderRadius: '50%' }}>
                                            <Calendar size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {pipeline.filter(l => l.status === stage).length === 0 && (
                                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--border-color)', fontSize: '0.8rem' }}>Sem leads</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leads;
