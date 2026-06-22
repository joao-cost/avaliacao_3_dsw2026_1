import db from '../config/database.js';
import { firebaseAuth } from '../config/firebaseAdmin.js';

const authMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  console.log('[AUTH][middleware] Requisição recebida', {
    path: req.path,
    method: req.method,
    temToken: Boolean(token),
  });

  if (!token) {
    console.warn('[AUTH][middleware] Token não informado');
    return res.status(401).json({ erro: 'Token não informado' });
  }

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    console.log('[AUTH][middleware] Token Firebase validado', {
      email: decodedToken.email,
      uid: decodedToken.uid,
    });

    const email = decodedToken.email;
    const nome = decodedToken.name || decodedToken.email || 'Usuário Google';

    const [rows] = await db.query(
      'SELECT id, nome, email, perfil, ativo FROM usuarios_autorizados WHERE email = ? LIMIT 1',
      [email]
    );

    console.log('[AUTH][middleware] Consulta usuarios_autorizados', {
      email,
      encontrados: rows.length,
    });

    let usuarioBanco = rows[0] || null;

    if (!usuarioBanco) {
      console.log('[AUTH][middleware] E-mail não encontrado, cadastrando automaticamente', {
        email,
        nome,
      });
      const [resultadoInsercao] = await db.query(
        'INSERT INTO usuarios_autorizados (nome, email, perfil, ativo) VALUES (?, ?, ?, 1)',
        [nome, email, 'usuario']
      );

      usuarioBanco = {
        id: resultadoInsercao.insertId,
        nome,
        email,
        perfil: 'usuario',
        ativo: 1,
      };
    } else if (!usuarioBanco.ativo) {
      console.warn('[AUTH][middleware] Usuário encontrado, mas desativado', { email });
      return res.status(403).json({ erro: 'Usuário desativado no banco' });
    }

    req.user = {
      ...decodedToken,
      usuarioBanco,
    };
    req.tokenUsado = token;

    try {
      await db.query(
        `INSERT INTO auth_sessions (email, nome, photo_url, token_usado)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           nome = VALUES(nome),
           photo_url = VALUES(photo_url),
           token_usado = VALUES(token_usado),
           last_login_at = CURRENT_TIMESTAMP`,
        [email, nome, decodedToken.picture || null, token]
      );

      console.log('[AUTH][middleware] Sessão salva no banco', {
        email,
        temFoto: Boolean(decodedToken.picture),
        tokenPrefixo: token.slice(0, 20),
      });
    } catch (sessionError) {
      console.warn('[AUTH][middleware] Não foi possível salvar a sessão no banco', {
        email,
        erro: sessionError?.message || sessionError,
      });
    }

    console.log('[AUTH][middleware] Autorização liberada', {
      email,
      usuarioBancoId: usuarioBanco.id,
    });

    next();
  } catch (error) {
    console.error('[AUTH][middleware] Falha ao validar token', error?.message || error);
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
};

export default authMiddleware;