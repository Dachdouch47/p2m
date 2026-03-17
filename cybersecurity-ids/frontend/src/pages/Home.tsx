import React from 'react';
import { useHistory } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

const Home: React.FC = () => {
    const history = useHistory();

    const features = [
        {
            icon: '☁️',
            title: 'Easy Upload',
            description: 'Upload CSV datasets with your network logs',
        },
        {
            icon: '📊',
            title: 'Smart Analysis',
            description: 'ML-powered intrusion detection and analysis',
        },
        {
            icon: '🔒',
            title: 'Security Focus',
            description: 'Identify and classify security threats',
        },
    ];

    return (
        <div style={{ paddingTop: '64px', paddingBottom: '64px', minHeight: '100vh' }}>
            <div className="container">
                {/* Hero Section */}
                <div
                    style={{
                        marginBottom: '64px',
                        textAlign: 'center',
                        color: 'white',
                    }}
                >
                    <h1
                        style={{
                            fontWeight: 'bold',
                            marginBottom: '16px',
                            fontSize: '2.5rem',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                    >
                        Cybersecurity Intrusion Detection System
                    </h1>
                    <p
                        style={{
                            marginBottom: '32px',
                            opacity: 0.95,
                            maxWidth: 600,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                            fontSize: '1.125rem',
                        }}
                    >
                        Advanced machine learning-powered analysis to detect and classify network intrusions in real-time
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => history.push('/upload')}
                            style={{
                                background: 'linear-gradient(90deg, #fff 0%, #f0f0f0 100%)',
                                color: '#667eea',
                                paddingLeft: '32px',
                                paddingRight: '32px',
                                fontSize: '1rem',
                            }}
                        >
                            Get Started
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => history.push('/results')}
                            style={{
                                borderColor: 'white',
                                color: 'white',
                                paddingLeft: '32px',
                                paddingRight: '32px',
                                fontSize: '1rem',
                            }}
                        >
                            View Results
                        </button>
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-3" style={{ marginBottom: '64px' }}>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card"
                        >
                            <div style={{ marginBottom: '16px', fontSize: '48px' }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                {feature.title}
                            </h3>
                            <p style={{ color: '#666' }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Dashboard Preview */}
                <div style={{ marginBottom: '32px' }}>
                    <h2
                        style={{
                            color: 'white',
                            fontWeight: 'bold',
                            marginBottom: '24px',
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        }}
                    >
                        System Overview
                    </h2>
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.98)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '32px',
                            borderRadius: '8px',
                        }}
                    >
                        <Dashboard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;