import express from 'express';
import cors from 'cors';
import equipamentosRoutes from './routes/equipamentosRoutes.js';
import authRoutes from './routes/authRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ARQUIVOS ESTATICOS
app.use(express.static(path.join(__dirname, '../../frontend')));

// ROTAS DE AUTENTICAÇÃO
app.use('/auth', authRoutes);

// ROTAS
app.use('/equipamentos', equipamentosRoutes);

// INICIAR O SERVIDOR
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
