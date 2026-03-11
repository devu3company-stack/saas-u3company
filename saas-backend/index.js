require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const http = require('http');
const { Server } = require('socket.io');
const ioClient = require('socket.io-client');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('./db');
const { searchLeads } = require('./services/puppeteerScraper');

const app = express();
app.use(cors());
app.use(express.json());

// Health check para Railway
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Environment configs
const ZAPPRO_API_URL = process.env.ZAPPRO_API_URL || 'https://bk.lrcatelan.com';
const ZAPPRO_API_TOKEN = process.env.ZAPPRO_API_TOKEN;
const ZAPPRO_COMPANY_ID = process.env.ZAPPRO_COMPANY_ID || '1';
const ZAPPRO_USER_ID = process.env.ZAPPRO_USER_ID || '1';

// Email Config
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT || 465;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || '"U3 Company Support" <suporte@u3company.com>';

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: Number(EMAIL_PORT) === 465, // true for 465, false for other ports
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

//==========================================================
// CONFIGURAÇÃO DO SOCKET.IO (CONEXÃO SAAS -> ZAPPRO)
//==========================================================
console.log(`🔌 Conectando ao Socket ZapPro: ${ZAPPRO_API_URL} | Empresa: ${ZAPPRO_COMPANY_ID} | Usuário: ${ZAPPRO_USER_ID}`);

const zapproSocket = ioClient(`${ZAPPRO_API_URL}/${ZAPPRO_COMPANY_ID}`, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    query: { userId: ZAPPRO_USER_ID },
    transports: ['websocket', 'polling'],
    extraHeaders: {
        origin: "https://chat.lrcatelan.com"
    }
});

zapproSocket.on('connect', () => {
    console.log('✅ Conectado ao Websocket original do ZapPro!');

    // O Zappro Original Exige que nos inscrevamos nestas "Salas" para enviar os dados
    zapproSocket.emit("joinNotification");
    zapproSocket.emit("joinTickets", "pending"); // Fila aguardando
    zapproSocket.emit("joinTickets", "open");    // Fila Abertos
});

zapproSocket.on('disconnect', () => {
    console.log('🔴 Websocket ZapPro desconectado.');
});

// Espelhamento: Tudo que acontece no ZapPro, encaminhamos para o FrontEnd React local!
zapproSocket.on(`company-${ZAPPRO_COMPANY_ID}-appMessage`, (data) => {
    console.log("📩 Nova Mensagem Capturada do ZapPro:", data?.message?.id);
    io.emit('zappro-message', data);
});

zapproSocket.on(`company-${ZAPPRO_COMPANY_ID}-ticket`, (data) => {
    console.log("🎟️ Ticket Atualizado do ZapPro:", data?.ticket?.id);
    io.emit('zappro-ticket', data);
});

zapproSocket.on(`company-${ZAPPRO_COMPANY_ID}-contact`, (data) => {
    console.log("👥 Contato Atualizado no ZapPro:", data?.contact?.id);
    io.emit('zappro-contact', data);
});

