from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from src.api.routes import monitoring, admin_router, auth_router
from src.api.routes.realtime import router as realtime_router, start_realtime_capture, set_loop
import threading
import asyncio

app = FastAPI(
    title="Cybersecurity IDS",
    description="Intrusion Detection System using Machine Learning",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted Host Middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1"])

# Include routes

app.include_router(monitoring.router, tags=["monitoring"])
app.include_router(admin_router)
app.include_router(auth_router)
app.include_router(realtime_router)
@app.get("/")
async def root():
    return {"message": "Cybersecurity IDS API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.on_event("startup")
async def startup_event():
    # Récupérer la boucle asyncio courante pour permettre à NFStream d'envoyer des messages
    loop = asyncio.get_running_loop()
    set_loop(loop)
    # Démarrer la capture en temps réel dans un thread séparé (daemon)
    # Remplacez "Ethernet" par le nom de votre interface réseau (voir ipconfig)
    thread = threading.Thread(target=start_realtime_capture, args=(r"\Device\NPF_{11FB0AD5-67ED-4990-B1B8-0C7585A5E6BC}",), daemon=True)
    thread.start()
    print("✅ Capture réseau temps réel démarrée sur l'interface 'Wi-Fi'")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
