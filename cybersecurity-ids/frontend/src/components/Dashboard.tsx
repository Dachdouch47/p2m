import React from 'react';
import { useHistory } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const history = useHistory();

    const stats = [
        {
            icon: '📦',
            label: 'Datasets Processed',
            value: '12',
            color: '#667eea',
            trend: '+2 this month',
        },
        {
            icon: '⚠️',
            label: 'Attacks Detected',
            value: '847',
            color: '#f44336',
            trend: '+15% this week',
        },
        {
            icon: '⚡',
            label: 'Detection Rate',
            value: '94.2%',
            color: '#4caf50',
            trend: 'Excellent',
        },
    ];

    return (
        <div>
            <div className="grid grid-3" style={{ marginBottom: '32px' }}>
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="stat-card"
                        style={{
                            background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                            border: `1px solid ${stat.color}30`,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ color: stat.color, marginRight: '8px', fontSize: '32px' }}>
                                {stat.icon}
                            </div>
                            <p style={{ color: '#666', fontSize: '0.875rem' }}>
                                {stat.label}
                            </p>
                        </div>
                        <p
                            style={{
                                fontWeight: 'bold',
                                color: stat.color,
                                marginBottom: '8px',
                                fontSize: '1.75rem',
                            }}
                        >
                            {stat.value}
                        </p>
                        <p style={{ color: '#666', fontSize: '0.75rem' }}>
                            {stat.trend}
                        </p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="card" style={{ marginBottom: '32px', backgroundColor: 'rgba(102, 126, 234, 0.05)' }}>
                <div style={{ padding: '16px' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>
                        System Status
                    </h3>

                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <p style={{ fontSize: '0.875rem' }}>Model Accuracy</p>
                            <p style={{ fontWeight: 'bold', color: '#667eea', fontSize: '0.875rem' }}>
                                94.2%
                            </p>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ 
                                    width: '94.2%',
                                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                                }}
                            ></div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <p style={{ fontSize: '0.875rem' }}>Data Processing</p>
                            <p style={{ fontWeight: 'bold', color: '#4caf50', fontSize: '0.875rem' }}>
                                100%
                            </p>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ 
                                    width: '100%',
                                    background: 'linear-gradient(90deg, #4caf50 0%, #45a049 100%)'
                                }}
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <p style={{ fontSize: '0.875rem' }}>System Health</p>
                            <p style={{ fontWeight: 'bold', color: '#ff9800', fontSize: '0.875rem' }}>
                                98%
                            </p>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ 
                                    width: '98%',
                                    background: 'linear-gradient(90deg, #ff9800 0%, #fb8c00 100%)'
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <div style={{ padding: '16px' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>
                        Quick Actions
                    </h3>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => history.push('/upload')}
                            style={{
                                flex: 1,
                                minWidth: '200px',
                            }}
                        >
                            Upload New Dataset
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => history.push('/results')}
                            style={{
                                flex: 1,
                                minWidth: '200px',
                            }}
                        >
                            View Results
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;