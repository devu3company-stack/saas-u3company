import { Target, TrendingUp } from 'lucide-react';

const Goals = () => {
    const goals = [
        { id: 1, type: 'Novos Clientes', current: 8, target: 12, unit: '' },
        { id: 2, type: 'MRR (Crescimento)', current: 14500, target: 20000, unit: 'R$' },
        { id: 3, type: 'Reuniões Agendadas', current: 45, target: 60, unit: '' },
        { id: 4, type: 'Propostas Enviadas', current: 15, target: 20, unit: '' }
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Metas e Objetivos</h2>
                    <p className="text-muted">Acompanhamento de metas do mês (Fev/26)</p>
                </div>
                <button className="btn btn-primary"><Target size={16} /> Nova Meta</button>
            </div>

            <div className="card" style={{ padding: 32 }}>
                <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp size={20} color="var(--accent-color)" /> Progresso Geral
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {goals.map(goal => {
                        const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
                        const formattedCurrent = goal.unit === 'R$' ? `R$ ${goal.current.toLocaleString('pt-BR')}` : goal.current;
                        const formattedTarget = goal.unit === 'R$' ? `R$ ${goal.target.toLocaleString('pt-BR')}` : goal.target;

                        return (
                            <div key={goal.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontWeight: 600 }}>{goal.type}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>
                                        {formattedCurrent} / {formattedTarget} ({percentage}%)
                                    </span>
                                </div>
                                <div style={{ width: '100%', height: 12, backgroundColor: 'var(--bg-tertiary)', borderRadius: 6, overflow: 'hidden' }}>
                                    <div
                                        style={{
                                            height: '100%',
                                            width: `${percentage}%`,
                                            backgroundColor: percentage >= 100 ? 'var(--success)' : 'var(--accent-color)',
                                            borderRadius: 6,
                                            transition: 'width 0.5s ease-out'
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Goals;
