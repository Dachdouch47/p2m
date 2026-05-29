# src/api/realtime.py
import asyncio
import threading
import joblib
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from nfstream import NFStreamer
import numpy as np
import pandas as pd 
from datetime import datetime
from collections import defaultdict
import time

router = APIRouter(tags=["realtime"])

# ------------------------------
# 1. Chargement du modèle
# ------------------------------
model_data = joblib.load("C:\\Users\\dachr\\p2m\\cybersecurity-ids\\backend\\src\\ml\\models\\detector_model.pkl")
model = model_data['model']
REQUIRED_FEATURES = model_data['feature_names']   # les 70 noms
print("Classes du modèle :", model.classes_)
benign_class = None
for c in model.classes_:
    if c.lower() in ('benign', 'benin', 'normal'):
        benign_class = c
        break
if benign_class is None:
    benign_class = model.classes_[0]
print("Classe bénigne utilisée :", benign_class)

# ------------------------------
# 2. Stockage partagé avec monitoring.py
# ------------------------------
shared_events = []          # liste des événements (du plus récent au plus ancien)
MAX_HISTORY = 10000
scan_tracker = defaultdict(list)

SCAN_THRESHOLD = 15
SCAN_WINDOW = 10
# ------------------------------
# 3. Gestionnaire WebSocket
# ------------------------------
class ConnectionManager:
    def __init__(self):
        self.active_connections = []
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    async def broadcast(self, message: dict):
        for conn in self.active_connections:
            try:
                await conn.send_json(message)
            except:
                pass

manager = ConnectionManager()

