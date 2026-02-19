from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database, models
from pydantic import BaseModel
from passlib.context import CryptContext

app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🚨 IMPORTANT: CORS settings to allow frontend to connect from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, including direct file access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables based on models
models.Base.metadata.create_all(bind=database.engine)

# Dependency to get database session
def get_db():
    db = database.SessionLocal()
    try: 
        yield db
    finally: 
        db.close()

class UserSchema(BaseModel):
    email: str
    password: str

@app.post("/register")
def register(user: UserSchema, db: Session = Depends(get_db)):
  
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
   
    hashed_password = pwd_context.hash(user.password)
    new_user = models.User(email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}