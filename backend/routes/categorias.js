import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import verificarGrupo  from '../middleware/verificarGrupo.js';
import db from '../banco.js';

const router = express.Router();

// Rota para obter todas as categorias do grupo
router.get('/', authenticateToken, verificarGrupo, (req, res) => {
    try {
        const usuario = db.prepare('SELECT * FROM Usuarios WHERE id = ?').get(req.user.id)
        const categorias = db.prepare('SELECT * FROM Categorias WHERE grupo_id = ?').all(usuario.grupo_id)
        res.json(categorias)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categorias' })
    }
})

// Rota para criar uma nova categoria
router.post('/', authenticateToken, verificarGrupo, (req, res) => {
    const { nome, icone, cor } = req.body
    if (!nome || !icone || !cor) {
        return res.status(400).json({ error: 'Nome, ícone e cor são obrigatórios' })
    }
    try {
        const usuario = db.prepare('SELECT * FROM Usuarios WHERE id = ?').get(req.user.id)
        const result = db.prepare('INSERT INTO Categorias (nome, icone, cor, grupo_id) VALUES (?, ?, ?, ?)').run(nome, icone, cor, usuario.grupo_id)
        res.status(201).json({ id: result.lastInsertRowid, nome, icone, cor })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar categoria' })
    }
})



export default router;