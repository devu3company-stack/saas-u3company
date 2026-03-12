import { useState, useEffect } from 'react';
import { Target, MessageCircle, Calendar, Plus, Link as LinkIcon, AlertTriangle, MessageSquare, Edit } from 'lucide-react';
import { useAuth } from '../utils/auth';
import { useSyncedData } from '../utils/useSyncedData';

const Leads = () => {
    const [pipeline, saveLeads] = useSyncedData('u3_leads', [], 'shared');

    const [showWebhook, setShowWebhook] = useState(false);
    const [editLead, setEditLead] = useState(null);
    const [currentView, setCurrentView] = useState('pipeline');

    const handleDragStart = (e, leadId) => {
        e.dataTransfer.setData('leadId', leadId);
    };

    const handleDrop = (e, targetStatus) => {
        e.preventDefault();
        const leadId = parseInt(e.dataTransfer.getData('leadId'));
        if (leadId) {
            const newList = pipeline.map(l =>
                l.id === leadId ? { ...l, status: targetStatus, updatedAt: Date.now() } : l
            );
            saveLeads(newList);
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const stagesPipeline = ['Novo', 'Contato', 'Diagnóstico', 'Proposta', 'Fechado'];
    const stagesFollowUp = ['Follow D1', 'Follow D2', 'Follow D3', 'Follow D5', 'Follow D7', 'Follow D10'];
    const stages = currentView === 'pipeline' ? stagesPipeline : stagesFollowUp;

    const handleSaveEdit = (e) => {
        e.preventDefault();
        const newList = pipeline.map(l => l.id === editLead.id ? { ...editLead, updatedAt: Date.now() } : l);
        saveLeads(newList);
        setEditLead(null);
    };

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
                <div style={{ display: 'flex', gap: 12, marginLeft: 'auto', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', backgroundColor: 'var(--bg-tertiary)', padding: 4, borderRadius: 8 }}>
                        <button style={{ background: currentView === 'pipeline' ? 'var(--bg-secondary)' : 'transparent', border: 'none', padding: '6px 12px', borderRadius: 6, color: currentView === 'pipeline' ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setCurrentView('pipeline')}>
                            Pipeline
                        </button>
                        <button style={{ background: currentView === 'followup' ? 'var(--bg-secondary)' : 'transparent', border: 'none', padding: '6px 12px', borderRadius: 6, color: currentView === 'followup' ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setCurrentView('followup')}>
                            Follow-Up
                        </button>
                    </div>

                    <button className="btn btn-outline" onClick={() => setShowWebhook(true)} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <LinkIcon size={16} /> Integração
                    </button>
                    <button className="btn btn-primary" onClick={() => {
                        const nome = prompt("Nome do novo Lead Manual:");
                        if (nome) {
                            const newList = [...pipeline, { id: Date.now(), name: nome, origem: 'Manual', campanha: '-', status: currentView === 'pipeline' ? 'Novo' : 'Follow D1', updatedAt: Date.now(), cardColor: '#ffffff', comentarios: '' }];
                            saveLeads(newList);
                        }
                    }} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Plus size={16} /> Lead Manual
                    </button>
                </div>
            </div>

            <div className="kanban-board-container" style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 16, minHeight: 'calc(100vh - 200px)', alignItems: 'flex-start' }}>
                {stages.map(stage => {
                    const leadsInStage = pipeline.filter(l => l.status === stage);

                    return (
                        <div
                            key={stage}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, stage)}
                            className="kanban-column"
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
                                            borderTop: `6px solid ${lead.cardColor && lead.cardColor !== '#ffffff' && lead.cardColor !== 'transparent' ? lead.cardColor : 'transparent'}`,
                                            border: stale ? '1px solid var(--danger)' : '1px solid var(--border-color)',
                                            backgroundColor: stale ? '#ff333310' : 'var(--bg-secondary)',
                                            boxShadow: stale ? '0 4px 12px rgba(255,50,50,0.15)' : 'none'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{lead.name}</div>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                {stale && <AlertTriangle size={16} color="var(--danger)" title="Parado há muito tempo!" />}
                                                <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} onClick={() => setEditLead(lead)}>
                                                    <Edit size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ fontSize: '0.75rem', color: stale ? 'var(--danger)' : 'var(--text-muted)', marginBottom: 8 }}>
                                            {lead.origem} {lead.campanha !== '-' && ` | ${lead.campanha}`}
                                        </div>

                                        {lead.comentarios && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', backgroundColor: 'var(--bg-main)', padding: 8, borderRadius: 6, marginBottom: 12, border: '1px dashed var(--border-color)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                                                <MessageSquare size={12} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                                                <span>{lead.comentarios.length > 60 ? lead.comentarios.substring(0, 60) + '...' : lead.comentarios}</span>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                Atualizado: {new Date(lead.updatedAt).toLocaleDateString()}
                                            </span>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="btn btn-outline" title="Chamar WhatsApp" onClick={(e) => {
                                                    e.stopPropagation();
                                                    let phoneStr = lead.telefone || (lead.origem === 'Extrator API' ? lead.campanha : '');
                                                    let digits = phoneStr.replace(/\D/g, '');
                                                    if (digits && digits.length >= 10 && !digits.startsWith('55')) {
                                                        digits = '55' + digits;
                                                    }
                                                    const finalNumber = digits || '5511999999999'; // Fallback
                                                    window.open(`https://wa.me/${finalNumber}?text=Olá ${encodeURIComponent(lead.name)}, tudo bem? Gostaria de falar sobre o projeto!`, '_blank');
                                                }} style={{ padding: 6, borderRadius: '50%' }}>
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

            {/* Modal Editar Lead */}
            {editLead && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto' }}>
                    <div className="card" style={{ width: 500, margin: 'auto' }}>
                        <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Editar Lead</span>
                            <button onClick={() => setEditLead(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                        </h3>
                        <form onSubmit={handleSaveEdit}>
                            <div className="form-group">
                                <label className="form-label">Nome</label>
                                <input type="text" className="form-control" required
                                    value={editLead.name || ''} onChange={e => setEditLead({ ...editLead, name: e.target.value })} />
                            </div>

                            <div className="responsive-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Telefone / Whats</label>
                                    <input type="text" className="form-control"
                                        value={editLead.telefone || ''} onChange={e => setEditLead({ ...editLead, telefone: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Cor do Card</label>
                                    <input type="color" className="form-control"
                                        value={editLead.cardColor || '#ffffff'} onChange={e => setEditLead({ ...editLead, cardColor: e.target.value })} style={{ height: 42, padding: 4 }} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Status (Coluna)</label>
                                <select className="form-control" value={editLead.status} onChange={e => setEditLead({ ...editLead, status: e.target.value })}>
                                    <optgroup label="Pipeline">
                                        {stagesPipeline.map(s => <option key={s} value={s}>{s}</option>)}
                                    </optgroup>
                                    <optgroup label="Follow-Up">
                                        {stagesFollowUp.map(s => <option key={s} value={s}>{s}</option>)}
                                    </optgroup>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Comentários / Observações</label>
                                <textarea rows="3" className="form-control" placeholder="Anotações do lead..." style={{ resize: 'vertical' }}
                                    value={editLead.comentarios || ''} onChange={e => setEditLead({ ...editLead, comentarios: e.target.value })}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 32, justifyContent: 'space-between' }}>
                                <button type="button" className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => {
                                    const newList = pipeline.filter(l => l.id !== editLead.id);
                                    saveLeads(newList);
                                    setEditLead(null);
                                }}>Excluir Lead</button>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setEditLead(null)}>Voltar</button>
                                    <button type="submit" className="btn btn-primary">Salvar Alterações</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leads;
