from fastapi import APIRouter, Depends, status, HTTPException, Response
from sqlalchemy.orm import Session
from .. import schemas, models, oauth2
from ..db import get_db

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db),
                current_user: models.User = Depends(oauth2.get_current_user)):
    new_task = models.Task(user_id=current_user.user_id, **task.model_dump())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


# get all tasks of user (seedha list return, dict mein wrap nahi)
@router.get("/", response_model=list[schemas.TaskResponse])
def get_my_tasks(skip: int = 0, limit: int = 20, db: Session = Depends(get_db),
                 current_user: models.User = Depends(oauth2.get_current_user)):
    return (db.query(models.Task)
            .filter(models.Task.user_id == current_user.user_id)
            .order_by(models.Task.due_date)
            .offset(skip).limit(limit).all())


@router.get("/{id}", response_model=schemas.TaskResponse)
def get_task(id: int, db: Session = Depends(get_db),
             current_user: models.User = Depends(oauth2.get_current_user)):
    task = db.query(models.Task).filter(
        models.Task.task_id == id, models.Task.user_id == current_user.user_id
    ).first()

    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task with id: {id} was not found")

    return task


@router.put("/{id}", response_model=schemas.TaskResponse)
def update_task(id: int, updated_task: schemas.TaskUpdate, db: Session = Depends(get_db),
                current_user: models.User = Depends(oauth2.get_current_user)):
    task_query = db.query(models.Task).filter(
        models.Task.task_id == id, models.Task.user_id == current_user.user_id
    )
    task = task_query.first()

    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task with id: {id} was not found")

    task_query.update(updated_task.model_dump(exclude_unset=True), synchronize_session=False)
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(id: int, db: Session = Depends(get_db),
                current_user: models.User = Depends(oauth2.get_current_user)):
    task = db.query(models.Task).filter(
        models.Task.task_id == id, models.Task.user_id == current_user.user_id
    ).first()

    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task with id: {id} was not found")

    db.delete(task)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
