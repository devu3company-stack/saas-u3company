const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `Você é o assistente virtual da U3 Company, uma agência de marketing digital e tráfego pago.

REGRAS IMPORTANTES:
- Responda SEMPRE em português brasileiro, de forma profissional mas amigável.
- Seja objetivo e direto, sem enrolação.
- Nunca invente dados, preços ou prazos que não foram fornecidos no contexto.
- Se não souber algo, diga que vai verificar com a equipe.
- Use emojis com moderação (máximo 1-2 por mensagem).
- Mantenha respostas curtas (máximo 3 parágrafos).

CONTEXTO DA U3 COMPANY:
- Serviços: Gestão de Tráfego Pago (Meta Ads, Google Ads, TikTok Ads), Criação de Landing Pages, CRM e Automações.
- Diferenciais: Relatórios semanais, reuniões quinzenais de alinhamento, gestor dedicado.
- Horário de atendimento: Seg-Sex 9h às 18h.

MODOS DE ATENDIMENTO:
- ADMINISTRATIVO: Responda diretamente sobre horários, endereço, documentos, boletos.
- COMERCIAL: Qualifique o lead (cidade, serviço de interesse, orçamento estimado, melhor horário). Seja consultivo.
- PÓS-VENDAS: Seja empático, resolva dúvidas, encaminhe para o gestor se necessário.

Baseado no histórico de mensagens abaixo, gere a melhor resposta possível.`;

export const generateAISuggestion = async (messages, department = 'Comercial') => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey || apiKey === 'SUA_CHAVE_AQUI') {
        return {
            success: false,
            text: '⚠️ API Key da Groq não configurada. Acesse console.groq.com/keys para gerar uma chave gratuita e adicione no arquivo .env como VITE_GROQ_API_KEY=sua_chave',
        };
    }

    // Mapeamento do histórico em formato ChatML
    const chatMessages = [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\nDepartamento atual: ${department}` },
        ...messages.map(m => ({
            role: m.dir === 'in' ? 'user' : 'assistant',
            content: m.text
        }))
    ];

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: chatMessages,
                temperature: 0.7,
                max_tokens: 300,
            }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err?.error?.message || `Erro ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();

        if (!text) throw new Error('Resposta vazia da IA');

        return { success: true, text };
    } catch (error) {
        console.error('Erro ao chamar Groq:', error);
        return {
            success: false,
            text: `Erro ao gerar sugestão: ${error.message}`,
        };
    }
};

export const extractContactFields = async (messages) => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey || apiKey === 'SUA_CHAVE_AQUI') return null;

    const chatText = messages.map(m => `${m.dir === 'in' ? 'Cliente' : 'Atendente'}: ${m.text}`).join('\n');

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'Extraia dados do cliente da conversa abaixo. Retorne APENAS um JSON válido com os campos: nome, cidade, interesse, urgencia (baixa/media/alta), intencao (compra/duvida/suporte). Se não conseguir identificar, use null.'
                    },
                    { role: 'user', content: chatText }
                ],
                temperature: 0.1,
                max_tokens: 200,
            }),
        });

        if (!response.ok) return null;

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();

        // Tenta fazer parse do JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch {
        return null;
    }
};
