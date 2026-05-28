import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';


// Correction des icônes Leaflet par défaut
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Icône rouge (depuis un CDN)
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultIcon = new L.Icon.Default();

interface ThreatPoint {
  id: string;
  src_ip: string;
  dst_ip: string;
  country: string;
  latitude: number;
  longitude: number;
  attack_count: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const ThreatMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Vos attaques statiques (inchangées)
  const [threats] = useState<ThreatPoint[]>([
    {
      id: 'threat1',
      src_ip: '203.45.67.89',
      dst_ip: '10.0.0.10',
      country: 'China',
      latitude: 39.9042,
      longitude: 116.4074,
      attack_count: 542,
      severity: 'critical',
    },
    {
      id: 'threat2',
      src_ip: '198.76.54.32',
      dst_ip: '10.0.0.20',
      country: 'Russia',
      latitude: 55.7558,
      longitude: 37.6173,
      attack_count: 438,
      severity: 'high',
    },
    {
      id: 'threat3',
      src_ip: '141.123.45.67',
      dst_ip: '10.0.0.30',
      country: 'Iran',
      latitude: 35.6762,
      longitude: 51.4243,
      attack_count: 365,
      severity: 'high',
    },
  ]);

  const [selectedThreat, setSelectedThreat] = useState<ThreatPoint | null>(null);

  // Fonction pour sélectionner une menace (change l'icône en rouge)
  const selectThreat = (threat: ThreatPoint) => {
    // Remettre tous les marqueurs à l'icône par défaut
    markersRef.current.forEach((marker) => {
      marker.setIcon(defaultIcon);
    });
    // Changer l'icône du marqueur sélectionné
    const selectedMarker = markersRef.current.get(threat.id);
    if (selectedMarker) {
      selectedMarker.setIcon(redIcon);
    }
    setSelectedThreat(threat);
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    // Ajouter les marqueurs pour chaque menace
    threats.forEach((threat) => {
      const marker = L.marker([threat.latitude, threat.longitude], { icon: defaultIcon }).addTo(map);
      marker.bindPopup(`
        <strong>${threat.country}</strong><br/>
        IP source: ${threat.src_ip}<br/>
        IP cible: ${threat.dst_ip}<br/>
        Attaques: ${threat.attack_count}<br/>
        Sévérité: ${threat.severity}
      `);
      marker.on('click', () => selectThreat(threat));
      markersRef.current.set(threat.id, marker);
    });

    // Nettoyage
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [threats]);

  return (
    <div className="threat-map-container">
      <h1 className="page-title">Carte des Menaces</h1>

      <div className="threat-map-wrapper">
        <div className="threat-map">
          <div ref={mapRef} style={{ height: '500px', width: '100%' }} />
        </div>

        <div className="threat-sidebar">
          <h2 style={{ marginBottom: '16px', color: 'var(--primary-red)' }}>
            Menaces Détectées
          </h2>
          <div className="threats-list">
            {threats.map((threat) => (
              <div
                key={threat.id}
                className={`threat-item ${selectedThreat?.id === threat.id ? 'active' : ''}`}
                onClick={() => selectThreat(threat)}
              >
                <div className="threat-header">
                  <span className={`severity-badge ${threat.severity}`}>
                    {threat.severity}
                  </span>
                  <span className="threat-country">{threat.country}</span>
                </div>
                <div className="threat-details">
                  <div className="threat-detail">
                    <span className="label">De:</span>
                    <span className="value">{threat.src_ip}</span>
                  </div>
                  <div className="threat-detail">
                    <span className="label">Vers:</span>
                    <span className="value">{threat.dst_ip}</span>
                  </div>
                  <div className="threat-detail">
                    <span className="label">Attaques:</span>
                    <span className="value" style={{ color: '#cc2936' }}>
                      {threat.attack_count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedThreat && (
        <div className="threat-details-panel">
          <h2>Détails de la Menace</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Pays</span>
              <span className="value">{selectedThreat.country}</span>
            </div>
            <div className="detail-item">
              <span className="label">Latitude</span>
              <span className="value">{selectedThreat.latitude.toFixed(4)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Longitude</span>
              <span className="value">{selectedThreat.longitude.toFixed(4)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Sévérité</span>
              <span className={`severity-badge ${selectedThreat.severity}`}>
                {selectedThreat.severity}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Nombre d'attaques</span>
              <span className="value">{selectedThreat.attack_count}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreatMap;