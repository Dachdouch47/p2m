import React, { useEffect, useState } from 'react';
import { getModelMetrics } from '../services/api';
import AnalysisResults from '../components/AnalysisResults';
import { ModelMetrics } from '../types';

const Results: React.FC = () => {
    const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getModelMetrics();
                setMetrics(data.metrics);
            } catch (err) {
                setError('Failed to fetch metrics');
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <div style={{ paddingTop: '48px', paddingBottom: '48px', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ marginBottom: '32px', color: 'white', textAlign: 'center' }}>
                    <h1
                        style={{
                            fontWeight: 'bold',
                            marginBottom: '16px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                    >
                        Analysis Results
                    </h1>
                    <p
                        style={{
                            opacity: 0.95,
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        }}
                    >
                        View your intrusion detection analysis and model performance metrics
                    </p>
                </div>

                <div
                    style={{
                        background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        padding: '32px',
                        borderRadius: '8px',
                    }}
                >
                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '48px', paddingBottom: '48px' }}>
                            <div className="spinner" style={{ borderColor: '#667eea' }}></div>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: '24px' }}>
                            <span>{error}</span>
                        </div>
                    )}

                    {!loading && !error && metrics && <AnalysisResults metrics={metrics} />}

                    {!loading && !error && !metrics && (
                        <div style={{ textAlign: 'center', paddingTop: '48px', paddingBottom: '48px' }}>
                            <p style={{ color: '#666' }}>
                                No analysis results available yet. Please upload and analyze a dataset first.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Results;