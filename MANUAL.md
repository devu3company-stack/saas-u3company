# 📘 Manual Completo do SaaS — U3 CRM

> Versão: 1.0 | Data: 20/02/2026  
> Endereço local: http://localhost:5173

---

## 🔐 1. Login (`/login`)

**O que faz:** Tela de autenticação para acessar o sistema.

### Como testar:
- [ ] Acessar `http://localhost:5173/login`
- [ ] Preencher e-mail e senha (demo: `admin@u3company.com` / `admin123`)
- [ ] Clicar "Acessar Plataforma"
- [ ] Verificar se redireciona para o Dashboard
- [ ] Clicar em "Esqueceu?" e verificar se o link aparece

---

## 📊 2. Dashboard (`/dashboard`)

**O que faz:** Visão geral com KPIs, reuniões do dia e alertas de clientes em risco.

### Como testar:
- [ ] Verificar se os 4 cards KPIs aparecem (Novos Clientes, MRR, Reuniões, NPS)
- [ ] Verificar se a lista "Reuniões de Hoje" carrega com 3 itens
- [ ] Verificar se "Clientes em Risco" aparece com NPS baixo
- [ ] Clicar no nome de um cliente em risco → deve ir para Cliente 360°

---

## 👥 3. Clientes (`/clientes`)

**O que faz:** Lista de clientes com filtros e cadastro.

### Como testar:
- [ ] Ver tabela com 5 clientes (mock)
- [ ] Clicar nos filtros (Todos / Ativo / Pausado / Cancelado)
- [ ] Verificar badges coloridos (Amarelo=Ativo, Cinza=Pausado, Vermelho=Cancelado)
- [ ] Clicar **"Novo Cliente"** → modal deve abrir
- [ ] Preencher formulário e clicar "Salvar e Iniciar Onboarding"
- [ ] Clicar **"Visão 360°"** em qualquer cliente → deve navegar para detalhe

---

## 🔄 4. Cliente 360° (`/clientes/:id`)

**O que faz:** Visão completa do cliente com abas.

### Como testar:
- [ ] Verificar header com nome + badge de status
- [ ] Clicar em cada aba e verificar:
  - [ ] **Resumo Geral**: cards Início, MRR, NPS
  - [ ] **Reuniões**: tabela com histórico
  - [ ] **Contratos/Docs**: área de upload + documento mock
  - [ ] **Cofre & Links**: tabela com senhas ocultas + botão "Revelar"
  - [ ] **Tarefas**: lista com badge "Vencido"
  - [ ] **NPS**: nota + comentário

---

## 🎯 5. Leads (`/leads`)

**O que faz:** Pipeline kanban de leads do tráfego.

### Como testar:
- [ ] Verificar 5 colunas (Novo / Contato / Diagnóstico / Proposta / Fechado)
- [ ] Ver cards de leads distribuídos nas colunas
- [ ] Verificar botões de ação (WhatsApp, Agendar Reunião)
- [ ] Clicar "Copiar Webhook URL"

---

## 📅 6. Reuniões (`/reunioes`)

**O que faz:** Agenda com integração Google Calendar.

### Como testar:
- [ ] Ver lista de próximos compromissos (3 itens)
- [ ] Clicar **"Nova Reunião"** → modal deve abrir
- [ ] Preencher título, cliente, data, horários
- [ ] Clicar **"Salvar no G Agenda"** → deve abrir o Google Calendar em nova aba com dados preenchidos
- [ ] Verificar se o e-mail `contato@u3company.com` aparece como convidado no Calendar

---

## 📈 7. Dashboard Tráfego (`/trafego`)

**O que faz:** Planilha mágica com cálculos de performance por cliente.

### Como testar:
- [ ] Verificar **seletor de cliente** no topo (AlphaTech / Imobiliária / Construtora)
- [ ] Trocar cliente e observar (dados são mock por enquanto)
- [ ] Verificar 8 cards: Investimento, Receita, ROAS, CAC, CPL, Mensagens, Cliques, CTR
- [ ] Verificar gráfico **"Investimento vs Receita"** (barras)
- [ ] Verificar gráfico **"Evolução do ROAS"** (linha)
- [ ] Preencher campo "Aprendizados do Mês"
- [ ] Clicar **"Exportar Relatório"**
- [ ] Clicar **"Importar Mídia"**

---

## 🎓 8. Portal do Cliente / Academy (`/academy`)

**O que faz:** Área de treinamento e onboarding com trilhas.

### Como testar:
- [ ] Verificar **seletor de cliente** no topo
- [ ] Ver barra de progresso (33%)
- [ ] Marcar/desmarcar checkboxes das lições
- [ ] Ver a trilha lateral "Sua Jornada" (4 etapas)

---

## 🏆 9. Metas (`/metas`)

**O que faz:** Acompanhamento de metas mensais com barras de progresso.

### Como testar:
- [ ] Ver 4 metas (Novos Clientes, MRR, Reuniões, Propostas)
- [ ] Verificar barras de progresso com % calculado
- [ ] Clicar **"Nova Meta"**

---

## ⭐ 10. Pesquisas NPS (`/pesquisas`)

**O que faz:** Feedback dos clientes com scores.

