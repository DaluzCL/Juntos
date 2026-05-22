import jwt from 'jsonwebtoken';

// --Middleware para autenticação de token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Armazena as informações do usuário no objeto de requisição
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
    next();
}

export default authenticateToken;