const admin = require('firebase-admin');

// Tenta inicializar com variáveis de ambiente (Railway/Vercel) ou arquivo local
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('✅ Firebase Admin inicializado via Variável de Ambiente.');
    } else {
        // Fallback para arquivo local se existir (NÃO COMMITE ESTE ARQUIVO)
        const fs = require('fs');
        const path = require('path');
        const localPath = path.join(__dirname, 'service-account.json');
        
        if (fs.existsSync(localPath)) {
            const serviceAccount = require(localPath);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('✅ Firebase Admin inicializado via service-account.json local.');
        } else {
            console.warn('⚠️ Firebase Admin NÃO INICIALIZADO. (Falta FIREBASE_SERVICE_ACCOUNT_JSON)');
        }
    }
} catch (e) {
    console.error('❌ Erro ao inicializar Firebase Admin:', e.message);
}

module.exports = admin;
