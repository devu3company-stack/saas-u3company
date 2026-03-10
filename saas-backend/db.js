// db.js - Banco de dados JSON em arquivo, compartilhado entre todos os usuários
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, 'data.json'));
const db = low(adapter);

// Estrutura inicial do banco
db.defaults({
    users: [],
    tenants: {},  // dados isolados por tenant: { tenant_ID: { u3_clients_v2: [], ... } }
    shared: {}    // dados compartilhados da agência matriz: { u3_clients_v2: [], ... }
}).write();

module.exports = db;
