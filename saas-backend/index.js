require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const http = require('http');
const { Server } = require('socket.io');
const ioClient = require('socket.io-client');

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

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 Saas Bridge CRM rodando na porta ${PORT}`);
});
