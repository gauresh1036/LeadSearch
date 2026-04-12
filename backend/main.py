"""
FastAPI backend for Apollo.io Company Search + Auth.
- /auth/signup  – register a new user
- /auth/signin  – login and receive a JWT token
- /search       – Apollo.io company search (existing)
"""

import os
import json
from pathlib import Path
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
import httpx
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import JWTError, jwt

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Apollo Company Search API")

# ------------------------------------------------------------------
# CORS – allow the React dev server (port 3000 / 5173) to call us
# ------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # In production, restrict this!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------
# Auth config
# ------------------------------------------------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production-please")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/signin", auto_error=False)

# Simple file-based user store (no DB required)
USERS_FILE = Path(__file__).parent / "users.json"


def _load_users() -> dict:
    if USERS_FILE.exists():
        return json.loads(USERS_FILE.read_text())
    return {}


def _save_users(users: dict):
    USERS_FILE.write_text(json.dumps(users, indent=2))


# ------------------------------------------------------------------
# Pydantic models
# ------------------------------------------------------------------
class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    name: str
    email: str


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------
def _create_token(data: dict) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({**data, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


# ------------------------------------------------------------------
# Apollo.io API config
# ------------------------------------------------------------------
APOLLO_API_URL = "https://api.apollo.io/v1/mixed_people/search"
APOLLO_API_KEY = os.getenv("APOLLO_API_KEY", "")


# ------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------
@app.get("/")
def root():
    """Health-check endpoint."""
    return {"message": "Apollo Company Search API is running 🚀"}


@app.post("/auth/signup", response_model=TokenResponse)
def signup(body: SignUpRequest):
    """Register a new user. Returns a JWT token on success."""
    users = _load_users()

    if body.email in users:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    if len(body.password) < 6:
        raise HTTPException(status_code=422, detail="Password must be at least 6 characters.")

    hashed = pwd_context.hash(body.password)
    users[body.email] = {"name": body.name, "email": body.email, "hashed_password": hashed}
    _save_users(users)

    token = _create_token({"sub": body.email, "name": body.name})
    return TokenResponse(access_token=token, name=body.name, email=body.email)


@app.post("/auth/signin", response_model=TokenResponse)
def signin(body: SignInRequest):
    """Authenticate an existing user. Returns a JWT token on success."""
    users = _load_users()
    user = users.get(body.email)

    if not user or not pwd_context.verify(body.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")

    token = _create_token({"sub": body.email, "name": user["name"]})
    return TokenResponse(access_token=token, name=user["name"], email=body.email)


@app.get("/auth/me")
def me(token: str = Depends(oauth2_scheme)):
    """Return the current user info from their JWT."""
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"name": payload.get("name"), "email": payload.get("sub")}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")


@app.get("/search")
async def search(
    industry: str = Query(..., description="Industry tag, e.g. 'Technology'"),
    location: str = Query(..., description="City or region name, e.g. 'San Francisco'"),
):
    """
    Search Apollo.io for people/companies by industry and location.
    Returns a simplified list with company name and contact details.
    """

    # --- Validate API key --------------------------------------------------
    if not APOLLO_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="APOLLO_API_KEY is not set. Add it to backend/.env",
        )

    # --- Build the request body for Apollo ----------------------------------
    payload = {
        "q_organization_industry_tag": industry,
        "person_locations": [location],
        "per_page": 10,
    }

    headers = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "x-api-key": APOLLO_API_KEY,
    }

    # --- Call Apollo API ----------------------------------------------------
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                APOLLO_API_URL,
                json=payload,
                headers=headers,
            )
            response.raise_for_status()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Apollo API request timed out.")
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=f"Apollo API error: {exc.response.text}",
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Could not reach Apollo API: {str(exc)}",
        )

    # --- Parse & simplify the response -------------------------------------
    data = response.json()
    people = data.get("people", [])

    results = []
    for person in people:
        org = person.get("organization", {}) or {}
        results.append(
            {
                "company_name": org.get("name", "N/A"),
                "industry": org.get("primary_industry") or industry,
                "employee_count": org.get("estimated_num_employees", "N/A"),
                "contact_name": person.get("name", "N/A"),
                "contact_title": person.get("title", "N/A"),
                "contact_email": person.get("email", "N/A"),
                "contact_phone": (
                    person.get("phone_numbers", [{}])[0].get("sanitized_number", "N/A")
                    if person.get("phone_numbers")
                    else "N/A"
                ),
                "company_website": org.get("website_url", "N/A"),
                "linkedin_url": person.get("linkedin_url", "N/A"),
            }
        )

    return {"results": results, "total": len(results)}
