from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt, JWTError
from schemas.auth import UserCreate, UserLogin
from utils.storage import store_data, get_data
from datetime import datetime, timedelta, timezone

# Function to create and return router, accepting SECRET_KEY as a parameter
def get_router(secret_key): # note: include .env file in root directory with SECRET_KEY
    router = APIRouter()
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

    # function to create tokens for logged-in users
    def create_access_token(data: dict, expires_delta: timedelta):
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + expires_delta
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)
        return encoded_jwt

    @router.post("/register")
    async def register_user(user: UserCreate):
        hashed_password = pwd_context.hash(user.password)
        store_data(user.email, "hashed_password", hashed_password)
        return {"message": "User registered successfully"}

    @router.post("/login")
    async def login_user(user: UserLogin):
        stored_hashed_password = get_data(user.email, "hashed_password")
        
        if stored_hashed_password and pwd_context.verify(user.password, stored_hashed_password):
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            token = create_access_token({"email": user.email}, access_token_expires)
            store_data(user.email, "token", token)
            return {"token": token}
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # function to verify tokens of users accessing protected pages (dashboard)
    @router.get("/verify-token")
    async def verify_token(token: str = Depends(oauth2_scheme)):
        try:
            payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
            email = payload.get("email")
            if email is None:
                raise HTTPException(status_code=401, detail="Invalid token payload")
            return {"email": email}
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

    return router