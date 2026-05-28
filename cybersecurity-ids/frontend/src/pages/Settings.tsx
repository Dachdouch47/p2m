import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Settings: React.FC = () => {
    const history = useHistory();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [activeTab, setActiveTab] = useState<'model' | 'notifications' | 'thresholds'>('model');

    const [settings, setSettings] = useState({
        model_sensitivity: 0.5,
        enable_notifications: true,
        notification_email: '',
        notification_telegram_token: '',
        critical_threshold: 0.7,
        warning_threshold: 0.5,
        auto_update_model: false,
        model_version: '1.0.0'
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Verify credentials (dachraoui_admin / admin_admin47)
        if (loginForm.username === 'dachraoui_admin' && loginForm.password === 'admin_admin47') {
            setIsLoggedIn(true);
            setLoginForm({ username: '', password: '' });
        } else {
            alert('Identifiants invalides');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    const handleSettingChange = (field: string, value: any) => {
        setSettings({ ...settings, [field]: value });
    };

    const handleSaveSettings = () => {
        console.log('Saving settings:', settings);
        alert('Paramètres sauvegardés avec succès');
    };

    if (!isLoggedIn) {
        return (
            <div className="settings-container">
                <div className="login-panel">
                    <div className="login-card">
                        <h1 className="page-title">Admin Panel</h1>
                        <p style={{marginBottom: '24px', color: 'var(--text-secondary)', textAlign: 'center'}}>
                            Connectez-vous pour accéder aux paramètres
                        </p>
                        
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label>Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    value={loginForm.username}
                                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                                    placeholder="dachraoui_admin"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'var(--bg-darker)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        color: 'var(--text-primary)',
                                        marginTop: '8px'
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mot de passe</label>
                                <input
                                    type="password"
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'var(--bg-darker)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        color: 'var(--text-primary)',
                                        marginTop: '8px'
                                    }}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                style={{width: '100%', marginTop: '16px'}}
                            >
                                Connexion
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1 className="page-title">Paramètres & Configuration</h1>
                <button 
                    className="btn btn-secondary"
                    onClick={handleLogout}
                >
                    Déconnexion
                </button>
            </div>

            <div className="settings-tabs">
                <button 
                    className={`tab ${activeTab === 'model' ? 'active' : ''}`}
                    onClick={() => setActiveTab('model')}
                >
                    Gestion du Modèle
                </button>
                <button 
                    className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notifications')}
                >
                    Notifications
                </button>
                <button 
                    className={`tab ${activeTab === 'thresholds' ? 'active' : ''}`}
                    onClick={() => setActiveTab('thresholds')}
                >
                    Seuils de Détection
                </button>
            </div>

            {activeTab === 'model' && (
                <div className="card">
                    <h2 className="card-header">Gestion du Modèle ML</h2>
                    <div className="settings-group">
                        <div className="setting-item">
                            <div className="setting-label">
                                <label>Version du modèle</label>
                                <p style={{fontSize: '0.875rem', color: 'var(--text-secondary)'}}>
                                    Modèle Random Forest actuellement actif
                                </p>
                            </div>
                            <div className="setting-value">{settings.model_version}</div>
                        </div>

                        <div className="setting-item">
                            <div className="setting-label">
                                <label>
                                    <input 
                                        type="checkbox"
                                        checked={settings.enable_notifications}
                                        onChange={(e) => handleSettingChange('enable_notifications', e.target.checked)}
                                    />
                                    Activer le modèle
                                </label>
                                <p style={{fontSize: '0.875rem', color: 'var(--text-secondary)'}}>
                                    Désactiver pour mettre le système en pause
                                </p>
                            </div>
                            <span className={settings.enable_notifications ? 'active' : 'inactive'}>
                                {settings.enable_notifications ? '●' : '●'} {settings.enable_notifications ? 'Actif' : 'Inactif'}
                            </span>
                        </div>

                        <div className="setting-item">
                            <div className="setting-label">
                                <label>Mise à jour automatique</label>
                                <p style={{fontSize: '0.875rem', color: 'var(--text-secondary)'}}>
                                    Charger automatiquement une nouvelle version du modèle .pkl
                                </p>
                            </div>
                            <input 
                                type="checkbox"
                                checked={settings.auto_update_model}
                                onChange={(e) => handleSettingChange('auto_update_model', e.target.checked)}
                            />
                        </div>

                        <div className="setting-item">
                            <button className="btn btn-secondary">
                                Charger nouveau modèle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'notifications' && (
                <div className="card">
                    <h2 className="card-header">Configuration des Notifications</h2>
                    <div className="settings-group">
                        <div className="setting-item">
                            <label>Email pour les alertes</label>
                            <input
                                type="email"
                                value={settings.notification_email}
                                onChange={(e) => handleSettingChange('notification_email', e.target.value)}
                                placeholder="admin@example.com"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: 'var(--bg-darker)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    marginTop: '8px'
                                }}
                            />
                        </div>

                        <div className="setting-item">
                            <label>Token Telegram (optionnel)</label>
                            <input
                                type="password"
                                value={settings.notification_telegram_token}
                                onChange={(e) => handleSettingChange('notification_telegram_token', e.target.value)}
                                placeholder="Votre token Telegram"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: 'var(--bg-darker)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    marginTop: '8px'
                                }}
                            />
                        </div>

                        <div className="setting-item">
                            <label>
                                <input 
                                    type="checkbox"
                                    checked={settings.enable_notifications}
                                    onChange={(e) => handleSettingChange('enable_notifications', e.target.checked)}
                                />
                                Recevoir des alertes sur les attaques critiques
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'thresholds' && (
                <div className="card">
                    <h2 className="card-header">Seuils de Détection</h2>
                    <div className="settings-group">
                        <div className="setting-item">
                            <label>Sensibilité générale: {(settings.model_sensitivity * 100).toFixed(0)}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.model_sensitivity * 100}
                                onChange={(e) => handleSettingChange('model_sensitivity', parseInt(e.target.value) / 100)}
                                style={{width: '100%', marginTop: '8px'}}
                            />
                            <p style={{fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px'}}>
                                Plus élevé = Plus sensible (plus d'alertes)
                            </p>
                        </div>

                        <div className="setting-item">
                            <label>Seuil critique: {(settings.critical_threshold * 100).toFixed(0)}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.critical_threshold * 100}
                                onChange={(e) => handleSettingChange('critical_threshold', parseInt(e.target.value) / 100)}
                                style={{width: '100%', marginTop: '8px'}}
                            />
                        </div>

                        <div className="setting-item">
                            <label>Seuil d'avertissement: {(settings.warning_threshold * 100).toFixed(0)}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.warning_threshold * 100}
                                onChange={(e) => handleSettingChange('warning_threshold', parseInt(e.target.value) / 100)}
                                style={{width: '100%', marginTop: '8px'}}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div style={{marginTop: '24px', display: 'flex', gap: '12px'}}>
                <button 
                    className="btn btn-primary"
                    onClick={handleSaveSettings}
                >
                    Sauvegarder les paramètres
                </button>
                <button 
                    className="btn btn-secondary"
                    onClick={() => history.push('/')}
                >
                    Retour à l'accueil
                </button>
            </div>
        </div>
    );
};

export default Settings;
