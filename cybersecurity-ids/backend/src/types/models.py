"""
Data models for Cybersecurity IDS monitoring and alerting
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


# ==================== Network Events ====================
class NetworkEvent(BaseModel):
    """Model for network traffic events"""
    timestamp: datetime
    src_ip: str
    dst_ip: str
    protocol: str
    port: int
    bytes_sent: int
    bytes_received: int
    prediction: int  # 0 = benign, 1 = attack
    confidence: float
    attack_type: str
    details: Dict[str, Any]


# ==================== Alerts ====================
class AlertLog(BaseModel):
    """Model for security alerts"""
    timestamp: datetime
    src_ip: str
    dst_ip: str
    protocol: str
    port: int
    attack_type: str
    confidence: float
    severity: str  # low, medium, high, critical
    explanation: str
    status: str = "new"  # new, acknowledged, resolved
    notes: str = ""


class FilterParams(BaseModel):
    """Model for alert filtering parameters"""
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    src_ip: Optional[str] = None
    dst_ip: Optional[str] = None
    attack_type: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    limit: int = 50
    offset: int = 0


# ==================== Analytics ====================
class DetectionStats(BaseModel):
    """Model for detection statistics"""
    total_events: int
    attacks_detected: int
    benign_events: int
    attack_percentage: float
    top_attack_types: List[Dict[str, Any]]
    top_source_ips: List[Dict[str, Any]]
    top_target_ips: List[Dict[str, Any]]
    top_target_ports: List[Dict[str, Any]]
    hourly_stats: Optional[List[Dict[str, Any]]] = None


class ConfusionMatrix(BaseModel):
    """Model for ML model confusion matrix"""
    tp: int  # True Positives
    tn: int  # True Negatives
    fp: int  # False Positives
    fn: int  # False Negatives
    accuracy: float
    precision: float
    recall: float
    f1_score: float


# ==================== Threats ====================
class ThreatLocation(BaseModel):
    """Model for geolocation-based threats"""
    src_ip: str
    dst_ip: str
    country: str
    region: str
    latitude: float
    longitude: float
    attack_count: int
    severity: str  # low, medium, high, critical


# ==================== Configuration ====================
class NotificationConfig(BaseModel):
    """Model for notification settings"""
    enable_email: bool = False
    email_address: Optional[str] = None
    enable_telegram: bool = False
    telegram_token: Optional[str] = None
    critical_threshold: float = 0.7
    warning_threshold: float = 0.5


class ModelSettings(BaseModel):
    """Model for ML model settings"""
    sensitivity: float  # 0.0 to 1.0
    critical_threshold: float = 0.7
    warning_threshold: float = 0.5
    auto_update: bool = False
    version: str = "1.0.0"


# ==================== Export ====================
class ExportRequest(BaseModel):
    """Model for data export requests"""
    format: str  # csv or pdf
    include_details: bool = True
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    filters: Optional[FilterParams] = None


class ExportResponse(BaseModel):
    """Model for export response"""
    status: str
    format: str
    file_path: Optional[str] = None
    message: str


# ==================== Authentication ====================
class LoginRequest(BaseModel):
    """Model for login requests"""
    username: str
    password: str


class User(BaseModel):
    """Model for user information"""
    username: str
    role: str
    email: Optional[str] = None
    active: bool = True


class TokenResponse(BaseModel):
    """Model for token responses"""
    access_token: str
    token_type: str
    user: User
