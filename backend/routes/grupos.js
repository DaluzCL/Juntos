import express from 'express';
import crypto from 'crypto';
import authenticateToken from '../middleware/authMiddleware.js';
import verificarGrupo  from '../middleware/verificarGrupo.js';
import db from '../banco.js';


const router = express.Router();

// Rota para criar um novo grupo
router.post('/criar', authenticateToken, (req, res) => {
    const { nome } = req.body;
    const userId = req.user.id;
    if (!nome) {
        return res.status(400).json({ error: 'O nome do grupo é obrigatório' });
    }
    const codigo = crypto.randomBytes(4).toString('hex');
    const stmt = db.prepare('INSERT INTO Grupos (nome, codigo_convite) VALUES (?, ?)');
    const result = stmt.run(nome, codigo);
    db.prepare('UPDATE Usuarios SET grupo_id = ? WHERE id = ?').run(result.lastInsertRowid, userId);
    res.json({ id: result.lastInsertRowid, nome, codigo });
});

// Rota para entrar em um grupo usando o código
router.post('/entrar', authenticateToken, (req, res) => {
    const { codigo } = req.body;
    const userId = req.user.id;
    if (!codigo) {
        return res.status(400).json({ error: 'O código do grupo é obrigatório' });
    }
    const stmt = db.prepare('SELECT * FROM Grupos WHERE codigo_convite = ?');
    const grupo = stmt.get(codigo);
    if (!grupo) {
        return res.status(404).json({ error: 'Grupo não encontrado' });
    }
    const stmtMembro = db.prepare('UPDATE Usuarios SET grupo_id = ? WHERE id = ?').run(grupo.id, userId);
    res.json({ message: 'Entrou no grupo com sucesso', grupo: { id: grupo.id, nome: grupo.nome } });
});

//Rota para listar os grupos do usuário
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const stmt = db.prepare('SELECT * FROM Grupos WHERE id = (SELECT grupo_id FROM Usuarios WHERE id = ?)');
    const grupo = stmt.get(userId); 
    res.json(grupo);
});

//Rota para listar os usuários do grupo na page Membros
router.get('/membros', authenticateToken, verificarGrupo, (req, res) => {
    try {
    const usuarios = db.prepare('SELECT id, nome, email FROM Usuarios WHERE grupo_id = ?').all(req.usuario.grupo_id);
    res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error:"Erro ao encontrar usuários do Grupo!"});
    }
})



export default router;