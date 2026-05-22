import express from 'express';
import { registerUser, loginUser, getUserByEmail } from '../auth.js';

const router = express.Router();

// Registrar um novo usuário
router.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
      const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    } else {
        const user = await registerUser(nome, email, senha);
        res.status(201).json({ id: user, message: "User registered successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login do usuário
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const token = await loginUser(email, senha);
        const user = await getUserByEmail(email);
        res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
    } catch (error) {        
        res.status(400).json({ message: error.message });
    }
  
    });



export default router;