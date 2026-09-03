import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then(async r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setUser(d.user); setStatus('ready'); })
      .catch(() => setStatus('ready'));
  }, []);

  async function login(e) {
    e.preventDefault(); setStatus('loading'); setMessage('');
    try {
      const r = await fetch('/api/sso', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'No autorizado');
      setUser(d.user); setToken('');
    } catch (err) { setMessage(err.message); }
    finally { setStatus('ready'); }
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  }

  if (status === 'checking') return <main className="center"><p>Verificando sesión...</p></main>;
  if (user) return <main className="center"><section className="dashboard"><header><div><span className="ok">SESIÓN VERIFICADA</span><h1>Monitoreo y Evaluación</h1></div><button className="secondary" onClick={logout}>Cerrar sesión</button></header><div className="grid"><article><span>Usuario</span><strong>{user.nombre}</strong></article><article><span>Rol</span><strong>{user.role}</strong></article></div></section></main>;
  return <main className="center"><form className="card" onSubmit={login}><div className="shield">✓</div><h1>Acceso seguro</h1><p>Portal de Monitoreo y Evaluación</p><label htmlFor="token">Token SSO</label><input id="token" type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="Pega el JWT recibido" required autoComplete="off"/><button disabled={status==='loading'}>{status==='loading'?'Verificando...':'Ingresar'}</button>{message && <div className="error" role="alert">{message}</div>}<small>Se validan firma, vigencia, acceso y usuario.</small></form></main>;
}

createRoot(document.getElementById('root')).render(<App/>);
