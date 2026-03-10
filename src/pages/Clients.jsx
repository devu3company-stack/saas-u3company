import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Filter, Edit2, Trash2 } from 'lucide-react';

const Clients = () => {
    const location = useLocation();
    const [filter, setFilter] = useState('Todos');
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('new') === 'true') {
            setShowModal(true);
        }
    }, [location]);

    const [clients, setClients] = useState(() => {
        const saved = localStorage.getItem('u3_clients_v2');
        if (saved) return JSON.parse(saved);
        return [];
    });

    useEffect(() => {
        localStorage.setItem('u3_clients_v2', JSON.stringify(clients));
    }, [clients]);

    const handleSaveClient = (e) => {
        e.preventDefault();
        const form = e.target;

        if (editingClient) {
            // Atualizar cliente existente
            const updatedClients = clients.map(c => {
                if (c.id === editingClient.id) {
                    return {
                        ...c,
                        name: form.empresa.value,
                        contato: form.contato.value,
                        status: form.status.value,
                        mrr: form.mrr.value,
                        responsavel: form.responsavel.value
                    };
                }
                return c;
            });
            setClients(updatedClients);
        } else {
            // Criar novo
            const newClient = {
                id: Date.now(),
                name: form.empresa.value,
                contato: form.contato.value,
                status: 'ativo',
                mrr: form.mrr.value,
                responsavel: 'Admin'
            };
            setClients([newClient, ...clients]);
        }

        closeModal();
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Certeza que deseja excluir este cliente definitivamente? A ação não pode ser desfeita.')) {
            setClients(clients.filter(c => c.id !== id));
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingClient(null);
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
                    <button className="btn btn-primary" onClick={() => { setEditingClient(null); setShowModal(true); }}><Plus size={16} /> Novo Cliente</button>
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
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <Link to={`/clientes/${client.id}`} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                                Visão 360°
                                            </Link>
                                            <button className="btn btn-outline" style={{ padding: '6px' }} onClick={() => handleEdit(client)} title="Editar Cliente">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn btn-outline" style={{ padding: '6px', color: 'var(--danger)', borderColor: 'transparent' }} onClick={() => handleDelete(client.id)} title="Excluir">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modal Novo/Editar Cliente */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: 500 }}>
                        <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
                            {editingClient ? 'Editar Cliente' : 'Onboarding de Novo Cliente'}
                        </h3>
                        <form onSubmit={handleSaveClient}>
                            <div className="form-group">
                                <label className="form-label">Nome da Empresa</label>
                                <input name="empresa" type="text" className="form-control" required defaultValue={editingClient?.name} placeholder="Ex: Mega Empreendimentos" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Pessoa de Contato</label>
                                <input name="contato" type="text" className="form-control" required defaultValue={editingClient?.contato} placeholder="Ex: Ricardo (Diretor)" />
                            </div>

                            <div className="responsive-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Mensalidade (MRR)</label>
                                    <input name="mrr" type="text" className="form-control" required defaultValue={editingClient?.mrr} placeholder="R$ 3.500" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    {editingClient ? (
                                        <select name="status" className="form-control" defaultValue={editingClient.status}>
                                            <option value="ativo">Ativo</option>
                                            <option value="pausado">Pausado</option>
                                            <option value="cancelado">Cancelado</option>
                                        </select>
                                    ) : (
                                        <input type="text" className="form-control" value="Ativo" disabled />
                                    )}
                                </div>
                            </div>

                            {editingClient && (
                                <div className="form-group">
                                    <label className="form-label">Responsável da Conta</label>
                                    <input name="responsavel" type="text" className="form-control" required defaultValue={editingClient?.responsavel} />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: 12, marginTop: 32, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">{editingClient ? 'Salvar Alterações' : 'Salvar e Iniciar Onboarding'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clients;
