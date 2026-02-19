from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# 1. Define the Database URL (This line must be above the engine creation)
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost:3306/project_db"

# 2. Create the Database Engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Configure the SessionLocal factory for database operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our database models to inherit from
Base = declarative_base()

# Function to initialize the database and create all tables
def init_db():
    Base.metadata.create_all(bind=engine)

# Dependency function to manage database session lifecycle
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()