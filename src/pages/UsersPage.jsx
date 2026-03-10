import { useState } from 'react';
import { useAuth } from '../utils/auth';
import { UserPlus, Shield, Trash2, ShieldAlert } from 'lucide-react';

const UsersPage = () => {
    const { usersList, createUser, deleteUser, user: currentUser } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleCreateUser = (e) => {
        e.preventDefault();
        setErrorMsg('');
        const form = e.target;
        const newUser = {
            email: form.email.value,
            password: form.password.value,
            name: form.name.value,
            role: form.role.value
        };

        if (usersList.some(u => u.email === newUser.email)) {
            setErrorMsg('E-mail já está em uso.');
            return;
        }

        createUser(newUser);
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja remover este usuário?')) {
            const res = deleteUser(id);
            if (!res.success) {
                alert(res.error);
            }
        }
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2>Equipe e Acessos</h2>
                    <p className="text-muted">Gerencie quem tem acesso à plataforma e suas permissões</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <UserPlus size={16} /> Novo Usuário
                </button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome & Contato</th>
                                <th>E-mail (Login)</th>
                                <th>Nível de Acesso</th>
                                <th style={{ textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.map(member => (
                                <tr key={member.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-main)' }}>
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{ fontWeight: 600 }}>{member.name}</div>
                                        </div>
                                    </td>
                                    <td>{member.email}</td>
                                    <td>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            padding: '4px 10px', borderRadius: 16, fontSize: '0.8rem', fontWeight: 600,
                                            backgroundColor: member.role === 'ceo' ? 'rgba(168, 85, 247, 0.1)' : 'var(--bg-tertiary)',
                                            color: member.role === 'ceo' ? '#a855f7' : 'var(--text-main)'
                                        }}>
                                            {member.role === 'ceo' ? <ShieldAlert size={14} /> : <Shield size={14} />}
                                            {member.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {member.id !== 1 && member.id !== 2 && member.id !== currentUser.id && (
                                            <button className="btn btn-outline" style={{ padding: '6px 10px', color: 'var(--danger)', borderColor: 'transparent' }} onClick={() => handleDelete(member.id)} title="Excluir Usuário">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Novo Usuário */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: 450 }}>
                        <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>Adicionar Membro</h3>
                        {errorMsg && <div style={{ color: 'var(--danger)', marginBottom: 16, fontSize: '0.85rem' }}>{errorMsg}</div>}

                        <form onSubmit={handleCreateUser}>
                            <div className="form-group">
                                <label className="form-label">Nome Completo</label>
                                <input name="name" type="text" className="form-control" required placeholder="Ex: João Silva" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">E-mail de Acesso</label>
                                <input name="email" type="email" className="form-control" required placeholder="joao@empresa.com" />
                            </div>
                            <div className="responsive-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Senha Provisória</label>
                                    <input name="password" type="text" className="form-control" required placeholder="Senha123" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Cargo (Nível)</label>
                                    <select name="role" className="form-control" required>
                                        <option value="gestor">Gestor Geral</option>
                                        <option value="financeiro">Financeiro</option>
                                        <option value="sdr">Atendimento (SDR)</option>
                                        <option value="designer">Designer / Especialista</option>
                                        <option value="cliente">Cliente Externo (Apenas Visualização)</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 32, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Criar Usuário</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
