# 🚀 SaaS de Gestão para Agências de Marketing

Sistema completo de gestão interna para agências de marketing digital, desenvolvido com React + Vite. Inclui CRM, gestão de tarefas, tracking de campanhas, White-Label e muito mais.

---

## ✨ Funcionalidades

### 📊 Dashboard Inteligente
- MRR dinâmico calculado automaticamente a partir dos contratos ativos
- KPIs de tarefas pendentes, atrasadas e NPS
- Alertas de churn e visão executiva

### 👥 CRM & Funil de Vendas
- Pipeline completo de leads (Topo → Qualificação → Proposta → Fechamento)
- Prospecção ativa com pontuação de leads
- Gestão de reuniões e agendamentos

### ✅ Gestão de Tarefas (Kanban)
- Quadro Kanban com Drag & Drop
- Timer de execução em tempo real
- Prioridades, tags, cores customizáveis
- Upload de criativos/flyers como anexos
- Visão lista e visão Kanban

### 📈 Tracking de Campanhas (UTMfy)
- Painel de performance de campanhas Meta Ads
- Métricas: clicks, leads, vendas, ROAS, CPL
- Gráficos de performance e breakdown por device

### 🎨 Materiais & Briefing por Cliente
- Upload de logo por cliente
- Campo de briefing de design (cores, fontes, tom de voz)
- Galeria de materiais e assets (flyers, criativos, guias de marca)

### 🔐 Controle de Acesso Avançado
- Criar e deletar usuários
- 6 cargos pré-definidos com presets de permissão
- **Permissões 100% customizáveis** por usuário via checkboxes
- Visão restrita para designers (sem financeiro)

### 💰 Financeiro
- Relatórios de faturamento
- Controle de inadimplência

### 🏷️ White-Label
- Personalização de marca do SaaS
- Configuração de cores e logo

---

## 🛠️ Stack Técnica

| Tecnologia | Uso |
|-----------|-----|
| React 18 | Frontend SPA |
| Vite | Build tool |
| React Router DOM | Navegação |
| Lucide React | Ícones |
| Recharts | Gráficos |
| Express.js | Backend (API Meta) |
| Vercel | Deploy |

---

## 📦 Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm run dev

# 3. Build para produção
npm run build
```

### Backend (API Meta Tracking)
```bash
cd saas-backend
npm install
npm start
```

### Variáveis de Ambiente (.env)
```
VITE_META_PIXEL_ID=seu_pixel_id
META_API_TOKEN=seu_token_meta
```

---

## 🚀 Deploy (Vercel)

1. Crie um repositório no GitHub
2. Importe no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático a cada push

---

## 👤 Credenciais de Teste

| E-mail | Senha | Cargo |
|--------|-------|-------|
| demo@u3company.com | demo | CEO |
| ceo@u3company.com | ceo | Admin oculto |
| designer@u3company.com | designer123 | Designer |

> ⚠️ **Altere essas credenciais** ao colocar em produção.

---

## 📂 Estrutura de Pastas

```
📁 pacote-saas/
├── 📁 src/
│   ├── 📁 pages/          # Todas as páginas do SaaS
│   ├── 📁 layouts/        # Layout do dashboard (sidebar)
│   ├── 📁 utils/          # Auth, AI, Calendar, Meta Pixel
│   ├── 📁 assets/         # Assets estáticos
│   ├── App.jsx            # Rotas principais
│   ├── main.jsx           # Entry point
│   └── index.css          # Design system completo
├── 📁 public/             # Favicon e assets públicos
├── 📁 saas-backend/       # Backend Express (Meta API)
├── index.html             # HTML base
├── package.json           # Dependências
├── vite.config.js         # Configuração Vite
├── vercel.json            # Config de deploy
└── README.md              # Este arquivo
```

---

## 📝 Licença

Software proprietário. Todos os direitos reservados.
Uso autorizado apenas para o comprador.

---

Desenvolvido com 💜 por U3 Company
