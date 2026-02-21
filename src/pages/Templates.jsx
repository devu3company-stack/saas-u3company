import { useState } from 'react';
import { Plus, FileText, CheckCircle, Clock, AlertTriangle, Copy } from 'lucide-react';

const Templates = () => {
    const [showModal, setShowModal] = useState(false);

    const templates = [
        {
            id: 1, name: 'boas_vindas_lead', category: 'MARKETING', status: 'APPROVED',
            text: 'Olá {{1}}! 👋 Obrigado pelo interesse na U3 Company. Nosso consultor {{2}} vai te atender em breve. Responda essa mensagem para iniciarmos!',
            variables: ['nome_cliente', 'nome_consultor']
        },
        {
            id: 2, name: 'lembrete_reuniao', category: 'UTILITY', status: 'APPROVED',
            text: 'Olá {{1}}, lembrando da nossa reunião agendada para {{2}} às {{3}}. Link de acesso: {{4}}. Confirme respondendo OK!',
            variables: ['nome', 'data', 'horario', 'link_meet']
        },
        {
            id: 3, name: 'follow_up_proposta', category: 'MARKETING', status: 'APPROVED',
            text: 'Oi {{1}}! Tudo bem? Passando pra saber se teve chance de avaliar a proposta que enviamos. Caso tenha dúvidas, estou à disposição! 😊',
            variables: ['nome']
        },
        {
            id: 4, name: 'pesquisa_nps', category: 'UTILITY', status: 'PENDING',
            text: 'Olá {{1}}! De 0 a 10, o quanto você recomendaria a U3 Company? Sua opinião é muito importante pra gente! 🙏',
            variables: ['nome']
        },
        {
            id: 5, name: 'segunda_via_boleto', category: 'UTILITY', status: 'APPROVED',
            text: 'Olá {{1}}! Segue a segunda via do seu boleto referente a {{2}}. Link: {{3}}. Qualquer dúvida, estamos aqui! ✅',
            variables: ['nome', 'referencia', 'link_boleto']
        },
    ];

    const statusConfig = {
        'APPROVED': { color: 'var(--success)', icon: <CheckCircle size={14} />, label: 'Aprovado' },
        'PENDING': { color: 'var(--warning)', icon: <Clock size={14} />, label: 'Aguardando' },
        'REJECTED': { color: 'var(--danger)', icon: <AlertTriangle size={14} />, label: 'Rejeitado' },
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Templates WhatsApp</h2>
                    <p className="text-muted">Mensagens aprovadas para envio fora da janela de 24h</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={16} /> Novo Template
                </button>
            </div>

            <div style={{ padding: '16px 24px', backgroundColor: 'rgba(255,246,0,0.06)', border: '1px solid rgba(255,246,0,0.15)', borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <AlertTriangle size={20} color="var(--accent-color)" />
                <div style={{ fontSize: '0.85rem' }}>
                    <strong>Regra WhatsApp (24h):</strong> Fora da janela de 24h, apenas templates aprovados pelo Meta podem ser enviados.
                    Mensagens livres só funcionam dentro da janela (após o cliente responder).
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {templates.map(t => {
                    const st = statusConfig[t.status];
                    return (
                        <div key={t.id} className="card" style={{ padding: 0 }}>
                            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <FileText size={20} color="var(--accent-color)" />
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{t.name}</div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.category}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: st.color, fontSize: '0.8rem', fontWeight: 600 }}>
                                        {st.icon} {st.label}
                                    </span>
                                    <button className="btn btn-outline" style={{ padding: '6px 10px' }}><Copy size={14} /></button>
                                </div>
                            </div>
                            <div style={{ padding: '16px 24px' }}>
                                <div style={{ padding: 16, backgroundColor: 'var(--bg-tertiary)', borderRadius: 8, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 12 }}>
                                    {t.text}
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {t.variables.map((v, vi) => (
                                        <span key={vi} style={{ padding: '4px 10px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: '0.75rem', color: 'var(--accent-color)' }}>
                                            {`{{${vi + 1}}}`} = {v}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal Novo Template */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: 550 }}>
                        <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>Criar Template</h3>
                        <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                            <div className="form-group">
                                <label className="form-label">Nome do Template (sem espaços)</label>
                                <input type="text" className="form-control" required placeholder="ex: follow_up_comercial" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Categoria</label>
                                <select className="form-control">
                                    <option>UTILITY</option>
                                    <option>MARKETING</option>
                                    <option>AUTHENTICATION</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Texto do Template</label>
                                <textarea className="form-control" rows="4" required placeholder="Use {{1}}, {{2}} para variáveis dinâmicas..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Variáveis (separadas por vírgula)</label>
                                <input type="text" className="form-control" placeholder="nome, empresa, data" />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                                Após criação, o template será enviado ao Meta para aprovação. Isso pode levar de minutos até 24h.
                            </p>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Enviar para Aprovação</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Templates;
