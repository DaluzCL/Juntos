import express from 'express';
import verificarGrupo  from '../middleware/verificarGrupo.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();
export default router;