import { Target, TrendingUp, Calendar as CalIcon, Award, UserCheck, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const Goals = () => {
    const today = new Date();
    const currentMonth = today.toLocaleString('pt-BR', { month: 'long' });

    // Simulação do Algoritmo de Dias Úteis
    const totalWorkingDays = 22; // Dias úteis no mês
    const passedWorkingDays = 12; // Dias úteis que já passaram até hoje
    const remainingDays = totalWorkingDays - passedWorkingDays;

    // Meta de Receita Mensal
    const mrrGoal = 50000;
    const currentMrr = 21000;

    const pacing = currentMrr / passedWorkingDays; // Quanto vendeu por dia
    const requiredPacing = (mrrGoal - currentMrr) / remainingDays; // Quanto PRECISA vender por dia agora

    // Status (Verde se saudavel, Vermelho se longe)
    const isHealthy = requiredPacing <= (mrrGoal / totalWorkingDays);
    const isMrrHealthy = currentMrr >= (mrrGoal / totalWorkingDays) * passedWorkingDays;

    // Funil SDR (Game: 2 Agendamentos para dar 1 Reunião. Taxa de conv = 20%)
    const mrrAvarageTicket = 2500;
    const salesNeeded = Math.ceil((mrrGoal - currentMrr) / mrrAvarageTicket);
    const meetingsNeeded = salesNeeded * 3; // (Assumindo 30% fechamento)
    const schedulesNeeded = meetingsNeeded * 2; // (Assumindo 50% de comparecimento show-up)

    const sdrDailyGoal = Math.ceil(schedulesNeeded / remainingDays);
    const closerDailyGoal = Math.ceil(meetingsNeeded / remainingDays);

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2>Metas de {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} (Gamificação)</h2>
                    <p className="text-muted">Acompanhamento diário para bater {remainingDays} dias úteis restantes</p>
                </div>
                <button className="btn btn-primary" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
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
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop"
                                alt="Employee"
                                style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--accent-color)', objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', bottom: -5, right: -5, backgroundColor: 'var(--accent-color)', borderRadius: '50%', padding: 4 }}>
                                <Award size={16} color="black" />
                            </div>
                        </div>
                        <h4 style={{ margin: '16px 0 4px', fontSize: '1.1rem' }}>Carlos Eduardo</h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>Top Closer 🔥</div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 12, lineHeight: 1.4 }}>
                            Maior taxa de fechamento da semana e +3 novos clientes retidos.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Goals;
