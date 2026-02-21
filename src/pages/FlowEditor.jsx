import { useState } from 'react';
import { Plus, Trash2, ChevronRight, MessageSquare, HelpCircle, UserCheck, Tag, ArrowRight } from 'lucide-react';

const FlowEditor = () => {
    const [selectedFlow, setSelectedFlow] = useState('menu_principal');

    const flows = {
        menu_principal: {
            name: 'Menu Principal',
            nodes: [
                { id: 'start', type: 'message', content: 'Olá! 👋 Pra te atender mais rápido, escolha uma opção:', next: 'menu' },
                {
                    id: 'menu', type: 'menu', content: 'Escolha:', options: [
                        { label: '1. Administrativo', next: 'admin_welcome' },
                        { label: '2. Comercial', next: 'comercial_welcome' },
                        { label: '3. Pós-vendas', next: 'pos_welcome' },
                    ]
                },
                { id: 'admin_welcome', type: 'message', content: 'Você está no Administrativo. Qual o assunto?', next: 'handoff_admin' },
                { id: 'comercial_welcome', type: 'message', content: 'Vamos entender sua necessidade! Qual sua cidade?', next: 'comercial_q2' },
                { id: 'comercial_q2', type: 'question', content: 'Qual serviço te interessa?', next: 'comercial_q3' },
                { id: 'comercial_q3', type: 'question', content: 'Melhor horário para contato?', next: 'handoff_comercial' },
                { id: 'pos_welcome', type: 'message', content: 'Aqui é o Pós-vendas! Qual seu número de contrato?', next: 'handoff_pos' },
                { id: 'handoff_admin', type: 'action', content: 'Atribuir ao setor Administrativo', action: 'assign_department' },
                { id: 'handoff_comercial', type: 'action', content: 'Atribuir ao setor Comercial + Criar Lead', action: 'assign_department' },
                { id: 'handoff_pos', type: 'action', content: 'Atribuir ao setor Pós-vendas', action: 'assign_department' },
            ]
        }
    };

    const flow = flows[selectedFlow];

    const typeIcons = {
        message: <MessageSquare size={16} color="#4FC3F7" />,
        menu: <Tag size={16} color="var(--accent-color)" />,
        question: <HelpCircle size={16} color="var(--warning)" />,
        action: <UserCheck size={16} color="var(--success)" />,
    };

    const typeLabels = {
        message: 'Mensagem',
        menu: 'Menu Interativo',
        question: 'Pergunta',
        action: 'Ação Automática',
    };

    const typeBorders = {
        message: '#4FC3F7',
        menu: 'var(--accent-color)',
        question: 'var(--warning)',
        action: 'var(--success)',
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Editor de Fluxos WhatsApp</h2>
                    <p className="text-muted">Configure os fluxos de atendimento de cada departamento</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <select className="form-control" style={{ minWidth: 200 }} value={selectedFlow} onChange={e => setSelectedFlow(e.target.value)}>
                        <option value="menu_principal">Menu Principal</option>
                    </select>
                    <button className="btn btn-primary"><Plus size={16} /> Novo Fluxo</button>
                </div>
            </div>

            {/* Legenda */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                {Object.keys(typeLabels).map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {typeIcons[t]} {typeLabels[t]}
                    </div>
                ))}
            </div>

            {/* Flow Nodes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 700 }}>
                {flow.nodes.map((node, i) => (
                    <div key={node.id}>
                        <div className="card" style={{
                            borderLeft: `4px solid ${typeBorders[node.type]}`,
                            padding: 20, cursor: 'pointer',
                            marginBottom: 0
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                        {typeIcons[node.type]}
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, color: typeBorders[node.type] }}>
                                            {typeLabels[node.type]}
                                        </span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>#{node.id}</span>
                                    </div>
                                    <div style={{ fontSize: '0.95rem' }}>{node.content}</div>

                                    {node.options && (
                                        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            {node.options.map((opt, oi) => (
                                                <div key={oi} style={{
                                                    padding: '8px 12px', backgroundColor: 'var(--bg-tertiary)',
                                                    borderRadius: 6, fontSize: '0.85rem', display: 'flex',
                                                    justifyContent: 'space-between', alignItems: 'center'
                                                }}>
                                                    <span>{opt.label}</span>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>→ {opt.next}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button style={{ padding: 6, color: 'var(--text-muted)' }}><Trash2 size={16} /></button>
                            </div>
                        </div>

                        {i < flow.nodes.length - 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                                <div style={{ width: 2, height: 24, backgroundColor: 'var(--border-color)' }}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button className="btn btn-outline" style={{ marginTop: 16 }}>
                <Plus size={16} /> Adicionar Etapa
            </button>
        </div>
    );
};

export default FlowEditor;
