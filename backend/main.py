"""
FastAPI backend for Apollo.io Company Search.
Accepts industry and city, queries Apollo API, and returns company results.
Falls back to curated demo data when Apollo returns no results.
"""

import os
import random
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel

# Load environment variables from .env file
load_dotenv()

gemini_client = None
if os.getenv("GEMINI_API_KEY"):
    gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))



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


# ------------------------------------------------------------------
# Curated demo company database (used as fallback when Apollo is empty)
# ------------------------------------------------------------------
DEMO_COMPANIES = {
    "technology": [
        {"name": "Nexus AI Solutions", "website": "nexusai.io", "employees": "150-200", "founded": "2019", "description": "AI-powered enterprise automation platform"},
        {"name": "CloudSync Technologies", "website": "cloudsync.tech", "employees": "500-1000", "founded": "2016", "description": "Cloud infrastructure and DevOps solutions"},
        {"name": "DataForge Analytics", "website": "dataforge.io", "employees": "80-150", "founded": "2020", "description": "Real-time big data analytics and visualization"},
        {"name": "CyberVault Security", "website": "cybervault.com", "employees": "200-500", "founded": "2017", "description": "Enterprise cybersecurity and threat detection"},
        {"name": "QuantumLeap Computing", "website": "quantumleap.dev", "employees": "50-100", "founded": "2021", "description": "Quantum computing research and applications"},
        {"name": "PixelStream Labs", "website": "pixelstream.io", "employees": "30-60", "founded": "2022", "description": "AR/VR development and immersive experiences"},
        {"name": "Neural Networks Inc", "website": "neuralnetworks.ai", "employees": "100-200", "founded": "2018", "description": "Deep learning models for healthcare diagnostics"},
        {"name": "SwiftCode Systems", "website": "swiftcode.dev", "employees": "200-400", "founded": "2015", "description": "Low-code enterprise application development"},
        {"name": "Apex Robotics", "website": "apexrobotics.com", "employees": "300-600", "founded": "2014", "description": "Industrial robotics and automation solutions"},
        {"name": "Horizon IoT", "website": "horizoniot.com", "employees": "60-120", "founded": "2020", "description": "Smart IoT platforms for connected cities"},
    ],
    "healthcare": [
        {"name": "MediCore Health Systems", "website": "medicore.health", "employees": "500-1000", "founded": "2012", "description": "Electronic health records and patient management"},
        {"name": "BioGenesis Labs", "website": "biogenesis.com", "employees": "200-400", "founded": "2016", "description": "Genomics research and personalized medicine"},
        {"name": "Stellar Health AI", "website": "stellarhealth.ai", "employees": "100-200", "founded": "2019", "description": "AI-driven diagnostic imaging and analysis"},
        {"name": "WellPath Therapeutics", "website": "wellpath.com", "employees": "150-300", "founded": "2017", "description": "Drug discovery and clinical trials management"},
        {"name": "CareConnect Solutions", "website": "careconnect.io", "employees": "80-150", "founded": "2020", "description": "Telemedicine and virtual healthcare platform"},
        {"name": "PharmaVista Analytics", "website": "pharmavista.com", "employees": "60-100", "founded": "2021", "description": "Pharmaceutical data analytics and insights"},
        {"name": "NeuraMed Devices", "website": "neuramed.com", "employees": "40-80", "founded": "2022", "description": "Neurotechnology and brain-computer interfaces"},
        {"name": "VitalSign Monitors", "website": "vitalsign.tech", "employees": "100-200", "founded": "2018", "description": "Wearable health monitoring devices"},
    ],
    "finance": [
        {"name": "Velox FinTech", "website": "veloxpay.com", "employees": "500-1000", "founded": "2015", "description": "Digital payments and financial infrastructure"},
        {"name": "CryptoVault Exchange", "website": "cryptovault.io", "employees": "200-400", "founded": "2018", "description": "Secure cryptocurrency trading platform"},
        {"name": "LendSmart Capital", "website": "lendsmart.com", "employees": "300-600", "founded": "2016", "description": "AI-powered lending and credit scoring"},
        {"name": "WealthGrid Advisors", "website": "wealthgrid.com", "employees": "100-200", "founded": "2019", "description": "Robo-advisory and wealth management platform"},
        {"name": "PayBridge Solutions", "website": "paybridge.io", "employees": "150-300", "founded": "2017", "description": "Cross-border payment processing"},
        {"name": "InsureTech Global", "website": "insuretech.com", "employees": "80-150", "founded": "2020", "description": "Digital insurance platform and risk analytics"},
        {"name": "BlockChain Ledger", "website": "bcledger.com", "employees": "50-100", "founded": "2021", "description": "Blockchain-based financial record keeping"},
        {"name": "CapitalForge Partners", "website": "capitalforge.com", "employees": "30-60", "founded": "2022", "description": "Venture capital and startup funding platform"},
    ],
    "renewable energy": [
        {"name": "GreenPulse Energy", "website": "greenpulse.energy", "employees": "300-600", "founded": "2014", "description": "Solar panel manufacturing and installation"},
        {"name": "WindForce Dynamics", "website": "windforce.com", "employees": "500-1000", "founded": "2012", "description": "Offshore wind farm development"},
        {"name": "SolarGrid Systems", "website": "solargrid.io", "employees": "200-400", "founded": "2016", "description": "Smart solar energy grid management"},
        {"name": "EcoVolt Batteries", "website": "ecovolt.com", "employees": "150-300", "founded": "2018", "description": "Next-gen energy storage solutions"},
        {"name": "HydroWave Power", "website": "hydrowave.energy", "employees": "100-200", "founded": "2019", "description": "Hydroelectric and tidal energy systems"},
        {"name": "BioFuel Innovations", "website": "biofuelinnovations.com", "employees": "80-150", "founded": "2020", "description": "Sustainable biofuel research and production"},
        {"name": "CleanAir Technologies", "website": "cleanair.tech", "employees": "60-120", "founded": "2021", "description": "Carbon capture and air purification"},
        {"name": "TerraWatt Solutions", "website": "terrawatt.io", "employees": "40-80", "founded": "2022", "description": "Geothermal energy exploration and development"},
    ],
    "creative arts": [
        {"name": "Aether Design Studio", "website": "aether.studio", "employees": "20-50", "founded": "2019", "description": "Brand design and creative strategy agency"},
        {"name": "PixelPerfect Media", "website": "pixelperfect.co", "employees": "30-60", "founded": "2018", "description": "Digital media production and animation"},
        {"name": "SoundWave Productions", "website": "soundwave.pro", "employees": "15-30", "founded": "2020", "description": "Music production and audio engineering"},
        {"name": "CinemaScope Films", "website": "cinemascope.film", "employees": "50-100", "founded": "2016", "description": "Independent film production and distribution"},
        {"name": "ArtVerse Gallery", "website": "artverse.io", "employees": "10-25", "founded": "2021", "description": "Digital art marketplace and NFT gallery"},
        {"name": "CreativeForge Agency", "website": "creativeforge.com", "employees": "40-80", "founded": "2017", "description": "Full-service advertising and creative agency"},
    ],
    "default": [
        {"name": "Apex Innovations", "website": "apexinnovations.com", "employees": "200-400", "founded": "2016", "description": "Cross-industry innovation consulting"},
        {"name": "Vanguard Solutions", "website": "vanguardsol.com", "employees": "300-600", "founded": "2014", "description": "Enterprise software and consulting"},
        {"name": "Summit Global Partners", "website": "summitglobal.com", "employees": "150-300", "founded": "2017", "description": "Strategic business advisory services"},
        {"name": "Nova Dynamics Corp", "website": "novadynamics.com", "employees": "100-200", "founded": "2019", "description": "Emerging technology investment and incubation"},
        {"name": "Pinnacle Group", "website": "pinnaclegroup.io", "employees": "500-1000", "founded": "2010", "description": "Multi-sector conglomerate and holding company"},
        {"name": "Elevate Enterprises", "website": "elevateent.com", "employees": "80-150", "founded": "2020", "description": "Business process optimization and growth"},
    ],
}

