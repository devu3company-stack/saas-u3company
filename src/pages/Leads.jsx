import { useState, useEffect } from 'react';
import { Target, MessageCircle, Calendar, Plus, Link as LinkIcon, AlertTriangle } from 'lucide-react';

const Leads = () => {
    const [pipeline, setPipeline] = useState(() => {
        const saved = localStorage.getItem('u3_leads');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, name: 'Marcos Silva', origem: 'Meta Ads', campanha: 'Black Friday', status: 'Novo', updatedAt: Date.now() - (3 * 24 * 60 * 60 * 1000) }, // 3 dias atras
            { id: 2, name: 'Juliana Costa', origem: 'Google Search', campanha: 'Lead Gen', status: 'Diagnóstico', updatedAt: Date.now() - (1000 * 60 * 60) }, // 1 hora atras
            { id: 3, name: 'Roberto Santos', origem: 'Site Orgânico', campanha: '-', status: 'Contato', updatedAt: Date.now() - (36 * 60 * 60 * 1000) } // 36 horas atras
        ];
    });

    const [showWebhook, setShowWebhook] = useState(false);

    useEffect(() => {
        localStorage.setItem('u3_leads', JSON.stringify(pipeline));
    }, [pipeline]);

    const handleDragStart = (e, leadId) => {
        e.dataTransfer.setData('leadId', leadId);
    };

    const handleDrop = (e, targetStatus) => {
        e.preventDefault();
        const leadId = parseInt(e.dataTransfer.getData('leadId'));
        if (leadId) {
            setPipeline(pipeline.map(l =>
                l.id === leadId ? { ...l, status: targetStatus, updatedAt: Date.now() } : l
            ));
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const stages = ['Novo', 'Contato', 'Diagnóstico', 'Proposta', 'Fechado'];

    // Calculo de Alerta de tempo (vermelho) - Ex: maior q 48 horas parado na mesma coluna (pro mock, usamos 24h pra aparecer)
    const isStale = (updatedAt) => {
        const hoursPassed = (Date.now() - updatedAt) / (1000 * 60 * 60);
        return hoursPassed > 24;
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Target color="var(--accent-color)" /> Pipeline de Vendas (CRM)</h2>
                    <p className="text-muted">Deslize os cards. Leads parados há mais de 24h ficam vermelhos.</p>
                </div>
                <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
                    <button className="btn btn-outline" onClick={() => setShowWebhook(true)} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <LinkIcon size={16} /> Integração (Meta/Webhook)
                    </button>
                    <button className="btn btn-primary" onClick={() => {
                        const nome = prompt("Nome do novo Lead Manual:");
                        if (nome) {
                            setPipeline([...pipeline, { id: Date.now(), name: nome, origem: 'Manual', campanha: '-', status: 'Novo', updatedAt: Date.now() }]);
                        }
                    }} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Plus size={16} /> Lead Manual
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 16, minHeight: 'calc(100vh - 200px)', alignItems: 'flex-start' }}>
                {stages.map(stage => {
                    const leadsInStage = pipeline.filter(l => l.status === stage);

                    return (
                        <div
                            key={stage}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, stage)}
                            style={{
                                minWidth: 280, backgroundColor: 'var(--bg-tertiary)', borderRadius: 12, padding: 16,
                                border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 16
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                                    {stage}
                                </span>
                                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>
                                    {leadsInStage.length}
                                </span>
                            </div>

                            {leadsInStage.map(lead => {
                                const stale = isStale(lead.updatedAt) && stage !== 'Fechado';
                                return (
                                    <div
                                        key={lead.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, lead.id)}
                                        className="card"
                                        style={{
                                            padding: 16, cursor: 'grab',
                                            border: stale ? '1px solid var(--danger)' : '1px solid var(--border-color)',
                                            backgroundColor: stale ? '#ff333310' : 'var(--bg-secondary)',
                                            boxShadow: stale ? '0 4px 12px rgba(255,50,50,0.15)' : 'none'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{lead.name}</div>
                                            {stale && <AlertTriangle size={16} color="var(--danger)" title="Parado há muito tempo!" />}
                                        </div>

                                        <div style={{ fontSize: '0.75rem', color: stale ? 'var(--danger)' : 'var(--text-muted)', marginBottom: 12 }}>
                                            {lead.origem} {lead.campanha !== '-' && ` | ${lead.campanha}`}
                                        </div>

                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                Atualizado: {new Date(lead.updatedAt).toLocaleDateString()}
                                            </span>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="btn btn-outline" title="Chamar WhatsApp" onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/5511999999999?text=Olá ${encodeURIComponent(lead.name)}, tudo bem? Gostaria de falar sobre o projeto!`, '_blank'); }} style={{ padding: 6, borderRadius: '50%' }}>
                                                    <MessageCircle size={14} color="var(--success)" />
                                                </button>
                                                <button className="btn btn-outline" title="Agendar Reunião" onClick={(e) => { e.stopPropagation(); window.location.href = '/reunioes'; }} style={{ padding: 6, borderRadius: '50%' }}>
                                                    <Calendar size={14} color="var(--accent-color)" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            {leadsInStage.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '24px 0', border: '1px dashed var(--border-color)', borderRadius: 8, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Solte leads aqui</div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Modal de Webhook (Meta Forms Integration) */}
            {showWebhook && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: 600, maxWidth: '90vw' }}>
                        <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <LinkIcon color="var(--accent-color)" /> Integrações (Webhook URL)
                        </h3>
                        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: 24, lineHeight: 1.5 }}>
                            Para que os leads do Meta Ads (Facebook/Insta Formulários), Typeform ou Landing Pages caiam direto neste quadro Kanban, configure seus apps para dispararem os dados (POST) na sua URL abaixo:
                        </p>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 600 }}>Webhook Exclusivo desta Licença</label>
                            <div style={{ display: 'flex' }}>
                                <input readOnly type="text" className="form-control" value="https://api.u3company.com/webhook/receive/t_k98dfj23_lead" style={{ borderRadius: '6px 0 0 6px', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--accent-color)' }} />
                                <button className="btn btn-primary" style={{ borderRadius: '0 6px 6px 0' }} onClick={(e) => {
                                    navigator.clipboard.writeText("https://api.u3company.com/webhook/receive/t_k98dfj23_lead");
                                    e.target.innerText = "Copiado!";
                                    setTimeout(() => e.target.innerText = "Copiar", 2000);
                                }}>Copiar</button>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'black', padding: 16, borderRadius: 8, marginTop: 24, fontFamily: 'monospace', fontSize: '0.8rem', color: '#00D084', overflowX: 'auto' }}>
                            // Exemplo de carga JSON esperada:<br />
                            {`{
  "name": "João da Silva",
  "phone": "5511999990000",
  "source": "Meta Ads",
  "campaign": "C1 - Lookalike"
}`}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                            <button className="btn btn-outline" onClick={() => setShowWebhook(false)}>Fechar e Voltar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leads;
