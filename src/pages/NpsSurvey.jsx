import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, CheckCircle } from 'lucide-react';

const NpsSurvey = () => {
    const { id } = useParams();
    const [clientName, setClientName] = useState('Cliente');
    const [score, setScore] = useState(null);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const clientsRaw = localStorage.getItem('u3_clients_v2');
        if (clientsRaw) {
            const clients = JSON.parse(clientsRaw);
            const client = clients.find(c => c.id.toString() === id);
            if (client) {
                setClientName(client.name);
            }
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (score === null) {
            alert("Por favor, selecione uma nota de 0 a 10.");
            return;
        }

        const responsesRaw = localStorage.getItem('u3_nps_responses') || '[]';
        const responses = JSON.parse(responsesRaw);

        responses.push({
            id: Date.now(),
            clientId: id,
            clientName: clientName,
            score: score,
            comment: comment,
            date: new Date().toLocaleDateString('pt-BR')
        });

        localStorage.setItem('u3_nps_responses', JSON.stringify(responses));
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-secondary)', padding: 20 }}>
                <div style={{ backgroundColor: 'var(--bg-main)', padding: 40, borderRadius: 16, textAlign: 'center', maxWidth: 500, width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)' }}>
                    <CheckCircle size={64} color="var(--success)" style={{ marginBottom: 24 }} />
                    <h2 style={{ marginBottom: 16, fontSize: '1.8rem' }}>Obrigado pelo seu feedback!</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Sua avaliação é muito importante para continuarmos melhorando nossos serviços.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', padding: 20 }}>
            <div style={{ backgroundColor: 'var(--bg-main)', padding: 40, borderRadius: 16, maxWidth: 600, width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: 8, color: 'var(--text-main)' }}>Pesquisa de Satisfação (NPS)</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Olá, <strong>{clientName}</strong>. Como você avalia nossa parceria até o momento?</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 32 }}>
                        <p style={{ marginBottom: 16, fontWeight: 600, textAlign: 'center', color: 'var(--text-main)' }}>Em uma escala de 0 a 10, o quanto você nos recomendaria para um amigo ou parceiro comercial?</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setScore(num)}
                                    style={{
                                        width: 38, height: 38, borderRadius: 8, border: '1px solid',
                                        borderColor: score === num ? 'var(--accent-color)' : 'var(--border-color)',
                                        backgroundColor: score === num ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                                        color: score === num ? 'white' : 'var(--text-main)',
                                        fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <span>Nada provável (0)</span>
                            <span>Extremamente provável (10)</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text-main)' }}>O que motivou sua nota? (Opcional)</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Deixe seu comentário, elogio ou sugestão..."
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 14, fontSize: '1rem' }}>
                        <Send size={18} /> Enviar Avaliação
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NpsSurvey;
