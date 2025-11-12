from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import math

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def clean_nan(data):
    if isinstance(data, list):
        return [clean_nan(x) for x in data]
    if isinstance(data, dict):
        return {k: clean_nan(v) for k, v in data.items()}
    if isinstance(data, float) and math.isnan(data):
        return None  # or "N/A"
    return data


@app.get("/properties")
def get_properties(suburb: str = "Belmont North"):
    url = "https://www.microburbs.com.au/report_generator/api/suburb/properties"
    params = {"suburb": suburb}
    headers = {
        "Authorization": "Bearer test",
        "Content-Type": "application/json"
    }

    r = requests.get(url, params=params, headers=headers)
    raw = r.json()

    # ✅ Clean NaN values before returning
    cleaned = clean_nan(raw)
    return cleaned
