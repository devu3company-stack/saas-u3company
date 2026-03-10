require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const http = require('http');
const { Server } = require('socket.io');
const ioClient = require('socket.io-client');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Environment configs
const ZAPPRO_API_URL = process.env.ZAPPRO_API_URL || 'https://bk.lrcatelan.com';
const ZAPPRO_API_TOKEN = process.env.ZAPPRO_API_TOKEN;
const ZAPPRO_COMPANY_ID = process.env.ZAPPRO_COMPANY_ID || '1';
const ZAPPRO_USER_ID = process.env.ZAPPRO_USER_ID || '1';

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

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 Saas Bridge CRM rodando na porta ${PORT}`);
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

