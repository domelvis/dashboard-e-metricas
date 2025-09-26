/**
 * @swagger
 * tags:
 *   name: Metrics
 *   description: Endpoints para métricas do dashboard
 */

/**
 * @swagger
 * /api/metrics:
 *   get:
 *     summary: Listar métricas do dashboard
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Lista de métricas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       metric_name:
 *                         type: string
 *                       metric_value:
 *                         type: number
 *                       computed_at:
 *                         type: string
 */

const express = require('express');
const router = express.Router();

router.get('/metrics', (req, res) => {
    const metrics = [
        { id: 1, metric_name: "Usuários Ativos", metric_value: 150, computed_at: new Date() },
        { id: 2, metric_name: "Vendas", metric_value: 2540, computed_at: new Date() },
        { id: 3, metric_name: "Page Views", metric_value: 12500, computed_at: new Date() }
    ];
    res.json({ rows: metrics });
});

module.exports = router;
