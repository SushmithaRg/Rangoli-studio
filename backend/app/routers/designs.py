from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api/designs", tags=["designs"])


@router.post("", response_model=schemas.DesignOut)
def create_design(
    payload: schemas.DesignCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    design = models.Design(user_id=current_user.id, **payload.model_dump())
    db.add(design)
    db.commit()
    db.refresh(design)
    return design


@router.get("", response_model=List[schemas.DesignOut])
def list_designs(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Design)
        .filter(models.Design.user_id == current_user.id)
        .order_by(models.Design.created_at.desc())
        .all()
    )


@router.delete("/{design_id}")
def delete_design(
    design_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    design = (
        db.query(models.Design)
        .filter(models.Design.id == design_id, models.Design.user_id == current_user.id)
        .first()
    )
    if not design:
        raise HTTPException(status_code=404, detail="Design not found.")
    db.delete(design)
    db.commit()
    return {"ok": True}
