import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import auth from './routes/auth.js'
import grupos from './routes/grupos.js'
import transacoes from './routes/transacoes.js'
import categorias from './routes/categorias.js'
import metas from './routes/metas.js'
import orcamentos from './routes/orcamentos.js'
import resumo from './routes/resumo.js'


dotenv.config();


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/grupos', grupos);
app.use('/api/transacoes', transacoes);
app.use('/api/categorias', categorias);
app.use('/api/metas', metas);
app.use('/api/orcamentos', orcamentos);
app.use('/api/resumo', resumo);

export default app;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});