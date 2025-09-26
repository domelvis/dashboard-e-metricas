const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dashboard Metrics API',
      version: '1.0.0',
      description: 'API monstruosa do dashboard',
    },
  },
  apis: ['./routes/*.js'], // aqui você pode apontar para suas rotas
};

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

const metricsRoutes = require("./routes/metrics");
app.use("/api", metricsRoutes);


// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Servir arquivos estáticos do frontend (caminho corrigido)
app.use(express.static(path.join(__dirname, "../../frontend")));

// ========================
// ROTAS DA API (QUE O FRONTEND PRECISA)
// ========================

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: "1.0.0"
    });
});

// Rota principal da API
app.get("/api", (req, res) => {
    res.json({
        message: "🚀 Dashboard Metrics API",
        version: "1.0.0",
        status: "operational"
    });
});

// ROTA: Receber dados do formulário (que o frontend precisa)
app.post("/api/data", (req, res) => {
    console.log("Dados recebidos:", req.body);
    res.json({ 
        success: true, 
        message: "Dados recebidos com sucesso",
        data: req.body 
    });
});

// ROTA: Executar análise (placeholder)
app.post("/api/analyze", (req, res) => {
    console.log("Análise solicitada");
    res.json({ 
        success: true, 
        message: "Análise executada",
        result: { score: 95, status: "excelente" }
    });
});

// ROTA: Buscar métricas (que o dashboard precisa)
app.get("/api/metrics", (req, res) => {
    // Dados de exemplo - depois conectamos com PostgreSQL
    const metrics = [
        { id: 1, metric_name: "Usuários Ativos", metric_value: 150, computed_at: new Date() },
        { id: 2, metric_name: "Vendas", metric_value: 2540, computed_at: new Date() },
        { id: 3, metric_name: "Page Views", metric_value: 12500, computed_at: new Date() }
    ];
    res.json({ rows: metrics });
});

// Servir o frontend para todas as outras rotas (caminho corrigido)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

app.listen(PORT, () => {
    console.log(`
🎉 DASHBOARD METRICS - APLICAÇÃO COMPLETA
📍 Frontend: http://localhost:${PORT}
📍 API: http://localhost:${PORT}/api
🐘 Banco: PostgreSQL:5432
    `);
});

module.exports = app;
