import express from 'express';
import verificarGrupo  from '../middleware/verificarGrupo.js';
import authenticateToken from '../middleware/authMiddleware.js';
import db from '../banco.js';

const router = express.Router();

const hoje = new Date();
const anoAtual = hoje.getFullYear();
const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0'); // Formata o mês para ter dois dígitos
const mesAnoAtual = `${anoAtual}-${mesAtual}`;

router.get('/', authenticateToken, verificarGrupo, (req, res) => {
    try {
        const resumo = db.prepare(`
            SELECT 
                (SELECT IFNULL(SUM(valor), 0) FROM Transacoes WHERE tipo = 'Entrada' AND grupo_id = ? AND data LIKE ?) AS total_entradas,
                (SELECT IFNULL(SUM(valor), 0) FROM Transacoes WHERE tipo = 'Saida' AND grupo_id = ? AND data LIKE ?) AS total_saidas
        `).get(req.usuario.grupo_id, `${mesAnoAtual}%`, req.usuario.grupo_id, `${mesAnoAtual}%`);
        const saldo = resumo.total_entradas - resumo.total_saidas;
        res.json({
            entradas: resumo.total_entradas,
            saidas: resumo.total_saidas,
            saldo: saldo
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar resumo' });
    }
});




export default router;