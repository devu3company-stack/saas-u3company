import { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import { Plus, CheckCircle, Clock, Calendar, AlertCircle, PlayCircle, StopCircle, User, LayoutGrid, List, Flag, Tag as TagIcon } from 'lucide-react';

const Tarefas = () => {
    const { user, usersList } = useAuth();

    const [tarefas, setTarefas] = useState(() => {
        const saved = localStorage.getItem('u3_tarefas');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, titulo: 'Ligar para Lead (Imobiliária)', descricao: 'Entrar em contato para fechar proposta final.', cliente: 'Imobiliária Prime', responsavel: 'SDR U3', dataEntrega: '2026-02-21', status: 'pendente', tempoExecucao: 0, iniciadaEm: null, prioridade: 'alta', tags: ['Vendas', 'Call'], cardColor: '#ffffff', referencias: '' },
            { id: 2, titulo: 'Ajustar Campanha Meta Ads', descricao: 'Otimizar o custo por lead (CPL)', cliente: 'AlphaTech Solutions', responsavel: 'GESTOR U3', dataEntrega: '2026-02-22', status: 'em_andamento', tempoExecucao: 1540, iniciadaEm: Date.now() - 1540000, prioridade: 'urgente', tags: ['Marketing', 'Ads'], cardColor: '#ffcccc', referencias: 'Ver drive de criativos' },
            { id: 3, titulo: 'Reunião Kickoff AlphaTech', descricao: 'Apresentar cronograma do projeto', cliente: 'AlphaTech Solutions', responsavel: 'CEO U3', dataEntrega: '2026-02-20', status: 'concluida', tempoExecucao: 3600, iniciadaEm: null, prioridade: 'normal', tags: ['Reunião', 'Onboarding'], cardColor: '#ccffcc', referencias: '' }
        ];
    });

    useEffect(() => {
        localStorage.setItem('u3_tarefas', JSON.stringify(tarefas));
    }, [tarefas]);

    const [clientes, setClientes] = useState(['Nenhum / Interno']);

    useEffect(() => {
        const savedClients = JSON.parse(localStorage.getItem('u3_clients_v2') || '[]');
        if (savedClients.length > 0) {
            setClientes(['Nenhum / Interno', ...savedClients.map(c => c.name)]);
        } else {
            setClientes(['Nenhum / Interno']);
        }
    }, []);

    const [modalOpen, setModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);
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

    const getPriorityColor = (prioridade) => {
        switch (prioridade) {
            case 'urgente': return 'var(--danger, #ef4444)';
            case 'alta': return 'var(--warning, #f59e0b)';
            case 'normal': return 'var(--info, #3b82f6)';
            case 'baixa': return 'var(--text-muted, #9ca3af)';
            default: return 'var(--text-muted, #9ca3af)';
        }
    };

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
            prioridade: form.prioridade.value,
            tags: form.tags.value.split(',').map(t => t.trim()).filter(t => t),
            status: 'pendente',
            tempoExecucao: 0,
            iniciadaEm: null,
            cardColor: form.cardColor?.value || 'transparent',
            referencias: form.referencias?.value || ''
        };
        setTarefas([novaTarefa, ...tarefas]);
        setModalOpen(false);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        const form = e.target;
        setTarefas(tarefas.map(t => {
            if (t.id === editTask.id) {
                return {
                    ...t,
                    titulo: form.titulo.value,
                    descricao: form.descricao.value,
                    cliente: form.cliente.value,
                    responsavel: form.responsavel.value,
                    dataEntrega: form.dataEntrega.value,
                    prioridade: form.prioridade.value,
                    tags: form.tags.value.split(',').map(t => t.trim()).filter(t => t),
                    cardColor: form.cardColor.value,
                    referencias: form.referencias.value
                };
            }
            return t;
        }));
        setEditTask(null);
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
                                    onClick={() => setEditTask(tarefa)}
                                    style={{
                                        padding: 16, margin: 0, cursor: 'grab', position: 'relative',
                                        borderTop: `6px solid ${tarefa.cardColor && tarefa.cardColor !== 'transparent' ? tarefa.cardColor : 'transparent'}`,
                                        border: tarefa.status === 'em_andamento' ? '1px solid var(--warning)' : '1px solid var(--border-color)',
                                        opacity: tarefa.status === 'concluida' ? 0.6 : 1
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-main)', display: 'inline-block', backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 4 }}>
                                            {tarefa.cliente}
                                        </div>
                                        {tarefa.prioridade && (
                                            <div title={`Prioridade ${tarefa.prioridade}`} style={{ color: getPriorityColor(tarefa.prioridade) }}>
                                                <Flag size={14} fill={getPriorityColor(tarefa.prioridade)} />
                                            </div>
                                        )}
                                    </div>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', textDecoration: tarefa.status === 'concluida' ? 'line-through' : 'none' }}>
                                        {tarefa.titulo}
                                    </h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.4 }}>
                                        {tarefa.descricao}
                                    </p>

                                    {tarefa.referencias && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)', padding: 8, borderRadius: 6, marginBottom: 12, border: '1px dashed var(--border-color)' }}>
                                            <strong>Ref/Obs:</strong> {tarefa.referencias}
                                        </div>
                                    )}

                                    {tarefa.tags && tarefa.tags.length > 0 && (
                                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                                            {tarefa.tags.map((tag, i) => (
                                                <span key={i} style={{ fontSize: '0.65rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                                                    <TagIcon size={10} /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginBottom: 12 }}>
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

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600 }}>
                                            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {tarefa.responsavel[0]}
                                            </div>
                                            {tarefa.responsavel}
                                        </div>

                                        {/* Ações Rápidas Kano */}
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {tarefa.status === 'pendente' && (
                                                <button onClick={(e) => { e.stopPropagation(); updateStatus(tarefa.id, 'em_andamento'); }} title="Iniciar" style={{ background: 'transparent', border: 'none', color: 'var(--warning)', cursor: 'pointer' }}>
                                                    <PlayCircle size={20} />
                                                </button>
                                            )}
                                            {tarefa.status === 'em_andamento' && (
                                                <button onClick={(e) => { e.stopPropagation(); updateStatus(tarefa.id, 'pendente'); }} title="Pausar" style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                                                    <StopCircle size={20} />
                                                </button>
                                            )}
                                            {tarefa.status !== 'concluida' && (
                                                <button onClick={(e) => { e.stopPropagation(); updateStatus(tarefa.id, 'concluida'); }} title="Concluir" style={{ background: 'transparent', border: 'none', color: 'var(--success)', cursor: 'pointer' }}>
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
                                    <th>Prioridade</th>
                                    <th>Prazo de Entrega</th>
                                    <th>Tempo Execução {user.role === 'ceo' && '(Visão CEO)'}</th>
                                    <th style={{ textAlign: 'right' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tarefas.map(tarefa => (
                                    <tr key={tarefa.id} style={{ opacity: tarefa.status === 'concluida' ? 0.6 : 1 }}>
                                        <td>
                                            <div style={{ fontWeight: 600, textDecoration: tarefa.status === 'concluida' ? 'line-through' : 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                {tarefa.titulo}
                                                {tarefa.tags && tarefa.tags.map((tag, i) => (
                                                    <span key={i} style={{ fontSize: '0.6rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: 12, fontWeight: 'normal', color: 'var(--text-muted)' }}>{tag}</span>
                                                ))}
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
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: getPriorityColor(tarefa.prioridade) }}>
                                                <Flag size={14} fill={getPriorityColor(tarefa.prioridade)} />
                                                {tarefa.prioridade ? tarefa.prioridade.charAt(0).toUpperCase() + tarefa.prioridade.slice(1) : '-'}
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
                                    {clientes.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="responsive-flex">
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Prioridade</label>
                                    <select name="prioridade" className="form-control" required defaultValue="normal">
                                        <option value="baixa">Baixa</option>
                                        <option value="normal">Normal</option>
                                        <option value="alta">Alta</option>
                                        <option value="urgente">Urgente</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Tags (separadas por vírgula)</label>
                                    <input name="tags" type="text" className="form-control" placeholder="Ex: design, call" />
                                </div>
                            </div>

                            <div className="responsive-flex">
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Atribuir para:</label>
                                    <select name="responsavel" className="form-control" required>
                                        {(usersList || []).filter(u => u.role !== 'cliente').map(u => (
                                            <option key={u.id} value={u.name}>{u.name} ({u.role.toUpperCase()})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ width: 150 }}>
                                    <label className="form-label">Entrega</label>
                                    <input name="dataEntrega" type="date" className="form-control" required />
                                </div>
                                <div className="form-group" style={{ width: 100 }}>
                                    <label className="form-label">Cor do Card</label>
                                    <input name="cardColor" type="color" className="form-control" defaultValue="#ffffff" style={{ height: 42, padding: 4 }} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Referências / Links / Anexos</label>
                                <textarea name="referencias" rows="2" className="form-control" placeholder="Links do drive, referências visuais, etc"></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Atribuir Tarefa</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Editar Tarefa */}
            {editTask && (
                <div onClick={() => setEditTask(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: 20 }}>
                    <div className="card" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 500 }}>
                        <h3 style={{ marginBottom: 24 }}>Editar Tarefa</h3>
                        <form onSubmit={handleSaveEdit}>
                            <div className="form-group">
                                <label className="form-label">Título da Tarefa</label>
                                <input name="titulo" type="text" className="form-control" defaultValue={editTask.titulo} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Descrição</label>
                                <textarea name="descricao" rows="2" className="form-control" defaultValue={editTask.descricao} required style={{ resize: 'none' }}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Cliente Referente</label>
                                <select name="cliente" className="form-control" defaultValue={editTask.cliente} required>
                                    {clientes.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="responsive-flex">
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Prioridade</label>
                                    <select name="prioridade" className="form-control" defaultValue={editTask.prioridade} required>
                                        <option value="baixa">Baixa</option>
                                        <option value="normal">Normal</option>
                                        <option value="alta">Alta</option>
                                        <option value="urgente">Urgente</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Tags</label>
                                    <input name="tags" type="text" className="form-control" defaultValue={(editTask.tags || []).join(', ')} />
                                </div>
                            </div>

                            <div className="responsive-flex">
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Responsável</label>
                                    <select name="responsavel" className="form-control" defaultValue={editTask.responsavel} required>
                                        {(usersList || []).filter(u => u.role !== 'cliente').map(u => (
                                            <option key={u.id} value={u.name}>{u.name} ({u.role.toUpperCase()})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ width: 140 }}>
                                    <label className="form-label">Entrega</label>
                                    <input name="dataEntrega" type="date" className="form-control" defaultValue={editTask.dataEntrega} required />
                                </div>
                                <div className="form-group" style={{ width: 80 }}>
                                    <label className="form-label">Cor</label>
                                    <input name="cardColor" type="color" className="form-control" defaultValue={editTask.cardColor || '#ffffff'} style={{ height: 42, padding: 4 }} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Referências / Links / Anexos</label>
                                <textarea name="referencias" rows="3" className="form-control" defaultValue={editTask.referencias} placeholder="Links do drive, referências visuais, etc"></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'space-between' }}>
                                <button type="button" className="btn btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => {
                                    setTarefas(tarefas.filter(t => t.id !== editTask.id));
                                    setEditTask(null);
                                }}>Excluir</button>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setEditTask(null)}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">Salvar Alterações</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Tarefas;
