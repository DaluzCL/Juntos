import express from 'express';
import verificarGrupo  from '../middleware/verificarGrupo.js';
import authenticateToken from '../middleware/authMiddleware.js';
import db from '../banco.js';

const router = express.Router();


// Rota para obter todas as transações do grupo
router.get('/', authenticateToken, verificarGrupo, (req, res) => {
  try {
    const usuario = db.prepare('SELECT * FROM Usuarios WHERE id = ?').get(req.user.id);
    const transacoes = db.prepare('SELECT * FROM Transacoes WHERE grupo_id = ?').all(usuario.grupo_id);
    res.json(transacoes);
  } catch (error) {
    res.status(500).json({ error: ' Erro ao buscar transações' });
    }
});

// Rota para criar uma nova transação
router.post('/' , authenticateToken, verificarGrupo, (req, res) => {
  const { descricao, valor, tipo, categoria_id, data } = req.body;
    if (!descricao || !valor || !tipo) {
        return res.status(400).json({ error: 'Descrição, valor e tipo são obrigatórios' });
    }  
    try { 
        const usuario = db.prepare('SELECT * FROM Usuarios WHERE id = ?').get(req.user.id);
        const stmt = db.prepare('INSERT INTO Transacoes (descricao, valor, tipo, grupo_id, categoria_id, data, criado_por) VALUES (?, ?, ?, ?, ?, ?, ?)');
        const result = stmt.run(descricao, valor, tipo, usuario.grupo_id, categoria_id, data, req.user.id);
        res.json({ id: result.lastInsertRowid, descricao, valor, tipo, categoria_id, data });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar transação' });
    }
});


// Rota para atualizar uma transação existente
router.put('/:id', authenticateToken, verificarGrupo, (req, res) => {
    const { id } = req.params;
    const { descricao, valor, tipo, categoria_id, data } = req.body;
    if (!descricao || !valor || !tipo) {
        return res.status(400).json({ error: 'Descrição, valor e tipo são obrigatórios' });
    }
    try {
        const usuario = db.prepare('SELECT * FROM Usuarios WHERE id = ?').get(req.user.id);
        const transacao = db.prepare('SELECT * FROM Transacoes WHERE id = ? AND grupo_id = ?').get(id, usuario.grupo_id);
        if (!transacao) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }
        const stmt = db.prepare('UPDATE Transacoes SET descricao = ?, valor = ?, tipo = ?, categoria_id = ?, data = ? WHERE id = ?');
        stmt.run(descricao, valor, tipo, categoria_id, data, id);
        res.json({ id, descricao, valor, tipo, categoria_id, data });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar transação' });
    }
});


// Rota para deletar uma transação
router.delete('/:id', authenticateToken, verificarGrupo, (req, res) => {
    const { id } = req.params;
    try {
        const usuario = db.prepare('SELECT * FROM Usuarios WHERE id = ?').get(req.user.id);
        const transacao = db.prepare('SELECT * FROM Transacoes WHERE id = ? AND grupo_id = ?').get(id, usuario.grupo_id);
        if (!transacao) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }
        const stmt = db.prepare('DELETE FROM Transacoes WHERE id = ?');
        stmt.run(id);
        res.json({ message: 'Transação deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar transação' });
    }
});






export default router;