import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';

const Clients = () => {
    const location = useLocation();
    const [filter, setFilter] = useState('Todos');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('new') === 'true') {
            setShowModal(true);
        }
    }, [location]);

    const [clients, setClients] = useState(() => {
        const saved = localStorage.getItem('u3_clients');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, name: 'AlphaTech Solutions', contato: 'Carlos Silva', status: 'ativo', mrr: 'R$ 2.500', responsavel: 'Admin' },
            { id: 2, name: 'Imobiliária Prime', contato: 'Fernanda Lima', status: 'ativo', mrr: 'R$ 3.000', responsavel: 'Gestor' },
            { id: 3, name: 'Boutique Fashion', contato: 'Roberto Mendes', status: 'pausado', mrr: 'R$ 1.200', responsavel: 'Admin' },
            { id: 4, name: 'Construtora Silva', contato: 'Joana', status: 'ativo', mrr: 'R$ 5.500', responsavel: 'Admin' },
            { id: 5, name: 'Dental Care Clínica', contato: 'Dr. Marcos', status: 'cancelado', mrr: 'R$ 2.000', responsavel: 'Gestor' }
        ];
    });

    useEffect(() => {
        localStorage.setItem('u3_clients', JSON.stringify(clients));
    }, [clients]);

    const handleCreateClient = (e) => {
        e.preventDefault();
        const form = e.target;
        const newClient = {
            id: Date.now(),
            name: form.empresa.value,
            contato: form.contato.value,
            status: 'ativo', // novo cliente entra ativo no onboarding
            mrr: form.mrr.value,
            responsavel: 'Admin' // padrão
        };
        setClients([newClient, ...clients]);
        setShowModal(false);
    };

    const filtered = filter === 'Todos' ? clients : clients.filter(c => c.status === filter.toLowerCase());

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Clientes</h2>
                    <p className="text-muted">Gerencie a carteira de clientes</p>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Novo Cliente</button>
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '16px 24px', display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)' }}>
                    <Filter size={20} color="var(--text-muted)" style={{ marginRight: 8 }} />
                    {['Todos', 'Ativo', 'Pausado', 'Cancelado'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '4px 12px',
                                borderRadius: '16px',
                                backgroundColor: filter === f ? 'var(--bg-tertiary)' : 'transparent',
                                color: filter === f ? 'var(--text-main)' : 'var(--text-muted)',
                                border: `1px solid ${filter === f ? 'var(--border-color)' : 'transparent'}`
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Empresa</th>
                                <th>Contato</th>
                                <th>Status</th>
                                <th>Mensalidade</th>
                                <th>Responsável</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(client => (
                                <tr key={client.id}>
                                    <td style={{ fontWeight: 600 }}>{client.name}</td>
                                    <td>{client.contato}</td>
                                    <td>
                                        <span className={`badge ${client.status}`}>{client.status.toUpperCase()}</span>
                                    </td>
                                    <td>{client.mrr}</td>
                                    <td>{client.responsavel}</td>
                                    <td>
                                        <Link to={`/clientes/${client.id}`} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                            Visão 360°
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modal Novo Cliente */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: 500 }}>
                        <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>Onboarding de Novo Cliente</h3>
                        <form onSubmit={handleCreateClient}>
                            <div className="form-group">
                                <label className="form-label">Nome da Empresa</label>
                                <input name="empresa" type="text" className="form-control" required placeholder="Ex: Mega Empreendimentos" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Pessoa de Contato</label>
                                <input name="contato" type="text" className="form-control" required placeholder="Ex: Ricardo (Diretor)" />
                            </div>
                            <div className="responsive-grid-2">
                                <div className="form-group">
                                    <label className="form-label">WhatsApp</label>
                                    <input name="whatsapp" type="text" className="form-control" required placeholder="(11) 99999-9999" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Mensalidade (MRR Target)</label>
                                    <input name="mrr" type="text" className="form-control" required placeholder="R$ 3.500" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 32, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Salvar e Iniciar Onboarding</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clients;
