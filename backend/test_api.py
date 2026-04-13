import httpx, json, os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("APOLLO_API_KEY", "")
headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "x-api-key": key,
}

# Test organization enrich (proper header auth)
print("=== /v1/organizations/enrich ===")
r = httpx.post(
    "https://api.apollo.io/v1/organizations/enrich",
    json={"domain": "google.com"},
    headers=headers,
    timeout=30,
)
print(f"Status: {r.status_code}")
data = r.json()
print(f"Keys: {list(data.keys())}")
print(json.dumps(data, indent=2)[:2000])
