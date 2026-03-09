import { useState } from 'react';
import { Smartphone, CheckCircle, ChevronRight, Wifi, Users, MessageSquare, Zap, AlertTriangle } from 'lucide-react';

const WhatsAppSetup = () => {
    const [step, setStep] = useState(0);
    const [connected, setConnected] = useState(false);
    const [qrBase64, setQrBase64] = useState('');
    const [isGeneratingQr, setIsGeneratingQr] = useState(false);
    const [departments, setDepartments] = useState([
        { id: 1, name: 'Administrativo', greeting: 'Olá! Você está falando com o setor Administrativo. Como posso ajudar?', agents: ['Admin Principal'], questions: ['Qual o assunto?'] },
        { id: 2, name: 'Comercial', greeting: 'Olá! Você chegou no Comercial. Vamos entender sua necessidade!', agents: ['Gestor de Tráfego 1'], questions: ['Qual sua cidade?', 'Qual serviço te interessa?', 'Melhor horário para contato?'] },
        { id: 3, name: 'Pós-vendas', greeting: 'Olá! Aqui é o Pós-vendas. Como posso te ajudar hoje?', agents: ['Admin Principal'], questions: ['Qual seu número de contrato?'] },
    ]);
    const [menuType, setMenuType] = useState('list');
    const [testPhone, setTestPhone] = useState('');

    const steps = [
        { label: 'Conectar WhatsApp', icon: <Smartphone size={20} /> },
        { label: 'Menu Principal', icon: <MessageSquare size={20} /> },
        { label: 'Departamentos', icon: <Users size={20} /> },
        { label: 'Testar', icon: <Zap size={20} /> },
    ];

    const handleConnect = async () => {
        setIsGeneratingQr(true);
        try {
            const response = await fetch('http://localhost:3001/api/whatsapp/create-instance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ instanceName: 'Test-AlphaTech' })
            });
            const data = await response.json();

            if (data.qrcode && data.qrcode.base64) {
                setQrBase64(data.qrcode.base64);
            }
            setIsGeneratingQr(false);

            // Simula leitura após gerar o QR pra testes rápidos (num ambiente real as pessoas escaneariam)
            setTimeout(() => setConnected(true), 4000);
        } catch (error) {
            console.error("Erro ao conectar Evolution API fake:", error);
            setIsGeneratingQr(false);
        }
    };

    const handleSendTest = async () => {
        if (!testPhone) return alert('Por favor, digite um número de teste.');
        try {
            const response = await fetch('http://localhost:3001/api/whatsapp/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instanceName: 'Test-AlphaTech',
                    number: testPhone.replace(/\D/g, ''),
                    text: 'Olá! Esta é uma mensagem de teste do seu CRM saas-u3company via Evolution API mockada.'
                })
            });
            const data = await response.json();
            if (data.success) {
                alert(data.message);
            } else {
                alert('Falha ao enviar mensagem.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de comunicação com o webhook mockado.');
        }
    };

    const handleFinish = () => {
        alert("Configuração do WhatsApp concluída e ativada com sucesso!");
        window.location.href = '/inbox';
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Configuração WhatsApp</h2>
                    <p className="text-muted">Wizard de conexão e configuração do fluxo de atendimento</p>
                </div>
            </div>

            {/* Stepper */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
                {steps.map((s, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <div
                            onClick={() => { if (i <= step || connected) setStep(i); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
                                backgroundColor: step === i ? 'var(--accent-color)' : i < step ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                                color: step === i ? 'black' : i < step ? 'var(--success)' : 'var(--text-muted)',
                                borderRadius: 12, cursor: 'pointer', flex: 1, fontWeight: step === i ? 700 : 500,
                                border: `1px solid ${step === i ? 'var(--accent-color)' : 'var(--border-color)'}`,
                                transition: '0.2s'
                            }}
                        >
                            {i < step ? <CheckCircle size={20} /> : s.icon}
                            <span>{s.label}</span>
                        </div>
                        {i < steps.length - 1 && <ChevronRight size={20} color="var(--border-color)" style={{ margin: '0 4px', flexShrink: 0 }} />}
                    </div>
                ))}
            </div>

            {/* Step 0 — Conectar */}
            {step === 0 && (
                <div className="card" style={{ maxWidth: 600 }}>
                    <h3 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Smartphone size={24} color="var(--accent-color)" /> Conectar WhatsApp via QR Code / API
                    </h3>
                    <p className="text-muted" style={{ marginBottom: 24 }}>
                        Utilize a conexão via Webhook (API de terceiros) ou faça a leitura do QR Code usando seu aparelho de celular corporativo.
                    </p>

                    {!connected ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {/* Option 1: QR Code */}
                            <div style={{ padding: 20, border: '1px solid var(--border-color)', borderRadius: 12, backgroundColor: 'var(--bg-tertiary)' }}>
                                <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Smartphone size={18} /> Escanear QR Code (Recomendado)
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                                    Abra o WhatsApp no seu celular {'>'} Aparelhos Conectados {'>'} Conectar um Aparelho.
                                </p>
                                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                                    <div style={{ width: 150, height: 150, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
                                        {/* Fake QR Fake vindo da Evolution Mock */}
                                        <div style={{ textAlign: 'center', color: 'black' }}>
                                            {qrBase64 ? (
                                                <img src={qrBase64} alt="QR Code" style={{ width: 130, height: 130 }} />
                                            ) : isGeneratingQr ? (
                                                <span style={{ fontSize: '0.8rem' }}>Gerando QR...</span>
                                            ) : (
                                                <span style={{ fontSize: '0.8rem' }}>Aguardando...</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <button className="btn btn-primary" onClick={handleConnect} disabled={isGeneratingQr} style={{ width: '100%', marginBottom: 12 }}>
                                            {isGeneratingQr ? 'Conectando Evolution...' : 'Gerar QR Code (Evolution API)'}
                                        </button>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>O QR Code expira em 30 segundos.</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>OU</div>

                            {/* Option 2: API Keys */}
                            <div style={{ padding: 20, border: '1px solid var(--border-color)', borderRadius: 12 }}>
                                <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Wifi size={18} /> Conexão via Evolution API / Z-API (BETA)
                                </h4>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Evolution API Endpoint URL</label>
                                    <input type="text" className="form-control" placeholder="https://evolution.seudominio.com/..." />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Global API Key</label>
                                    <input type="password" className="form-control" placeholder="•••••••••••••••••••••" />
                                </div>
                                <button className="btn btn-outline" onClick={handleConnect} style={{ width: '100%', justifyContent: 'center' }}>
                                    Conectar via API
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: 24, backgroundColor: 'var(--bg-tertiary)', borderRadius: 12, textAlign: 'center' }}>
                            <CheckCircle size={48} color="var(--success)" style={{ marginBottom: 12 }} />
                            <h3 style={{ color: 'var(--success)', marginBottom: 8 }}>Aparelho Conectado!</h3>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                <p><strong>Status:</strong> Online (Conectado à API)</p>
                                <p>Pronto para realizar testes!</p>
                            </div>
                            <button className="btn btn-primary" onClick={() => setStep(1)} style={{ marginTop: 16 }}>
                                Próximo: Configurar Menu <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Step 1 — Menu */}
            {step === 1 && (
                <div className="card" style={{ maxWidth: 700 }}>
                    <h3 style={{ marginBottom: 24 }}>Menu Principal (1ª mensagem para o cliente)</h3>

                    <div className="form-group">
                        <label className="form-label">Mensagem de boas-vindas</label>
                        <textarea className="form-control" rows="3" defaultValue="Olá! 👋 Pra te atender mais rápido, escolha uma opção:" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tipo de Menu</label>
                        <div style={{ display: 'flex', gap: 12 }}>
                            {['list', 'buttons'].map(t => (
                                <button key={t} className={`btn ${menuType === t ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setMenuType(t)}>
                                    {t === 'list' ? '📋 Lista (recomendado)' : '🔘 Botões'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: 16 }}>
                        <label className="form-label">Opções do Menu</label>
                        {departments.map((d, i) => (
                            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, padding: 12, backgroundColor: 'var(--bg-tertiary)', borderRadius: 8 }}>
                                <span style={{ fontWeight: 700, color: 'var(--accent-color)', width: 24 }}>{i + 1}</span>
                                <input type="text" className="form-control" defaultValue={d.name} style={{ flex: 1 }} />
                            </div>
                        ))}
                    </div>

                    {/* Preview */}
                    <div style={{ marginTop: 24, padding: 20, backgroundColor: '#075e54', borderRadius: 12, maxWidth: 320 }}>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Preview WhatsApp</p>
                        <div style={{ backgroundColor: '#dcf8c6', color: 'black', padding: 12, borderRadius: '0 12px 12px 12px', fontSize: '0.9rem', marginBottom: 8 }}>
                            Olá! 👋 Pra te atender mais rápido, escolha uma opção:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {departments.map((d, i) => (
                                <div key={d.id} style={{ backgroundColor: 'white', color: '#075e54', padding: '8px 12px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                                    {i + 1}. {d.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline" onClick={() => setStep(0)}>Voltar</button>
                        <button className="btn btn-primary" onClick={() => setStep(2)}>Próximo: Departamentos <ChevronRight size={16} /></button>
                    </div>
                </div>
            )}

            {/* Step 2 — Departamentos */}
            {step === 2 && (
                <div>
                    <h3 style={{ marginBottom: 24 }}>Configuração por Departamento</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {departments.map((dep) => (
                            <div key={dep.id} className="card">
                                <h4 style={{ marginBottom: 16, color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {dep.name === 'Administrativo' && '🏢'}
                                    {dep.name === 'Comercial' && '💼'}
                                    {dep.name === 'Pós-vendas' && '🤝'}
                                    {dep.name}
                                </h4>

                                <div className="responsive-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Atendente(s) responsável</label>
                                        <select className="form-control" defaultValue={dep.agents[0]}>
                                            <option>Admin Principal</option>
                                            <option>Gestor de Tráfego 1</option>
                                            <option>Financeiro</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Modo IA</label>
                                        <select className="form-control" defaultValue={dep.name === 'Administrativo' ? 'auto' : 'suggest'}>
                                            <option value="auto">🤖 Resposta automática (IA)</option>
                                            <option value="suggest">💡 IA sugere, atendente aprova</option>
                                            <option value="off">👤 Apenas humano</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Mensagem de boas-vindas do setor</label>
                                    <input type="text" className="form-control" defaultValue={dep.greeting} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Perguntas obrigatórias ({dep.questions.length})</label>
                                    {dep.questions.map((q, qi) => (
                                        <div key={qi} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                            <span style={{ color: 'var(--accent-color)', fontWeight: 700, width: 24 }}>{qi + 1}</span>
                                            <input type="text" className="form-control" defaultValue={q} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline" onClick={() => setStep(1)}>Voltar</button>
                        <button className="btn btn-primary" onClick={() => setStep(3)}>Próximo: Testar <ChevronRight size={16} /></button>
                    </div>
                </div>
            )}

            {/* Step 3 — Teste */}
            {step === 3 && (
                <div className="card" style={{ maxWidth: 600 }}>
                    <h3 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Zap size={24} color="var(--accent-color)" /> Testar Configuração
                    </h3>
                    <p className="text-muted" style={{ marginBottom: 24 }}>
                        Envie uma mensagem de teste para seu próprio WhatsApp para validar que o webhook, menu e CRM estão funcionando.
                    </p>

                    <div className="form-group">
                        <label className="form-label">Seu número de WhatsApp (com DDD)</label>
                        <input type="text" className="form-control" placeholder="+55 19 99999-0000" value={testPhone} onChange={e => setTestPhone(e.target.value)} />
                    </div>

                    <button className="btn btn-primary" onClick={handleSendTest} style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
                        <MessageSquare size={16} /> Enviar Mensagem de Teste
                    </button>

                    <div style={{ marginTop: 32, padding: 20, backgroundColor: 'var(--bg-tertiary)', borderRadius: 12 }}>
                        <h4 style={{ marginBottom: 16 }}>Checklist de Validação</h4>
                        {[
                            'Webhook recebeu a mensagem (GET challenge OK)',
                            'Contact criado automaticamente no CRM',
                            'Conversation aberta com status "novo"',
                            'Menu 1/2/3 enviado ao contato',
                            'Resposta do contato moveu para departamento',
                            'IA sugeriu resposta no Inbox'
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 5 ? '1px solid var(--border-color)' : 'none' }}>
                                <input type="checkbox" style={{ width: 18, height: 18, accentColor: 'var(--accent-color)' }} />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline" onClick={() => setStep(2)}>Voltar</button>
                        <button className="btn btn-primary" onClick={handleFinish}>
                            <CheckCircle size={16} /> Finalizar e Ativar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhatsAppSetup;
