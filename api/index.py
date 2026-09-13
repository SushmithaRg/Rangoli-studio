"""
Vercel Python serverless entry point.

Vercel builds each file under /api into its own serverless function. This file
just exposes the real FastAPI app (defined in backend/app/main.py) so Vercel's
Python runtime (which supports ASGI apps) can run it directly.

NOTE: Running a Postgres-backed FastAPI app on Vercel's serverless functions
works for small/medium traffic, but each invocation may open a fresh DB
connection (cold starts). For production traffic, prefer a Postgres provider
with connection pooling built in (e.g. Neon's pooled connection string, or
Supabase's "Transaction" pooler mode), or deploy the backend separately on a
long-running host like Render/Railway/Fly.io instead. See README.md.
"""

import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "backend"))

from app.main import app  # noqa: E402
