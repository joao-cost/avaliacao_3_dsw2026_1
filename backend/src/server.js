import express from 'express';
import cors from 'cors';
import equipamentosRoutes from './routes/equipamentosRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ROTAS DE AUTENTICAÇÃO
app.use('/auth', authRoutes);

// ROTAS
app.use('/equipamentos', equipamentosRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API de equipamentos com autenticação Firebase' });
});

// INICIAR O SERVIDOR
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
