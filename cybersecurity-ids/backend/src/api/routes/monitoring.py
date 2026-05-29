from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from collections import Counter

router = APIRouter(prefix="/api", tags=["monitoring"])

# =========================================================================
# MODÈLES (si besoin)
# =========================================================================
class ExportRequest(BaseModel):
    format: str
    filters: Optional[dict] = None

# =========================================================================
# 1. Événements réseau (utilisé par Monitoring pour l'historique initial)
# =========================================================================
@router.get("/monitoring/events")
async def get_network_events(limit: int = 1000, offset: int = 0):
    from src.api.routes.realtime import shared_events
    events_slice = shared_events[offset:offset+limit]
    return {"events": events_slice, "total": len(shared_events)}

# =========================================================================
# 2. Menaces géolocalisées (utilisé par ThreatMap)
# =========================================================================
@router.get("/threats")
async def get_threats():
    from src.api.routes.realtime import shared_events
    # À implémenter avec une vraie géolocalisation (API ipinfo, MaxMind)
    # Pour l'instant, retourne une liste vide
    return {"threats": []}

# =========================================================================
# (Optionnel) Si vous voulez garder les statistiques pour une future utilisation
# =========================================================================
@router.get("/analytics/stats")
async def get_detection_stats():
    from src.api.routes.realtime import shared_events
    total = len(shared_events)
    attacks = sum(1 for e in shared_events if e.get("verdict") == "Attack")
    return {
        "total_events": total,
        "attacks_detected": attacks,
        "attack_percentage": round(attacks / total * 100, 2) if total else 0,
    }