import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Adjust the URL based on your backend configuration

export interface UploadResponse {
    status: string;
    message: string;
    file_path: string;
    file_name: string;
    rows: number;
    columns: string[];
}

export interface TrainResponse {
    status: string;
    message: string;
    metrics: {
        accuracy: number;
        precision: number;
        recall: number;
        f1_score: number;
    };
}

export interface PredictResponse {
    status: string;
    total_records: number;
    attacks_detected: number;
    normal_records: number;
    attack_percentage: number;
}

export interface MetricsResponse {
    status: string;
    metrics: {
        accuracy: number;
        precision: number;
        recall: number;
        f1_score: number;
    };
}

export interface StatisticsResponse {
    status: string;
    total_records: number;
    attacks_detected: number;
    attack_types: Record<string, number>;
    detection_rate: number;
}

export const uploadDataset = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/upload/dataset`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const listDatasets = async () => {
    const response = await axios.get(`${API_URL}/upload/datasets`);
    return response.data;
};

export const trainModel = async (filePath: string): Promise<TrainResponse> => {
    // ⚠️ DÉPRÉCIÉ: Modèle déjà pré-entraîné dans detector_model.pkl
    // On utilise directement /upload-analyze pour prédictions
    throw new Error("Training is disabled. Model is pre-trained. Use uploadAndAnalyze() instead.");
};

export const predictOnDataset = async (filePath: string): Promise<PredictResponse> => {
    // ⚠️ DÉPRÉCIÉ: Utilisez uploadAndAnalyze() à la place
    throw new Error("Direct predict is disabled. Use uploadAndAnalyze() instead.");
};

export const uploadAndAnalyze = async (file: File): Promise<any> => {
    /**
     * 🎯 ENDPOINT RECOMMANDÉ: Upload + Prédictions automatiques
     * 
     * Le modèle pré-entraîné (detector_model.pkl) fait:
     * 1. Preprocessing des données (identique entraînement)
     * 2. Prédictions RandomForest
     * 3. Calcul des statistiques
     */
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/analyze/upload-analyze`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const getModelMetrics = async (): Promise<MetricsResponse> => {
    const response = await axios.get(`${API_URL}/results/metrics`);
    return response.data;
};

export const getStatistics = async (filePath: string): Promise<StatisticsResponse> => {
    const response = await axios.post(`${API_URL}/results/statistics`, { file_path: filePath });
    return response.data;
};