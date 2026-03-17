export interface Dataset {
    name: string;
    size: number;
    uploadedAt: string;
}

export interface AnalysisResult {
    status: string;
    total_records: number;
    attacks_detected: number;
    normal_records: number;
    attack_percentage: number;
}

export interface ModelMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
}

export interface AttackStatistics {
    status: string;
    total_records: number;
    attacks_detected: number;
    attack_types: Record<string, number>;
    detection_rate: number;
}