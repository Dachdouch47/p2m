from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
from typing import Optional
from datetime import datetime, timedelta
import json
import jwt as pyjwt
import os

USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")
# =========================
# ROUTERS
# =========================

admin_router = APIRouter(prefix="/api/admin", tags=["admin"])
auth_router = APIRouter(prefix="/api/auth", tags=["auth"])

# =========================
# CONFIG
# =========================
def load_users():
    if not os.path.exists(USERS_FILE):
        return {}

    with open(USERS_FILE, "r") as f:
        return json.load(f)


def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)
users_db = load_users()

USER_SECRET_KEY = os.environ.get("IDS_SECRET_KEY", "supersecret")
USER_ALGORITHM = "HS256"
USER_ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# =========================
# MODELS
# =========================

class UserCreate(BaseModel):
    username: str
    password: str
    is_admin: Optional[bool] = False

class UserToken(BaseModel):
    access_token: str
    token_type: str

# =========================
# UTILS
# =========================

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=USER_ACCESS_TOKEN_EXPIRE_MINUTES)
    data.update({"exp": expire})
    return pyjwt.encode(data, USER_SECRET_KEY, algorithm=USER_ALGORITHM)

def get_user(username):
    return users_db.get(username)


# =========================
# ROUTES USER
# =========================

@auth_router.post("/signup", response_model=UserToken)
def signup(user: UserCreate):

    if user.username in users_db:
        raise HTTPException(400, "User exists")

    users_db[user.username] = {
        "username": user.username,
        "hashed_password": hash_password(user.password),
        "is_admin": user.is_admin
    }
    save_users(users_db)
    token = create_token({
        "sub": user.username,
        "is_admin": user.is_admin
    })

    return {"access_token": token, "token_type": "bearer"}

@auth_router.post("/login", response_model=UserToken)
def login(form: OAuth2PasswordRequestForm = Depends()):

    user = get_user(form.username)

    if not user or not verify_password(form.password, user["hashed_password"]):
        raise HTTPException(401, "Invalid credentials")

    token = create_token({
        "sub": user["username"],
        "is_admin": user["is_admin"]
    })

    return {"access_token": token, "token_type": "bearer"}

@auth_router.get("/me")
def me(token: str = Depends(oauth2_scheme)):
    payload = pyjwt.decode(token, USER_SECRET_KEY, algorithms=[USER_ALGORITHM])
    return {
        "username": payload.get("sub"),
        "is_admin": payload.get("is_admin", False)
    }

# =========================
# ROUTES ADMIN (exemple)
# =========================

@admin_router.get("/settings")
def get_settings():
    return {"msg": "admin settings"}

@admin_router.get("/verify")
def verify():
    return {"status": "ok"}