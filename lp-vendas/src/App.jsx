import React, { useEffect } from 'react';
import { CheckCircle, BarChart2, MessageCircle, GitBranch, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import './index.css';

const App = () => {

  useEffect(() => {
    document.title = "U3 SaaS - Acelere suas Vendas";
  }, []);

  const KIWIFY_LINK = "https://pay.kiwify.com.br/AkbuJgK";

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap fill="currentColor" /> U3 SaaS
        </div>
        <div>
          <a href="https://saas-u3company.vercel.app/login" className="btn btn-outline" style={{ marginRight: 16, textDecoration: 'none' }}>Fazer Login</a>
          <button className="btn btn-primary" onClick={() => window.open(KIWIFY_LINK, '_blank')}>
            Assinar Agora
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ padding: '80px 5% 40px', textAlign: 'center', background: 'radial-gradient(circle at top, var(--bg-secondary) 0%, var(--bg-color) 100%)' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: 24, maxWidth: 900, margin: '0 auto 24px', lineHeight: 1.2 }}>
          A Plataforma Definitiva para <span style={{ color: 'var(--accent-color)' }}>Automatizar e Escalar Vendas</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: 700, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Gestão de CRM, Automação de WhatsApp (Fluxos), Análise de Tráfego e Gestão Financeira. O ecossistema completo que sua empresa precisa por uma única assinatura acessível.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 60 }}>
          <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)' }} onClick={() => window.location.href = "#pricing"}>
            Ver Planos e Começar <ArrowRight size={24} />
          </button>
        </div>

        {/* Dashboard Print */}
        <div style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 16, border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          <img src="/prints/dashboard.png" alt="Dashboard do SaaS" style={{ width: '100%', display: 'block', backgroundColor: 'var(--bg-tertiary)', minHeight: 400, objectFit: 'cover' }} onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1100x600/1a1d24/00e5ff?text=Dashboard+Premium+U3+Company';
          }} />
        </div>
      </header>

      {/* Benefits Section */}
      <section style={{ padding: '100px 5%', backgroundColor: 'var(--bg-color)' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 16 }}>Por que escolher o U3 SaaS?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Tudo o que sua agência ou empresa de serviços precisa para ser lucrativa.</p>
        </div>

        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
          <div className="card" style={{ padding: 24 }}>
            <h4 style={{ color: 'var(--accent-color)', marginBottom: 12 }}>🚀 Escala Acelerada</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Automatize processos manuais e foque apenas no que traz dinheiro: a estratégia.</p>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h4 style={{ color: 'var(--accent-color)', marginBottom: 12 }}>📊 Decisões Baseadas em Dados</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Mensure seu ROI em tempo real. Saiba exatamente qual campanha está performando.</p>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h4 style={{ color: 'var(--accent-color)', marginBottom: 12 }}>🤖 IA Integrada</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Insights preditivos e automações inteligentes para prever churn e otimizar funis.</p>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h4 style={{ color: 'var(--accent-color)', marginBottom: 12 }}>💎 White Label Premium</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sua marca, suas cores. Entregue um portal profissional para seus clientes.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 16 }}>Funcionalidades de Elite</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Esqueça dezenas de ferramentas caras. Nós unificamos o ecossistema.</p>
        </div>

        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, maxWidth: 1200, margin: '0 auto' }}>

          {/* CRM */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 32, flex: 1 }}>
              <GitBranch size={40} color="var(--accent-color)" style={{ marginBottom: 24 }} />
              <h3 style={{ marginBottom: 16, fontSize: '1.5rem' }}>CRM e Pipeline de Vendas</h3>
              <p style={{ color: 'var(--text-muted)' }}>Acompanhe cada lead no funil. Gestão de status, etiquetas e histórico completo de interações.</p>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 32, flex: 1 }}>
              <MessageCircle size={40} color="var(--accent-color)" style={{ marginBottom: 24 }} />
              <h3 style={{ marginBottom: 16, fontSize: '1.5rem' }}>Automação de WhatsApp</h3>
              <p style={{ color: 'var(--text-muted)' }}>Construtor visual de fluxos. Envie mensagens, arquivos e qualifique leads automaticamente 24/7.</p>
            </div>
          </div>

          {/* Analytics */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 32, flex: 1 }}>
              <BarChart2 size={40} color="var(--accent-color)" style={{ marginBottom: 24 }} />
              <h3 style={{ marginBottom: 16, fontSize: '1.5rem' }}>Tráfego e Dashboard 360°</h3>
              <p style={{ color: 'var(--text-muted)' }}>Integração com Meta Ads. ROI, CPA e ROAS calculados automaticamente para seus clientes.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '100px 5%', backgroundColor: 'var(--bg-secondary)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: 16 }}>Escolha seu Modelo de Sucesso</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 60, fontSize: '1.1rem' }}>Seja como assinante ou dono do código, nós temos o plano ideal.</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', maxWidth: 1100, margin: '0 auto' }}>

          {/* Plano Mensal */}
          <div className="card" style={{ flex: 1, minWidth: 320, maxWidth: 450, padding: 48, border: '2px solid var(--accent-color)', position: 'relative', boxShadow: '0 10px 30px rgba(0, 229, 255, 0.15)' }}>
            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-color)', color: '#000', padding: '6px 20px', borderRadius: 20, fontWeight: 'bold', fontSize: '0.9rem' }}>
              RECORRENTE
            </div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: 16 }}>Assinante SaaS</h3>
            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: 8 }}>
              R$ 147,00
            </div>
            <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: 32 }}>por mês</div>

            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}><CheckCircle size={20} color="var(--success)" /> Acesso Completo ao Painel</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}><CheckCircle size={20} color="var(--success)" /> CRM e Automações de Whats</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}><CheckCircle size={20} color="var(--success)" /> Dashboards de Tráfego</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}><CheckCircle size={20} color="var(--success)" /> Suporte e Atualizações</li>
            </ul>

            <button className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.2rem', fontWeight: 'bold' }} onClick={() => window.open("https://pay.kiwify.com.br/AkbuJgK", '_blank')}>
              Assinar Agora
            </button>
          </div>

          {/* Código Fonte */}
          <div className="card" style={{ flex: 1, minWidth: 320, maxWidth: 450, padding: 48, position: 'relative' }}>
            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'var(--warning)', color: '#000', padding: '6px 20px', borderRadius: 20, fontWeight: 'bold', fontSize: '0.9rem' }}>
              OPORTUNIDADE ÚNICA
            </div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: 16 }}>Código Fonte</h3>
            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: 8 }}>
              R$ 1.297
            </div>
            <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: 32 }}>pagamento único</div>

            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}><CheckCircle size={20} color="var(--success)" /> Código Fonte Completo (Full Stack)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}><CheckCircle size={20} color="var(--success)" /> Direito de Revenda (White Label)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}><CheckCircle size={20} color="var(--success)" /> Repositório Frontend e Backend</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}><CheckCircle size={20} color="var(--success)" /> Documentação de Deploy</li>
            </ul>

            <button className="btn btn-outline" style={{ width: '100%', padding: '18px', fontSize: '1.2rem', fontWeight: 'bold' }} onClick={() => window.open("https://pay.kiwify.com.br/AkbuJgK?codigo_fonte=true", '_blank')}>
              Comprar Código Fonte
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px 5% 40px', backgroundColor: 'var(--bg-color)', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 40 }}>
          <div>
            <div style={{ marginBottom: 16, fontWeight: 'bold', color: 'var(--text-color)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap fill="currentColor" /> U3 SaaS
            </div>
            <p style={{ maxWidth: 300 }}>Seu sistema de vendas autônomo. Simplifique suas ferramentas e escale seu negócio.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-color)', marginBottom: 16 }}>Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><a href="https://saas-u3company.vercel.app/login" style={{ color: 'inherit', textDecoration: 'none' }}>Login</a></li>
              <li><a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Planos</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-color)', marginBottom: 16 }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Termos de Uso</li>
              <li>Política de Privacidade</li>
            </ul>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '40px auto 0', paddingTop: 24, borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} U3 Company. Todos os direitos reservados. Feito com amor por desenvolvedores e IA.
        </div>
      </footer>
    </div>
  );
};

export default App;
