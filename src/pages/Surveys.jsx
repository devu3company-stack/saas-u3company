import { useState, useEffect } from 'react';
import { BarChart2, Star, Link2, Copy, CheckCircle, ExternalLink, Trash2 } from 'lucide-react';
import { useAuth } from '../utils/auth';

const Surveys = () => {
    const { getData } = useAuth();
    const [clients, setClients] = useState([]);
    const [responses, setResponses] = useState([]);
    const [copiedId, setCopiedId] = useState(null);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [generatedLink, setGeneratedLink] = useState('');

    useEffect(() => {
        const clientsData = getData('u3_clients_v2', '[]') || [];
        setClients(Array.isArray(clientsData) ? clientsData : []);

        const npsResponses = JSON.parse(localStorage.getItem('u3_nps_responses') || '[]');
        setResponses(npsResponses);
    }, [getData]);

    const avgScore = responses.length > 0
        ? (responses.reduce((acc, r) => acc + r.score, 0) / responses.length).toFixed(1)
        : '-';

    const getNpsZone = (score) => {
        if (score === '-') return { label: 'Sem dados', color: 'var(--text-muted)' };
        const num = parseFloat(score);
        if (num >= 9) return { label: 'Zona de Excelência', color: 'var(--success)' };
        if (num >= 7) return { label: 'Zona de Aperfeiçoamento', color: 'var(--warning)' };
        return { label: 'Zona Crítica', color: 'var(--danger)' };
    };

    const zone = getNpsZone(avgScore);

    const generateNpsLink = (client) => {
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/nps/${client.id}`;
        setSelectedClient(client);
        setGeneratedLink(link);
        setShowLinkModal(true);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopiedId(selectedClient?.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const deleteResponse = (responseId) => {
        const updated = responses.filter(r => r.id !== responseId);
        setResponses(updated);
        localStorage.setItem('u3_nps_responses', JSON.stringify(updated));
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Pesquisas de Satisfação (NPS)</h2>
                    <p className="text-muted">Feedback dos clientes — gere links exclusivos para coleta</p>
                </div>
                <button className="btn btn-outline" onClick={() => alert("Gerando Relatório Completo Avançado em PDF... Isso será enviado para o seu e-mail do sistema.")}><BarChart2 size={16} /> Relatório Completo</button>
            </div>

            <div className="grid-cards">
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card-title">Média Geral NPS</div>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: zone.color }}>{avgScore}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 8 }}>{zone.label}</div>
                </div>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card-title">Respostas Coletadas</div>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-main)' }}>{responses.length}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 8 }}>De {clients.length} clientes cadastrados</div>
                </div>
            </div>

            {/* Seção de Geração de Links */}
            <div className="card" style={{ marginTop: 24 }}>
                <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Link2 size={18} /> Gerar Link NPS Exclusivo
                </h3>
                <p className="text-muted" style={{ marginBottom: 16, fontSize: '0.85rem' }}>
                    Selecione um cliente para gerar um link exclusivo de pesquisa NPS. O cliente poderá acessar pelo navegador e deixar sua nota + feedback.
                </p>

                {clients.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                        {clients.map(client => {
                            const hasResponse = responses.some(r => r.clientId === client.id.toString());
                            return (
                                <div key={client.id} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '12px 16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 8,
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{client.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: hasResponse ? 'var(--success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                            {hasResponse ? <><CheckCircle size={12} /> Já respondeu</> : 'Aguardando resposta'}
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}
                                        onClick={() => generateNpsLink(client)}
                                    >
                                        <Link2 size={14} /> Gerar Link
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                        Nenhum cliente cadastrado. Cadastre clientes para gerar links NPS.
                    </div>
                )}
            </div>

            {/* Tabela de Respostas */}
            <div className="card" style={{ padding: 0, marginTop: 24 }}>
                <h3 style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>Últimas Respostas</h3>
                <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Nota</th>
                                <th>Comentário</th>
                                <th>Data</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {responses.length > 0 ? responses.map(res => (
                                <tr key={res.id}>
                                    <td style={{ fontWeight: 600 }}>{res.clientName || res.client}</td>
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
                                        "{res.comment || 'Sem comentário'}"
                                    </td>
                                    <td>{res.date}</td>
                                    <td>
                                        <button
                                            onClick={() => deleteResponse(res.id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 4 }}
                                            title="Remover resposta"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                                        Nenhuma resposta coletada ainda. Gere um link NPS e envie para seus clientes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Link Gerado */}
            {showLinkModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: 550, maxWidth: '90vw' }}>
                        <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Link2 size={20} color="var(--accent-color)" /> Link NPS Gerado
                        </h3>
                        <p className="text-muted" style={{ marginBottom: 16, fontSize: '0.85rem' }}>
                            Envie este link exclusivo para <strong>{selectedClient?.name}</strong> responder a pesquisa de satisfação.
                        </p>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: 12, backgroundColor: 'var(--bg-tertiary)', borderRadius: 8,
                            border: '1px solid var(--border-color)', marginBottom: 16
                        }}>
                            <input
                                readOnly
                                value={generatedLink}
                                style={{ flex: 1, background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '0.85rem', outline: 'none', fontFamily: 'monospace' }}
                            />
                            <button
                                className="btn btn-primary"
                                style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                                onClick={copyLink}
                            >
                                {copiedId === selectedClient?.id ? <><CheckCircle size={14} /> Copiado!</> : <><Copy size={14} /> Copiar</>}
                            </button>
                        </div>

                        <div style={{ padding: 12, backgroundColor: 'rgba(0, 208, 132, 0.1)', borderRadius: 8, border: '1px solid rgba(0, 208, 132, 0.2)', marginBottom: 16 }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--success)', margin: 0 }}>
                                💡 Dica: Envie pelo WhatsApp, e-mail ou qualquer canal. O cliente preencherá pelo celular ou computador.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                            <a href={generatedLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                                <ExternalLink size={14} /> Visualizar
                            </a>
                            <button className="btn btn-primary" onClick={() => setShowLinkModal(false)}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Surveys;
