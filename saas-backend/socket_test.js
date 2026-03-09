const ioClient = require('socket.io-client');
const ZAPPRO_API_URL = 'https://bk.lrcatelan.com';
const ZAPPRO_COMPANY_ID = '1';
const ZAPPRO_USER_ID = '1';

const zapproSocket = ioClient(`${ZAPPRO_API_URL}/${ZAPPRO_COMPANY_ID}`, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    query: { userId: ZAPPRO_USER_ID },
    transports: ['websocket', 'polling']
});

zapproSocket.on('connect', () => {
    console.log('✅ Conectado ao Websocket original do ZapPro!');
});

zapproSocket.on('connect_error', (err) => {
    console.log('❌ Erro de conexão:', err.message);
});
