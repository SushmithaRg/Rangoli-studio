# Rangoli Studio

A full-stack rangoli drawing app:
- **Trace a Design** — 10 original designs per difficulty level (Beginner / Intermediate / Advanced), with a guide-overlay tracing mode and a "Check My Drawing" match score.
- **Free Draw** — MS Paint-style tools: pen, eraser, line, rectangle, circle, triangle, dot-connect, fill bucket.
- **Get Designs** — a free, downloadable library of the same original artwork, separate from the game.
- **My Gallery** — every saved design, kept permanently per user.
- **Profile** — avatar, username, logout.

> **Note on design sources:** the ZIP you shared only contained a list of external, copyrighted image URLs (mostly dead blog/Pinterest links) — not usable design files. I couldn't legally embed those, so this project ships with 30 original SVG rangoli designs instead (`frontend/src/data/designs.js`).

## Tech stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React 18 + Vite, plain CSS |
| Backend   | FastAPI (Python), JWT auth |
| Database  | PostgreSQL via SQLAlchemy |
| Deploy    | Vercel (see options below) |

## Project structure

```
rangoli-studio/
├── backend/                # FastAPI app
│   ├── app/
│   │   ├── main.py         # app entry point
│   │   ├── config.py       # reads .env
│   │   ├── database.py     # SQLAlchemy engine/session
│   │   ├── models.py       # User, Design tables
│   │   ├── schemas.py      # Pydantic request/response models
│   │   ├── security.py     # password hashing + JWT
│   │   ├── deps.py         # get_current_user dependency
│   │   └── routers/
│   │       ├── auth.py     # signup, login, me, avatar
│   │       └── designs.py  # save/list/delete designs
│   ├── init_db.py          # one-time table creation script
│   ├── requirements.txt
│   └── .env.example
├── frontend/                # React app
│   └── src/
│       ├── data/designs.js         # 30 original SVG rangoli designs
│       ├── utils/canvasEngine.js   # shared drawing/scoring helpers
│       ├── components/CanvasBoard.jsx  # the drawing canvas + toolbar
│       ├── components/Sidebar.jsx
│       └── pages/ (Login, TraceDesign, FreeDraw, GetDesigns, MyGallery, Profile)
├── api/index.py             # Vercel serverless entry point (wraps the FastAPI app)
└── vercel.json               # Vercel build/route config
```

## 1. Running locally in VS Code

### Prerequisites
- Python 3.10+
- Node.js 18+
- A PostgreSQL database (local install, or a free hosted one — see below)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Now edit .env and set DATABASE_URL to your real Postgres password/host,
# and set SECRET_KEY to a random string:
#   python -c "import secrets; print(secrets.token_hex(32))"

python init_db.py                # creates the users/designs tables
uvicorn app.main:app --reload --port 8000
```

The API is now running at `http://localhost:8000`. Visit `http://localhost:8000/docs` for interactive API docs.

### Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env             # VITE_API_URL=http://localhost:8000 is correct for local dev
npm run dev
```

Visit `http://localhost:5173`. Create a profile, and you're in.

### Getting a free PostgreSQL database (if you don't have one locally)
Any of these work great with the `DATABASE_URL` format in `.env.example`:
- [Neon](https://neon.tech) — serverless Postgres, generous free tier, works well with Vercel.
- [Supabase](https://supabase.com) — Postgres + free tier, dashboard included.
- A local Postgres install (`createdb rangoli_studio`).

## 2. Deploying

PostgreSQL-backed FastAPI apps run best on a long-lived server rather than short-lived serverless functions, so here are two real options:

### Option A (recommended): frontend on Vercel, backend elsewhere
1. Deploy `backend/` to [Render](https://render.com), [Railway](https://railway.app), or [Fly.io](https://fly.io) — all have simple "deploy a FastAPI app" flows and support long-running Postgres connections without cold-start issues.
2. Set the same environment variables from `backend/.env.example` in that host's dashboard.
3. Deploy `frontend/` to Vercel as a normal Vite project (`vercel.com/new` → import repo → set root directory to `frontend`).
4. In the Vercel project's environment variables, set `VITE_API_URL` to your backend's live URL.

### Option B: everything on Vercel (single project)
The included `vercel.json` and `api/index.py` let you deploy both frontend and backend from one Vercel project:
1. Push this whole repo to GitHub.
2. Import it in Vercel — it will use `vercel.json` to build the React app (`frontend/`) and the FastAPI app (`api/index.py`) together.
3. In the Vercel project's Environment Variables, add `DATABASE_URL`, `SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES`, and `CORS_ORIGINS` (pointing at your Vercel domain).
4. Use a serverless-friendly Postgres provider (Neon's pooled connection string, or Supabase's "Transaction" pooler mode) — this avoids exhausting your database's connection limit under serverless cold starts.
5. Run `init_db.py` once against your production `DATABASE_URL` (from your machine, with `.env` pointed at production) to create the tables before first use.

## 3. Environment variables reference

**backend/.env**
| Variable | Example | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/rangoli_studio` | Your Postgres connection string |
| `SECRET_KEY` | (random 64-char hex string) | Signs login tokens — keep secret |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` | How long a login lasts (7 days) |
| `CORS_ORIGINS` | `http://localhost:5173,https://yourapp.vercel.app` | Comma-separated allowed frontend origins |

**frontend/.env**
| Variable | Example | Notes |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Where the frontend sends API requests |

## Notes on the design library

`frontend/src/data/designs.js` contains 10 hand-built original SVG designs for each of Beginner, Intermediate, and Advanced, styled after traditional motifs (kolam dot patterns, lotus, peacock, paisley/kairi, kalash, mandalas). These are used both in the Trace game and the Get Designs library. Feel free to add more by following the same pattern — each entry is just `{ name, svg }`.
