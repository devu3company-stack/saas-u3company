import { Calendar as CalendarIcon, Clock, Video, Plus, ExternalLink, Users } from 'lucide-react';
import { useState } from 'react';

const Meetings = () => {
    const [showModal, setShowModal] = useState(false);

    // Formulario de nova reuniao
    const [newMeet, setNewMeet] = useState({
        title: '',
        client: '',
        date: '',
        timeStart: '10:00',
        timeEnd: '11:00',
        details: 'Reunião via Google Meet com a equipe.'
    });

    const meetings = [
        { date: 'Hoje', time: '14:30', client: 'Construtora Silva', title: 'Alinhamento', platform: 'Google Meet' },
        { date: 'Amanhã', time: '10:00', client: 'Dental Care Clínica', title: 'Apresentação Diagnóstico', platform: 'Zoom' },
        { date: 'Amanhã', time: '16:00', client: 'Boutique Fashion', title: 'Onboarding', platform: 'Google Meet' }
    ];

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
                details: meetParams.details,
                location: 'Google Meet',
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

        // Abre em nova guia para salvar lá
        const url = generateGoogleCalendarLink(newMeet);
        window.open(url, '_blank');

        // Em um sistema real, salvaria no DB (supabase/firebase) aqui primeiro

        setShowModal(false);
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
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{m.date}</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Clock size={16} /> {m.time}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>{m.title}</div>
                                    <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Users size={14} /> {m.client}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 12 }}>
                                <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Video size={16} /> Entrar na Call
                                </button>
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
                                <input type="text" className="form-control" required placeholder="Ex: Imobiliária Prime"
                                    value={newMeet.client} onChange={e => setNewMeet({ ...newMeet, client: e.target.value })} />
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
