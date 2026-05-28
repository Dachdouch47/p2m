"""
Authentication service for admin user management
"""
import json
import os
from passlib.context import CryptContext
from typing import Optional
from src.types.models import User

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Path to credentials file
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), "../../config/admin_credentials.json")


def load_admin_credentials() -> dict:
    """Load admin credentials from JSON file"""
    try:
        with open(CREDENTIALS_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"admin_users": [], "settings": {}}


def save_admin_credentials(credentials: dict) -> None:
    """Save admin credentials to JSON file"""
    os.makedirs(os.path.dirname(CREDENTIALS_FILE), exist_ok=True)
    with open(CREDENTIALS_FILE, 'w') as f:
        json.dump(credentials, f, indent=2)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate password hash"""
    return pwd_context.hash(password)


def verify_admin_credentials(username: str, password: str) -> Optional[User]:
    """
    Verify admin credentials and return user if valid
    
    Args:
        username: Admin username
        password: Admin password (plain text)
        
    Returns:
        User object if credentials are valid, None otherwise
    """
    credentials = load_admin_credentials()
    
    for admin_user in credentials.get("admin_users", []):
        if admin_user.get("username") == username and admin_user.get("active"):
            if verify_password(password, admin_user.get("password_hash", "")):
                return User(
                    username=admin_user["username"],
                    role=admin_user.get("role", "admin"),
                    email=admin_user.get("email"),
                    active=admin_user.get("active", True)
                )
    
    return None


def get_admin_settings() -> dict:
    """Get current admin settings"""
    credentials = load_admin_credentials()
    return credentials.get("settings", {})


def update_admin_settings(settings: dict) -> dict:
    """
    Update admin settings
    
    Args:
        settings: Dictionary of settings to update
        
    Returns:
        Updated settings dictionary
    """
    credentials = load_admin_credentials()
    
    # Merge new settings with existing ones
    current_settings = credentials.get("settings", {})
    current_settings.update(settings)
    
    # Save back to file
    credentials["settings"] = current_settings
    save_admin_credentials(credentials)
    
    return current_settings


def create_admin_user(username: str, password: str, email: str = None) -> dict:
    """
    Create a new admin user
    
    Args:
        username: Admin username
        password: Plain text password
        email: Optional email address
        
    Returns:
        Created admin user dict
    """
    credentials = load_admin_credentials()
    
    # Check if user already exists
    for user in credentials.get("admin_users", []):
        if user["username"] == username:
            raise ValueError(f"User {username} already exists")
    
    # Create new user
    new_user = {
        "username": username,
        "password_hash": get_password_hash(password),
        "role": "admin",
        "active": True,
        "email": email,
        "created_at": "2024-01-01T00:00:00Z"
    }
    
    credentials.get("admin_users", []).append(new_user)
    save_admin_credentials(credentials)
    
    return new_user
