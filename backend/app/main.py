from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth, designs
from .config import CORS_ORIGINS

app = FastAPI(title="Rangoli Studio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(designs.router)


@app.on_event("startup")
def on_startup():
    # Creates tables if they don't exist yet. For a production app you'd normally
    # use Alembic migrations instead, but this keeps first-time setup simple.
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as exc:  # noqa: BLE001
        print(f"[startup] Warning: could not verify/create tables: {exc}")


@app.get("/api/health")
def health():
    return {"status": "ok"}
