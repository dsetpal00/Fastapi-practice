from fastapi import FastAPI
from .scheduler import scheduler
from contextlib import asynccontextmanager
from .routers import task, users, auth
from . import models
from .db import engine

from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager #Ye Python ka decorator hai jo asynchronous context manager create karta hai.
async def lifespan(app: FastAPI):
    scheduler.start() #Jab FastAPI application start hogi, scheduler bhi start ho jayega.

#     Ye sabse important part hai!
# - yield se pehle ka code → Application startup ke time execute hota hai.
# - yield ke baad ka code → Application shutdown ke time execute hota hai.

    yield
    scheduler.shutdown()

 # Tells humne kya additional kiya
#Yahan lifespan=lifespan ka matlab hai:
# - Pehla lifespan → FastAPI ka parameter.
# - Dusra lifespan → Hamara banaya hua function.

app = FastAPI(lifespan=lifespan)

app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_methods=["*"],
        allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(users.router)
app.include_router(task.router)
app.include_router(auth.router)