import React, { useState } from 'react';
import { signup } from '../services/auth';

const Signup: React.FC<{ onSignup: () => void }> = ({ onSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await signup(username, password);
      localStorage.setItem('token', res.access_token);
      onSignup();
    } catch (err) {
      setError('Signup failed (username may already exist)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #cc2936 0%, #e63946 100%)' }}>
      <div className="auth-form-card" style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: 36, minWidth: 340 }}>
        <h2 style={{ textAlign: 'center', color: '#cc2936', marginBottom: 24 }}>Créer un compte</h2>
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
            {loading ? 'Création...' : 'Créer un compte'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <span style={{ color: '#888', fontSize: '0.95rem' }}>Déjà inscrit ? </span>
            <a href="/login" style={{ color: '#cc2936', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>Se connecter</a>
          </div>
          {error && <div className="error-msg" style={{ color: '#e63946', marginTop: 12, textAlign: 'center' }}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