//==========================================================
// ROTAS DO BRIDGE CRM
//==========================================================
app.post('/api/whatsapp/send-message', async (req, res) => {
    try {
        const { instanceName, number, text } = req.body;

        if (!ZAPPRO_API_TOKEN || ZAPPRO_API_TOKEN === 'COLE_SEU_TOKEN_AQUI') {
            return res.status(400).json({ error: 'Token não configurado.', success: false });
        }

        if (!number) {
            return res.status(400).json({ error: 'Número de telefone é obrigatório', success: false });
        }

        const payload = {
            number: number,
            body: text,
            sendSignature: false, // Pode adicionar a assinatura do vendedor
            closeTicket: false
        };

        const response = await axios.post(`${ZAPPRO_API_URL}/api/messages/send`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZAPPRO_API_TOKEN}`
            }
        });

        console.log(`[Mensagem ZapPro Enviada] Para: ${number} | Sucesso!`);
        res.json({ success: true, message: 'Mensagem enviada', data: response.data });
    } catch (error) {
        console.error("❌ Erro ao enviar ZapPro:", error?.response?.data || error.message);
        res.status(500).json({ error: 'Erro na API remota', success: false, details: error?.response?.data || error.message });
    }
});

//==========================================================
// ROTAS PARA API DE CONVERSÕES DO META (CAPI)
//==========================================================
app.post('/api/meta/capi', async (req, res) => {
    try {
        const { eventName, eventData, eventId, sourceUrl, userAgent, fbp, fbc } = req.body;

        const META_PIXEL_ID = process.env.VITE_META_PIXEL_ID;
        const META_API_TOKEN = process.env.META_API_TOKEN;

        if (!META_PIXEL_ID || !META_API_TOKEN) {
            return res.status(500).json({ error: 'Configurações de Meta CAPI incompletas. Verifique o .env.' });
        }

        const payloadInfo = {
            data: [
                {
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: "website",
                    event_id: eventId,
                    event_source_url: sourceUrl,
                    user_data: {
                        client_ip_address: req.ip || req.connection.remoteAddress,
                        client_user_agent: userAgent,
                        fbp,
                        fbc,
                        // Aqui você também pode adicionar emd (email), ph (phone), caso você tenha coletado do CRM
                        // convertidos em hash SHA-256
                    },
                    custom_data: eventData || {}
                }
            ]
        };

        const response = await axios.post(`https://graph.facebook.com/v18.0/${META_PIXEL_ID}/events`, payloadInfo, {
            params: { access_token: META_API_TOKEN }
        });

        console.log(`[CAPI Evento] Enviado com sucesso: ${eventName} (${eventId})`);
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error("❌ Erro na API de Conversões do Meta (CAPI):", error?.response?.data || error.message);
        res.status(500).json({ success: false, error: 'Falha no envio do Evento.' });
    }
});


//==========================================================
// DATABASE API - DADOS COMPARTILHADOS ENTRE USUARIOS
//==========================================================

// GET: Busca um dado pelo namespace ("shared" ou "tenant_ID") e pela chave
app.get('/api/data/:namespace/:key', (req, res) => {
    const { namespace, key } = req.params;
    try {
        let value;
        if (namespace === 'shared') {
            value = db.get(`shared.${key}`).value();
        } else {
            value = db.get(`tenants.${namespace}.${key}`).value();
        }
        res.json({ success: true, value: value !== undefined ? value : null });
    } catch (e) {
        res.json({ success: true, value: null });
    }
});

