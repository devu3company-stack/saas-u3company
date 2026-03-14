import { useState, useEffect } from 'react';
import { Target, MessageCircle, Calendar, Edit2, Save, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../utils/auth';

const Academy = () => {
    const { user, getData, setData } = useAuth();
    const defaultClients = getData('u3_clients_v2', '[]') || [];
    const clientsList = Array.isArray(defaultClients) ? defaultClients : [];

    // Se for cliente, tenta achar o nome dele na lista de empresas
    const initialClient = () => {
        if (user?.role === 'cliente' || user?.role === 'cliente_admin') {
            const myTenantId = user?.tenantId || user?.id;
            const myClient = clientsList.find(c => c.id === myTenantId);
            if (myClient) return myClient.name;
        }
        return clientsList.length > 0 ? clientsList[0].name : '';
    };

    const [selectedClient, setSelectedClient] = useState(initialClient());
    const [isEditingRoadmap, setIsEditingRoadmap] = useState(false);

    const defaultRoadmap = [
        { id: 1, title: 'Setup & Kickoff', desc: 'Configuração de BM, criação de anúncios iniciais e landing page de alta conversão.', active: true },
        { id: 2, title: 'Escala & Otimização', desc: 'Implementação de regras automáticas, teste A/B contínuo de criativos.', active: false },
        { id: 3, title: 'Consolidação CRM', desc: 'Liberação de portal próprio avançado, funis e remarketing omni-channel.', active: false }
    ];

    const [roadmaps, setRoadmaps] = useState(() => {
        const saved = getData('u3_roadmaps', '{}');
        return (saved && typeof saved === 'object' && !Array.isArray(saved)) ? saved : {};
    });

    const [academySettings, setAcademySettings] = useState(() => {
        const saved = getData('u3_academy_settings', '{}');
        return (saved && typeof saved === 'object' && !Array.isArray(saved)) ? saved : {};
    });

    const currentRoadmap = (selectedClient && roadmaps[selectedClient]) || defaultRoadmap;

    // LTV calculado a partir dos dados do cliente (tempo de contrato x mensalidade)
    const selectedClientData = clientsList.find(c => c.name === selectedClient);
    const clientLtv = selectedClientData
        ? (parseFloat(String(selectedClientData.mrr || '0').replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0) * (selectedClientData.tempoContrato || 1)
        : 0;
    const currentSettings = (selectedClient && academySettings[selectedClient]) || { ltv: clientLtv };

    const saveRoadmap = (updatedRoadmap) => {
        const newRoadmaps = { ...roadmaps, [selectedClient]: updatedRoadmap };
        setRoadmaps(newRoadmaps);
        setData('u3_roadmaps', newRoadmaps);
    };

    const saveSettings = (newSettings) => {
        const updated = { ...academySettings, [selectedClient]: newSettings };
        setAcademySettings(updated);
        setData('u3_academy_settings', updated);
    };

    const activeStepsCount = currentRoadmap.filter(s => s.active).length;
    const totalSteps = currentRoadmap.length;
    const progressPercent = totalSteps > 0 ? Math.round((activeStepsCount / totalSteps) * 100) : 0;
    const currentMonth = activeStepsCount === 0 ? 1 : activeStepsCount;

    const handleUpdateStep = (index, field, value) => {
        const updated = [...currentRoadmap];
        updated[index] = { ...updated[index], [field]: value };
        saveRoadmap(updated);
    };

    const handleAddStep = () => {
        const updated = [...currentRoadmap, { id: Date.now(), title: 'Nova Etapa', desc: 'Descrição da etapa...', active: false }];
        saveRoadmap(updated);
    };

    const handleRemoveStep = (index) => {
        const updated = currentRoadmap.filter((_, i) => i !== index);
        saveRoadmap(updated);
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2>Academy / Onboarding U3</h2>
                    <p className="text-muted">Área de Treinamento e Passo a Passo (Portal do Cliente)</p>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginLeft: 'auto' }}>
                    <select
                        className="form-control"
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        style={{ minWidth: 200 }}
                    >
                        <option value="">Selecione um cliente</option>
                        {clientsList.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="responsive-grid-sidebar">
                <div>
                    {/* LTV e Resumo Estratégico */}
                    <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24, gap: 16 }}>
                        <div className="card" style={{ padding: 16 }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mês Atual de Contrato</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-color)' }}>Mês {currentMonth} / {totalSteps}</div>
                        </div>
                        <div className="card" style={{ padding: 16 }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>LTV (Valor no Tempo)</div>
                            {isEditingRoadmap ? (
                                <input
                                    type="number"
                                    className="form-control"
                                    value={currentSettings.ltv}
                                    onChange={e => saveSettings({ ...currentSettings, ltv: Number(e.target.value) })}
                                    style={{ marginTop: 4 }}
                                />
                            ) : (
                                <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentSettings.ltv)}
                                </div>
                            )}
                        </div>
                        <div className="card" style={{ padding: 16 }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status do Projeto</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: progressPercent >= 100 ? 'var(--success)' : progressPercent === 0 ? 'var(--text-muted)' : 'var(--warning)' }}>
                                {progressPercent >= 100 ? 'Concluído' : progressPercent === 0 ? 'A Iniciar' : 'Em Andamento'}
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ margin: 0 }}>Progresso do Onboarding / Escala</h3>
                            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setIsEditingRoadmap(!isEditingRoadmap)}>
                                {isEditingRoadmap ? 'Concluir Edição' : 'Configurar Trilha'}
                            </button>
                        </div>

                        <div style={{ width: '100%', backgroundColor: 'var(--bg-tertiary)', borderRadius: 8, overflow: 'hidden', height: 16, marginBottom: 8 }}>
                            <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: progressPercent === 100 ? 'var(--success)' : 'var(--accent-color)', transition: 'width 0.3s ease' }}></div>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Progresso: {progressPercent}% ({activeStepsCount} de {totalSteps} concluídos)</p>
                    </div>

                    {/* Timeline de Entregas por Mês */}
                    <div className="card" style={{ marginBottom: 24, padding: 0 }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Roadmap de Entregas</h3>
                                <span className="badge" style={{ backgroundColor: 'var(--warning)', color: 'black' }}>Estratégia de Retenção</span>
                            </div>
                            <button className="btn btn-outline" onClick={() => setIsEditingRoadmap(!isEditingRoadmap)} style={{ padding: '4px 12px', fontSize: '0.8rem', display: 'flex', gap: 8, alignItems: 'center' }}>
                                {isEditingRoadmap ? <><Save size={14} /> Concluir Edição</> : <><Edit2 size={14} /> Editar Roadmap</>}
                            </button>
                        </div>
                        <div style={{ padding: 24 }}>
                            {currentRoadmap.map((step, index) => (
                                <div key={step.id} style={{ display: 'flex', gap: 16, marginBottom: index === currentRoadmap.length - 1 ? 0 : 24 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: step.active ? 'var(--accent-color)' : 'transparent', border: step.active ? 'none' : '2px solid var(--border-color)', color: step.active ? 'black' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {index + 1}
                                        </div>
                                        {index < currentRoadmap.length - 1 && (
                                            <div style={{ width: 2, height: '100%', minHeight: 40, backgroundColor: step.active ? 'var(--accent-color)' : 'var(--border-color)', marginTop: 8, flex: 1 }}></div>
                                        )}
                                    </div>
                                    <div style={{ opacity: step.active ? 1 : 0.6, flex: 1 }}>
                                        {isEditingRoadmap ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                    <input type="text" className="form-control" value={step.title} onChange={e => handleUpdateStep(index, 'title', e.target.value)} style={{ padding: '4px 8px', fontSize: '0.9rem' }} />
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', cursor: 'pointer' }}>
                                                        <input type="checkbox" checked={step.active} onChange={e => handleUpdateStep(index, 'active', e.target.checked)} />
                                                        Ativo
                                                    </label>
                                                    <button onClick={() => handleRemoveStep(index)} style={{ color: 'var(--danger)', padding: 4 }}><Trash2 size={16} /></button>
                                                </div>
                                                <textarea className="form-control" value={step.desc} onChange={e => handleUpdateStep(index, 'desc', e.target.value)} style={{ padding: '4px 8px', fontSize: '0.85rem', minHeight: 60 }} />
                                            </div>
                                        ) : (
                                            <>
                                                <h4 style={{ margin: '0 0 4px', color: step.active ? 'var(--accent-color)' : 'var(--text-main)' }}>Mês {index + 1}: {step.title}</h4>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{step.desc}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isEditingRoadmap && (
                                <div style={{ marginTop: 24, textAlign: 'center' }}>
                                    <button className="btn btn-outline" onClick={handleAddStep} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto' }}>
                                        <Plus size={16} /> Adicionar Mês / Etapa
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="card">
                        <h3 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Sua Jornada</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <li style={{ color: 'var(--accent-color)', fontWeight: 600 }}>1. Onboarding</li>
                            <li style={{ color: 'var(--text-muted)' }}>2. Aprovação</li>
                            <li style={{ color: 'var(--text-muted)' }}>3. Resultados</li>
                            <li style={{ color: 'var(--text-muted)' }}>4. Suporte</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Academy;
