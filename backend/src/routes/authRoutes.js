import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

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