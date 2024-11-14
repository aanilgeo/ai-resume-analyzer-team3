# Pydantic models for auth requests (e.g., registration, login).
from pydantic import BaseModel, EmailStr

# Pydantic model for user registration
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# Pydantic model for user login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Pydantic model for the response after successful login
class TokenResponse(BaseModel):
    token: str