"""
FastAPI backend for Apollo.io Company Search.
Accepts industry and city, queries Apollo API, and returns company results.
"""

import os
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from dotenv import load_dotenv

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

# Apollo.io API config
APOLLO_API_URL = "https://api.apollo.io/v1/contacts/search"
APOLLO_API_KEY = os.getenv("APOLLO_API_KEY", "")


@app.get("/")
def root():
    """Health-check endpoint."""
    return {"message": "Apollo Company Search API is running 🚀"}


@app.get("/search")
async def search(
    industry: str = Query(..., description="Industry tag, e.g. 'Technology'"),
    location: str = Query(..., description="City or region name, e.g. 'San Francisco'"),
):
    """
    Search Apollo.io for contacts by industry and location.
    Returns a simplified list with company name and email.
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
    print(f"DEBUG: Apollo response keys: {list(data.keys())}")
    
    contacts = data.get("contacts", [])
    print(f"DEBUG: Number of contacts found: {len(contacts)}")

    results = []
    for contact in contacts:
        org = contact.get("organization", {}) or {}
        results.append(
            {
                "company_name": org.get("name", "N/A"),
                "email": contact.get("email", "N/A"),
            }
        )

    return {"results": results, "total": len(results)}
