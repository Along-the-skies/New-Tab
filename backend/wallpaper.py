import os
import requests
from dotenv import load_dotenv

load_dotenv()

NASA_API = "https://api.nasa.gov/planetary/apod"
NASA_API_KEY = os.getenv("NASA_API_KEY")


def get_wallpaper():
    response = requests.get(
        NASA_API,
        params={
            "api_key":NASA_API_KEY
        }
    )

    response.raise_for_status()
    data=response.json()

    return{
        "url":data.get("hdurl") or data.get("url"),
        "title": data.get("title"),
        "date": data.get("date")

    }