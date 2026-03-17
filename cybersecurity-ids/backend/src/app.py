from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from src.api.routes import upload, analyze, results

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
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])
app.include_router(analyze.router, prefix="/api/analyze", tags=["analyze"])
app.include_router(results.router, prefix="/api/results", tags=["results"])

@app.get("/")
async def root():
    return {"message": "Cybersecurity IDS API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
