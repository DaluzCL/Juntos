import express from 'express';
import verificarGrupo  from '../middleware/verificarGrupo.js';
import authenticateToken from '../middleware/authMiddleware.js';
import db from '../banco.js';

const router = express.Router();

// Rotas para listar metas
router.get('/', authenticateToken, verificarGrupo, (req, res) => {
    try {  
    const metas = db.prepare('SELECT * FROM Metas WHERE grupo_id = ?').all(req.usuario.grupo_id);
    res.json(metas);  
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar metas' });
    }
});     


// Rota para criar uma nova meta
router.post('/' , authenticateToken, verificarGrupo, (req, res) => {
    const { nome, valor_alvo, valor_atual} = req.body;
    const grupo_id = req.usuario.grupo_id;
    if (!nome || !valor_alvo) {
        return res.status(400).json({ error: 'Nome e valor alvo são obrigatórios' });
    }
    try {
        const stmt = db.prepare('INSERT INTO Metas (nome, valor_alvo, valor_atual, grupo_id) VALUES (?, ?, ?, ?)');
        const info = stmt.run(nome, valor_alvo, valor_atual, grupo_id);
        res.json({ id: info.lastInsertRowid, nome, valor_alvo, valor_atual, grupo_id });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar meta' });
    }
});

// Rota para atualizar uma meta existente
router.put('/:id', authenticateToken, verificarGrupo, (req, res) => {
    const { id } = req.params;
    const { nome, valor_alvo, valor_atual } = req.body;
    try {
    const meta = db.prepare('SELECT * FROM Metas WHERE id = ?').get(id);
     if (!meta) {
        return res.status(404).json({ error: 'Meta não encontrada' });
    }
      if (meta.grupo_id !== req.usuario.grupo_id) {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    
        const stmt = db.prepare('UPDATE Metas SET nome = ?, valor_alvo = ?, valor_atual = ? WHERE id = ?');
        stmt.run(nome, valor_alvo, valor_atual, id);
        res.json({ id, nome, valor_alvo, valor_atual });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar meta' });
    }
});

// Rota para deletar uma meta
router.delete('/:id', authenticateToken, verificarGrupo, (req, res) => {
    const { id } = req.params;
    try {
    const meta = db.prepare('SELECT * FROM Metas WHERE id = ?').get(id);
     if (!meta) {
        return res.status(404).json({ error: 'Meta não encontrada' });
    }
      if (meta.grupo_id !== req.usuario.grupo_id) {
        return res.status(403).json({ error: 'Acesso negado' });
    }
        const stmt = db.prepare('DELETE FROM Metas WHERE id = ?');
        stmt.run(id);
        res.json({ message: 'Meta deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar meta' });
    }
 });


export default router;