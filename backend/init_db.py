"""
Run this once to create the database tables before first use:

    cd backend
    python init_db.py

Make sure your .env file (copied from .env.example) has a valid DATABASE_URL first.
"""

from app.database import Base, engine
from app import models  # noqa: F401  (import registers the models with Base)

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully (users, designs).")