CITY_SUFFIXES = {
    "san francisco": "SF",
    "new york": "NYC",
    "london": "UK",
    "berlin": "DE",
    "tokyo": "JP",
    "singapore": "SG",
    "bangalore": "IN",
    "mumbai": "IN",
    "chennai": "IN",
    "hyderabad": "IN",
    "delhi": "IN",
    "pune": "IN",
    "los angeles": "LA",
    "chicago": "CHI",
    "seattle": "SEA",
    "austin": "ATX",
    "boston": "BOS",
    "toronto": "CA",
    "sydney": "AU",
    "dubai": "UAE",
    "paris": "FR",
    "amsterdam": "NL",
}


def get_demo_companies(industry: str, location: str, count: int = 10):
    """Return curated demo companies filtered by industry and location."""
    industry_key = industry.lower().strip()

    # Find best matching industry
    matched_key = "default"
    for key in DEMO_COMPANIES:
        if key in industry_key or industry_key in key:
            matched_key = key
            break

    companies = DEMO_COMPANIES[matched_key].copy()
    random.shuffle(companies)
    companies = companies[:count]

    # Add location context to each company
    city = location.strip().title() if location else "Global"
    city_tag = CITY_SUFFIXES.get(location.lower().strip(), "")

    results = []
    for c in companies:
        results.append({
            "company_name": c["name"],
            "location": city,
            "industry": industry.strip().title(),
            "employees": c["employees"],
            "website": c["website"],
            "founded": c["founded"],
            "description": c["description"],
        })

    return results


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
    Search for companies by industry and location.
    Tries Apollo API first, falls back to curated demo data.
    """

    # --- Try Apollo API first (if key is set) --------------------------
    if APOLLO_API_KEY:
        try:
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
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    APOLLO_API_URL, json=payload, headers=headers
                )
                response.raise_for_status()

            data = response.json()
            contacts = data.get("contacts", [])

            if contacts:
                # Apollo returned real data
                results = []
                for contact in contacts:
                    org = contact.get("organization", {}) or {}
                    results.append({
                        "company_name": org.get("name", "N/A"),
                        "location": location.strip().title(),
                        "industry": industry.strip().title(),
                        "employees": org.get("estimated_num_employees", "N/A"),
                        "website": org.get("website_url", "N/A"),
                        "founded": str(org.get("founded_year", "N/A")),
                        "description": org.get("short_description", "N/A"),
                    })
                return {"results": results, "total": len(results), "source": "apollo"}

        except Exception as e:
            print(f"Apollo API error (falling back to demo): {e}")

    # --- Fallback: return curated demo data ----------------------------
    results = get_demo_companies(industry, location)
    return {"results": results, "total": len(results), "source": "demo"}

class EmailRequest(BaseModel):
    company_name: str
    industry: str
    contact_name: str
    contact_title: str

@app.post("/generate-email")
async def generate_email(request: EmailRequest):
    """Generates a custom email using Gemini API."""
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not set.")
    
    prompt = f"""Write a short, professional outreach email to {request.contact_name}, who is the {request.contact_title} at {request.company_name} (Industry: {request.industry}).

The goal of the email is to introduce our services and request a brief meeting.
Keep it concise, polite, and engaging.
"""
    try:
        if not gemini_client:
            raise HTTPException(status_code=500, detail="Gemini client could not be initialized. Check API Key.")
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return {"email": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
