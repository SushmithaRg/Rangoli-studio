import os
from dotenv import load_dotenv

# Loads variables from a local .env file if one exists (used for local dev).
# In production (Vercel, Render, etc.) you set these as real environment variables instead.
load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/rangoli_studio",
)

SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-secret-change-me")

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
