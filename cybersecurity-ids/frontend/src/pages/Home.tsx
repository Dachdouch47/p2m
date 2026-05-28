import React from 'react';
import { useHistory } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

const Home: React.FC = () => {
    const history = useHistory();

    const features = [
        {
            title: 'Dataset Upload',
            description: 'Upload CSV or Parquet files with your network logs for analysis',
        },
        {
            title: 'ML Analysis',
            description: 'Advanced machine learning-powered intrusion detection',
        },
        {
            title: 'Real-time Threats',
            description: 'Identify and classify security threats instantly',
        },
    ];

    return (
        <div className="home-hero-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container" style={{ maxWidth: 700, background: 'rgba(255,255,255,0.95)', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: 48 }}>
                <h1 style={{ fontWeight: 'bold', fontSize: '2.7rem', marginBottom: 16, textAlign: 'center', color: '#cc2936' }}>
                    Bienvenue sur Cybersecurity IDS
                </h1>
                <p style={{ fontSize: '1.15rem', color: '#333', marginBottom: 32, textAlign: 'center' }}>
                    Plateforme intelligente de détection d'intrusions réseau par Machine Learning.<br/>
                    <b>Fonctionnalités :</b> Analyse automatique, historique personnel, gestion de modèles, alertes en temps réel, et plus !
                </p>
                <ul style={{ margin: '0 auto 32px auto', maxWidth: 500, color: '#444', fontSize: '1.05rem' }}>
                    <li>• Upload de fichiers réseau (CSV/Parquet)</li>
                    <li>• Prédiction IA sur vos données</li>
                    <li>• Historique d'analyse personnel</li>
                    <li>• Gestion de profil et sécurité</li>
                </ul>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={() => history.push('/login')} style={{ background: '#cc2936', color: 'white', border: 'none', borderRadius: 8, padding: '14px 36px', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(204,41,54,0.08)' }}>
                        Se connecter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;