import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Calendar, Lock, CheckSquare, Smile, Shield, ArrowLeft, BarChart2, Users, DollarSign, Clock, LayoutGrid, CheckCircle, PlayCircle, Plus, Map } from 'lucide-react';

const ClientDetail = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('onboarding');

    // Onboarding Trail Tracker
    const [onboardingSteps, setOnboardingSteps] = useState(() => {
        const saved = localStorage.getItem(`u3_onboarding_${id}`);
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, title: 'Reunião de Kickoff', desc: 'Apresentação da equipe e metas', done: false },
            { id: 2, title: 'Ativos Digitais (BM, Ads)', desc: 'Conseguir acessos ao Meta e Google Ads', done: false },
            { id: 3, title: 'Criação de Criativos / Copy', desc: 'Produzir peças para a campanha', done: false },
            { id: 4, title: 'Aprovação Final com Cliente', desc: 'Validar assets', done: false },
            { id: 5, title: 'Ativação das Campanhas', desc: 'Campanhas no ar', done: false }
        ];
    });

    useEffect(() => {
        localStorage.setItem(`u3_onboarding_${id}`, JSON.stringify(onboardingSteps));
    }, [onboardingSteps]);

    const toggleStep = (stepId) => {
        setOnboardingSteps(onboardingSteps.map(s =>
            s.id === stepId ? { ...s, done: !s.done } : s
        ));
    };

    // Load REAL Client Data
    const [client, setClient] = useState(null);
    const [clientTasks, setClientTasks] = useState([]);

    useEffect(() => {
        const clients = JSON.parse(localStorage.getItem('u3_clients') || '[]');
        const found = clients.find(c => c.id.toString() === id);
        if (found) {
            setClient({
                name: found.name,
                status: found.status || 'ativo',
                start: found.start || new Date().toLocaleDateString('pt-BR'),
                mrr: found.mrr || '-',
                nps: found.nps || '-',
                responsible: found.responsavel || 'Gestor U3',
                phone: found.whatsapp || found.contato || '-',
                email: found.email || '-'
            });
        } else {
            setClient({
                name: 'Cliente Não Encontrado',
                status: 'cancelado',
                start: '-', mrr: '-', nps: '-', responsible: '-', phone: '-', email: '-'
            });
        }

        const tasks = JSON.parse(localStorage.getItem('u3_tarefas') || '[]');
        // Filter tasks by client name (if matched)
        const matchedTasks = tasks.filter(t => found && t.cliente.toLowerCase().includes(found.name.toLowerCase()));

        // If no tasks found, provide mock tasks
        if (matchedTasks.length > 0) {
            setClientTasks(matchedTasks.map(t => ({
                id: t.id, title: t.titulo,
                status: t.coluna === 'concluido' ? 'concluida' : t.coluna === 'pendente' ? 'pendente' : 'em_andamento',
                resp: t.responsavel, time: 'Dinâmico'
            })));
        } else {
            setClientTasks([
                { id: 1, title: 'Criar novas artes Meta Ads', status: 'pendente', resp: 'Equipe U3', time: '0h 0m' },
                { id: 2, title: 'Setup de Conta', status: 'em_andamento', resp: 'Gestor U3', time: '1h 20m' }
            ]);
        }
    }, [id]);

    const funnelStages = [
        { name: 'Leads (Topo)', count: 120, color: 'var(--border-color)' },
        { name: 'Qualificados (Meio)', count: 45, color: 'var(--warning)' },
        { name: 'Oportunidades (Fundo)', count: 15, color: 'var(--accent-color)' },
        { name: 'Vendas Fechadas', count: 4, color: 'var(--success)' }
    ];

    if (!client) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando dados do cliente...</div>;

    return (
        <div>
            <div className="page-header" style={{ marginBottom: 16 }}>
                <div>
                    <Link to="/clientes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: 12, fontSize: '0.9rem' }}>
                        <ArrowLeft size={16} /> Voltar para Clientes
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{client.name}</h2>
                        <span className={`badge ${client.status}`}>{client.status.toUpperCase()}</span>
                    </div>
                    <p className="text-muted" style={{ display: 'flex', gap: 16 }}>
                        <span>👤 {client.responsible}</span>
                        <span>📱 {client.phone}</span>
                        <span>✉️ {client.email}</span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-outline">Editar Ficha</button>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Calendar size={16} /> Agendar Mentoria
                    </button>
                </div>
            </div>

            <div className="tabs">
                {[
                    { id: 'resumo', label: 'Resumo & Dashboard' },
                    { id: 'onboarding', label: 'Trilha de Onboarding' },
                    { id: 'crm', label: 'CRM & Funil' },
                    { id: 'midia', label: 'Mídia & Performance' },
                    { id: 'tarefas', label: 'Tarefas da Equipe' },
                    { id: 'cofre', label: 'Docs & Senhas' }
                ].map(tab => (
                    <div
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            <div className="tab-content" style={{ marginTop: 24 }}>
                {activeTab === 'resumo' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="grid-cards">
                            <div className="card">
                                <div className="card-title">Início Contrato</div>
                                <div className="card-value" style={{ fontSize: '1.5rem' }}>{client.start}</div>
                            </div>
                            <div className="card">
                                <div className="card-title">Mensalidade (MRR)</div>
                                <div className="card-value" style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>{client.mrr}</div>
                            </div>
                            <div className="card">
                                <div className="card-title">Satisfação (NPS)</div>
                                <div className="card-value" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>{client.nps} / 10</div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Calendar size={18} /> Próximas Reuniões
                            </h3>
                            <table style={{ width: '100%' }}>
                                <thead><tr><th>Data</th><th>Título</th><th>Status</th><th>Link</th></tr></thead>
                                <tbody>
                                    <tr><td>22/02/2026</td><td>Alinhamento Quinzenal</td><td><span className="badge ativo" style={{ background: 'transparent', border: '1px solid var(--accent-color)' }}>Agendada</span></td><td><a href="#" style={{ color: 'var(--accent-color)' }}>Google Meet</a></td></tr>
                                    <tr><td>10/01/2026</td><td>Onboarding e Setup</td><td><span className="badge" style={{ backgroundColor: 'var(--success)', color: 'white' }}>Realizada</span></td><td>-</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ClientDetail;
