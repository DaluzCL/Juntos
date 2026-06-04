import express from 'express';
import verificarGrupo  from '../middleware/verificarGrupo.js';
import authenticateToken from '../middleware/authMiddleware.js';
import db from '../banco.js';

const router = express.Router();

router.get('/', authenticateToken, verificarGrupo, (req, res) => {
  try {
    const orcamentos = db.prepare('SELECT * FROM Orcamentos WHERE grupo_id = ?').all(req.usuario.grupo_id);
    res.json(orcamentos);   
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar orçamentos' });
  }
});


router.post('/', authenticateToken, verificarGrupo, (req, res) => {
    const { mes, valor_limite, categoria_id } = req.body;
    const grupo_id = req.usuario.grupo_id;
    if (!mes || !valor_limite || !categoria_id) {
        return res.status(400).json({ error: 'Mês, valor limite e categoria são obrigatórios' });
    }
    try {
        const stmt = db.prepare('INSERT INTO Orcamentos (mes, valor_limite, categoria_id, grupo_id) VALUES (?, ?, ?, ?)');
        const info = stmt.run(mes, valor_limite, categoria_id, grupo_id);
        res.json({ id: info.lastInsertRowid, mes, valor_limite, categoria_id, grupo_id });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar orçamento' });
    }
});

router.put('/:id', authenticateToken, verificarGrupo, (req, res) => {
    const { id } = req.params;
    const { mes, valor_limite, categoria_id } = req.body;  
    try {
    const orcamento = db.prepare('SELECT * FROM Orcamentos WHERE id = ?').get(id);
        if (!orcamento) {
            return res.status(404).json({ error: 'Orçamento não encontrado' });
        }
        if (orcamento.grupo_id !== req.usuario.grupo_id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }
        const stmt = db.prepare('UPDATE Orcamentos SET mes = ?, valor_limite = ?, categoria_id = ? WHERE id = ?');
        stmt.run(mes, valor_limite, categoria_id, id);
        res.json({ id, mes, valor_limite, categoria_id });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar orçamento' });
    }
});


export default router;