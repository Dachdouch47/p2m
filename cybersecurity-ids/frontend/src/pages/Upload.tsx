import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { AnalysisResult, ModelMetrics, AttackStatistics } from '../types';

const Upload: React.FC = () => {
    const [analysisData, setAnalysisData] = useState<{
        result: AnalysisResult;
        metrics: ModelMetrics;
        stats: AttackStatistics;
    } | null>(null);

    const handleAnalysisComplete = (
        result: AnalysisResult,
        metrics: ModelMetrics,
        stats: AttackStatistics
    ) => {
        setAnalysisData({ result, metrics, stats });
    };

    return (
        <div style={{ paddingTop: '48px', paddingBottom: '48px', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '768px' }}>
                <div style={{ marginBottom: '32px', color: 'white', textAlign: 'center' }}>
                    <h1
                        style={{
                            fontWeight: 'bold',
                            marginBottom: '16px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                    >
                        Upload Network Logs
                    </h1>
                    <p
                        style={{
                            opacity: 0.95,
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        }}
                    >
                        Upload a CSV file containing network log data for intrusion detection analysis
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
                    <FileUpload onAnalysisComplete={handleAnalysisComplete} />
                </div>
            </div>
        </div>
    );
};

export default Upload;