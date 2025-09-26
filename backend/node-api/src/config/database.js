const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

// ===================================
// 1. CONFIGURAÇÃO DE CONEXÃO
// ===================================
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    // Configurações do Pool
    max: 20, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000, 
};

// Criar o pool de conexões
const pool = new Pool(config);

console.log('=== CONFIGURAÇÃO DO BANCO DE DADOS ===');
console.log('Database:', config.database);
console.log('User:', config.user);
console.log('======================================');

// Event listeners para monitoramento
pool.on('connect', (client) => {
    console.log(`[${new Date().toISOString()}] Nova conexão estabelecida com PostgreSQL`);
});
pool.on('error', (err, client) => {
    console.error(`[${new Date().toISOString()}] Erro no pool PostgreSQL:`, err.message);
});

// ===================================
// 2. FUNÇÕES ESPERADAS PELO server.js
// ===================================

/**
 * healthCheck: Executa uma query simples para garantir que a conexão está ativa.
 * Usado pela rota /api/health.
 */
const healthCheck = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT current_database(), current_user');
        client.release();
        return {
            status: 'connected',
            database_name: result.rows[0].current_database,
            user: result.rows[0].current_user
        };
    } catch (error) {
        // Lança um erro customizado para a API saber que está desconectada
        throw { status: 'disconnected', error: error.message };
    }
};

/**
 * initialize: Tenta uma conexão inicial. Usado no início do startServer.
 */
const initialize = async () => {
    console.log(`[${new Date().toISOString()}] Tentando inicializar a conexão com o BD...`);
    try {
        await healthCheck();
        console.log(`[${new Date().toISOString()}] 🟢 Conexão inicial com o BD SUCESSO!`);
        return true;
    } catch (error) {
        console.error(`[${new Date().toISOString()}] 🔴 FALHA ao inicializar o BD. Verifique as credenciais.`);
        throw error; // Lança o erro para o server.js parar
    }
};


// Exporta o objeto 'database' conforme a desestruturação no server.js
module.exports = {
    database: { 
        pool,
        query: pool.query.bind(pool),
        healthCheck,
        initialize
    }
};

// Exporta o pool diretamente como default para outros módulos que possam esperá-lo
module.exports.default = pool;
