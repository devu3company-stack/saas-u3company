import { BarChart2, Star } from 'lucide-react';

const Surveys = () => {
    const responses = [
        { id: 1, client: 'AlphaTech Solutions', score: 10, comment: 'Excelente atendimento e resultados consistentes!', date: '01/02/2026' },
        { id: 2, client: 'Imobiliária Prime', score: 5, comment: 'Senti falta de um acompanhamento mais próximo neste mês.', date: '28/01/2026' },
        { id: 3, client: 'Construtora Silva', score: 9, comment: 'Tudo ótimo, equipe muito atenciosa.', date: '25/01/2026' },
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Pesquisas de Satisfação (NPS)</h2>
                    <p className="text-muted">Feedback dos clientes</p>
                </div>
                <button className="btn btn-outline"><BarChart2 size={16} /> Relatório Completo</button>
            </div>

            <div className="grid-cards">
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card-title">Média Geral NPS</div>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--success)' }}>8.9</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 8 }}>Zona de Excelência</div>
                </div>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card-title">Respostas no Mês</div>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-main)' }}>12</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 8 }}>De 15 clientes ativos</div>
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <h3 style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>Últimas Respostas</h3>
                <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Nota</th>
                                <th>Comentário</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {responses.map(res => (
                                <tr key={res.id}>
                                    <td style={{ fontWeight: 600 }}>{res.client}</td>
                                    <td>
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                            color: res.score >= 9 ? 'var(--success)' : res.score <= 6 ? 'var(--danger)' : 'var(--warning)',
                                            fontWeight: 700
                                        }}>
                                            <Star size={16} fill="currentColor" /> {res.score}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        "{res.comment}"
                                    </td>
                                    <td>{res.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Surveys;
