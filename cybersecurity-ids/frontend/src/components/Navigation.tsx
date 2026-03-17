import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Navigation: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <span className="logo-icon">🔒</span>
                    <span className="logo-text">Cybersecurity IDS</span>
                </div>
                <div className="navbar-links">
                    <RouterLink to="/" className="nav-link">Home</RouterLink>
                    <RouterLink to="/upload" className="nav-link">Upload</RouterLink>
                    <RouterLink to="/results" className="nav-link">Results</RouterLink>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;