"""
Capture de flux réseau pour analyse en temps réel
Utilise Scapy pour capturer et extraire les features
"""

import pandas as pd
import numpy as np
from collections import defaultdict
from datetime import datetime
import threading
from typing import Dict, List, Optional

try:
    from scapy.all import sniff, IP, TCP, UDP, ICMP
    SCAPY_AVAILABLE = True
except ImportError:
    SCAPY_AVAILABLE = False
    print("⚠️ Scapy non installé. Installer: pip install scapy")


class NetworkFlowCapture:
    """
    Capture les flux réseau et extrait les features
    Compatible avec le format d'entraînement
    """
    
    def __init__(self, packet_count: int = 100):
        """
        Args:
            packet_count: Nombre de paquets à capturer par lot
        """
        self.packet_count = packet_count
        self.packets = []
        self.flows = defaultdict(lambda: {
            'protocol': None,
            'src_ip': None,
            'dst_ip': None,
            'src_port': None,
            'dst_port': None,
            'packet_count': 0,
            'bytes_sent': 0,
            'bytes_received': 0,
            'first_timestamp': None,
            'last_timestamp': None,
            'flags': []
        })
        self.is_capturing = False
    
    def extract_features(self, packet) -> Optional[Dict]:
        """
        Extrait les features d'un paquet
        Retourne un dictionnaire compatible avec le modèle
        """
        try:
            if not IP in packet:
                return None
            
            ip_layer = packet[IP]
            src_ip = ip_layer.src
            dst_ip = ip_layer.dst
            protocol = ip_layer.proto
            
            # Détermination du protocole
            if TCP in packet:
                protocol_name = "TCP"
                tcp_layer = packet[TCP]
                src_port = tcp_layer.sport
                dst_port = tcp_layer.dport
                flags = tcp_layer.flags
            elif UDP in packet:
                protocol_name = "UDP"
                udp_layer = packet[UDP]
                src_port = udp_layer.sport
                dst_port = udp_layer.dport
                flags = 0
            elif ICMP in packet:
                protocol_name = "ICMP"
                src_port = 0
                dst_port = 0
                flags = 0
            else:
                protocol_name = "Other"
                src_port = 0
                dst_port = 0
                flags = 0
            
            # Création du flux ID
            flow_id = f"{src_ip}-{dst_ip}-{protocol_name}-{src_port}-{dst_port}"
            
            # Extraction des features du paquet
            packet_length = len(packet)
            timestamp = datetime.now().isoformat()
            
            feature = {
                'FlowID': flow_id,
                'SourceIP': src_ip,
                'DestinationIP': dst_ip,
                'SourcePort': src_port,
                'DestinationPort': dst_port,
                'Protocol': protocol_name,
                'PacketLength': packet_length,
                'Timestamp': timestamp,
                'Flags': flags if protocol_name == "TCP" else 0,
                'TTL': ip_layer.ttl,
                'HeaderLength': ip_layer.ihl * 4,
                'TotalLength': ip_layer.len
            }
            
            return feature
            
        except Exception as e:
            print(f"❌ Erreur extraction features: {e}")
            return None
    
    def packet_callback(self, packet):
        """Callback exécuté pour chaque paquet capturé"""
        feature = self.extract_features(packet)
        if feature:
            self.packets.append(feature)
        
        # Si on a capturé assez de paquets, arrêter
        if len(self.packets) >= self.packet_count:
            self.is_capturing = False
    
    def capture_packets(self, interface: Optional[str] = None, 
                       packet_count: Optional[int] = None,
                       filter_str: str = "tcp or udp or icmp") -> pd.DataFrame:
        """
        Lance la capture réseau
        
        Args:
            interface: Interface réseau ("eth0", "Wi-Fi", etc.)
                      Si None, utilise l'interface par défaut
            packet_count: Nombre de paquets à capturer
            filter_str: Filtre BPF (ex: "tcp port 80")
            
        Returns:
            DataFrame avec les paquets capturés
        """
        if not SCAPY_AVAILABLE:
            raise ImportError("Scapy non disponible. Installer: pip install scapy")
        
        if packet_count:
            self.packet_count = packet_count
        
        self.packets = []
        self.is_capturing = True
        
        print(f"📡 Début capture ({self.packet_count} paquets)...")
        print(f"   Interface: {interface or 'auto'}")
        print(f"   Filtre: {filter_str}\n")
        
        try:
            sniff(
                prn=self.packet_callback,
                iface=interface,
                filter=filter_str,
                store=False,
                count=self.packet_count
            )
        except PermissionError:
            print("❌ Erreur: Droits administrateur requis!")
            print("   Windows: Lancer PowerShell en admin")
            print("   Linux/Mac: Utiliser sudo")
        except Exception as e:
            print(f"❌ Erreur capture: {e}")
        
        print(f"✅ {len(self.packets)} paquets capturés\n")
        
        # Conversion en DataFrame
        return pd.DataFrame(self.packets)
    
    def aggregate_flows(self, packets_df: pd.DataFrame) -> pd.DataFrame:
        """
        Agrège les paquets en flux
        Calcule les statistiques par flux
        """
        if packets_df.empty:
            return pd.DataFrame()
        
        flows_list = []
        
        for flow_id, group in packets_df.groupby('FlowID'):
            flow_stats = {
                'FlowID': flow_id,
                'SourceIP': group['SourceIP'].iloc[0],
                'DestinationIP': group['DestinationIP'].iloc[0],
                'SourcePort': group['SourcePort'].iloc[0],
                'DestinationPort': group['DestinationPort'].iloc[0],
                'Protocol': group['Protocol'].iloc[0],
                'Duration': (pd.to_datetime(group['Timestamp']).max() - 
                           pd.to_datetime(group['Timestamp']).min()).total_seconds(),
                'TotalFwdPackets': len(group),
                'TotalBwdPackets': 0,  # À implémenter avec flux bidirectionnels
                'TotalLenFwdPackets': group['PacketLength'].sum(),
                'TotalLenBwdPackets': 0,
                'FwdPacketLengthMean': group['PacketLength'].mean(),
                'FwdPacketLengthStd': group['PacketLength'].std(),
                'FwdPacketLengthMax': group['PacketLength'].max(),
                'FwdPacketLengthMin': group['PacketLength'].min(),
                'BwdPacketLengthMean': 0,
                'BwdPacketLengthStd': 0,
                'BwdPacketLengthMax': 0,
                'BwdPacketLengthMin': 0,
            }
            flows_list.append(flow_stats)
        
        return pd.DataFrame(flows_list)


