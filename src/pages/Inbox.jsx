import { useState } from 'react';
import { Send, Bot, User, Paperclip, Phone, MoreVertical, Search, Clock, Tag, ChevronDown, Loader, CheckCircle, Calendar, UserPlus } from 'lucide-react';
import { generateAISuggestion } from '../utils/ai';

const Inbox = () => {
    const [selectedConvo, setSelectedConvo] = useState(0);
    const [msgInput, setMsgInput] = useState('');
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [showMeetModal, setShowMeetModal] = useState(false);

    const [conversations, setConversations] = useState([
        {
            id: 1, contactName: 'Marcos Lima', phone: '+55 11 98765-4321',
            department: 'Comercial', status: 'em atendimento', unread: 0,
            lastMsg: 'Boa tarde! Tenho interesse no serviço de tráfego pago.', lastTime: '14:32',
            tags: ['Lead Quente', 'Meta Ads'],
            messages: [
                { dir: 'in', text: 'Oi, boa tarde!', time: '14:30' },
                { dir: 'out', text: 'Olá! 👋 Pra te atender mais rápido, escolha uma opção:\n\n1. Administrativo\n2. Comercial\n3. Pós-vendas', time: '14:30', auto: true },
                { dir: 'in', text: '2', time: '14:31' },
                { dir: 'out', text: 'Olá! Você chegou no Comercial. Vamos entender sua necessidade! Qual sua cidade?', time: '14:31', auto: true },
                { dir: 'in', text: 'Campinas - SP', time: '14:31' },
                { dir: 'out', text: 'Ótimo! Qual serviço te interessa?', time: '14:31', auto: true },
                { dir: 'in', text: 'Boa tarde! Tenho interesse no serviço de tráfego pago.', time: '14:32' },
            ]
        },
        {
            id: 2, contactName: 'Ana Paula', phone: '+55 19 91234-5678',
            department: 'Administrativo', status: 'novo', unread: 2,
            lastMsg: 'Preciso da segunda via do boleto', lastTime: '13:15',
            tags: ['Cliente Ativo'],
            messages: [
                { dir: 'in', text: 'Olá, preciso da segunda via do boleto deste mês', time: '13:14' },
                { dir: 'in', text: 'Preciso da segunda via do boleto', time: '13:15' },
            ]
        },
        {
            id: 3, contactName: 'Roberto Souza', phone: '+55 11 97777-8888',
            department: 'Pós-vendas', status: 'aguardando', unread: 0,
            lastMsg: 'Ok, fico no aguardo do relatório.', lastTime: 'Ontem',
            tags: ['Follow-up'],
            messages: [
                { dir: 'in', text: 'Bom dia, gostaria de ver o relatório mensal', time: '09:00' },
                { dir: 'out', text: 'Bom dia Roberto! Estamos finalizando o relatório e enviaremos até amanhã.', time: '09:15' },
                { dir: 'in', text: 'Ok, fico no aguardo do relatório.', time: '09:16' },
            ]
        }
    ]);

    const convo = conversations[selectedConvo];

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const now = () => {
        const d = new Date();
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    const handleSend = () => {
        if (!msgInput.trim()) return;
        const updated = [...conversations];
        updated[selectedConvo] = {
            ...updated[selectedConvo],
            messages: [...updated[selectedConvo].messages, { dir: 'out', text: msgInput, time: now() }],
            lastMsg: msgInput,
            lastTime: now()
        };
        setConversations(updated);
        setMsgInput('');
        setAiSuggestion(null);
    };

    const handleAiSuggest = async () => {
        setAiLoading(true);
        setAiSuggestion(null);
        const result = await generateAISuggestion(convo.messages, convo.department);
        setAiSuggestion(result.text);
        setAiLoading(false);
    };

    const handleConvertClient = () => {
        const updated = [...conversations];
        updated[selectedConvo] = {
            ...updated[selectedConvo],
            status: 'fechado',
            tags: [...updated[selectedConvo].tags, 'Convertido ✅']
        };
        setConversations(updated);
        showToast(`✅ ${convo.contactName} convertido em cliente com sucesso!`);
    };

    const handleCreateTask = () => {
        showToast(`📋 Tarefa criada para "${convo.contactName}" — acompanhe em Clientes 360°`);
    };

    const handleScheduleMeeting = (e) => {
        e.preventDefault();
        setShowMeetModal(false);

        // Gera link Google Calendar
        const form = e.target;
        const title = form.meetTitle.value;
        const date = form.meetDate.value.replace(/-/g, '');
        const timeS = form.meetTimeStart.value.replace(':', '') + '00';
        const timeE = form.meetTimeEnd.value.replace(':', '') + '00';

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: `${title} - ${convo.contactName}`,
            details: `Reunião com ${convo.contactName} (${convo.phone})`,
            location: 'Google Meet',
            dates: `${date}T${timeS}/${date}T${timeE}`,
            add: 'contato@u3company.com',
        });
        window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
        showToast(`📅 Reunião "${title}" agendada para ${convo.contactName}!`);
    };

    const statusColors = {
        'novo': 'var(--accent-color)',
        'em atendimento': 'var(--success)',
        'aguardando': 'var(--warning)',
        'fechado': 'var(--text-muted)'
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 320px', gap: 0, height: 'calc(100vh - 134px)', margin: '-32px', marginTop: '-32px', position: 'relative' }}>

            {/* Toast notification */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 2000,
                    padding: '14px 24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--accent-color)',
                    borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeIn 0.3s ease'
                }}>
                    <CheckCircle size={18} color="var(--success)" /> {toast}
                </div>
            )}

            {/* Lista de conversas */}
            <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-secondary)' }}>
                <div style={{ padding: 16, borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'var(--bg-tertiary)', borderRadius: 8, padding: '8px 12px' }}>
                        <Search size={16} color="var(--text-muted)" />
                        <input type="text" placeholder="Buscar conversa..." style={{ border: 'none', background: 'none', color: 'var(--text-main)', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
                    </div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.map((c, i) => (
                        <div key={c.id} onClick={() => setSelectedConvo(i)}
                            style={{
                                padding: '16px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)',
                                backgroundColor: selectedConvo === i ? 'var(--bg-tertiary)' : 'transparent',
                                borderLeft: selectedConvo === i ? '3px solid var(--accent-color)' : '3px solid transparent'
                            }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{c.contactName}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.lastTime}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 6 }}>
                                {c.lastMsg}
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 10, backgroundColor: statusColors[c.status], color: c.status === 'novo' ? 'black' : 'white' }}>
                                    {c.status}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.department}</span>
                                {c.unread > 0 && (
                                    <span style={{ marginLeft: 'auto', backgroundColor: 'var(--accent-color)', color: 'black', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                                        {c.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat */}
            <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
                {/* Chat header */}
                <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>{convo.contactName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{convo.phone} · {convo.department}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-outline" style={{ padding: 8, borderRadius: '50%' }}><Phone size={16} /></button>
                        <button className="btn btn-outline" style={{ padding: 8, borderRadius: '50%' }}><MoreVertical size={16} /></button>
                    </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {convo.messages.map((msg, i) => (
                        <div key={i} style={{
                            alignSelf: msg.dir === 'out' ? 'flex-end' : 'flex-start', maxWidth: '70%'
                        }}>
                            <div style={{
                                padding: '10px 14px', borderRadius: msg.dir === 'out' ? '12px 0 12px 12px' : '0 12px 12px 12px',
                                backgroundColor: msg.dir === 'out' ? '#075e54' : 'var(--bg-tertiary)',
                                color: 'var(--text-main)', fontSize: '0.9rem', whiteSpace: 'pre-line'
                            }}>
                                {msg.auto && <span style={{ fontSize: '0.7rem', color: 'var(--accent-color)', display: 'block', marginBottom: 4 }}>🤖 Automático</span>}
                                {msg.text}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2, textAlign: msg.dir === 'out' ? 'right' : 'left' }}>
                                {msg.time}
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI Suggestion */}
                {aiSuggestion && (
                    <div style={{ padding: '12px 20px', backgroundColor: 'rgba(255,246,0,0.08)', borderTop: '1px solid rgba(255,246,0,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <Bot size={16} color="var(--accent-color)" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-color)' }}>Sugestão da IA</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: 8 }}>{aiSuggestion}</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => { setMsgInput(aiSuggestion); setAiSuggestion(null); }}>
                                Usar Resposta
                            </button>
                            <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setAiSuggestion(null)}>
                                Descartar
                            </button>
                        </div>
                    </div>
                )}

                {/* Input */}
                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button style={{ padding: 8, color: 'var(--text-muted)' }}><Paperclip size={20} /></button>
                    <input
                        type="text" className="form-control" placeholder="Digite sua mensagem..."
                        value={msgInput} onChange={e => setMsgInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                        style={{ flex: 1 }}
                    />
                    <button className="btn btn-outline" onClick={handleAiSuggest} disabled={aiLoading} style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6, opacity: aiLoading ? 0.6 : 1 }}>
                        {aiLoading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Bot size={16} />} {aiLoading ? 'Pensando...' : 'IA'}
                    </button>
                    <button className="btn btn-primary" onClick={handleSend} style={{ padding: 10, borderRadius: '50%' }}>
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {/* Painel CRM lateral */}
            <div style={{ borderLeft: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', overflowY: 'auto', padding: 20 }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, margin: '0 auto 12px' }}>
                        {convo.contactName[0]}
                    </div>
                    <h3 style={{ marginBottom: 4 }}>{convo.contactName}</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>{convo.phone}</p>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label className="form-label">Etapa Pipeline</label>
                    <select className="form-control" defaultValue="Diagnóstico">
                        <option>Novo</option>
                        <option>Contato</option>
                        <option>Diagnóstico</option>
                        <option>Proposta</option>
                        <option>Fechado</option>
                    </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label className="form-label">Departamento</label>
                    <select className="form-control" defaultValue={convo.department}>
                        <option>Administrativo</option>
                        <option>Comercial</option>
                        <option>Pós-vendas</option>
                    </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label className="form-label">Atribuído a</label>
                    <select className="form-control">
                        <option>Admin Principal</option>
                        <option>Gestor de Tráfego 1</option>
                    </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Tag size={14} /> Tags</label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {convo.tags.map((t, i) => (
                            <span key={i} style={{ padding: '4px 10px', borderRadius: 12, backgroundColor: 'var(--bg-tertiary)', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}>
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Bot size={14} /> Campos extraídos pela IA
                    </label>
                    <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                            <span className="text-muted">Cidade</span><span>Campinas - SP</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                            <span className="text-muted">Interesse</span><span>Tráfego Pago</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                            <span className="text-muted">Intenção</span><span style={{ color: 'var(--success)' }}>Compra</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button className="btn btn-outline" onClick={handleCreateTask} style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>📋 Criar Tarefa</button>
                    <button className="btn btn-outline" onClick={() => setShowMeetModal(true)} style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>📅 Agendar Reunião</button>
                    <button className="btn btn-primary" onClick={handleConvertClient} style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                        <UserPlus size={16} /> Converter em Cliente
                    </button>
                </div>
            </div>

            {/* Modal Agendar Reunião */}
            {showMeetModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: 480 }}>
                        <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Calendar size={20} color="var(--accent-color)" /> Agendar Reunião com {convo.contactName}
                        </h3>
                        <form onSubmit={handleScheduleMeeting}>
                            <div className="form-group">
                                <label className="form-label">Título</label>
                                <input name="meetTitle" type="text" className="form-control" required defaultValue={`Alinhamento — ${convo.contactName}`} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Data</label>
                                    <input name="meetDate" type="date" className="form-control" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Início</label>
                                    <input name="meetTimeStart" type="time" className="form-control" required defaultValue="10:00" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Fim</label>
                                    <input name="meetTimeEnd" type="time" className="form-control" required defaultValue="11:00" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowMeetModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Calendar size={16} /> Salvar no Google Agenda
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inbox;
