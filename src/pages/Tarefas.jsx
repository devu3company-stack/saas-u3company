import { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import { Plus, CheckCircle, Clock, Calendar, AlertCircle, PlayCircle, StopCircle, User, LayoutGrid, List } from 'lucide-react';

const Tarefas = () => {
    const { user, USERS } = useAuth();

    // Mock inicial das tarefas
    const [tarefas, setTarefas] = useState([
        { id: 1, titulo: 'Ligar para Lead (Imobiliária)', descricao: 'Entrar em contato para fechar proposta final.', cliente: 'Imobiliária Prime', responsavel: 'SDR U3', dataEntrega: '2026-02-21', status: 'pendente', tempoExecucao: 0, iniciadaEm: null },
        { id: 2, titulo: 'Ajustar Campanha Meta Ads', descricao: 'Otimizar o custo por lead (CPL)', cliente: 'AlphaTech Solutions', responsavel: 'GESTOR U3', dataEntrega: '2026-02-22', status: 'em_andamento', tempoExecucao: 1540, iniciadaEm: Date.now() - 1540000 },
        { id: 3, titulo: 'Reunião Kickoff AlphaTech', descricao: 'Apresentar cronograma do projeto', cliente: 'AlphaTech Solutions', responsavel: 'CEO U3', dataEntrega: '2026-02-20', status: 'concluida', tempoExecucao: 3600, iniciadaEm: null }
    ]);

    const clientesMock = ['AlphaTech Solutions', 'Imobiliária Prime', 'Construtora Silva', 'Nenhum / Interno'];

    const [modalOpen, setModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('kanban'); // 'list' ou 'kanban'

    // Timer para atualizar o tempo na tela se estiver em andamento
    useEffect(() => {
        const interval = setInterval(() => {
            setTarefas(current => current.map(t => {
                if (t.status === 'em_andamento' && t.iniciadaEm) {
                    return { ...t, tempoExecucao: Math.floor((Date.now() - t.iniciadaEm) / 1000) };
                }
                return t;
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
    };

    const handleCreateTask = (e) => {
        e.preventDefault();
        const form = e.target;
        const novaTarefa = {
            id: Date.now(),
            titulo: form.titulo.value,
            descricao: form.descricao.value,
            cliente: form.cliente.value,
            responsavel: form.responsavel.value,
            dataEntrega: form.dataEntrega.value,
            status: 'pendente',
            tempoExecucao: 0,
            iniciadaEm: null
        };
        setTarefas([novaTarefa, ...tarefas]);
        setModalOpen(false);
    };

    const updateStatus = (id, newStatus) => {
        setTarefas(tarefas.map(t => {
            if (t.id === id) {
                if (newStatus === 'em_andamento' && t.status !== 'em_andamento') {
                    const offset = t.tempoExecucao * 1000;
                    return { ...t, status: newStatus, iniciadaEm: Date.now() - offset };
                }
                if (t.status === 'em_andamento' && newStatus !== 'em_andamento') {
                    return { ...t, status: newStatus, iniciadaEm: null };
                }
                return { ...t, status: newStatus };
            }
            return t;
        }));
    };

    // --- Lógica Drag & Drop ---
    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetStatus) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('taskId'));
        if (taskId) {
            updateStatus(taskId, targetStatus);
        }
    };

    const columns = [
        { id: 'pendente', title: 'A Fazer / Pendentes', color: 'var(--border-color)', textColor: 'var(--text-main)' },
        { id: 'em_andamento', title: 'Em Andamento', color: 'var(--warning)', textColor: 'black' },
        { id: 'concluida', title: 'Concluídas', color: 'var(--success)', textColor: 'white' },
    ];

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2>Gestão de Tarefas</h2>
                    <p className="text-muted">Acompanhe as execuções e prazos do time</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ display: 'flex', backgroundColor: 'var(--bg-tertiary)', padding: 4, borderRadius: 8 }}>
                        <button
                            style={{
                                background: viewMode === 'kanban' ? 'var(--bg-secondary)' : 'transparent',
                                border: 'none', padding: '6px 12px', borderRadius: 6, color: viewMode === 'kanban' ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                            }}
                            onClick={() => setViewMode('kanban')}
                        >
                            <LayoutGrid size={16} /> Kanban
                        </button>
                        <button
                            style={{
                                background: viewMode === 'list' ? 'var(--bg-secondary)' : 'transparent',
                                border: 'none', padding: '6px 12px', borderRadius: 6, color: viewMode === 'list' ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                            }}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={16} /> Lista
                        </button>
                    </div>

                    {(user.role === 'ceo' || user.role === 'gestor') && (
                        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                            <Plus size={16} /> Nova Tarefa
                        </button>
                    )}
                </div>
            </div>

            {viewMode === 'kanban' ? (
                /* VISÃO KANBAN */
                <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 16, alignItems: 'flex-start' }}>
                    {columns.map(col => (
                        <div
                            key={col.id}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, col.id)}
                            style={{
                                flex: '1', minWidth: 320, backgroundColor: 'var(--bg-tertiary)', borderRadius: 12, padding: 16,
                                display: 'flex', flexDirection: 'column', gap: 16, height: 'calc(100vh - 220px)', overflowY: 'auto'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '0.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ display: 'block', width: 10, height: 10, borderRadius: '50%', backgroundColor: col.color }}></span>
                                    {col.title}
                                </h3>
                                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>
                                    {tarefas.filter(t => t.status === col.id).length}
                                </span>
                            </div>

                            {tarefas.filter(t => t.status === col.id).map(tarefa => (
                                <div
                                    key={tarefa.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, tarefa.id)}
                                    className="card"
                                    style={{
                                        padding: 16, margin: 0, cursor: 'grab', position: 'relative',
                                        border: tarefa.status === 'em_andamento' ? '1px solid var(--warning)' : '1px solid transparent',
                                        opacity: tarefa.status === 'concluida' ? 0.6 : 1
                                    }}
                                >
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-main)', marginBottom: 8, display: 'inline-block', backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 4 }}>
                                        {tarefa.cliente}
                                    </div>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', textDecoration: tarefa.status === 'concluida' ? 'line-through' : 'none' }}>
                                        {tarefa.titulo}
                                    </h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.4 }}>
                                        {tarefa.descricao}
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                                            <Calendar size={12} /> {tarefa.dataEntrega.split('-').reverse().join('/')}
                                        </div>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 4, fontWeight: 'bold',
                                            color: tarefa.status === 'em_andamento' ? 'var(--warning)' : 'var(--text-main)'
                                        }}>
                                            <Clock size={12} /> {formatTime(tarefa.tempoExecucao)}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600 }}>
                                            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {tarefa.responsavel[0]}
                                            </div>
                                            {tarefa.responsavel}
                                        </div>

                                        {/* Ações Rápidas Kano */}
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {tarefa.status === 'pendente' && (
                                                <button onClick={() => updateStatus(tarefa.id, 'em_andamento')} title="Iniciar" style={{ background: 'transparent', border: 'none', color: 'var(--warning)', cursor: 'pointer' }}>
                                                    <PlayCircle size={20} />
                                                </button>
                                            )}
                                            {tarefa.status === 'em_andamento' && (
                                                <button onClick={() => updateStatus(tarefa.id, 'pendente')} title="Pausar" style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                                                    <StopCircle size={20} />
                                                </button>
                                            )}
                                            {tarefa.status !== 'concluida' && (
                                                <button onClick={() => updateStatus(tarefa.id, 'concluida')} title="Concluir" style={{ background: 'transparent', border: 'none', color: 'var(--success)', cursor: 'pointer' }}>
                                                    <CheckCircle size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {tarefas.filter(t => t.status === col.id).length === 0 && (
                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: 24, border: '2px dashed var(--border-color)', borderRadius: 8 }}>
                                    Nenhuma tarefa aqui.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                /* VISÃO LISTA / TABELA */
                <>
                    <div className="grid-cards">
                        <div className="card">
                            <div className="card-title">Tarefas Pendentes</div>
                            <div className="card-value">{tarefas.filter(t => t.status === 'pendente').length}</div>
                        </div>
                        <div className="card">
                            <div className="card-title">Em Execução</div>
                            <div className="card-value" style={{ color: 'var(--warning)' }}>{tarefas.filter(t => t.status === 'em_andamento').length}</div>
                        </div>
                        <div className="card">
                            <div className="card-title">Concluídas</div>
                            <div className="card-value" style={{ color: 'var(--success)' }}>{tarefas.filter(t => t.status === 'concluida').length}</div>
                        </div>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tarefa / Responsável</th>
                                    <th>Prazo de Entrega</th>
                                    <th>Tempo Execução {user.role === 'ceo' && '(Visão CEO)'}</th>
                                    <th style={{ textAlign: 'right' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tarefas.map(tarefa => (
                                    <tr key={tarefa.id} style={{ opacity: tarefa.status === 'concluida' ? 0.6 : 1 }}>
                                        <td>
                                            <div style={{ fontWeight: 600, textDecoration: tarefa.status === 'concluida' ? 'line-through' : 'none' }}>
                                                {tarefa.titulo}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                                {tarefa.descricao}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
                                                <span style={{ backgroundColor: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: 4 }}>
                                                    {tarefa.cliente}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <User size={12} /> {tarefa.responsavel}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                                                <Calendar size={14} color="var(--text-muted)" />
                                                {tarefa.dataEntrega.split('-').reverse().join('/')}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: 6,
                                                color: tarefa.status === 'em_andamento' ? 'var(--warning)' : 'var(--text-main)',
                                                fontWeight: tarefa.status === 'em_andamento' ? 700 : 500
                                            }}>
                                                <Clock size={16} />
                                                {formatTime(tarefa.tempoExecucao)}
                                                {tarefa.status === 'em_andamento' && <span style={{ fontSize: '0.7rem' }}>(Gravando...)</span>}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                {tarefa.status !== 'concluida' && tarefa.status !== 'em_andamento' && (
                                                    <button className="btn btn-outline" style={{ padding: '6px 12px', borderColor: 'var(--warning)', color: 'var(--warning)' }}
                                                        onClick={() => updateStatus(tarefa.id, 'em_andamento')}>
                                                        <PlayCircle size={16} /> Iniciar
                                                    </button>
                                                )}

                                                {tarefa.status === 'em_andamento' && (
                                                    <button className="btn btn-outline" style={{ padding: '6px 12px', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                                        onClick={() => updateStatus(tarefa.id, 'pendente')}>
                                                        <StopCircle size={16} /> Pausar
                                                    </button>
                                                )}

                                                {tarefa.status !== 'concluida' && (
                                                    <button className="btn btn-primary" style={{ padding: '6px 12px', backgroundColor: 'var(--success)', color: 'white' }}
                                                        onClick={() => updateStatus(tarefa.id, 'concluida')}>
                                                        <CheckCircle size={16} /> Finalizar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Modal Criar Tarefa */}
            {modalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: 400 }}>
                        <h3 style={{ marginBottom: 24 }}>Criar Nova Tarefa</h3>
                        <form onSubmit={handleCreateTask}>
                            <div className="form-group">
                                <label className="form-label">Título da Tarefa</label>
                                <input name="titulo" type="text" className="form-control" required autoFocus />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Descrição</label>
                                <textarea name="descricao" rows="2" className="form-control" required style={{ resize: 'none' }}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Cliente Referente</label>
                                <select name="cliente" className="form-control" required>
                                    {clientesMock.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: 16 }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Atribuir para:</label>
                                    <select name="responsavel" className="form-control" required>
                                        {USERS.filter(u => u.role !== 'cliente').map(u => (
                                            <option key={u.id} value={u.name}>{u.name} ({u.role.toUpperCase()})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ width: 150 }}>
                                    <label className="form-label">Entrega</label>
                                    <input name="dataEntrega" type="date" className="form-control" required />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Atribuir Tarefa</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Tarefas;
