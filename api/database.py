from dotenv import load_dotenv
import os
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine


# Load environment variables from .env file
load_dotenv()

POSTGRES_URL= os.getenv("POSTGRES_URL")
POSTGRES_PRISMA_URL=os.getenv("POSTGRES_PRISMA_URL")
POSTGRES_URL_NON_POOLING=os.getenv("POSTGRES_URL_NON_POOLING")
POSTGRES_USER= os.getenv("POSTGRES_USER")
POSTGRES_HOST= os.getenv("POSTGRES_HOST")
POSTGRES_PASSWORD=os.getenv("POSTGRES_PASSWORD")
POSTGRES_DATABASE=os.getenv("POSTGRES_DATABASE")

# Construct the DATABASE_URL
if all([POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_DATABASE]):
    DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DATABASE}"
else:
    print('Missing .env-values')
    DATABASE_URL = None

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

