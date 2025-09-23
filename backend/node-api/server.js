const express = require('express');
const path = require('path');
const routes = require('./routes');

const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../../frontend')));

// Rotas da API
app.use('/api', routes);

// Rota para páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dashboard.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/about.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
