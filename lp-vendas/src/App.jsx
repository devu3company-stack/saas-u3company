import React, { useEffect, useState } from 'react';
import { CheckCircle, BarChart2, MessageCircle, GitBranch, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import './index.css';

const App = () => {

  const KIWIFY_LINK = "https://pay.kiwify.com.br/AkbuJgK";
  const [checkoutUrl, setCheckoutUrl] = useState(KIWIFY_LINK);

  useEffect(() => {
    document.title = "U3 SaaS - Acelere suas Vendas";

    // Captura e mantem UTMs de rastreio (estilo UTMfy)
    const urlParams = new URLSearchParams(window.location.search);

    // Se veio parâmetros novos na URL, salva (para o usuário não perder a origem se der reload na página)
    if (Array.from(urlParams.keys()).length > 0) {
      localStorage.setItem('u3_utm_params', urlParams.toString());
    }

    // Monta a URL de destino com os parâmetros capturados
    const storedParams = localStorage.getItem('u3_utm_params');
    if (storedParams) {
      setCheckoutUrl(`${KIWIFY_LINK}?${storedParams}`);
    }
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap fill="currentColor" /> U3 SaaS
        </div>
        <div>
          <a href="https://saas-u3company.vercel.app/login" className="btn btn-outline" style={{ marginRight: 16, textDecoration: 'none' }}>Fazer Login</a>
          <button className="btn btn-primary" onClick={() => window.open(checkoutUrl, '_blank')}>
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
          <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)' }} onClick={() => window.open(checkoutUrl, '_blank')}>
            Começar hoje por R$ 47,90/mês <ArrowRight size={24} />
          </button>
        </div>

        {/* Dashboard Print */}
        <div style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 16, border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          <img src="/prints/dashboard.png" alt="Dashboard do SaaS" style={{ width: '100%', display: 'block', backgroundColor: 'var(--bg-tertiary)', minHeight: 400, objectFit: 'cover' }} onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1100x600/1a1d24/00e5ff?text=Gerando+Print+do+Dashboard...';
          }} />
        </div>
      </header>

      {/* Features Section */}
      <section style={{ padding: '100px 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 16 }}>Tudo o que você precisa para crescer</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Esqueça dezenas de ferramentas caras e integrações complexas. Nós unificamos o essencial.</p>
        </div>

        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, maxWidth: 1200, margin: '0 auto' }}>

          {/* CRM */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 32, flex: 1 }}>
              <GitBranch size={40} color="var(--accent-color)" style={{ marginBottom: 24 }} />
              <h3 style={{ marginBottom: 16, fontSize: '1.5rem' }}>CRM e Pipilene de Vendas</h3>
              <p style={{ color: 'var(--text-muted)' }}>Acompanhe cada lead no funil. Saiba exatamente onde cada oportunidade está e feche negócios mais rápido.</p>
            </div>
            <img src="/prints/crm.png" alt="Print CRM" style={{ width: '100%', borderTop: '1px solid var(--border-color)', objectFit: 'cover', maxHeight: 250 }} onError={(e) => e.target.src = 'https://via.placeholder.com/600x400/1a1d24/00e5ff?text=Print+Clientes'} />
          </div>

          {/* WhatsApp */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 32, flex: 1 }}>
              <MessageCircle size={40} color="var(--accent-color)" style={{ marginBottom: 24 }} />
              <h3 style={{ marginBottom: 16, fontSize: '1.5rem' }}>Automação de WhatsApp</h3>
              <p style={{ color: 'var(--text-muted)' }}>Crie fluxos de atendimento com nosso editor visual inteligente. Atenda clientes 24/7 sem nenhum esforço humano.</p>
            </div>
            <img src="/prints/flow.png" alt="Print Flow Builder" style={{ width: '100%', borderTop: '1px solid var(--border-color)', objectFit: 'cover', maxHeight: 250 }} onError={(e) => e.target.src = 'https://via.placeholder.com/600x400/1a1d24/00e5ff?text=Print+Fluxos'} />
          </div>

          {/* Analytics */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 32, flex: 1 }}>
              <BarChart2 size={40} color="var(--accent-color)" style={{ marginBottom: 24 }} />
              <h3 style={{ marginBottom: 16, fontSize: '1.5rem' }}>Análise de Tráfego e ROI</h3>
              <p style={{ color: 'var(--text-muted)' }}>Mensure seus resultados do Meta Ads. Acompanhe CPL, CAC, ROAS e receba insights gerados pela inteligência artificial.</p>
            </div>
            <img src="/prints/traffic.png" alt="Print Dashboard Tráfego" style={{ width: '100%', borderTop: '1px solid var(--border-color)', objectFit: 'cover', maxHeight: 250 }} onError={(e) => e.target.src = 'https://via.placeholder.com/600x400/1a1d24/00e5ff?text=Print+Trafego'} />
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '100px 5%', backgroundColor: 'var(--bg-secondary)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: 16 }}>Plano Único. Sem Surpresas.</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 60, fontSize: '1.1rem' }}>Tenha acesso a todas as funcionalidades por um valor que ajuda sua empresa a lucrar mais.</p>

        <div className="card" style={{ maxWidth: 450, margin: '0 auto', padding: 48, border: '2px solid var(--accent-color)', position: 'relative', boxShadow: '0 10px 30px rgba(0, 229, 255, 0.15)' }}>
          <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-color)', color: '#000', padding: '6px 20px', borderRadius: 20, fontWeight: 'bold', fontSize: '0.9rem' }}>
            Tudo Liberado
          </div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: 16 }}>Acesso Pro</h3>
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: 8 }}>
            R$ 47,90
          </div>
          <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: 32 }}>por mês, cancele quando quiser.</div>

          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.1rem' }}><CheckCircle size={22} color="var(--success)" /> <strong>CRM de Vendas</strong> Completo</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.1rem' }}><CheckCircle size={22} color="var(--success)" /> <strong>Construtor de Fluxos</strong> WhatsApp</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.1rem' }}><CheckCircle size={22} color="var(--success)" /> Relatórios de <strong>Meta Ads e ROI</strong></li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.1rem' }}><CheckCircle size={22} color="var(--success)" /> Gestor <strong>Financeiro Integrado</strong></li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.1rem' }}><CheckCircle size={22} color="var(--success)" /> Multi-Atendentes (Inbox)</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.1rem' }}><CheckCircle size={22} color="var(--success)" /> Atualizações Gratuitas</li>
          </ul>

          <button className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }} onClick={() => window.open(checkoutUrl, '_blank')}>
            <ShieldCheck size={24} /> Assinar e Começar
          </button>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 20 }}>Pagamento 100% seguro via Kiwify.</p>
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
