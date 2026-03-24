import React from 'react';
import { Rocket, PlayCircle, AlertTriangle, Cpu, CheckCircle, Workflow, Paintbrush, TrendingUp, Users, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeadExtractor = () => {
    const navigate = useNavigate();

    const sections = [
        {
            id: 'hero',
            bg: 'var(--bg-main)',
            content: (
                <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: 900, margin: '0 auto' }}>
                    <div style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', 
                        backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 100, color: 'var(--accent-color)',
                        fontSize: '0.85rem', fontWeight: 600, marginBottom: 24, border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                        <Rocket size={16} /> NOVIDADE NO U3 FLOW
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
                        🚀 Gere leads todos os dias, <span style={{ color: 'var(--accent-color)' }}>sem depender de anúncios</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: 40, lineHeight: 1.6 }}>
                        O Extrator de Leads da U3 permite encontrar contatos qualificados automaticamente e alimentar seu CRM com novas oportunidades diariamente.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/extrator-ferramenta')} className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: 12 }}>
                            👉 Começar agora
                        </button>
                        <button className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <PlayCircle size={20} /> Ver como funciona
                        </button>
                    </div>
                    {/* Floating elements simulation */}
                    <div style={{ marginTop: 60, position: 'relative' }}>
                        <div style={{ 
                            backgroundColor: 'var(--bg-secondary)', padding: 24, borderRadius: 24, border: '1px solid var(--border-color)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', opacity: 0.9
                        }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 16, marginBottom: 16 }}>
                                <div style={{ fontWeight: 700 }}>🔍 Extração Ativa</div>
                                <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--success)', animation: 'pulse 2s infinite' }} />
                                    Online
                                </div>
                             </div>
                             <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                                {[1,2,3].map(i => (
                                    <div key={i} style={{ minWidth: 200, padding: 12, backgroundColor: 'var(--bg-tertiary)', borderRadius: 12 }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lead encontrado #{i}</div>
                                        <div style={{ fontWeight: 600 }}>Empresa de Automação...</div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'problem',
            bg: 'var(--bg-secondary)',
            content: (
                <div style={{ padding: '80px 20px', maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
                    <div>
                        <div style={{ color: 'var(--danger)', marginBottom: 16 }}>
                            <AlertTriangle size={48} />
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 24 }}>Você está deixando dinheiro na mesa</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                            A maioria das empresas depende apenas de tráfego pago ou indicação. 
                            Sem um fluxo constante de novos leads, o crescimento fica limitado.
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { title: 'Poucos leads qualificados', desc: 'Sua equipe passa tempo com quem não quer comprar.' },
                            { title: 'Alto custo por aquisição', desc: 'Os preços dos anúncios não param de subir.' },
                            { title: 'Falta de previsibilidade', desc: 'Não saber quantos leads terá amanhã é perigoso.' }
                        ].map((item, i) => (
                            <div key={i} style={{ padding: 20, backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 16, borderLeft: '4px solid var(--danger)' }}>
                                <h4 style={{ fontWeight: 700, marginBottom: 4 }}>{item.title}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'solution',
            bg: 'var(--bg-main)',
            content: (
                <div style={{ padding: '80px 20px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 16 }}>Uma máquina de geração de leads automática</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: 48, maxWidth: 700, margin: '0 auto 48px' }}>
                        Com o Extrator de Leads, você consegue encontrar e organizar contatos prontos para abordagem de forma simples e rápida.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 24 }}>
                        {[
                            { icon: <Cpu />, title: 'Extração automática', text: 'Busca leads em massa sem esforço manual.' },
                            { icon: <CheckCircle />, title: 'Lead qualificado', text: 'Contatos prontos para sua abordagem comercial.' },
                            { icon: <Zap />, title: 'Organização inteligente', text: 'Tudo separado por nicho e região.' },
                            { icon: <ShieldCheck />, title: 'Filtros avançados', text: 'Selecione apenas quem realmente importa.' }
                        ].map((item, i) => (
                            <div key={i} className="card" style={{ padding: 32, textAlign: 'left', borderRadius: 24, transition: 'transform 0.3s ease' }}>
                                <div style={{ color: 'var(--accent-color)', marginBottom: 20 }}>{React.cloneElement(item.icon, { size: 32 })}</div>
                                <h4 style={{ fontWeight: 700, marginBottom: 12 }}>{item.title}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'integration',
            bg: 'var(--bg-secondary)',
            content: (
                <div style={{ padding: '80px 20px', maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ 
                            width: '100%', aspectRatio: '1/1', backgroundColor: 'var(--accent-color)', 
                            borderRadius: '50%', opacity: 0.1, position: 'absolute', top: 0, left: 0, 
                            filter: 'blur(100px)' 
                        }} />
                        <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'var(--bg-main)', padding: 32, borderRadius: 24, border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                                <div style={{ padding: 10, backgroundColor: 'var(--accent-color)', borderRadius: 12, color: 'white' }}>
                                    <Workflow size={24} />
                                </div>
                                <div style={{ fontWeight: 700 }}>Conexão Ativa</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                                    <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 12, fontWeight: 600 }}>Extrator</div>
                                    <ArrowRight className="text-muted" />
                                    <div style={{ padding: '12px 16px', backgroundColor: 'var(--accent-color)', borderRadius: 12, color: 'white', fontWeight: 600 }}>U3 CRM</div>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                    Sincronização em tempo real de contatos qualificados.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 24 }}>Funciona perfeitamente com o U3 Flow</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 32 }}>
                            Você gera os leads e automaticamente pode organizar, acompanhar e converter dentro do seu CRM. 
                            Tudo integrado em uma única experiência.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontWeight: 700, color: 'var(--accent-color)', fontSize: '1.1rem' }}>
                            <span>Geração</span>
                            <ArrowRight size={18} />
                            <span>Organização</span>
                            <ArrowRight size={18} />
                            <span>Conversão</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'whitelabel',
            bg: 'linear-gradient(135deg, var(--bg-main) 0%, #1a1a2e 100%)',
            content: (
                <div style={{ padding: '100px 20px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ color: 'var(--accent-color)', marginBottom: 24, display: 'inline-block' }}>
                        <Paintbrush size={52} />
                    </div>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: 24 }}>White Label: Seu Grande Diferencial</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: 48, maxWidth: 800, margin: '0 auto 48px' }}>
                        Use como se fosse seu produto. Personalize totalmente a ferramenta para o seu negócio ou para vender aos seus clientes.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                        {[
                            'Altere cores', 'Coloque sua logo', 'Venda como SaaS próprio', 'Crie recorrência mensal'
                        ].map((text, i) => (
                            <div key={i} style={{ 
                                padding: '16px 24px', backgroundColor: 'rgba(255,255,255,0.03)', 
                                borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600
                            }}>
                                <CheckCircle size={18} color="var(--success)" /> {text}
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'benefits',
            bg: 'var(--bg-secondary)',
            content: (
                <div style={{ padding: '80px 20px', maxWidth: 1000, margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 48, textAlign: 'center' }}>O que você ganha com isso</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                        {[
                            'Mais leads todos os dias', 'Redução do custo de aquisição', 
                            'Mais previsibilidade de vendas', 'Escala no seu negócio', 
                            'Independência de tráfego pago'
                        ].map((benefit, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, backgroundColor: 'var(--bg-main)', borderRadius: 16 }}>
                                <div style={{ color: 'var(--accent-color)', flexShrink: 0 }}><TrendingUp size={24} /></div>
                                <span style={{ fontWeight: 600 }}>{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'forwho',
            bg: 'var(--bg-main)',
            content: (
                <div style={{ padding: '80px 20px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: 16 }}><Users size={40} /></div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 48 }}>Ideal para:</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
                        {[
                            'Agências de marketing', 'Closers e vendedores', 'Empresas B2B', 
                            'Prestadores de serviço', 'Quem quer escalar vendas'
                        ].map((target, i) => (
                            <div key={i} style={{ 
                                padding: '12px 24px', backgroundColor: 'var(--bg-tertiary)', 
                                borderRadius: 100, border: '1px solid var(--border-color)',
                                fontWeight: 600, fontSize: '1rem'
                            }}>
                                {target}
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'offer',
            bg: 'linear-gradient(rgba(59, 130, 246, 0.1), transparent)',
            content: (
                <div style={{ padding: '100px 20px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 24 }}>Comece agora</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: 40 }}>
                        Tenha acesso ao Extrator de Leads e comece hoje mesmo a gerar novas oportunidades para o seu negócio.
                    </p>
                    <button onClick={() => navigate('/extrator-ferramenta')} className="btn btn-primary" style={{ padding: '20px 48px', fontSize: '1.25rem', borderRadius: 16, boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.4)' }}>
                        🚀 Quero gerar leads todos os dias
                    </button>
                    <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 32, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ShieldCheck size={16} /> Compra Segura</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={16} /> Suporte Prioritário</div>
                    </div>
                </div>
            )
        },
        {
            id: 'final-cta',
            bg: 'var(--bg-main)',
            content: (
                <div style={{ padding: '100px 20px', maxWidth: 900, margin: '0 auto', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>Pare de depender da sorte para vender</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: 32 }}>
                        Tenha um sistema que gera oportunidades todos os dias.
                    </p>
                    <button onClick={() => navigate('/extrator-ferramenta')} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.1rem', borderRadius: 12 }}>
                        👉 Começar agora
                    </button>
                    <p style={{ marginTop: 60, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        © {new Date().getFullYear()} U3 Company - Todos os direitos reservados.
                    </p>
                </div>
            )
        }
    ];

    return (
        <div style={{ overflowX: 'hidden', color: 'var(--text-main)', fontFamily: 'Inter, sans-serif' }}>
            {sections.map(section => (
                <section key={section.id} style={{ backgroundColor: section.bg, position: 'relative' }}>
                    {section.content}
                </section>
            ))}

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
                section {
                    width: 100%;
                }
                .btn {
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    transition: all 0.2s ease;
                    border: none;
                }
                .btn-primary {
                    background-color: var(--accent-color);
                    color: white;
                }
                .btn-primary:hover {
                    background-color: #2563eb;
                    transform: translateY(-2px);
                }
                .btn-outline {
                    background-color: transparent;
                    border: 1px solid var(--border-color);
                    color: var(--text-main);
                }
                .btn-outline:hover {
                    background-color: var(--bg-secondary);
                    transform: translateY(-2px);
                }
                h1, h2, h3, h4 {
                    margin: 0;
                }
            `}</style>
        </div>
    );
};

export default LeadExtractor;
