"""
Routes for monitoring, alerts, and analytics
Basées uniquement sur les données réelles capturées par realtime.py
"""
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from collections import Counter
from src.types.models import AlertLog, ThreatLocation, ExportRequest
   # source unique de vérité

router = APIRouter(prefix="/api", tags=["monitoring"])

# ------------------------------------------------------------------
# 1. Événements réseau (historique réel)
# ------------------------------------------------------------------
@router.get("/monitoring/events")
async def get_network_events(limit: int = 100, offset: int = 0):
    from src.api.routes.realtime import shared_events
    """Retourne les vrais événements capturés (ordre antéchronologique)"""
    events_slice = shared_events[offset:offset+limit]
    return {"events": events_slice, "total": len(shared_events)}

# ------------------------------------------------------------------
# 2. Alertes (construites à partir des événements de type Attack)
# ------------------------------------------------------------------
def build_alerts_from_events():
    from src.api.routes.realtime import shared_events
    """Convertit les événements 'Attack' en objets AlertLog"""
    alerts = []
    for idx, ev in enumerate(shared_events):
        if ev.get("verdict") == "Attack":
            alert = AlertLog(
                timestamp=datetime.fromisoformat(ev["timestamp"]),
                src_ip=ev["src_ip"],
                dst_ip=ev["dst_ip"],
                protocol=ev["protocol"],
                port=ev["port"],
                attack_type="Unknown",   # à enrichir si votre modèle donne le type
                confidence=ev["confidence"],
                severity="high" if ev["confidence"] > 0.8 else "medium",
                explanation="Détection automatique par modèle IA",
                status="new",
                notes=""
            )
            alerts.append(alert)
    return alerts

@router.get("/alerts")
async def get_alerts(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    alerts = build_alerts_from_events()
    if severity:
        alerts = [a for a in alerts if a.severity == severity]
    if status:
        alerts = [a for a in alerts if a.status == status]
    return {
        "alerts": alerts[offset:offset+limit],
        "total": len(alerts)
    }

@router.post("/alerts")
async def create_alert(alert: AlertLog):
    """Ajoute une alerte manuelle (stockage en mémoire, non persistant)"""
    # Dans un vrai système, il faudrait une base de données.
    # Ici on ne stocke pas car on veut zéro simulation.
    raise HTTPException(status_code=501, detail="Not implemented (no simulation)")

@router.patch("/alerts/{alert_id}")
async def update_alert(alert_id: int, status: str = None, notes: str = None):
    raise HTTPException(status_code=501, detail="Not implemented")

# ------------------------------------------------------------------
# 3. Statistiques calculées à partir des vrais événements
# ------------------------------------------------------------------
@router.get("/analytics/stats")
async def get_detection_stats():
    from src.api.routes.realtime import shared_events
    total = len(shared_events)
    attacks = sum(1 for e in shared_events if e.get("verdict") == "Attack")
    benign = total - attacks
    # Top IPs sources malveillantes
    src_ips = [e["src_ip"] for e in shared_events if e.get("verdict") == "Attack"]
    top_ips = Counter(src_ips).most_common(5)
    # Top ports ciblés
    ports = [e["port"] for e in shared_events if e.get("verdict") == "Attack"]
    top_ports = Counter(ports).most_common(5)
    # Top protocoles
    protocols = [e["protocol"] for e in shared_events if e.get("verdict") == "Attack"]
    top_protocols = Counter(protocols).most_common(5)
    return {
        "total_events": total,
        "attacks_detected": attacks,
        "benign_events": benign,
        "attack_percentage": round(attacks / total * 100, 2) if total else 0,
        "top_attack_types": [],   # à remplir si votre modèle donne le type d'attaque
        "top_source_ips": [{"ip": ip, "count": cnt} for ip, cnt in top_ips],
        "top_target_ports": [{"port": port, "protocol": "TCP", "count": cnt} for port, cnt in top_ports],
    }

@router.get("/analytics/confusion-matrix")
async def get_confusion_matrix():
    # Pas de matrice de confusion en temps réel sans vérité terrain
    raise HTTPException(status_code=404, detail="Not available in real-time mode")

# ------------------------------------------------------------------
# 4. Menaces géolocalisées (à partir des IP sources d'attaques)
# ------------------------------------------------------------------
# Note : pour une vraie géolocalisation, utilisez une API (ipinfo, maxmind).
# Ici on simule uniquement la structure, mais sans données factices.
@router.get("/threats")
async def get_threats():
    from src.api.routes.realtime import shared_events
    # Extraire les IPs sources uniques des attaques
    attack_ips = list({e["src_ip"] for e in shared_events if e.get("verdict") == "Attack"})
    # Sans API de géoloc, on ne peut pas remplir pays/région/coordonnées.
    # On renvoie une liste vide ou on lève une erreur.
    return {"threats": []}

@router.get("/threats/{threat_id}")
async def get_threat_details(threat_id: int):
    raise HTTPException(status_code=404, detail="No threat data available")

# ------------------------------------------------------------------
# 5. Export (à implémenter avec des données réelles)
# ------------------------------------------------------------------
@router.post("/export")
async def export_data(request: ExportRequest):
    from src.api.routes.realtime import shared_events
    # Idéalement exporter shared_events au format CSV/PDF
    raise HTTPException(status_code=501, detail="Export not yet implemented for real data")