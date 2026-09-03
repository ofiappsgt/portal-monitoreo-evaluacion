import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';
import { verifySsoToken, createSession, verifySession } from './auth.js';

if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) throw new Error('Faltan JWT_SECRET o DATABASE_URL');
const app = express();
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());

app.get('/api/health', (_req,res)=>res.json({ok:true}));
app.post('/api/sso', async (req,res) => {
  try {
    const bearer = req.get('authorization')?.replace(/^Bearer\s+/i, '');
    const token = req.body?.token || bearer;
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    const claims = await verifySsoToken(token);
    const { rows } = await pool.query('SELECT id, nombre, role FROM users WHERE id = $1 LIMIT 1', [claims.userId]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Usuario no autorizado' });
    const session = await createSession(user);
    res.cookie('me_session', session, { httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'lax', maxAge:8*60*60*1000, path:'/' });
    return res.json({ user: { nombre:user.nombre, role:user.role } });
  } catch (e) {
    console.error('SSO rechazado:', e.code || e.message);
    return res.status(401).json({ error: 'Token inválido, vencido o sin el acceso requerido' });
  }
});
app.get('/api/me', async (req,res) => {
  try {
    const session = await verifySession(req.cookies.me_session);
    const { rows } = await pool.query('SELECT nombre, role FROM users WHERE id = $1 LIMIT 1', [session.sub]);
    if (!rows[0]) return res.status(401).json({error:'No autorizado'});
    res.json({user:rows[0]});
  } catch { res.status(401).json({error:'No autorizado'}); }
});
app.post('/api/logout', (_req,res)=>{ res.clearCookie('me_session',{path:'/'}); res.status(204).end(); });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'dist');
app.use(express.static(dist));
app.get(/.*/, (_req,res)=>res.sendFile(path.join(dist,'index.html')));
const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Servidor activo en puerto ${port}`));
