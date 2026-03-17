import React, { useState } from 'react';
import { uploadDataset, trainModel, predictOnDataset, getStatistics } from '../services/api';
import { AnalysisResult, ModelMetrics, AttackStatistics } from '../types';

interface FileUploadProps {
    onAnalysisComplete?: (result: AnalysisResult, metrics: ModelMetrics, stats: AttackStatistics) => void;
}

type StepStatus = 'pending' | 'loading' | 'complete' | 'error';

interface Step {
    name: string;
    status: StepStatus;
}

const FileUpload: React.FC<FileUploadProps> = ({ onAnalysisComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);
    const [steps, setSteps] = useState<Step[]>([
        { name: 'Upload Dataset', status: 'pending' },
        { name: 'Train Model', status: 'pending' },
        { name: 'Make Predictions', status: 'pending' },
        { name: 'Get Statistics', status: 'pending' },
    ]);

    const updateStep = (index: number, status: StepStatus) => {
        const newSteps = [...steps];
        newSteps[index].status = status;
        setSteps(newSteps);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setError(null);
            setSuccess(null);
        } else {
            setError('Please upload a valid CSV file.');
            setFile(null);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile && droppedFile.type === 'text/csv') {
            setFile(droppedFile);
            setError(null);
        } else {
            setError('Please drop a valid CSV file.');
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) return;

        setLoading(true);
        setError(null);
        setSuccess(null);
        setSteps([
            { name: 'Upload Dataset', status: 'loading' },
            { name: 'Train Model', status: 'pending' },
            { name: 'Make Predictions', status: 'pending' },
            { name: 'Get Statistics', status: 'pending' },
        ]);

        try {
            // Step 1: Upload the dataset
            const uploadResponse = await uploadDataset(file);
            
            if (uploadResponse.status !== 'success') {
                throw new Error('Upload failed: ' + uploadResponse.message);
            }

            const filePath = uploadResponse.file_path;
            setUploadedFilePath(filePath);
            updateStep(0, 'complete');
            setSuccess(`Dataset uploaded successfully! (${uploadResponse.rows} rows, ${uploadResponse.columns.length} columns)`);

            // Step 2: Train the model
            updateStep(1, 'loading');
            const trainResponse = await trainModel(filePath);
            
            if (trainResponse.status !== 'success') {
                throw new Error('Training failed: ' + trainResponse.message);
            }

            const metrics = trainResponse.metrics;
            updateStep(1, 'complete');
            setSuccess(prev => (prev || '') + '\nModel trained successfully!');

            // Step 3: Make predictions
            updateStep(2, 'loading');
            const predictResponse = await predictOnDataset(filePath);
            
            if (predictResponse.status !== 'success') {
                throw new Error('Prediction failed');
            }

            updateStep(2, 'complete');

            // Step 4: Get statistics
            updateStep(3, 'loading');
            const statsResponse = await getStatistics(filePath);
            
            if (statsResponse.status !== 'success') {
                throw new Error('Failed to get statistics');
            }

            updateStep(3, 'complete');
            setSuccess(prev => (prev || '') + '\nAnalysis completed successfully!');

            // Call the callback if provided
            if (onAnalysisComplete) {
                onAnalysisComplete(predictResponse, metrics, statsResponse);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during analysis';
            setError(errorMessage);
            console.error('Error during analysis workflow:', error);
            
            // Mark current step as error
            for (let i = 0; i < steps.length; i++) {
                if (steps[i].status === 'loading') {
                    updateStep(i, 'error');
                    break;
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const getStepIcon = (status: StepStatus) => {
        switch (status) {
            case 'complete':
                return '✓';
            case 'error':
                return '✗';
            case 'loading':
                return '⟳';
            default:
                return '○';
        }
    };

    const completedSteps = steps.filter(s => s.status === 'complete').length;
    const progressPercent = (completedSteps / steps.length) * 100;

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {/* Drag and Drop Area */}
                <div 
                    className="file-upload-area"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="upload-icon">☁️</div>
                    <h2 className="upload-title">Drag and drop your CSV file here</h2>
                    <p className="upload-subtitle">or click to select</p>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        disabled={loading}
                        id="file-input"
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                        <button 
                            type="button"
                            className="btn btn-primary"
                            disabled={loading}
                            onClick={() => document.getElementById('file-input')?.click()}
                        >
                            Choose File
                        </button>
                    </label>
                    {file && (
                        <p className="upload-success">✓ {file.name}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div style={{ marginBottom: '24px', marginTop: '24px' }}>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={!file || loading}
                    >
                        {loading ? 'Analyzing...' : 'Upload & Analyze'}
                    </button>
                </div>
            </form>

            {/* Steps Progress */}
            {loading && (
                <div className="card" style={{ marginBottom: '24px', backgroundColor: 'rgba(102, 126, 234, 0.05)' }}>
                    <div style={{ padding: '16px' }}>
                        <h3 style={{ marginBottom: '24px', fontWeight: 'bold' }}>Analysis Progress</h3>
                        <div className="step-list">
                            {steps.map((step, index) => (
                                <div key={index} className="step-item">
                                    <span className={`step-icon step-icon-${step.status}`}>
                                        {getStepIcon(step.status)}
                                    </span>
                                    <span className={step.status === 'loading' ? 'step-name-loading' : 'step-name'}>
                                        {step.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="progress-bar" style={{ marginTop: '16px' }}>
                            <div 
                                className="progress-fill" 
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Alert */}
            {error && (
                <div className="alert alert-error" style={{ marginBottom: '24px' }}>
                    <span>{error}</span>
                    <button 
                        className="alert-close"
                        onClick={() => setError(null)}
                        type="button"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Success Alert */}
            {success && (
                <div className="alert alert-success" style={{ marginBottom: '24px', whiteSpace: 'pre-wrap' }}>
                    <span>{success}</span>
                    <button 
                        className="alert-close"
                        onClick={() => setSuccess(null)}
                        type="button"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Uploaded File Path */}
            {uploadedFilePath && (
                <div className="card" style={{ backgroundColor: 'rgba(102, 126, 234, 0.05)' }}>
                    <div style={{ padding: '16px' }}>
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>
                            <strong>Uploaded File Path:</strong>
                        </p>
                        <p style={{ marginTop: '8px', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                            {uploadedFilePath}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;