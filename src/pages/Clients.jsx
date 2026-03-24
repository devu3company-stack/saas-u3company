import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Filter, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../utils/auth';
import { useSyncedData } from '../utils/useSyncedData';

const Clients = () => {
    const { user } = useAuth();
    const isDesigner = user?.role === 'designer';
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

    const [clients, saveClients] = useSyncedData('u3_clients_v2', []);

    const parseMrr = (mrr) => {
        return parseFloat(String(mrr || '0').replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleSaveClient = (e) => {
        e.preventDefault();
        const form = e.target;
        const tempoContrato = Number(form.tempoContrato.value) || 1;

        if (editingClient) {
            const newList = clients.map(c => {
                if (c.id === editingClient.id) {
                    return {
                        ...c,
                        name: form.empresa.value,
                        contato: form.contato.value,
                        status: form.status.value,
                        mrr: form.mrr.value,
                        responsavel: form.responsavel.value,
                        tempoContrato: tempoContrato,
                        ltv: parseMrr(form.mrr.value) * tempoContrato
                    };
                }
                return c;
            });
            saveClients(newList);
        } else {
            const mrrValue = form.mrr.value;
            const newClient = {
                id: Date.now(),
                name: form.empresa.value,
                contato: form.contato.value,
                status: 'ativo',
                mrr: mrrValue,
                responsavel: 'Admin',
                tempoContrato: tempoContrato,
                ltv: parseMrr(mrrValue) * tempoContrato
            };
            saveClients([newClient, ...clients]);
        }

        closeModal();
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Certeza que deseja excluir este cliente definitivamente? A ação não pode ser desfeita.')) {
            saveClients(clients.filter(c => c.id !== id));
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
                <div className="filter-bar" style={{ padding: '16px 24px', display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
                    <Filter size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['Todos', 'Ativo', 'Pausado', 'Cancelado'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: '20px',
                                    backgroundColor: filter === f ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                                    color: filter === f ? 'var(--bg-primary)' : 'var(--text-muted)',
                                    border: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                    {/* Versão Desktop (Tabela) */}
                    <table className="hide-mobile">
                        <thead>
                            <tr>
                                <th>Empresa</th>
                                <th>Contato</th>
                                <th>Status</th>
                                {!isDesigner && <th>Mensalidade</th>}
                                {!isDesigner && <th>Contrato</th>}
                                {!isDesigner && <th>LTV</th>}
                                <th>Responsável</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(client => {
                                const mrrNum = parseMrr(client.mrr);
                                const tempo = client.tempoContrato || 1;
                                const ltv = client.ltv || mrrNum * tempo;
                                return (
                                    <tr key={client.id}>
                                        <td style={{ fontWeight: 600 }}>{client.name}</td>
                                        <td>{client.contato}</td>
                                        <td>
                                            <span className={`badge ${client.status}`}>{client.status.toUpperCase()}</span>
                                        </td>
                                        {!isDesigner && <td>{client.mrr}</td>}
                                        {!isDesigner && <td>{tempo} {tempo === 1 ? 'mês' : 'meses'}</td>}
                                        {!isDesigner && (
                                            <td>
                                                <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                                                    {formatCurrency(ltv)}
                                                </span>
                                            </td>
                                        )}
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
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Mobile Card Version */}
                    <div className="show-mobile-only" style={{ padding: 16 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {filtered.map(client => (
                                <div key={client.id} className="card" style={{ padding: 16, borderLeft: `4px solid ${client.status === 'ativo' ? 'var(--success)' : client.status === 'pausado' ? 'var(--text-muted)' : 'var(--danger)'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{client.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                👤 {client.responsavel}
                                            </div>
                                        </div>
                                        <span className={`badge ${client.status}`} style={{ fontSize: '0.6rem', padding: '4px 8px' }}>
                                            {client.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div style={{ padding: '12px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ color: 'var(--text-muted)', width: 60 }}>Contato:</span> <span>{client.contato}</span>
                                        </div>
                                        {!isDesigner && (
                                            <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ color: 'var(--text-muted)', width: 60 }}>Valor:</span>
                                                <span style={{ fontWeight: 700, color: 'var(--success)' }}>{client.mrr}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <Link to={`/clientes/${client.id}`} className="btn btn-primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', justifyContent: 'center' }}>
                                            Visão 360°
                                        </Link>
                                        <button
                                            className="btn btn-outline"
                                            style={{ padding: '10px 14px' }}
                                            onClick={() => handleEdit(client)}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filtered.length === 0 && (
                                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                                    Nenhum cliente encontrado.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Novo/Editar Cliente */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000, padding: 20, overflowY: 'auto'
                }}>
                    <div className="card modal-content" style={{ width: '100%', maxWidth: 500 }}>
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
                                    <label className="form-label">Tempo de Contrato (meses)</label>
                                    <input name="tempoContrato" type="number" className="form-control" required min="1" defaultValue={editingClient?.tempoContrato || 12} placeholder="12" />
                                </div>
                            </div>

                            <div style={{ padding: 12, backgroundColor: 'rgba(0, 208, 132, 0.08)', borderRadius: 8, border: '1px solid rgba(0, 208, 132, 0.2)', marginBottom: 16 }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>LTV Estimado (Mensalidade × Meses)</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>
                                    {formatCurrency(parseMrr(editingClient?.mrr || '0') * (editingClient?.tempoContrato || 12))}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                    💡 Calculado automaticamente ao salvar
                                </div>
                            </div>

                            <div className="responsive-grid-2">
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
                                {editingClient && (
                                    <div className="form-group">
                                        <label className="form-label">Responsável da Conta</label>
                                        <input name="responsavel" type="text" className="form-control" required defaultValue={editingClient?.responsavel} />
                                    </div>
                                )}
                            </div>

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
