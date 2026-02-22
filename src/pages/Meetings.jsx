import { Calendar as CalendarIcon, Clock, Video, Plus, ExternalLink, Users, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

const Meetings = () => {
    const [showModal, setShowModal] = useState(false);

    // Formulario de nova reuniao
    const [newMeet, setNewMeet] = useState({
        title: '',
        client: '',
        date: '',
        timeStart: '10:00',
        timeEnd: '11:00',
        details: 'Reunião via Google Meet com a equipe.',
        meetLink: ''
    });

    const [meetings, setMeetings] = useState(() => {
        const saved = localStorage.getItem('u3_meetings');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, date: '2026-02-21', timeStart: '14:30', client: 'Construtora Silva', title: 'Alinhamento', platform: 'Google Meet', details: '', meetLink: 'https://meet.google.com/abc-def-ghi' },
            { id: 2, date: '2026-02-22', timeStart: '10:00', client: 'Dental Care Clínica', title: 'Apresentação Diagnóstico', platform: 'Zoom', details: '', meetLink: 'https://zoom.us/j/123456789' },
            { id: 3, date: '2026-02-22', timeStart: '16:00', client: 'Boutique Fashion', title: 'Onboarding', platform: 'Google Meet', details: '', meetLink: '' }
        ];
    });

    useEffect(() => {
        localStorage.setItem('u3_meetings', JSON.stringify(meetings));
    }, [meetings]);

    const generateGoogleCalendarLink = (meetParams) => {
        if (!meetParams.date) return '#';

        try {
            const dateStr = meetParams.date.replace(/-/g, '');
            const startStr = meetParams.timeStart.replace(':', '') + '00';
            const endStr = meetParams.timeEnd.replace(':', '') + '00';

            // Formatacao UTC
            const params = new URLSearchParams({
                action: 'TEMPLATE',
                text: `${meetParams.title} - ${meetParams.client}`,
                details: `${meetParams.details}\n\nLink da Reunião: ${meetParams.meetLink}`,
                location: meetParams.meetLink || 'Google Meet',
                dates: `${dateStr}T${startStr}/${dateStr}T${endStr}`,
                add: 'contato@u3company.com', // Adiciona o seu e-mail do agenda que vai ser notificado
            });
            return `https://calendar.google.com/calendar/render?${params.toString()}`;
        } catch (e) {
            return '#';
        }
    };

    const handleScheduleMeet = (e) => {
        e.preventDefault();

        // Salvar localmente
        const novoCompromisso = {
            id: Date.now(),
            date: newMeet.date,
            timeStart: newMeet.timeStart,
            timeEnd: newMeet.timeEnd,
            client: newMeet.client,
            title: newMeet.title,
            platform: 'Google Meet',
            details: newMeet.details,
            meetLink: newMeet.meetLink
        };
        setMeetings([...meetings, novoCompromisso]);

        // Abre em nova guia
        const url = generateGoogleCalendarLink(newMeet);
        window.open(url, '_blank');

        setShowModal(false);
    };

    const formatDateExt = (dStr) => {
        if (!dStr) return '';
        const today = new Date().toISOString().split('T')[0];
        if (dStr === today) return 'Hoje';
        const parts = dStr.split('-');
        return `${parts[2]}/${parts[1]}`;
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Agenda Mensal</h2>
                    <p className="text-muted">Reuniões de clientes e follow-ups</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={16} /> Nova Reunião
                </button>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CalendarIcon size={20} color="var(--accent-color)" /> Próximos Compromissos
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {meetings.map((m, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: 'var(--bg-tertiary)', borderRadius: 12 }}>
                            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                                <div style={{ textAlign: 'center', paddingRight: 24, borderRight: '1px solid var(--border-color)' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{formatDateExt(m.date)}</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Clock size={16} /> {m.timeStart || m.time}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>{m.title}</div>
                                    <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Users size={14} /> {m.client}
                                    </div>
                                    {m.details && (
                                        <div style={{ marginTop: 6, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <FileText size={12} /> {m.details}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 12 }}>
                                {m.meetLink ? (
                                    <a href={m.meetLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                                        <Video size={16} /> Entrar na Call
                                    </a>
                                ) : (
                                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.5, cursor: 'not-allowed' }} title="Nenhum link configurado para esta reunião.">
                                        <Video size={16} /> Sem Link
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de Agendamento */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: 500 }}>
                        <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>Agendar Reunião</h3>
                        <form onSubmit={handleScheduleMeet}>
                            <div className="form-group">
                                <label className="form-label">Título da Reunião</label>
                                <input type="text" className="form-control" required placeholder="Ex: Apresentação de Resultados"
                                    value={newMeet.title} onChange={e => setNewMeet({ ...newMeet, title: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Cliente</label>
                                <select className="form-control" required
                                    value={newMeet.client} onChange={e => setNewMeet({ ...newMeet, client: e.target.value })}>
                                    <option value="" disabled>Selecione um cliente...</option>
                                    <option value="Lead Externo">Lead Externo (Avulso)</option>
                                    {JSON.parse(localStorage.getItem('u3_clients') || '[]').map(c => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                                    {JSON.parse(localStorage.getItem('u3_clients') || '[]').length === 0 && (
                                        <>
                                            <option value="Imobiliária Prime">Imobiliária Prime</option>
                                            <option value="AlphaTech Solutions">AlphaTech Solutions</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <div>
                                    <label className="form-label">Data</label>
                                    <input type="date" className="form-control" required
                                        value={newMeet.date} onChange={e => setNewMeet({ ...newMeet, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="form-label">Início</label>
                                    <input type="time" className="form-control" required
                                        value={newMeet.timeStart} onChange={e => setNewMeet({ ...newMeet, timeStart: e.target.value })} />
                                </div>
                                <div>
                                    <label className="form-label">Fim</label>
                                    <input type="time" className="form-control" required
                                        value={newMeet.timeEnd} onChange={e => setNewMeet({ ...newMeet, timeEnd: e.target.value })} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Link da Videoconferência (Meet/Zoom)</label>
                                <input type="url" className="form-control" placeholder="https://meet.google.com/..."
                                    value={newMeet.meetLink} onChange={e => setNewMeet({ ...newMeet, meetLink: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Descrição / Pauta da Reunião</label>
                                <textarea rows="3" className="form-control" placeholder="Anotações ou links..." style={{ resize: 'none' }}
                                    value={newMeet.details} onChange={e => setNewMeet({ ...newMeet, details: e.target.value })}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 32, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CalendarIcon size={16} /> Salvar no G Agenda <ExternalLink size={14} />
                                </button>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: 12 }}>
                                Você será redirecionado para o calendário com as info já preenchidas e com notificação via e-mail se quiser.
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Meetings;
