import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://saas-u3company.onrender.com';

const NpsSurvey = () => {
    const { namespace, id } = useParams();
    const [clientName, setClientName] = useState('');
    const [score, setScore] = useState(null);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Busca o nome do cliente no BACKEND (banco de dados)
        fetch(`${API_BASE}/api/nps/${namespace}/client/${id}`)
            .then(r => r.json())
            .then(data => {
                if (data.success && data.clientName) {
                    setClientName(data.clientName);
                } else {
                    setClientName('Cliente');
                }
            })
            .catch(() => setClientName('Cliente'))
            .finally(() => setLoading(false));
    }, [namespace, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (score === null) {
            alert("Por favor, selecione uma nota de 0 a 10.");
            return;
        }

        setSubmitting(true);

        const npsResponse = {
            id: Date.now(),
            clientId: id,
            clientName: clientName,
            score: score,
            comment: comment,
            date: new Date().toLocaleDateString('pt-BR')
        };

        try {
            // Salva no BACKEND (banco de dados) usando o namespace correto
            const res = await fetch(`${API_BASE}/api/nps/${namespace}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ response: npsResponse })
            });
            const data = await res.json();
            if (data.success) {
                setSubmitted(true);
            } else {
                alert('Erro ao salvar. Tente novamente.');
            }
        } catch (err) {
            console.error('Erro ao enviar NPS:', err);
            alert('Erro de conexão. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0d0d1a', color: '#fff' }}>
                <Loader2 size={48} style={{ animation: 'spin 1.5s linear infinite' }} />
                <p style={{ marginTop: 16, color: '#999' }}>Carregando pesquisa...</p>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (submitted) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0d0d1a', padding: 20 }}>
                <div style={{ backgroundColor: '#1a1a2e', padding: 40, borderRadius: 16, textAlign: 'center', maxWidth: 500, width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid #2a2a3e' }}>
                    <CheckCircle size={64} color="#00d084" style={{ marginBottom: 24 }} />
                    <h2 style={{ marginBottom: 16, fontSize: '1.8rem', color: '#fff' }}>Obrigado pelo seu feedback!</h2>
                    <p style={{ color: '#999' }}>Sua avaliação é muito importante para continuarmos melhorando nossos serviços.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0d0d1a', padding: 20 }}>
            <div style={{ backgroundColor: '#1a1a2e', padding: 40, borderRadius: 16, maxWidth: 600, width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid #2a2a3e' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: 8, color: '#fff' }}>Pesquisa de Satisfação (NPS)</h1>
                    <p style={{ color: '#999' }}>Olá, <strong style={{ color: '#00d084' }}>{clientName}</strong>. Como você avalia nossa parceria até o momento?</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 32 }}>
                        <p style={{ marginBottom: 16, fontWeight: 600, textAlign: 'center', color: '#fff' }}>Em uma escala de 0 a 10, o quanto você nos recomendaria para um amigo ou parceiro comercial?</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setScore(num)}
                                    style={{
                                        width: 42, height: 42, borderRadius: 8, border: '1px solid',
                                        borderColor: score === num ? '#00d084' : '#2a2a3e',
                                        backgroundColor: score === num ? '#00d084' : '#12122a',
                                        color: score === num ? '#000' : '#fff',
                                        fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.75rem', color: '#666' }}>
                            <span>Nada provável (0)</span>
                            <span>Extremamente provável (10)</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#fff' }}>O que motivou sua nota? (Opcional)</label>
                        <textarea
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Deixe seu comentário, elogio ou sugestão..."
                            style={{
                                width: '100%', padding: 12, borderRadius: 8, border: '1px solid #2a2a3e',
                                backgroundColor: '#12122a', color: '#fff', fontSize: '0.9rem',
                                resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
                            gap: 8, padding: 14, fontSize: '1rem', fontWeight: 600,
                            backgroundColor: submitting ? '#333' : '#00d084', color: submitting ? '#999' : '#000',
                            border: 'none', borderRadius: 8, cursor: submitting ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {submitting ? (
                            <><Loader2 size={18} style={{ animation: 'spin 1.5s linear infinite' }} /> Enviando...</>
                        ) : (
                            <><Send size={18} /> Enviar Avaliação</>
                        )}
                    </button>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </form>
            </div>
        </div>
    );
};

export default NpsSurvey;
