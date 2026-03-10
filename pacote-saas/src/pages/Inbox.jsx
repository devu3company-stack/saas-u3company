import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Send, Bot, User, Paperclip, Phone, MoreVertical, Search, Clock, Tag, ChevronDown, Loader, CheckCircle, Calendar, UserPlus } from 'lucide-react';
import { generateAISuggestion } from '../utils/ai';
import { useAuth } from '../utils/auth';

const Inbox = () => {
    const { getData, setData } = useAuth();
    const [selectedConvoId, setSelectedConvoId] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewContactModal, setShowNewContactModal] = useState(false);
    const [msgInput, setMsgInput] = useState('');
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [showMeetModal, setShowMeetModal] = useState(false);

    // Conexão do Bridge via Socket Local (porta 3001 que escuta o ZapPro Original nas Nuvens)
    useEffect(() => {
        const socket = io('http://localhost:3001');

        socket.on('connect', () => {
            console.log('🟢 React CRM conectado ao Bridge (Porta 3001) com Sucesso!');
        });

        socket.on('zappro-message', (data) => {
            console.log("📨 Mensagem Chegou no Front:", data);

            // Lógica de espelhamento que injeta a msg direto no meio do chat!
            if (data.action === 'create' && data.message) {
                const incomingNumber = data.ticket?.contact?.number;
                const newText = data.message.body;
                const isFromMe = data.message.fromMe;

                // Formato do relógio: "14:30"
                const msgTime = new Date(data.message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                setConversations(prev => {
                    const idx = prev.findIndex(c => c.phone.replace(/\D/g, '') === incomingNumber);
                    if (idx === -1) {
                        // Se o contato for novo e enviou msg pra gente agora (não estava na lista lateral)
                        const newContact = {
                            id: Date.now(),
                            contactName: data.ticket?.contact?.name || incomingNumber,
                            phone: incomingNumber,
                            department: 'Triagem',
                            status: 'novo',
                            unread: isFromMe ? 0 : 1,
                            lastMsg: newText,
                            lastTime: msgTime,
                            tags: [],
                            messages: [{ dir: isFromMe ? 'out' : 'in', text: newText, time: msgTime }]
                        };
                        showToast(`💬 Nova msg de ${newContact.contactName}!`);
                        return [newContact, ...prev];
                    }

                    // Se a conversa já existia na lista lateral
                    const updated = [...prev];
                    updated[idx] = {
                        ...updated[idx],
                        messages: [...updated[idx].messages, { dir: isFromMe ? 'out' : 'in', text: newText, time: msgTime }],
                        lastMsg: newText,
                        lastTime: msgTime,
                        unread: (updated[idx].id !== selectedConvoId && !isFromMe) ? updated[idx].unread + 1 : updated[idx].unread
                    };
                    return updated;
                });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [selectedConvoId]);

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

    const convo = conversations.find(c => c.id === selectedConvoId) || conversations[0];
    const filteredConversations = conversations.filter(c =>
        c.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''))
    );

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const now = () => {
        const d = new Date();
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    const handleSend = async () => {
        if (!msgInput.trim()) return;

        const currentMsg = msgInput;
        // Limpa estado para dar feedback visual na hora
        setMsgInput('');
        setAiSuggestion(null);

        const currentConvoId = convo.id;
        const idx = conversations.findIndex(c => c.id === currentConvoId);
        if (idx === -1) return;

        const updated = [...conversations];
        updated[idx] = {
            ...updated[idx],
            messages: [...updated[idx].messages, { dir: 'out', text: currentMsg, time: now() }],
            lastMsg: currentMsg,
            lastTime: now()
        };
        setConversations(updated);

        // Disparo Real para a API (ZapPro / Evolution Backend Local)
        try {
            const response = await fetch('http://localhost:3001/api/whatsapp/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instanceName: 'U3Company',
                    number: convo.phone.replace(/\D/g, ''), // Puxa apenas os números do contato na tela
                    text: currentMsg
                })
            });
            const data = await response.json();
            if (!data.success) {
                showToast(`❌ Falha ao enviar ao WhatsApp: ${data.error}`);
            }
        } catch (error) {
            console.error("Erro na comunicação com o backend:", error);
            showToast("❌ Servidor local de mensagens indisponível.");
        }
    };

    const handleAiSuggest = async () => {
        setAiLoading(true);
        setAiSuggestion(null);
        const result = await generateAISuggestion(convo.messages, convo.department);
        setAiSuggestion(result.text);
        setAiLoading(false);
    };

    const handleConvertClient = () => {
        const idx = conversations.findIndex(c => c.id === convo.id);
        if (idx === -1) return;
        const updated = [...conversations];
        updated[idx] = {
            ...updated[idx],
            status: 'fechado',
            tags: [...updated[idx].tags, 'Convertido ✅']
        };
        setConversations(updated);
        showToast(`✅ ${convo.contactName} convertido em cliente com sucesso!`);
    };

    const handleCreateTask = () => {
        const tarefasArr = getData('u3_tarefas', '[]');
        const novaTarefa = {
            id: Date.now(),
            titulo: `Atender Solicitação - ${convo.contactName}`,
            descricao: `Lead gerado pelo WhatsApp.\nÚltima msg: ${convo.lastMsg}`,
            cliente: convo.contactName,
            responsavel: 'SDR U3',
            dataEntrega: new Date().toISOString().split('T')[0],
            status: 'pendente',
            tempoExecucao: 0,
            iniciadaEm: null
        };
        setData('u3_tarefas', [novaTarefa, ...tarefasArr]);
        showToast(`📋 Tarefa criada para "${convo.contactName}" — acompanhe no Kanban`);
    };

    const handleScheduleMeeting = (e) => {
        e.preventDefault();
        setShowMeetModal(false);

        const form = e.target;
        const title = form.meetTitle.value;
        const dateRaw = form.meetDate.value;
        const date = dateRaw.replace(/-/g, '');
        const timeS = form.meetTimeStart.value.replace(':', '') + '00';
        const timeE = form.meetTimeEnd.value.replace(':', '') + '00';
        const notes = form.meetDesc.value;

        // Salvar localmente isolado
        const meetingsArr = getData('u3_meetings', '[]');
        const novoCompromisso = {
            id: Date.now(),
            date: dateRaw,
            timeStart: form.meetTimeStart.value,
            timeEnd: form.meetTimeEnd.value,
            client: convo.contactName,
            title: title,
            platform: 'Google Meet',
            details: notes
        };
        setData('u3_meetings', [...meetingsArr, novoCompromisso]);

        // Gera link Google Calendar
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: `${title} - ${convo.contactName}`,
            details: `Reunião com ${convo.contactName} (${convo.phone})\n\n${notes}`,
            location: 'Google Meet',
            dates: `${date}T${timeS}/${date}T${timeE}`,
            add: 'contato@u3company.com',
        });
        window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
        showToast(`📅 Reunião "${title}" agendada! Confirme no Google Agenda.`);
    };

    const statusColors = {
        'novo': 'var(--accent-color)',
        'em atendimento': 'var(--success)',
        'aguardando': 'var(--warning)',
        'fechado': 'var(--text-muted)'
    };

    return (
        <div className="inbox-grid">

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
                    <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'var(--bg-tertiary)', borderRadius: 8, padding: '8px 12px' }}>
                            <Search size={16} color="var(--text-muted)" />
                            <input type="text" placeholder="Buscar conversa..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: 'none', background: 'none', color: 'var(--text-main)', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowNewContactModal(true)} style={{ padding: '8px 12px' }} title="Novo Contato">
                            <UserPlus size={16} />
                        </button>
                    </div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {filteredConversations.map((c) => (
                        <div key={c.id} onClick={() => setSelectedConvoId(c.id)}
                            style={{
                                padding: '16px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)',
                                backgroundColor: selectedConvoId === c.id ? 'var(--bg-tertiary)' : 'transparent',
                                borderLeft: selectedConvoId === c.id ? '3px solid var(--accent-color)' : '3px solid transparent'
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
                            <div className="responsive-grid-3">
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
                            <div className="form-group" style={{ marginTop: 16 }}>
                                <label className="form-label">Descrição da Reunião</label>
                                <textarea name="meetDesc" rows="3" className="form-control" placeholder="Anotações para pauta..." style={{ resize: 'none' }}></textarea>
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
            {/* Modal Novo Contato */}
            {showNewContactModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: 400 }}>
                        <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <UserPlus size={20} color="var(--accent-color)" /> Novo Contato
                        </h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const newContact = {
                                id: Date.now(),
                                contactName: formData.get('nome'),
                                phone: formData.get('telefone'),
                                department: formData.get('departamento'),
                                status: 'novo',
                                unread: 0,
                                lastMsg: '',
                                lastTime: now(),
                                tags: [],
                                messages: []
                            };
                            setConversations([newContact, ...conversations]);
                            setSelectedConvoId(newContact.id);
                            setShowNewContactModal(false);
                            showToast(`✅ Contato ${newContact.contactName} adicionado!`);
                        }}>
                            <div className="form-group">
                                <label className="form-label">Nome do Contato</label>
                                <input name="nome" type="text" className="form-control" placeholder="Ex: João Silva" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">WhatsApp (com DDD)</label>
                                <input name="telefone" type="text" className="form-control" placeholder="Ex: 11999999999" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Departamento Inicial</label>
                                <select name="departamento" className="form-control">
                                    <option>Comercial</option>
                                    <option>Administrativo</option>
                                    <option>Pós-vendas</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowNewContactModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CheckCircle size={16} /> Salvar Contato
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
