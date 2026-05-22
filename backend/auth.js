import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './banco.js';

// Função para registrar um novo usuário
async function registerUser(nome, email, senha) {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const stmt = db.prepare('INSERT INTO Usuarios (nome, email, senha) VALUES (?, ?, ?)');
    const result = stmt.run(nome, email, hashedPassword);
    console.log(`Usuário registrado com ID: ${result.lastInsertRowid}`);
    return result.lastInsertRowid;
}

//Função de login do usuário
async function loginUser(email, senha) {
    const stmt = db.prepare('SELECT * FROM Usuarios WHERE email = ?');
    const user = stmt.get(email);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    const isMtach = await bcrypt.compare(senha, user.senha);
    if (!isMtach) {
        throw new Error('Senha incorreta');
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

//Função para verificar o token JWT
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        throw new Error('Token inválido');
    }
}

//Funcão para obter informações do usuário a partir do email
function getUserByEmail(email) {
    const stmt = db.prepare('SELECT * FROM Usuarios WHERE email = ?');
    const user = stmt.get(email);
    return user;
}

//Exportando as funções para serem usadas em outras partes do backend
export { registerUser, loginUser, verifyToken, getUserByEmail };


