from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from jose import jwt
from schemas.auth import UserCreate, UserLogin
from utils.storage import store_data, get_data

# Function to create and return router, accepting SECRET_KEY as a parameter
def get_router(secret_key):
    router = APIRouter()
    ALGORITHM = "HS256"
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    @router.post("/register")
    async def register_user(user: UserCreate):
        hashed_password = pwd_context.hash(user.password)
        store_data(user.email, "hashed_password", hashed_password)
        return {"message": "User registered successfully"}

    @router.post("/login")
    async def login_user(user: UserLogin):
        stored_hashed_password = get_data(user.email, "hashed_password")
        
        if stored_hashed_password and pwd_context.verify(user.password, stored_hashed_password):
            token = jwt.encode({"email": user.email}, secret_key, algorithm=ALGORITHM)
            store_data(user.email, "token", token)
            return {"token": token}
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return router