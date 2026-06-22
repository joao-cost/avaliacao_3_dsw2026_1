import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Rota pública para expor as configurações do Firebase Web ao Frontend (evitando arquivos JS locais)
router.get('/config', (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  });
});

router.get('/session', authMiddleware, (req, res) => {
  console.log('[AUTH][route] Sessão validada', {
    email: req.user?.email,
    usuarioBancoId: req.user?.usuarioBanco?.id,
  });
  res.json({
    autenticado: true,
    user: req.user,
    foto: req.user?.picture || req.user?.photoURL || null,
    tokenUsado: req.tokenUsado,
  });
});

export default router;