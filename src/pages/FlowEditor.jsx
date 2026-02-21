import { useState } from 'react';
import { Plus, Trash2, MessageSquare, HelpCircle, UserCheck, Tag, ArrowRight, Save, Play, MousePointer2, Image as ImageIcon, Zap, Clock } from 'lucide-react';

const FlowEditor = () => {
    const [selectedFlow, setSelectedFlow] = useState('menu_principal');

    const [nodes, setNodes] = useState([
        { id: 'start', type: 'trigger', content: 'Palavra-chave: "Olá", "Menu"', title: 'Gatilho Inicial' },
        { id: 'boas_vindas', type: 'message', content: 'Olá! 👋 Pra te atender mais rápido, escolha uma opção abaixo:', title: 'Mensagem de Saudação' },
        {
            id: 'menu', type: 'menu', content: 'Menu Principal', title: 'Menu de Opções', options: [
                { label: '1. Suporte Técnico', next: 'suporte_flow', color: 'var(--accent-color)' },
                { label: '2. Comercial / Vendas', next: 'vendas_flow', color: 'var(--success)' },
                { label: '3. Financeiro (2ª Via)', next: 'financeiro_flow', color: 'var(--warning)' },
            ]
        },
    ]);

    const nodeTypes = [
        { type: 'message', label: 'Texto Simples', icon: <MessageSquare size={18} />, color: '#4FC3F7', desc: 'Envia uma mensagem de texto' },
        { type: 'media', label: 'Imagem / Arquivo', icon: <ImageIcon size={18} />, color: '#BA68C8', desc: 'Envia mídia ou documento' },
        { type: 'menu', label: 'Menu de Opções', icon: <Tag size={18} />, color: 'var(--accent-color)', desc: 'Cria botões de escolha' },
        { type: 'question', label: 'Coletar Dado', icon: <HelpCircle size={18} />, color: '#FFB74D', desc: 'Espera resposta do usuário' },
        { type: 'delay', label: 'Atraso Inteligente', icon: <Clock size={18} />, color: '#90A4AE', desc: 'Simula digitação' },
        { type: 'action', label: 'Ação / Webhook', icon: <Zap size={18} />, color: 'var(--success)', desc: 'Integra com outro sistema' },
        { type: 'handoff', label: 'Passar p/ Humano', icon: <UserCheck size={18} />, color: '#F06292', desc: 'Envia para a fila' },
    ];

    const handleAddNode = (typeObj) => {
        const newNode = {
            id: `node_${Date.now()}`,
            type: typeObj.type,
            title: `Novo ${typeObj.label}`,
            content: 'Clique para editar o conteúdo...'
        };
        if (typeObj.type === 'menu') {
            newNode.options = [{ label: 'Nova Opção', next: '' }];
        }
        setNodes([...nodes, newNode]);
    };

    const removeNode = (id) => {
        setNodes(nodes.filter(n => n.id !== id));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>

            {/* Topbar do Editor */}
            <div className="page-header" style={{ marginBottom: 0, paddingBottom: 16, borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2><span style={{ color: 'var(--accent-color)' }}>◉</span> Editor Visual de Fluxos</h2>
                    <p className="text-muted" style={{ margin: 0, marginTop: 4 }}>Arraste, conecte e automatize seu atendimento (Estilo Typebot/Make)</p>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16, color: 'var(--text-muted)' }}>
                        <select className="form-control" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', width: 220 }}>
                            <option>Fluxo: Menu Principal (Ativo)</option>
                            <option>Fluxo: Qualificação Leads</option>
                            <option>Fluxo: Cobrança Automática</option>
                        </select>
                    </div>
                    <button className="btn btn-outline" style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Play size={16} /> Testar Fluxo</button>
                    <button className="btn btn-primary" style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Save size={16} /> Publicar</button>
                </div>
            </div>

            {/* Layout Canvas + Sidebar */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', marginTop: 1 }}>

                {/* Sidebar de Ferramentas */}
                <div style={{ width: 280, borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Blocos Disponíveis</h3>

                    {nodeTypes.map((t, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleAddNode(t)}
                            style={{
                                display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12,
                                backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)',
                                borderRadius: 8, cursor: 'grab', transition: '0.2s',
                            }}
                            onMouseOver={e => e.currentTarget.style.borderColor = t.color}
                            onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${t.color}20`, color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {t.icon}
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{t.label}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>{t.desc}</div>
                            </div>
                        </div>
                    ))}

                    <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px dashed var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        <MousePointer2 size={16} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.5 }} />
                        Clique em um bloco para adicionar ao fluxo ativo.
                    </div>
                </div>

                {/* Área do Canvas (Flow Builder) */}
                <div style={{
                    flex: 1,
                    position: 'relative',
                    backgroundColor: 'var(--bg-main)',
                    backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    overflowY: 'auto',
                    padding: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>

                    {nodes.map((node, index) => {
                        const nodeTypeInfo = node.type === 'trigger' ? { color: '#FF7043', icon: <Zap size={16} /> } : nodeTypes.find(n => n.type === node.type) || nodeTypes[0];

                        return (
                            <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 350 }}>

                                {/* O Cartão do Node */}
                                <div className="card" style={{
                                    width: '100%', padding: 0, overflow: 'hidden',
                                    border: `1px solid ${nodeTypeInfo.color}50`,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    position: 'relative',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}>
                                    {/* Header do Node */}
                                    <div style={{
                                        backgroundColor: `${nodeTypeInfo.color}15`,
                                        padding: '10px 16px',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        borderBottom: `1px solid ${nodeTypeInfo.color}30`
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: nodeTypeInfo.color, fontWeight: 600, fontSize: '0.85rem' }}>
                                            {nodeTypeInfo.icon} {node.title}
                                        </div>
                                        {node.type !== 'trigger' && (
                                            <button onClick={(e) => { e.stopPropagation(); removeNode(node.id); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Corpo do Node */}
                                    <div style={{ padding: 16 }}>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, backgroundColor: 'var(--bg-tertiary)', padding: 12, borderRadius: 6, border: '1px solid var(--border-color)' }}>
                                            {node.content}
                                        </div>

                                        {/* Renderização de Opções se for Menu */}
                                        {node.options && (
                                            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                {node.options.map((opt, oi) => (
                                                    <div key={oi} style={{
                                                        border: `1px solid ${opt.color}`,
                                                        borderRadius: 6, padding: '8px 12px',
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        boxShadow: `0 0 8px ${opt.color}20`
                                                    }}>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{opt.label}</span>
                                                        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: opt.color, cursor: 'crosshair', border: '2px solid var(--bg-main)' }}></div>
                                                    </div>
                                                ))}
                                                <button style={{ backgroundColor: 'transparent', border: '1px dashed var(--border-color)', color: 'var(--text-muted)', padding: '6px', borderRadius: 6, fontSize: '0.8rem', cursor: 'pointer', marginTop: 4 }}>
                                                    + Adicionar Botão
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Conector Inferior (Socket) */}
                                    {node.type !== 'menu' && (
                                        <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, borderRadius: '50%', backgroundColor: nodeTypeInfo.color, border: '2px solid var(--bg-main)', zIndex: 2, cursor: 'crosshair' }}></div>
                                    )}
                                </div>

                                {/* A Linha de Conexão Vertical */}
                                {index < nodes.length - 1 && (
                                    <div style={{
                                        width: 2, height: 40,
                                        backgroundColor: 'var(--accent-color)',
                                        opacity: 0.5,
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            position: 'absolute', bottom: -4, left: -4,
                                            width: 10, height: 10,
                                            borderBottom: '2px solid var(--accent-color)',
                                            borderRight: '2px solid var(--accent-color)',
                                            transform: 'rotate(45deg)',
                                            opacity: 0.5
                                        }}></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Botão Flutuante de Adição Rápida Final */}
                    <button style={{
                        marginTop: 20, width: 40, height: 40, borderRadius: '50%',
                        backgroundColor: 'var(--accent-color)', color: 'black',
                        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '0 4px 12px rgba(255, 246, 0, 0.3)',
                        transition: 'transform 0.2s'
                    }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Plus size={20} />
                    </button>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>Finalizar Fluxo</div>

                </div>
            </div>
        </div>
    );
};

export default FlowEditor;
