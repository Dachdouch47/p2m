import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

function isAuthenticated() {
    return !!localStorage.getItem('token');
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}

const Navigation: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <span className="logo-text">Cybersecurity IDS</span>
                </div>
                <div className="navbar-links">
                    <RouterLink to="/" className="nav-link">Accueil</RouterLink>
                    <RouterLink to="/monitoring" className="nav-link">Surveillance</RouterLink>
                    <RouterLink to="/alerts" className="nav-link">Alertes</RouterLink>
                    <RouterLink to="/threats" className="nav-link">Menaces</RouterLink>
                    <RouterLink to="/settings" className="nav-link">Paramètres</RouterLink>
                    {isAuthenticated() ? (
                        <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', marginLeft: '16px' }} onClick={logout}>
                            Se déconnecter
                        </button>
                    ) : (
                        <>
                            <RouterLink to="/login" className="nav-link">Se connecter</RouterLink>
                            <RouterLink to="/signup" className="nav-link">Créer un compte</RouterLink>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;