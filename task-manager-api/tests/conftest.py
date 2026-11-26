#Ye testing ka common setup hoga. Ismein hum TestClient create karenge aur har test ke pehle/baad test database clean rakhenge.

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app import models
from app.db import SessionLocal, engine
from app.scheduler import scheduler

@pytest.fixture
def client(monkeypatch):

    # Tests ke dauran background scheduler ko run nahi karna.
    monkeypatch.setattr(scheduler, "start", lambda: None)
    monkeypatch.setattr(scheduler, "shutdown", lambda: None)

    # Test database ki tables create karo.
    models.Base.metadata.create_all(bind=engine)

    # Previous test data clean karo.
    db = SessionLocal()
    db.query(models.Task).delete()
    db.query(models.User).delete()
    db.commit()
    db.close()

    with TestClient(app) as test_client:
        yield test_client

    # Test complete hone ke baad cleanup.
    db = SessionLocal()
    db.query(models.Task).delete()
    db.query(models.User).delete()
    db.commit()
    db.close()

# pytest.fixture: Common setup ko multiple tests mein reuse karne deta hai.
# TestClient(app): FastAPI endpoints ko HTTP requests bhejne deta hai bina manually server start kiye.
# monkeypatch: Test ke dauran scheduler ke start() aur shutdown() ko temporarily replace karta hai. Isse background job test data ko unexpectedly modify nahi karegi.
# Database cleanup: Har test ko clean starting state milti hai.