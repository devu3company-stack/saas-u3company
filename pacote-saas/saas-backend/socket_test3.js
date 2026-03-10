const ioClient = require('socket.io-client');
const ZAPPRO_API_URL = 'https://bk.lrcatelan.com';
const ZAPPRO_COMPANY_ID = '1';
const ZAPPRO_USER_ID = '1';

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
});

zapproSocket.on('connect_error', (err) => {
    console.log('❌ Erro de conexão:', err.message);
});

// listen for any event
zapproSocket.onAny((event, ...args) => {
    console.log(`[Event: ${event}]`, args);
});

setInterval(() => {
    console.log("Still running. connected:", zapproSocket.connected);
}, 2000);
