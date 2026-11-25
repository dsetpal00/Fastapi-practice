from . import models, db
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

def check_status():
    session = db.SessionLocal()

    try:
        tasks = session.query(models.Task).filter(models.Task.due_date <= datetime.now(), models.Task.status != "expired").all()

        for task in tasks:
            if task.status == "completed":
                session.delete(task)

            else:
                task.status = "expired"

        session.commit()

    finally:
        session.close()


scheduler = BackgroundScheduler()
scheduler.add_job(
    check_status,
    "interval",
    minutes = 1
)