@router.websocket("/ws/monitoring")
async def websocket_monitoring(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# ------------------------------
# 4. Mapping NFStream -> features (70 colonnes)
# ------------------------------
mapping = {
    'Protocol': 'protocol',
    'Flow Duration': 'bidirectional_duration_ms',
    'Total Fwd Packets': 'src2dst_packets',
    'Total Backward Packets': 'dst2src_packets',
    'Fwd Packets Length Total': 'src2dst_bytes',
    'Bwd Packets Length Total': 'dst2src_bytes',
    'Fwd Packet Length Max': 'src2dst_max_ps',
    'Fwd Packet Length Min': 'src2dst_min_ps',
    'Fwd Packet Length Mean': 'src2dst_mean_ps',
    'Fwd Packet Length Std': 'src2dst_stddev_ps',
    'Bwd Packet Length Max': 'dst2src_max_ps',
    'Bwd Packet Length Min': 'dst2src_min_ps',
    'Bwd Packet Length Mean': 'dst2src_mean_ps',
    'Bwd Packet Length Std': 'dst2src_stddev_ps',
    'Flow Bytes/s': 'bidirectional_bytes_per_second',
    'Flow Packets/s': 'bidirectional_packets_per_second',
    'Flow IAT Mean': 'bidirectional_mean_piat_ms',
    'Flow IAT Std': 'bidirectional_stddev_piat_ms',
    'Flow IAT Max': 'bidirectional_max_piat_ms',
    'Flow IAT Min': 'bidirectional_min_piat_ms',
    'Fwd IAT Total': 'src2dst_duration_ms',
    'Fwd IAT Mean': 'src2dst_mean_piat_ms',
    'Fwd IAT Std': 'src2dst_stddev_piat_ms',
    'Fwd IAT Max': 'src2dst_max_piat_ms',
    'Fwd IAT Min': 'src2dst_min_piat_ms',
    'Bwd IAT Total': 'dst2src_duration_ms',
    'Bwd IAT Mean': 'dst2src_mean_piat_ms',
    'Bwd IAT Std': 'dst2src_stddev_piat_ms',
    'Bwd IAT Max': 'dst2src_max_piat_ms',
    'Bwd IAT Min': 'dst2src_min_piat_ms',
    'Fwd PSH Flags': 'src2dst_psh_packets',
    'Fwd URG Flags': 'src2dst_urg_packets',
    'Fwd Header Length': 'src2dst_header_length',
    'Bwd Header Length': 'dst2src_header_length',
    'Fwd Packets/s': 'src2dst_packets_per_second',
    'Bwd Packets/s': 'dst2src_packets_per_second',
    'Packet Length Min': 'bidirectional_min_ps',
    'Packet Length Max': 'bidirectional_max_ps',
    'Packet Length Mean': 'bidirectional_mean_ps',
    'Packet Length Std': 'bidirectional_stddev_ps',
    'Packet Length Variance': 'bidirectional_var_ps',
    'FIN Flag Count': 'bidirectional_fin_packets',
    'SYN Flag Count': 'bidirectional_syn_packets',
    'RST Flag Count': 'bidirectional_rst_packets',
    'PSH Flag Count': 'bidirectional_psh_packets',
    'ACK Flag Count': 'bidirectional_ack_packets',
    'URG Flag Count': 'bidirectional_urg_packets',
    'CWE Flag Count': 'bidirectional_cwr_packets',
    'ECE Flag Count': 'bidirectional_ece_packets',
    'Down/Up Ratio': 'down_up_ratio',
    'Avg Packet Size': 'bidirectional_mean_ps',
    'Avg Fwd Segment Size': 'src2dst_mean_ps',
    'Avg Bwd Segment Size': 'dst2src_mean_ps',
    'Bwd Avg Bulk Rate': 'bulk_rate',
    'Subflow Fwd Packets': 'src2dst_packets',
    'Subflow Fwd Bytes': 'src2dst_bytes',
    'Subflow Bwd Packets': 'dst2src_packets',
    'Subflow Bwd Bytes': 'dst2src_bytes',
    'Init Fwd Win Bytes': 'init_win_bytes_forward',
    'Init Bwd Win Bytes': 'init_win_bytes_backward',
    'Fwd Act Data Packets': 'active_forward_packets',
    'Fwd Seg Size Min': 'src2dst_min_ps',
    'Active Mean': 'active_mean',
    'Active Std': 'active_std',
    'Active Max': 'active_max',
    'Active Min': 'active_min',
    'Idle Mean': 'idle_mean',
    'Idle Std': 'idle_std',
    'Idle Max': 'idle_max',
    'Idle Min': 'idle_min',
}

def flow_to_features(flow):
    features = {}
    for col in REQUIRED_FEATURES:
        nf_key = mapping.get(col)
        if nf_key is None:
            features[col] = 0
            continue
        value = getattr(flow, nf_key, 0)
        if value is None or (isinstance(value, float) and np.isnan(value)):
            value = 0
        # Calculs spéciaux pour certaines colonnes
        if col == 'Flow Bytes/s':
            duration = getattr(flow, 'bidirectional_duration_ms', 1) / 1000.0
            total_bytes = getattr(flow, 'bidirectional_bytes', 0)
            value = total_bytes / duration if duration > 0 else 0
        elif col == 'Flow Packets/s':
            duration = getattr(flow, 'bidirectional_duration_ms', 1) / 1000.0
            total_packets = getattr(flow, 'bidirectional_packets', 0)
            value = total_packets / duration if duration > 0 else 0
        elif col == 'Packet Length Variance':
            std = getattr(flow, 'bidirectional_stddev_ps', 0)
            value = std ** 2
        elif col == 'Down/Up Ratio':
            up = getattr(flow, 'src2dst_bytes', 1)
            down = getattr(flow, 'dst2src_bytes', 0)
            value = down / up if up > 0 else 0
        elif col in ('Fwd Header Length', 'Bwd Header Length', 'Init Fwd Win Bytes', 'Init Bwd Win Bytes',
                     'Active Mean', 'Active Std', 'Active Max', 'Active Min', 'Idle Mean', 'Idle Std',
                     'Idle Max', 'Idle Min', 'Bwd Avg Bulk Rate'):
            value = 0
        features[col] = value
    return features

# ------------------------------
# 5. Capture et prédiction en continu
# ------------------------------
loop = None

def set_loop(l):
    global loop
    loop = l

def start_realtime_capture(interface=r"\Device\NPF_{B8FD596D-A594-47E6-A1CB-40E8F3ADE92F}"):
    """Capture les flux, prédit et diffuse via WebSocket + stockage."""
    global shared_events
    streamer = NFStreamer(source=interface,
                          decode_tunnels=True,
                          statistical_analysis=False,
                          idle_timeout=15,
                          active_timeout=60)
    for flow in streamer:
        current_time = time.time()

        scan_tracker[flow.src_ip].append(
            (flow.dst_port, current_time)
        )

        # garder seulement les ports récents
        scan_tracker[flow.src_ip] = [
            (p, t)
            for p, t in scan_tracker[flow.src_ip]
            if current_time - t < SCAN_WINDOW
        ]

        unique_ports = len(set(
            p for p, _ in scan_tracker[flow.src_ip]
        ))

        # détection scan
        if unique_ports >= SCAN_THRESHOLD:

            event = {
                "timestamp": datetime.now().isoformat(),
                "src_ip": flow.src_ip,
                "dst_ip": flow.dst_ip,
                "protocol": str(flow.protocol),
                "port": flow.dst_port,
                "bytes_sent": getattr(flow, 'src2dst_bytes', 0),
                "bytes_received": getattr(flow, 'dst2src_bytes', 0),
                "verdict": "Attack",
                "confidence": 0.99,
                "attack_type": "Port Scan"
            }

            shared_events.append(event)

            if len(shared_events) > MAX_HISTORY:
                shared_events.pop()

            asyncio.run_coroutine_threadsafe(
                manager.broadcast(event),
                loop
            )

            continue
        features_dict = flow_to_features(flow)
        X = pd.DataFrame(
            [[features_dict.get(f, 0) for f in REQUIRED_FEATURES]],
            columns=REQUIRED_FEATURES
        )

        proba = model.predict_proba(X)[0]
        pred_class = model.classes_[np.argmax(proba)]
        confidence = float(np.max(proba))
        is_attack = pred_class != benign_class          # ← correction ici
        verdict = "Attack" if is_attack else "Benign"
        attack_type = pred_class if is_attack else ""   # ← utilisation
        event = {
            "timestamp": datetime.now().isoformat(),
            "src_ip": flow.src_ip,
            "dst_ip": flow.dst_ip,
            "protocol": str(flow.protocol),
            "port": flow.dst_port,
            "bytes_sent": getattr(flow, 'src2dst_bytes', 0),
            "bytes_received": getattr(flow, 'dst2src_bytes', 0),
            "verdict": verdict,
            "confidence": confidence,
            "attack_type": attack_type
        }
        shared_events.append(event)
        if len(shared_events) > MAX_HISTORY:
            shared_events.pop()
        asyncio.run_coroutine_threadsafe(manager.broadcast(event), loop)