// POST: Salva um dado pelo namespace e chave
app.post('/api/data/:namespace/:key', (req, res) => {
    const { namespace, key } = req.params;
    const { value } = req.body;
    try {
        if (namespace === 'shared') {
            db.set(`shared.${key}`, value).write();
        } else {
            // Garante que o namespace do tenant exista
            if (!db.get(`tenants.${namespace}`).value()) {
                db.set(`tenants.${namespace}`, {}).write();
            }
            db.set(`tenants.${namespace}.${key}`, value).write();
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

//==========================================================
// NPS API - Endpoint público para pesquisas NPS
//==========================================================

// POST: Salva uma resposta NPS no namespace correto
app.post('/api/nps/:namespace', (req, res) => {
    const { namespace } = req.params;
    const { response } = req.body;
    try {
        const key = 'u3_nps_responses';
        let existing;
        if (namespace === 'shared') {
            existing = db.get(`shared.${key}`).value() || [];
        } else {
            if (!db.get(`tenants.${namespace}`).value()) {
                db.set(`tenants.${namespace}`, {}).write();
            }
            existing = db.get(`tenants.${namespace}.${key}`).value() || [];
        }
        existing.push(response);
        if (namespace === 'shared') {
            db.set(`shared.${key}`, existing).write();
        } else {
            db.set(`tenants.${namespace}.${key}`, existing).write();
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// GET: Busca o nome do cliente pelo namespace e ID (para a página pública NPS)
app.get('/api/nps/:namespace/client/:clientId', (req, res) => {
    const { namespace, clientId } = req.params;
    try {
        const key = 'u3_clients_v2';
        let clients;
        if (namespace === 'shared') {
            clients = db.get(`shared.${key}`).value() || [];
        } else {
            clients = db.get(`tenants.${namespace}.${key}`).value() || [];
        }
        const client = clients.find(c => c.id.toString() === clientId.toString());
        res.json({ success: true, clientName: client ? client.name : 'Cliente' });
    } catch (e) {
        res.json({ success: true, clientName: 'Cliente' });
    }
});

// GET: Lista todos os usuarios
app.get('/api/users', (req, res) => {
    const users = db.get('users').value();
    res.json({ success: true, users });
});

// POST: Salva a lista completa de usuarios
app.post('/api/users', (req, res) => {
    const { users } = req.body;
    db.set('users', users).write();
    res.json({ success: true });
});

//==========================================================
// ROTAS DE EXTRAÇÃO DE LEADS
//==========================================================
app.post('/api/extract-leads', async (req, res) => {
    try {
        const { niche, city, state, radius, limit, extraKeywords } = req.body;

        if (!niche || !city || !state) {
            return res.status(400).json({ error: 'Niche, city and state are required.' });
        }

        console.log(`Starting extraction for ${niche} in ${city} - ${state}...`);

        // Fetch leads from Google Places API
        const leads = await searchLeads({ niche, city, state, radius, limit, extraKeywords });

        console.log(`Extraction finished. Found ${leads.length} leads.`);

        res.json({
            success: true,
            totalFound: leads.length,
            leads
        });
    } catch (error) {
        console.error('Error during extraction process:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

//==========================================================
// WEBHOOK KIWIFY - AUTOMAÇÃO DE VENDAS
//==========================================================
app.post('/api/webhooks/kiwify', async (req, res) => {
    console.log('📦 Recebido Webhook Kiwify:', req.body.order_status);

    const { order_status, customer } = req.body;

    if (order_status !== 'paid') {
        return res.status(200).send('Status não processado');
    }

    const { full_name, email } = customer;

    const userExists = db.get('users').find({ email: email }).value();

    if (userExists) {
        console.log(`⚠️ Usuário ${email} já existe. Ignorando criação.`);
        return res.status(200).send('Usuário já existe');
    }

    const password = crypto.randomBytes(4).toString('hex');

    const newUser = {
        id: Date.now(),
        name: full_name,
        email: email,
        password: password,
        role: 'cliente_admin',
        createdAt: new Date().toISOString()
    };

    db.get('users').push(newUser).write();

    console.log(`✅ Novo usuário criado para Kiwify: ${email}`);

    try {
        const platformUrl = 'https://saas-u3company.vercel.app';

        await transporter.sendMail({
            from: EMAIL_FROM,
            to: email,
            subject: '🚀 Seu acesso ao U3 SaaS chegou!',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #00e5ff;">Bem-vindo ao U3 SaaS!</h2>
                    <p>Olá <strong>${full_name}</strong>, sua compra foi aprovada e seu acesso já está liberado.</p>
                    <p>Aqui estão suas credenciais para login:</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>URL:</strong> <a href="${platformUrl}">${platformUrl}</a></p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 5px 0;"><strong>Senha Temporária:</strong> ${password}</p>
                    </div>
                    <p>Recomendamos que você altere sua senha no primeiro acesso em seu perfil.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777;">Este é um email automático, por favor não responda.</p>
                </div>
            `
        });
        console.log(`📧 Email enviado com sucesso para ${email}`);
    } catch (error) {
        console.error('❌ Erro ao enviar email:', error);
    }

    res.status(200).send('Webhook processado com sucesso');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

