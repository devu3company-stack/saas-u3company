import { useState } from 'react';
import { useAuth } from '../utils/auth';
import { UserPlus, Shield, Trash2, ShieldAlert, Edit2, KeyRound, Building2 } from 'lucide-react';

const ROLE_LABELS = {
    ceo: 'CEO / Admin',
    gestor: 'Gestor Geral',
    financeiro: 'Financeiro',
    sdr: 'Atendimento (SDR)',
    designer: 'Designer / Especialista',
    cliente_admin: 'Administrador do Cliente',
    cliente: 'Cliente Externo'
};

const UsersPage = () => {
    const { usersList, createUser, deleteUser, updateUser, getUserPermissions, user: currentUser, PERMISSIONS, ALL_ROUTES } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [selectedRole, setSelectedRole] = useState('gestor');
    const [selectedPerms, setSelectedPerms] = useState(PERMISSIONS['gestor'] || []);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetUser, setResetUser] = useState(null);
    const [filterType, setFilterType] = useState('todos'); // 'todos', 'matriz', 'tenants'

    const isCeo = currentUser?.role === 'ceo';

    const openCreateModal = () => {
        setEditingUser(null);
        setSelectedRole('gestor');
        setSelectedPerms([...(PERMISSIONS['gestor'] || [])]);
        setErrorMsg('');
        setShowModal(true);
    };

    const openEditModal = (member) => {
        setEditingUser(member);
        setSelectedRole(member.role);
        const perms = getUserPermissions(member);
        setSelectedPerms([...perms]);
        setErrorMsg('');
        setShowModal(true);
    };

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        setSelectedPerms([...(PERMISSIONS[role] || [])]);
    };

    const togglePerm = (path) => {
        setSelectedPerms(prev =>
            prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        const form = e.target;

        if (editingUser) {
            updateUser(editingUser.id, {
                name: form.name.value,
                role: selectedRole,
                customPermissions: selectedPerms
            });
            setShowModal(false);
        } else {
            const email = form.email.value;
            if (usersList.some(u => u.email === email)) {
                setErrorMsg('E-mail já está em uso.');
                return;
            }
            createUser({
                email,
                password: form.password.value,
                name: form.name.value,
                role: selectedRole,
                customPermissions: selectedPerms
            });
            setShowModal(false);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja remover este usuário?')) {
            const res = deleteUser(id);
            if (!res.success) {
                alert(res.error);
            }
        }
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        const newPassword = e.target.newPassword.value;
        if (!newPassword || newPassword.length < 3) {
            alert('A senha deve ter pelo menos 3 caracteres.');
            return;
        }
        updateUser(resetUser.id, { password: newPassword });
        setShowResetModal(false);
        setResetUser(null);
        alert(`Senha de ${resetUser.name} redefinida com sucesso!`);
    };

    // Filtragem dos usuários na tabela
    const displayedUsers = usersList.filter(u => {
        if (currentUser.role === 'cliente_admin' || currentUser.tenantId) {
            const myTenantId = currentUser.tenantId || currentUser.id;
            return u.id === myTenantId || u.tenantId === myTenantId;
        }
        // CEO e matriz
        if (filterType === 'matriz') return !u.tenantId && u.role !== 'cliente_admin';
        if (filterType === 'tenants') return u.tenantId || u.role === 'cliente_admin';
        return true; // 'todos'
    });

    // Conta clientes admin para exibir nos filtros
    const totalMatriz = usersList.filter(u => !u.tenantId && u.role !== 'cliente_admin').length;
    const totalTenants = usersList.filter(u => u.tenantId || u.role === 'cliente_admin').length;

    // Encontra o nome do tenant pai
    const getTenantOwnerName = (member) => {
        if (member.role === 'cliente_admin') return member.name;
        if (member.tenantId) {
            const owner = usersList.find(u => u.id === member.tenantId);
            return owner ? owner.name : `Tenant #${member.tenantId}`;
        }
        return null;
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2>Equipe e Acessos</h2>
                    <p className="text-muted">Gerencie quem tem acesso à plataforma e suas permissões</p>
                </div>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    <UserPlus size={16} /> Novo Usuário
                </button>
            </div>

            {/* Filtros (só para CEO) */}
            {isCeo && totalTenants > 0 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                    {[
                        { key: 'todos', label: `Todos (${usersList.length})` },
                        { key: 'matriz', label: `Equipe Matriz (${totalMatriz})` },
                        { key: 'tenants', label: `Clientes Admin (${totalTenants})` }
                    ].map(f => (
                        <button
                            key={f.key}
                            className={`btn ${filterType === f.key ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                            onClick={() => setFilterType(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="card" style={{ padding: 0 }}>
                <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome & Contato</th>
                                <th>E-mail (Login)</th>
                                <th>Nível de Acesso</th>
                                {isCeo && <th>Empresa / Tenant</th>}
                                <th>Permissões</th>
                                <th style={{ textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedUsers.map(member => {
                                const perms = getUserPermissions(member);
                                const tenantName = getTenantOwnerName(member);
                                const isClienteAdmin = member.role === 'cliente_admin';
                                const isTenantMember = !!member.tenantId;
                                return (
                                    <tr key={member.id} style={{
                                        backgroundColor: isClienteAdmin ? 'rgba(168, 85, 247, 0.03)' : 'transparent'
                                    }}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: '50%',
                                                    backgroundColor: isClienteAdmin ? 'rgba(168, 85, 247, 0.15)' : 'var(--bg-tertiary)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 'bold', color: isClienteAdmin ? '#a855f7' : 'var(--text-main)'
                                                }}>
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
                                                backgroundColor: member.role === 'ceo' ? 'rgba(168, 85, 247, 0.1)' : isClienteAdmin ? 'rgba(0, 208, 132, 0.1)' : 'var(--bg-tertiary)',
                                                color: member.role === 'ceo' ? '#a855f7' : isClienteAdmin ? 'var(--success)' : 'var(--text-main)'
                                            }}>
                                                {member.role === 'ceo' ? <ShieldAlert size={14} /> : isClienteAdmin ? <Building2 size={14} /> : <Shield size={14} />}
                                                {ROLE_LABELS[member.role] || member.role.toUpperCase()}
                                            </span>
                                        </td>
                                        {isCeo && (
                                            <td>
                                                {tenantName ? (
                                                    <span style={{ fontSize: '0.8rem', color: isClienteAdmin ? 'var(--success)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <Building2 size={12} />
                                                        {isClienteAdmin ? tenantName : `Sub de ${tenantName}`}
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Equipe Matriz</span>
                                                )}
                                            </td>
                                        )}
                                        <td>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 220, lineHeight: 1.6 }}>
                                                {perms.length} abas liberadas
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                                                <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => openEditModal(member)} title="Editar Permissões">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    className="btn btn-outline"
                                                    style={{ padding: '6px 10px', color: 'var(--warning)', borderColor: 'transparent' }}
                                                    onClick={() => { setResetUser(member); setShowResetModal(true); }}
                                                    title="Resetar Senha"
                                                >
                                                    <KeyRound size={14} />
                                                </button>
                                                {member.id !== 1 && member.id !== 2 && member.id !== currentUser.id && (
                                                    <button className="btn btn-outline" style={{ padding: '6px 10px', color: 'var(--danger)', borderColor: 'transparent' }} onClick={() => handleDelete(member.id)} title="Excluir Usuário">
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {displayedUsers.length === 0 && (
                                <tr>
                                    <td colSpan={isCeo ? 6 : 5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                                        Nenhum usuário encontrado neste filtro.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Criar / Editar Usuário */}
            {showModal && (
                <div onClick={() => setShowModal(false)} style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: 20
                }}>
                    <div className="card" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 550 }}>
                        <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
                            {editingUser ? `Editar: ${editingUser.name}` : 'Adicionar Membro'}
                        </h3>
                        {errorMsg && <div style={{ color: 'var(--danger)', marginBottom: 16, fontSize: '0.85rem' }}>{errorMsg}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Nome Completo</label>
                                <input name="name" type="text" className="form-control" required defaultValue={editingUser?.name} placeholder="Ex: João Silva" />
                            </div>

                            {!editingUser && (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">E-mail de Acesso</label>
                                        <input name="email" type="email" className="form-control" required placeholder="joao@empresa.com" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Senha Provisória</label>
                                        <input name="password" type="text" className="form-control" required placeholder="Senha123" />
                                    </div>
                                </>
                            )}

                            <div className="form-group">
                                <label className="form-label">Cargo (Preset de Permissões)</label>
                                <select className="form-control" value={selectedRole} onChange={(e) => handleRoleChange(e.target.value)}>
                                    {Object.entries(ROLE_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
                                    Ao selecionar um cargo, as permissões padrão são carregadas. Você pode customizar abaixo.
                                </p>
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: 12 }}>Permissões de Acesso</label>
                                <div style={{
                                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8,
                                    backgroundColor: 'var(--bg-tertiary)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)',
                                    maxHeight: 260, overflowY: 'auto'
                                }}>
                                    {ALL_ROUTES.map(route => {
                                        const isChecked = selectedPerms.includes(route.path);
                                        return (
                                            <label key={route.path}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                                                    borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem',
                                                    backgroundColor: isChecked ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                                                    border: `1px solid ${isChecked ? '#a855f7' : 'var(--border-color)'}`,
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => togglePerm(route.path)}
                                                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                                                />
                                                <span style={{ color: isChecked ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                                    {route.label}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                    <button type="button" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setSelectedPerms(ALL_ROUTES.map(r => r.path))}>
                                        Marcar Todas
                                    </button>
                                    <button type="button" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setSelectedPerms([])}>
                                        Desmarcar Todas
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">{editingUser ? 'Salvar Alterações' : 'Criar Usuário'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Resetar Senha */}
            {showResetModal && resetUser && (
                <div onClick={() => { setShowResetModal(false); setResetUser(null); }} style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000, padding: 20
                }}>
                    <div className="card" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 420 }}>
                        <h3 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <KeyRound size={20} color="var(--warning)" /> Resetar Senha
                        </h3>
                        <p className="text-muted" style={{ marginBottom: 24, fontSize: '0.85rem' }}>
                            Definir nova senha para <strong>{resetUser.name}</strong> ({resetUser.email})
                        </p>

                        <form onSubmit={handleResetPassword}>
                            <div className="form-group">
                                <label className="form-label">Nova Senha</label>
                                <input
                                    name="newPassword"
                                    type="text"
                                    className="form-control"
                                    required
                                    minLength={3}
                                    placeholder="Digite a nova senha"
                                    autoFocus
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => { setShowResetModal(false); setResetUser(null); }}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <KeyRound size={14} /> Redefinir Senha
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
