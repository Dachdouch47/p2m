import React from 'react';
import { useHistory } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const history = useHistory();

    const stats = [
        {
            label: 'Datasets Processed',
            value: '12',
            trend: '+2 this month',
        },
        {
            label: 'Attacks Detected',
            value: '847',
            trend: '+15% this week',
        },
        {
            label: 'Detection Rate',
            value: '94.2%',
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
                    >
                        <p style={{ color: '#a0a0a0', fontSize: '0.875rem', marginBottom: '12px' }}>
                            {stat.label}
                        </p>
                        <p className="stat-card-value">
                            {stat.value}
                        </p>
                        <p className="stat-card-trend">
                            {stat.trend}
                        </p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="card" style={{ marginBottom: '32px' }}>
                <h3 className="card-header">
                    System Status
                </h3>

                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <p style={{ fontSize: '0.875rem' }}>Model Accuracy</p>
                        <p style={{ fontWeight: 'bold', color: '#cc2936', fontSize: '0.875rem' }}>
                            94.2%
                        </p>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-bar-fill" 
                            style={{ 
                                width: '94.2%',
                            }}
                        ></div>
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <p style={{ fontSize: '0.875rem' }}>Data Processing</p>
                        <p style={{ fontWeight: 'bold', color: '#10b981', fontSize: '0.875rem' }}>
                            100%
                        </p>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-bar-fill" 
                            style={{ 
                                width: '100%',
                                background: '#10b981'
                            }}
                        ></div>
                    </div>
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <p style={{ fontSize: '0.875rem' }}>System Health</p>
                        <p style={{ fontWeight: 'bold', color: '#f59e0b', fontSize: '0.875rem' }}>
                            98%
                        </p>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-bar-fill" 
                            style={{ 
                                width: '98%',
                                background: '#f59e0b'
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h3 className="card-header">
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
                </div>
            </div>
        </div>
    );
};

export default Dashboard;