import { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar as CalIcon, Award, UserCheck, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { useAuth } from '../utils/auth';

const Goals = () => {
    const { getData, setData } = useAuth();
    const today = new Date();
    const currentMonth = today.toLocaleString('pt-BR', { month: 'long' });
    const [modalOpen, setModalOpen] = useState(false);
    const [goalsConfig, setGoalsConfig] = useState(() => {
        const emptyState = {
            goal: 0,
            ticket: 0,
            metaStart: 0,
            metaPro: 0,
            metaDiamond: 0,
            hallName: '-',
            hallDesc: 'Nenhum destaque ainda.',
            hallPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop'
        };
        return getData('u3_goals', JSON.stringify(emptyState));
    });

    const updateGoals = (newGoals) => {
        setGoalsConfig(newGoals);
        setData('u3_goals', newGoals);
    };

    const [currentMrr, setCurrentMrr] = useState(0);

    useEffect(() => {
        const clients = getData('u3_clients_v2', '[]');
        const totalMrr = clients.reduce((acc, c) => {
            if (c.status === 'ativo' && c.mrr) {
                const numberStr = String(c.mrr).replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
                const val = parseFloat(numberStr) || 0;
                return acc + val;
            }
            return acc;
        }, 0);
        setCurrentMrr(totalMrr);
    }, [getData]);

    // Simulação do Algoritmo de Dias Úteis
    const totalWorkingDays = 22; // Dias úteis no mês
    const passedWorkingDays = 12; // Dias úteis que já passaram até hoje
    const remainingDays = totalWorkingDays - passedWorkingDays;

    // Meta de Receita Mensal
    const mrrGoal = goalsConfig.goal;

    const pacing = currentMrr / passedWorkingDays; // Quanto vendeu por dia
    const requiredPacing = (mrrGoal - currentMrr) / remainingDays; // Quanto PRECISA vender por dia agora

    // Status (Verde se saudavel, Vermelho se longe)
    const isHealthy = requiredPacing <= (mrrGoal / totalWorkingDays);
    const isMrrHealthy = currentMrr >= (mrrGoal / totalWorkingDays) * passedWorkingDays;

    // Funil SDR (Game: 2 Agendamentos para dar 1 Reunião. Taxa de conv = 20%)
    const mrrAvarageTicket = goalsConfig.ticket;
    const salesNeeded = Math.ceil((mrrGoal - currentMrr) / mrrAvarageTicket);
    const meetingsNeeded = salesNeeded * 3; // (Assumindo 30% fechamento)
    const schedulesNeeded = meetingsNeeded * 2; // (Assumindo 50% de comparecimento show-up)

    const sdrDailyGoal = Math.ceil(schedulesNeeded / remainingDays);
    const closerDailyGoal = Math.ceil(meetingsNeeded / remainingDays);

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2>Calendário de Metas ({currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)})</h2>
                    <p className="text-muted">Acompanhamento diário para bater {remainingDays} dias úteis restantes</p>
                </div>
                <button className="btn btn-primary" onClick={() => setModalOpen(true)} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Target size={16} /> Configurar Metas
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 24 }}>

                {/* Meta Financeira */}
                <div className="card" style={{ border: isMrrHealthy ? '2px solid var(--success)' : '2px solid var(--danger)' }}>
                    <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
                        <TrendingUp size={18} /> MRR Target (Novo)
                    </h3>
                    <div style={{ fontSize: '2rem', fontWeight: 700, margin: '16px 0 8px', color: isMrrHealthy ? 'var(--success)' : 'var(--danger)' }}>
                        R$ {currentMrr.toLocaleString('pt-BR')} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {mrrGoal.toLocaleString('pt-BR')}</span>
                    </div>
                    {isMrrHealthy ? (
                        <div style={{ fontSize: '0.85rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle size={14} /> Ritmo Saudável!
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.85rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <AlertTriangle size={14} /> Ritmo Lento. Faltam R$ {(mrrGoal - currentMrr).toLocaleString('pt-BR')}
                        </div>
                    )}

                    <div style={{ marginTop: 24, padding: 16, backgroundColor: 'var(--bg-tertiary)', borderRadius: 8 }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Alvo da Equipe p/ hoje:</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600 }}>R$ {Math.ceil(requiredPacing).toLocaleString('pt-BR')} / dia útil</span>
                            <Zap size={16} color="var(--accent-color)" />
                        </div>
                    </div>
                </div>

                {/* 3 Metas (Start, Pro, Diamond) */}
                <div className="card">
                    <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
                        <Target size={18} /> Metas (Start, Pro, Diamond)
                    </h3>

                    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { label: 'Meta Start', value: goalsConfig.metaStart, color: '#4FC3F7' },
                            { label: 'Meta Pro', value: goalsConfig.metaPro, color: 'var(--accent-color)' },
                            { label: 'Meta Diamond', value: goalsConfig.metaDiamond, color: '#B39DDB' }
                        ].map((m, idx) => {
                            const progress = Math.min((currentMrr / m.value) * 100, 100);
                            return (
                                <div key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                                        <span style={{ fontWeight: 600, color: m.color }}>{m.label}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>R$ {currentMrr.toLocaleString('pt-BR')} / R$ {m.value.toLocaleString('pt-BR')}</span>
                                    </div>
                                    <div style={{ width: '100%', height: 8, backgroundColor: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: m.color, transition: 'width 0.5s ease' }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Calculadora de Funil SDR/Closer */}
                <div className="card">
                    <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 24 }}>
                        <CalIcon size={18} /> O Que Fazer Hoje
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', gap: 6, alignItems: 'center' }}>
                                    🎯 Meta SDR
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Agendamentos necessários</div>
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-color)' }}>
                                {sdrDailyGoal}/dia
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', gap: 6, alignItems: 'center' }}>
                                    🤝 Meta Closer
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reuniões Qualificadas</div>
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-color)' }}>
                                {closerDailyGoal}/dia
                            </div>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
                            Cálculo dinâmico (Conv: 30% | TM: R$ {mrrAvarageTicket})
                        </div>
                    </div>
                </div>

                {/* Gamificação: Hall da Fama */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 24 }}>
                        <Award size={18} color="var(--accent-color)" /> Hall da Fama (MVP)
                    </h3>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img
                                src={goalsConfig.hallPhoto}
                                alt="Employee"
                                style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--accent-color)', objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', bottom: -5, right: -5, backgroundColor: 'var(--accent-color)', borderRadius: '50%', padding: 4 }}>
                                <Award size={16} color="black" />
                            </div>
                        </div>
                        <h4 style={{ margin: '16px 0 4px', fontSize: '1.1rem' }}>{goalsConfig.hallName}</h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>Top Closer 🔥</div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 12, lineHeight: 1.4 }}>
                            {goalsConfig.hallDesc}
                        </p>
                    </div>
                </div>

            </div>

            {modalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: 600, maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}><Target size={20} color="var(--accent-color)" /> Configurar Metas</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            updateGoals({
                                goal: Number(e.target.goal.value),
                                ticket: Number(e.target.ticket.value),
                                metaStart: Number(e.target.metaStart.value),
                                metaPro: Number(e.target.metaPro.value),
                                metaDiamond: Number(e.target.metaDiamond.value),
                                hallName: e.target.hallName.value,
                                hallDesc: e.target.hallDesc.value,
                                hallPhoto: e.target.hallPhoto.value,
                            });
                            setModalOpen(false);
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Meta de MRR Mensal (R$)</label>
                                    <input name="goal" type="number" className="form-control" defaultValue={goalsConfig.goal} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Ticket Médio (R$)</label>
                                    <input name="ticket" type="number" className="form-control" defaultValue={goalsConfig.ticket} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Meta Start (R$)</label>
                                    <input name="metaStart" type="number" className="form-control" defaultValue={goalsConfig.metaStart} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Meta Pro (R$)</label>
                                    <input name="metaPro" type="number" className="form-control" defaultValue={goalsConfig.metaPro} required />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Meta Diamond (R$)</label>
                                    <input name="metaDiamond" type="number" className="form-control" defaultValue={goalsConfig.metaDiamond} required />
                                </div>

                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Nome (Hall da Fama)</label>
                                    <input name="hallName" className="form-control" defaultValue={goalsConfig.hallName} required />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Foto URL (Hall da Fama)</label>
                                    <input name="hallPhoto" className="form-control" defaultValue={goalsConfig.hallPhoto} required />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Descrição (Hall da Fama)</label>
                                    <textarea name="hallDesc" className="form-control" defaultValue={goalsConfig.hallDesc} rows={2} required></textarea>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Salvar Metas</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;
