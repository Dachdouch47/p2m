import React, { useState, useEffect, useRef } from 'react';

interface NetworkEvent {
  timestamp: string;
  src_ip: string;
  dst_ip: string;
  protocol: string;
  port: number;
  bytes_sent: number;
  bytes_received: number;
  verdict: string;
  confidence: number;
  attack_type: string;
}

// Fonction pour convertir le numéro de protocole en nom
const getProtocolName = (protocol: string | number): string => {
  const protocolMap: { [key: string]: string; [key: number]: string } = {
    '1': 'ICMP',
    '6': 'TCP',
    '17': 'UDP',
    '41': 'IPv6',
    '47': 'GRE',
    '50': 'ESP',
    '51': 'AH',
    '58': 'ICMPv6',
    '121': 'SMP',
    '132': 'SCTP',
    'ICMP': 'ICMP',
    'TCP': 'TCP',
    'UDP': 'UDP',
    '2': 'IGMP',
    'IPv6': 'IPv6',
    'GRE': 'GRE',
    'ESP': 'ESP',
    'AH': 'AH',
    'SMP': 'SMP',
    'SCTP': 'SCTP',
  };

  const protocolStr = String(protocol).toUpperCase();
  return protocolMap[protocolStr] || String(protocol);
};

const Monitoring: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'attacks'>('all');
  const [isLive, setIsLive] = useState(true);
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // Connexion WebSocket lorsque isLive est true
  useEffect(() => {
    if (!isLive) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    // Établir la connexion WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws/monitoring');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connecté');
    };

    ws.onmessage = (event) => {
      try {
        const newEvent: NetworkEvent = JSON.parse(event.data);
        setEvents(prev => [newEvent, ...prev.slice(0, 99)]);
        if (newEvent.verdict === 'Attack') {
          // Accès dynamique avec 'as any'
          const globalWindow = window as any;
          if (!globalWindow.attacks) globalWindow.attacks = [];
          globalWindow.attacks.unshift(newEvent);
          if (globalWindow.attacks.length > 1000) globalWindow.attacks.pop();
          globalWindow.dispatchEvent(new CustomEvent('attackAdded', { detail: newEvent }));
        }
      } catch (err) {
        console.error('Erreur lors du parsing WebSocket', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    ws.onclose = () => {
      console.log('WebSocket déconnecté');
    };

    return () => {
      ws.close();
    };
  }, [isLive]);

  // Optionnel : charger quelques événements historiques via REST au démarrage
  useEffect(() => {
    fetch('http://localhost:8000/api/monitoring/events?limit=100')
      .then(res => res.json())
      .then(data => {
        if (data.events && Array.isArray(data.events)) {
          setEvents(data.events);
        }
      })
      .catch(err => console.error('Erreur chargement historique', err));
  }, []);

  // Filtrage des événements
  const filteredEvents = filter === 'attacks'
    ? events.filter(e => e.verdict === 'Attack')
    : events;

  // Statistiques
  const stats = {
    attacks: events.filter(e => e.verdict === 'Attack').length
  };

  return (
    <div className="monitoring-container">
      <div className="monitoring-header">
        <h1 className="page-title">Surveillance en Temps Réel</h1>
        <div className="monitoring-controls">
          <div className="filter-group">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Tous
            </button>
            <button
              className={`filter-btn ${filter === 'attacks' ? 'active' : ''}`}
              onClick={() => setFilter('attacks')}
            >
              Attaques
            </button>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? '⏸ Pause' : '▶ Lecture'}
          </button>
        </div>
      </div>

      <div className="monitoring-stats">
        <div className="stat">
          <div className="stat-value">{stats.attacks}</div>
          <div className="stat-label">Attaques détectées</div>
        </div>
      </div>

      <div className="events-table">
        <table>
          <thead>
            <tr>
              <th>Heure</th>
              <th>IP Source</th>
              <th>IP Destination</th>
              <th>Protocole</th>
              <th>Port</th>
              <th>Octets</th>
              <th>Verdict</th>
              <th>Confiance</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event, idx) => (
              <tr key={idx} className={event.verdict === 'Attack' ? 'attack-row' : ''}>
                <td className="time">{new Date(event.timestamp).toLocaleTimeString()}</td>
                <td className="ip">{event.src_ip}</td>
                <td className="ip">{event.dst_ip}</td>
                <td>{getProtocolName(event.protocol)}</td>
                <td>{event.port}</td>
                <td>{(event.bytes_sent + event.bytes_received).toLocaleString()}</td>
                <td>
                  <span className={`verdict ${event.verdict.toLowerCase()}`}>
                    {event.attack_type || event.verdict}
                  </span>
                </td>
                <td>
                  <div className="confidence-bar">
                    <div
                      className="confidence-fill"
                      style={{ width: `${event.confidence * 100}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Monitoring;