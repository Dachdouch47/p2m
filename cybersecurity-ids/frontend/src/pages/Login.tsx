import React, { useState } from 'react';
import { login } from '../services/auth';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(username, password);
      localStorage.setItem('token', res.access_token);
      onLogin();
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
      <div className="auth-form-card" style={{ background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(204, 41, 54, 0.15)', padding: 48, minWidth: 380, border: '2px solid #cc2936' }}>
        <h2 style={{ textAlign: 'center', color: '#cc2936', marginBottom: 32, fontSize: '1.8rem', fontWeight: 700 }}>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 16, padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 16, padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%', background: '#cc2936', color: 'white', border: 'none', borderRadius: 6, padding: 12, fontWeight: 600, fontSize: '1rem', marginBottom: 12 }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <span style={{ color: '#888', fontSize: '0.95rem' }}>Pas de compte ? </span>
            <a href="/signup" style={{ color: '#cc2936', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>Créer un compte</a>
          </div>
          {error && <div className="error-msg" style={{ color: '#e63946', marginTop: 12, textAlign: 'center' }}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
