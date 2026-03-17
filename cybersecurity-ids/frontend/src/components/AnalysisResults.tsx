import React from 'react';
import { AnalysisResult, ModelMetrics, AttackStatistics } from '../types';

interface AnalysisResultsProps {
    analysisResult?: AnalysisResult;
    metrics?: ModelMetrics;
    statistics?: AttackStatistics;
}

const StatCard: React.FC<{
    icon: string;
    title: string;
    value: string | number;
    subtext?: string;
    color: string;
}> = ({ icon, title, value, subtext, color }) => (
    <div className="stat-card" style={{ borderColor: color + '40', backgroundColor: color + '10' }}>
        <div style={{ color, marginBottom: '8px', fontSize: '32px' }}>{icon}</div>
        <p style={{ color: '#666', marginBottom: '8px', fontSize: '0.875rem' }}>
            {title}
        </p>
        <p style={{ fontWeight: 'bold', color, marginBottom: '8px', fontSize: '1.5rem' }}>
            {value}
        </p>
        {subtext && (
            <p style={{ color: '#666', fontSize: '0.75rem' }}>
                {subtext}
            </p>
        )}
    </div>
);

const MetricBar: React.FC<{ label: string; value: number; color: string }> = ({
    label,
    value,
    color,
}) => (
    <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <p style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                {label}
            </p>
            <p style={{ color, fontWeight: 'bold', fontSize: '0.875rem' }}>
                {(value * 100).toFixed(2)}%
            </p>
        </div>
        <div className="progress-bar">
            <div 
                className="progress-fill" 
                style={{ 
                    width: `${value * 100}%`,
                    background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`
                }}
            ></div>
        </div>
    </div>
);

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
    analysisResult,
    metrics,
    statistics,
}) => {
    if (!analysisResult && !metrics && !statistics) {
        return (
            <div style={{ textAlign: 'center', paddingTop: '48px', paddingBottom: '48px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <p style={{ color: '#666' }}>
                    No analysis results available. Please upload and analyze a dataset first.
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Key Metrics Cards */}
            <div className="grid grid-4" style={{ marginBottom: '32px' }}>
                {analysisResult && (
                    <>
                        <StatCard
                            icon="📊"
                            title="Total Records"
                            value={analysisResult.total_records}
                            color="#667eea"
                        />
                        <StatCard
                            icon="🚨"
                            title="Attacks Detected"
                            value={analysisResult.attacks_detected}
                            subtext={`${analysisResult.attack_percentage}% of data`}
                            color="#f44336"
                        />
                        <StatCard
                            icon="✓"
                            title="Normal Records"
                            value={analysisResult.normal_records}
                            subtext={`${(100 - analysisResult.attack_percentage).toFixed(2)}% of data`}
                            color="#4caf50"
                        />
                        <StatCard
                            icon="📈"
                            title="Attack Rate"
                            value={`${analysisResult.attack_percentage}%`}
                            color="#ff9800"
                        />
                    </>
                )}
            </div>

            {/* Model Metrics */}
            {metrics && (
                <div className="card" style={{ marginBottom: '32px', backgroundColor: 'rgba(102, 126, 234, 0.05)', border: '1px solid rgba(102, 126, 234, 0.2)' }}>
                    <div style={{ padding: '16px' }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>
                            Model Performance Metrics
                        </h3>
                        <MetricBar label="Accuracy" value={metrics.accuracy} color="#667eea" />
                        <MetricBar label="Precision" value={metrics.precision} color="#764ba2" />
                        <MetricBar label="Recall" value={metrics.recall} color="#f093fb" />
                        <MetricBar label="F1 Score" value={metrics.f1_score} color="#26a69a" />
                    </div>
                </div>
            )}

            {/* Attack Statistics */}
            {statistics && (
                <div className="card" style={{ backgroundColor: 'rgba(244, 67, 54, 0.05)', border: '1px solid rgba(244, 67, 54, 0.2)' }}>
                    <div style={{ padding: '16px' }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>
                            Attack Statistics
                        </h3>

                        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
                            <p style={{ color: '#666', fontSize: '0.875rem' }}>
                                Detection Rate
                            </p>
                            <p style={{ color: '#f44336', fontWeight: 'bold', fontSize: '1.5rem' }}>
                                {statistics.detection_rate}%
                            </p>
                        </div>

                        <h4 style={{ fontWeight: 'bold', marginBottom: '16px', fontSize: '0.9rem' }}>
                            Attack Types Breakdown:
                        </h4>

                        {Object.keys(statistics.attack_types).length > 0 ? (
                            <div className="table-container" style={{ backgroundColor: '#fafafa' }}>
                                <table className="table">
                                    <thead style={{ backgroundColor: '#f5f3ff' }}>
                                        <tr>
                                            <th style={{ color: '#667eea' }}>Attack Type</th>
                                            <th align="right" style={{ color: '#667eea' }}>Count</th>
                                            <th align="right" style={{ color: '#667eea' }}>Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(statistics.attack_types).map(([type, count]) => {
                                            const percentage =
                                                statistics.attacks_detected > 0
                                                    ? ((count / statistics.attacks_detected) * 100).toFixed(2)
                                                    : 0;
                                            return (
                                                <tr key={type}>
                                                    <td style={{ fontWeight: 500 }}>{type}</td>
                                                    <td align="right">{count}</td>
                                                    <td align="right">
                                                        <span style={{
                                                            display: 'inline-block',
                                                            paddingLeft: '12px',
                                                            paddingRight: '12px',
                                                            paddingTop: '4px',
                                                            paddingBottom: '4px',
                                                            backgroundColor: '#f4433620',
                                                            color: '#f44336',
                                                            borderRadius: '4px',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.875rem',
                                                        }}>
                                                            {percentage}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ color: '#666', fontSize: '0.875rem' }}>
                                No specific attack types detected in the dataset.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalysisResults;