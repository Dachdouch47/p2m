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
    average_confidence: number;
}

export interface ModelMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
}

export interface AttackStatistics {
    total_attacks: number;
    avg_confidence: number;
}

// ==================== Phase 4: Monitoring Types ====================

export interface NetworkEvent {
    timestamp: string;
    src_ip: string;
    dst_ip: string;
    protocol: string;
    port: number;
    bytes_sent: number;
    bytes_received: number;
    verdict: 'Attack' | 'Benign';
    confidence: number;
}

export interface AlertLogEntry {
    id: number;
    timestamp: string;
    src_ip: string;
    dst_ip: string;
    protocol: string;
    port: number;
    attack_type: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    explanation: string;
    status: 'new' | 'acknowledged' | 'resolved';
    notes: string;
}

export interface ThreatLocation {
    id: number;
    src_ip: string;
    dst_ip: string;
    country: string;
    region: string;
    latitude: number;
    longitude: number;
    attack_count: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ConfusionMatrixData {
    tp: number;
    tn: number;
    fp: number;
    fn: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
}

export interface DetectionStats {
    total_events: number;
    attacks_detected: number;
    benign_events: number;
    attack_percentage: number;
    top_attack_types: Array<{ type: string; count: number }>;
    top_source_ips: Array<{ ip: string; count: number }>;
    top_target_ports: Array<{ port: number | string; protocol: string; count: number }>;
}

export interface AdminSettings {
    model_sensitivity: number;
    enable_notifications: boolean;
    notification_email: string | null;
    notification_telegram_token: string | null;
    critical_threshold: number;
    warning_threshold: number;
    auto_update_model: boolean;
    model_version: string;
}

export interface User {
    username: string;
    role: string;
    email?: string;
    active: boolean;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}