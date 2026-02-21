import { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import { Plus, CheckCircle, Clock, Calendar, AlertCircle, PlayCircle, StopCircle, User } from 'lucide-react';

const Tarefas = () => {
    const { user, USERS } = useAuth();

    // Mock inicial das tarefas
    const [tarefas, setTarefas] = useState([
        { id: 1, titulo: 'Ligar para Lead (Imobiliária)', responsavel: 'SDR U3', dataEntrega: '2026-02-21', status: 'pendente', tempoExecucao: 0, iniciadaEm: null },
        { id: 2, titulo: 'Ajustar Campanha Meta Ads', responsavel: 'GESTOR U3', dataEntrega: '2026-02-22', status: 'em_andamento', tempoExecucao: 1540, iniciadaEm: Date.now() - 1540000 },
        { id: 3, titulo: 'Reunião Kickoff AlphaTech', responsavel: 'CEO U3', dataEntrega: '2026-02-20', status: 'concluida', tempoExecucao: 3600, iniciadaEm: null }
    ]);

    const [modalOpen, setModalOpen] = useState(false);

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
            responsavel: form.responsavel.value,
            dataEntrega: form.dataEntrega.value,
            status: 'pendente',
            tempoExecucao: 0,
            iniciadaEm: null
        };
        setTarefas([novaTarefa, ...tarefas]);
        setModalOpen(false);
    };

    const toggleStatus = (id, newStatus) => {
        setTarefas(tarefas.map(t => {
            if (t.id === id) {
                if (newStatus === 'em_andamento') {
                    // Se foi pausada antes, ajustamos o 'iniciadaEm' para manter o progresso salvo
                    const offset = t.tempoExecucao * 1000;
                    return { ...t, status: newStatus, iniciadaEm: Date.now() - offset };
                }
                if (newStatus === 'concluida' || newStatus === 'pendente') {
                    return { ...t, status: newStatus, iniciadaEm: null }; // Para o relógio
                }
            }
            return t;
        }));
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Gestão de Tarefas</h2>
                    <p className="text-muted">Acompanhe as execuções e prazos do time</p>
                </div>
                {(user.role === 'ceo' || user.role === 'gestor') && (
                    <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                        <Plus size={16} /> Nova Tarefa
                    </button>
                )}
            </div>

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
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                        <User size={12} /> {tarefa.responsavel}
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
                                                onClick={() => toggleStatus(tarefa.id, 'em_andamento')}>
                                                <PlayCircle size={16} /> Iniciar
                                            </button>
                                        )}

                                        {tarefa.status === 'em_andamento' && (
                                            <button className="btn btn-outline" style={{ padding: '6px 12px', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                                onClick={() => toggleStatus(tarefa.id, 'pendente')}>
                                                <StopCircle size={16} /> Pausar
                                            </button>
                                        )}

                                        {tarefa.status !== 'concluida' && (
                                            <button className="btn btn-primary" style={{ padding: '6px 12px', backgroundColor: 'var(--success)', color: 'white' }}
                                                onClick={() => toggleStatus(tarefa.id, 'concluida')}>
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

            {/* Modal Criar Tarefa */}
            {modalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: 400 }}>
                        <h3 style={{ marginBottom: 24 }}>Criar Nova Tarefa</h3>
                        <form onSubmit={handleCreateTask}>
                            <div className="form-group">
                                <label className="form-label">Título da Tarefa</label>
                                <input name="titulo" type="text" className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Atribuir para:</label>
                                <select name="responsavel" className="form-control" required>
                                    {USERS.filter(u => u.role !== 'cliente').map(u => (
                                        <option key={u.id} value={u.name}>{u.name} ({u.role.toUpperCase()})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Data de Entrega</label>
                                <input name="dataEntrega" type="date" className="form-control" required />
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
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