### Como testar:
- [ ] Ver card "Média Geral NPS" (8.9)
- [ ] Ver card "Respostas no Mês" (12)
- [ ] Ver tabela com 3 respostas (notas coloridas: verde/vermelho/amarelo)
- [ ] Clicar **"Relatório Completo"**

---

## ⚙️ 11. Configurações (`/configuracoes`)

**O que faz:** Ajustes do sistema, usuários e integrações.

### Como testar:
- [ ] **Aba "Geral"**: editar nome da empresa e e-mail
- [ ] **Aba "Usuários e Permissões"**:
  - [ ] Ver tabela de 3 usuários
  - [ ] Alterar tipo de acesso (Admin / SDR / Financeiro / Cliente)
  - [ ] Clicar ícone de lixeira (excluir)
  - [ ] Clicar **"Convidar Usuário"**
- [ ] **Aba "Integrações (API)"**: copiar webhook URL

---

## 💬 12. Inbox / Chat WhatsApp (`/inbox`)

**O que faz:** Central de mensagens com IA integrada.

### Como testar:
- [ ] Ver 3 conversas na lista lateral esquerda
- [ ] Clicar em cada conversa e ver o histórico de mensagens
- [ ] Verificar mensagens marcadas como "🤖 Automático"
- [ ] Clicar botão **"IA"** → deve mostrar "Pensando..." e depois exibir sugestão
  - ⚠️ **Requer API Key da Groq** configurada no `.env` (gratuita)
- [ ] Clicar **"Usar Resposta"** → texto vai pro campo de input
- [ ] Clicar **"Descartar"** → sugestão some
- [ ] Ver painel CRM à direita (Pipeline, Departamento, Tags, Campos da IA)
- [ ] Clicar **"Converter em Cliente"**, **"Criar Tarefa"**, **"Agendar Reunião"**

---

## 📱 13. Conectar WhatsApp (`/whatsapp-setup`)

**O que faz:** Wizard de 4 passos para conectar WhatsApp Business.

### Como testar:
- [ ] **Passo 1**: Selecionar cliente → clicar "Iniciar Embedded Signup" → aguardar conexão simulada
- [ ] **Passo 2**: Editar mensagem de boas-vindas + tipo de menu (Lista/Botões) + ver preview WhatsApp
- [ ] **Passo 3**: Configurar cada departamento (atendente, modo IA, perguntas)
- [ ] **Passo 4**: Preencher telefone + marcar checklist de validação + "Finalizar e Ativar"

---

## 🔀 14. Editor de Fluxos (`/fluxos`)

**O que faz:** Configuração visual dos fluxos de atendimento WhatsApp.

### Como testar:
- [ ] Ver nodes do fluxo "Menu Principal" com cores por tipo
- [ ] Verificar legenda (Mensagem / Menu / Pergunta / Ação)
- [ ] Ver opções do menu (1. Admin / 2. Comercial / 3. Pós-vendas)
- [ ] Clicar **"Novo Fluxo"** / **"Adicionar Etapa"**

---

## 📝 15. Templates WhatsApp (`/templates`)

**O que faz:** Gerenciador de templates para mensagens fora da janela 24h.

### Como testar:
- [ ] Ver alerta amarelo explicando a regra de 24h
- [ ] Ver 5 templates pré-cadastrados com status (Aprovado / Aguardando)
- [ ] Ver variáveis de cada template ({{1}}, {{2}})
- [ ] Clicar **"Novo Template"** → modal abre
- [ ] Preencher e clicar "Enviar para Aprovação"
- [ ] Clicar ícone de copiar em qualquer template

---

## 🔑 Configuração da IA (Groq - Gratuita)

### Passo a passo:
1. Acesse [console.groq.com/keys](https://console.groq.com/keys)
2. Crie uma conta (pode usar Google login)
3. Clique "Create API Key"
4. Copie a chave gerada
5. Abra o arquivo `.env` na raiz do projeto
6. Substitua `SUA_CHAVE_AQUI` pela sua chave:
   ```
   VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
7. Reinicie o servidor (`Ctrl+C` → `npm run dev`)
8. Teste no Inbox clicando o botão "IA"

---

## 🗂 Estrutura de Arquivos

```
src/
├── layouts/
│   └── DashboardLayout.jsx    ← Layout geral (sidebar + topbar)
├── pages/
│   ├── Login.jsx              ← Autenticação
│   ├── Dashboard.jsx          ← Home / KPIs
│   ├── Clients.jsx            ← Lista de clientes
│   ├── ClientDetail.jsx       ← Cliente 360°
│   ├── Leads.jsx              ← Pipeline de leads
│   ├── Meetings.jsx           ← Reuniões + Google Calendar
│   ├── Traffic.jsx            ← Dashboard Tráfego
│   ├── Academy.jsx            ← Portal do Cliente
│   ├── Goals.jsx              ← Metas
│   ├── Surveys.jsx            ← NPS
│   ├── Settings.jsx           ← Configurações + Usuários
│   ├── Inbox.jsx              ← Chat WhatsApp + IA
│   ├── WhatsAppSetup.jsx      ← Wizard de conexão
│   ├── FlowEditor.jsx         ← Editor de fluxos
│   └── Templates.jsx          ← Templates WhatsApp
├── utils/
│   ├── ai.js                  ← Integração Groq (Llama 3.3)
│   └── calendar.js            ← URL Google Calendar
├── index.css                  ← Design system U3
└── App.jsx                    ← Rotas
```
