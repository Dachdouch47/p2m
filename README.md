# 🛡️ Cybersecurity Intrusion Detection System (IDS)

Application web full-stack pour détecter les menaces dans les logs réseau en temps réel avec Machine Learning.

## 📋 Qu'est-ce que c'est?

Système de détection d'intrusions (IDS) qui:
- ✅ **Capture le trafic réseau** en temps réel
- ✅ **Détecte les menaces** avec Machine Learning
- ✅ **Affiche les résultats** instantanément
- ✅ **Visualise les menaces** sur une carte interactive
- ✅ **Gère l'authentification** utilisateur

## 🚀 Démarrage rapide

### Prérequis
- **Python 3.8+**
- **Node.js 16+** et npm

### 1️⃣ Cloner et préparer

```bash
git clone https://github.com/your-username/cybersecurity-ids.git
cd cybersecurity-ids
```

### 2️⃣ Configuration Backend

```bash
cd cybersecurity-ids/backend

# Créer environnement virtuel
python -m venv venv

# Activer sur Windows:
venv\Scripts\activate

# Activer sur macOS/Linux:
source venv/bin/activate

# Installer dépendances
pip install -r requirements.txt
```

### 3️⃣ Configuration Frontend

```bash
cd ../frontend
npm install
```

## ⚡ Démarrer l'application

### Terminal 1 - Backend
```bash
cd cybersecurity-ids/backend
venv\Scripts\activate  # Windows
uvicorn src.app:app --reload
```
✅ Backend sur: **http://localhost:8000**

### Terminal 2 - Frontend
```bash
cd cybersecurity-ids/frontend
npm start
```
✅ Frontend sur: **http://localhost:3000**

## ⚙️ Configuration de l'interface réseau

Le backend capture le trafic réseau en temps réel. Par défaut, il utilise une interface réseau spécifique.

### Trouver votre interface réseau

**Sur Windows:**
```bash
ipconfig /all
```
Cherchez le nom complet du dispositif réseau (exemple: `\Device\NPF_{XXXX-XXXX-XXXX-XXXX}`)

**Sur macOS/Linux:**
```bash
ifconfig
# ou
ip link show
```

### Modifier l'interface réseau

L'interface réseau se trouve dans **2 fichiers** à modifier:

#### 1️⃣ Dans [cybersecurity-ids/backend/src/app.py](cybersecurity-ids/backend/src/app.py#L48)
```python
args=(r"\Device\NPF_{11FB0AD5-67ED-4990-B1B8-0C7585A5E6BC}",)
```

#### 2️⃣ Dans [cybersecurity-ids/backend/src/api/routes/realtime.py](cybersecurity-ids/backend/src/api/routes/realtime.py#L226)
```python
def start_realtime_capture(interface=r"\Device\NPF_{11FB0AD5-67ED-4990-B1B8-0C7585A5E6BC}"):
```

### Remplacer par votre interface

Dans **les 2 fichiers**, remplacez:
```
\Device\NPF_{11FB0AD5-67ED-4990-B1B8-0C7585A5E6BC}
```

Par votre propre interface. Exemple:
```
\Device\NPF_{VOTRE-INTERFACE-RESEAU}
```

### Alternative : Désactiver la capture réseau

Si l'interface ne fonctionne pas, vous pouvez la désactiver temporairement en commentant dans `app.py`:

```python
# thread.start()  # Désactiver si l'interface ne fonctionne pas
```

## 📁 Structure

```
cybersecurity-ids/
├── backend/                    # API FastAPI + ML
│   ├── src/
│   │   ├── api/routes/
│   │   │   ├── realtime.py     # Détection temps réel
│   │   │   ├── monitoring.py   # Monitoring & Threat Map
│   │   │   ├── auth.py         # Authentification
│   │   ├── ml/models/          # Modèles ML
│   │   └── app.py              # App principale
│   └── requirements.txt
├── frontend/                   # React + TypeScript
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Monitoring.tsx  # Real-time Detection
│   │   │   ├── ThreatMap.tsx   # Carte des menaces
│   │   │   └── ...
│   │   ├── components/         # Composants
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## 🎯 Fonctionnalités principales

### 1. Real-time Detection (Détection temps réel)
- Capture le trafic réseau en direct
- Analyse avec machine learning
- Résultats instantanés
- Page: **http://localhost:3000/monitoring**

### 2. Threat Map (Carte des menaces)
- Visualisation géographique des menaces
- Localisation des adresses IP
- Interaction interactive
- Page: **http://localhost:3000/threats**

## 📚 Accès

- **Frontend:** http://localhost:3000
- **API Docs:** http://localhost:8000/docs

## 🔧 Dépannage

**Backend ne démarre pas?**
```bash
# Vérifier port 8000
netstat -ano | findstr :8000
# Démarrer sur port différent
uvicorn src.app:app --reload --port 8001
```

**Frontend ne démarre pas?**
```bash
# Réinstaller dépendances
rm -r node_modules
npm install
npm start
```

**La capture réseau ne fonctionne pas?**
- Vérifiez que vous avez modifié l'interface réseau dans `app.py` et `realtime.py`
- Utilisez `ipconfig /all` pour obtenir votre interface
- Sinon, commentez `thread.start()` dans `app.py`

## 📝 Licence

MIT License

### Backend (Python)
See [requirements.txt](backend/requirements.txt) for complete list:
- **FastAPI** - Modern web framework for building APIs
- **Uvicorn** - ASGI server for running FastAPI
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **scikit-learn** - Machine learning algorithms
- **Pydantic** - Data validation using Python type annotations
- **python-multipart** - Streaming file upload support
- **python-dotenv** - Environment variable management

### Frontend (Node.js/npm)
See [frontend/package.json](frontend/package.json) for complete list:
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **React Router** - Client-side routing
- **Material-UI** - UI component library
- **Axios** - HTTP client for API requests

## Features

- **File Upload:** Users can upload CSV datasets containing network logs for analysis.
- **Malicious Activity Detection:** The application utilizes machine learning models to detect various types of attacks based on the uploaded data.
- **Results Visualization:** Users can view detailed analysis results, including detected attack types and model performance metrics.

## Technologies Used

- **Frontend:** React, TypeScript
- **Backend:** FastAPI (or Flask), Python
- **Machine Learning:** scikit-learn, pandas
- **Database:** (Specify the database used, e.g., PostgreSQL, MongoDB)

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.