# ===== MODE SIMULATION =====
def generate_dummy_network_data(num_flows: int = 10) -> pd.DataFrame:
    """
    Génère des données réseau simulées pour test
    Utile si Scapy ne fonctionne pas ou sans droit admin
    """
    print(f"🎲 Génération {num_flows} flux simulés...\n")
    
    protocols = ['TCP', 'UDP', 'ICMP']
    
    data = []
    for i in range(num_flows):
        protocol = np.random.choice(protocols)
        
        # Simule un flux normal ou une attaque (20% d'attaques)
        is_attack = np.random.random() < 0.2
        
        row = {
            'FlowID': f"flow_{i}",
            'SourceIP': f"192.168.{np.random.randint(1, 255)}.{np.random.randint(1, 255)}",
            'DestinationIP': f"10.0.{np.random.randint(1, 255)}.{np.random.randint(1, 255)}",
            'SourcePort': np.random.randint(1024, 65535),
            'DestinationPort': 80 if np.random.random() < 0.7 else np.random.randint(1, 65535),
            'Protocol': protocol,
            'Duration': np.random.randint(1, 100) if not is_attack else np.random.randint(100, 1000),
            'TotalFwdPackets': np.random.randint(1, 100) if not is_attack else np.random.randint(500, 2000),
            'TotalBwdPackets': np.random.randint(0, 50),
            'TotalLenFwdPackets': np.random.randint(100, 10000) if not is_attack else np.random.randint(50000, 500000),
            'TotalLenBwdPackets': np.random.randint(0, 5000),
            'FwdPacketLengthMean': np.random.randint(50, 1000),
            'FwdPacketLengthStd': np.random.randint(10, 500),
            'FwdPacketLengthMax': np.random.randint(1000, 5000),
            'FwdPacketLengthMin': np.random.randint(1, 100),
            'BwdPacketLengthMean': np.random.randint(50, 1000),
            'BwdPacketLengthStd': np.random.randint(10, 500),
            'BwdPacketLengthMax': np.random.randint(1000, 5000),
            'BwdPacketLengthMin': np.random.randint(1, 100),
        }
        
        data.append(row)
    
    df = pd.DataFrame(data)
    print(f"✅ {len(df)} flux générés\n")
    return df
