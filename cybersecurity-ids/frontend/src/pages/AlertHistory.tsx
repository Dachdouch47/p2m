import React, { useState, useEffect } from 'react';

interface Alert {
  id: number;
  timestamp: string;
  src_ip: string;
  dst_ip: string;
  protocol: string;
  port: number;
  attack_type: string;
  confidence: number;
  severity: string;
  explanation: string;
  status: 'new' | 'acknowledged' | 'resolved';
  notes: string;
}

const AlertHistory: React.FC = () => {
  // État initialisé à partir des attaques déjà stockées dans window (si existantes)
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const win = window as any;
    if (win.attacks && Array.isArray(win.attacks)) {
      return win.attacks.map((ev: any, idx: number) => formatAlert(ev, idx));
    }
    return [];
  });

  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Formater un événement brut en objet Alert
  const formatAlert = (ev: any, idx: number): Alert => ({
    id: idx,
    timestamp: ev.timestamp,
    src_ip: ev.src_ip,
    dst_ip: ev.dst_ip,
    protocol: ev.protocol,
    port: ev.port,
    attack_type: ev.attack_type || 'Attaque inconnue',
    confidence: ev.confidence,
    severity: getSeverity(ev.confidence),
    explanation: `Attaque détectée depuis ${ev.src_ip} vers ${ev.dst_ip}`,
    status: 'new',
    notes: ''
  });

  const getSeverity = (confidence: number): string => {
    if (confidence >= 0.9) return 'critical';
    if (confidence >= 0.7) return 'high';
    if (confidence >= 0.5) return 'medium';
    return 'low';
  };

  // Écouter les nouvelles attaques via l'événement personnalisé
  useEffect(() => {
    const handleAttackAdded = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newAttack = customEvent.detail;
      setAlerts(prev => [formatAlert(newAttack, prev.length), ...prev]);
    };
    const win = window as any;
    win.addEventListener('attackAdded', handleAttackAdded);
    return () => win.removeEventListener('attackAdded', handleAttackAdded);
  }, []);

  // Filtrage local
  const filteredAlerts = alerts.filter(a => 
    (severity === '' || a.severity === severity) &&
    (status === '' || a.status === status)
  );

  // Export CSV
  const downloadCSV = () => {
    const headers = ["Horodatage","IP Source","IP Destination","Protocole","Port","Type d'attaque","Confiance (%)","Sévérité","Statut","Explication","Notes"];
    const rows = filteredAlerts.map(alert => [
      new Date(alert.timestamp).toLocaleString(),
      alert.src_ip,
      alert.dst_ip,
      alert.protocol,
      alert.port,
      alert.attack_type,
      Math.round(alert.confidence * 100),
      alert.severity,
      alert.status,
      alert.explanation,
      alert.notes || ""
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `alertes_${new Date().toISOString().slice(0,19)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export PDF (impression)
  const handleExportPDF = () => {
    window.print();
  };

  // Actions locales
  const handleAcknowledge = (id: number) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id && alert.status === 'new'
          ? { ...alert, status: 'acknowledged' }
          : alert
      )
    );
  };

  const handleAddNote = (id: number) => {
    const note = prompt('Ajouter une note :');
    if (note) {
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === id ? { ...alert, notes: note } : alert
        )
      );
    }
  };

  return (
    <div className="alert-history-container">
      <div className="monitoring-header">
        <h1 className="page-title">Historique des Alertes</h1>
        <div className="export-buttons">
          <button className="btn btn-secondary" onClick={downloadCSV}>📥 CSV</button>
          <button className="btn btn-secondary" onClick={handleExportPDF}>📥 PDF</button>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label>Sévérité</label>
          <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="">Tous les niveaux</option>
            <option value="low">Bas</option>
            <option value="medium">Moyen</option>
            <option value="high">Haut</option>
            <option value="critical">Critique</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Statut</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="new">Nouveau</option>
            <option value="acknowledged">Reconnu</option>
            <option value="resolved">Résolu</option>
          </select>
        </div>
      </div>

      <div className="alerts-list">
        {filteredAlerts.map(alert => (
          <div key={alert.id} className="alert-item">
            <div
              className="alert-header"
              onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
            >
              <div className="alert-title">
                <span className={`severity ${alert.severity}`}>
                  {alert.severity.toUpperCase()}
                </span>
                <h3>{alert.attack_type}</h3>
                <div className="alert-meta">
                  <span>{alert.src_ip}</span>
                  <span>→</span>
                  <span>{alert.dst_ip}</span>
                </div>
              </div>
              <span>{expandedId === alert.id ? '▼' : '▶'}</span>
            </div>

            {expandedId === alert.id && (
              <div className="alert-details">
                <div className="detail-row">
                  <label>Heure</label>
                  <p>{new Date(alert.timestamp).toLocaleString()}</p>
                </div>
                <div className="detail-row">
                  <label>IP Source</label>
                  <p>{alert.src_ip}</p>
                </div>
                <div className="detail-row">
                  <label>IP Destination</label>
                  <p>{alert.dst_ip}</p>
                </div>
                <div className="detail-row">
                  <label>Protocole / Port</label>
                  <p>{alert.protocol} / {alert.port}</p>
                </div>
                <div className="detail-row">
                  <label>Type d'attaque</label>
                  <p>{alert.attack_type}</p>
                </div>
                <div className="detail-row">
                  <label>Confiance</label>
                  <p>{(alert.confidence * 100).toFixed(0)}%</p>
                </div>
                <div className="detail-row">
                  <label>Explication</label>
                  <p>{alert.explanation}</p>
                </div>
                {alert.notes && (
                  <div className="detail-row">
                    <label>Note</label>
                    <p>{alert.notes}</p>
                  </div>
                )}
                <div className="alert-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleAcknowledge(alert.id)}
                    disabled={alert.status !== 'new'}
                  >
                    Marquer comme reconnu
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleAddNote(alert.id)}
                  >
                    Ajouter une note
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredAlerts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Aucune attaque détectée pour le moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertHistory;