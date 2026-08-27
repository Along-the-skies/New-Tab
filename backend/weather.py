import requests


def get_weather(latitude, longitude):
    response = requests.get(
        "https://api.open-meteo.com/v1/forecast",
        params={
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,weather_code"
        }
    )

    data = response.json()

    location_response = requests.get(
        "https://nominatim.openstreetmap.org/reverse",
        params={
            "lat": latitude,
            "lon": longitude,
            "format": "json"
        },
        headers={
            "User-Agent": "NewTabWindow"
        }
    )

    location_data = location_response.json()
    address = location_data["address"]

    location = (
            address.get("city")
            or address.get("town")
            or address.get("village")
            or address.get("municipality")
        )

    return {
        "temperature": data["current"]["temperature_2m"],
        "weather_code": data["current"]["weather_code"],
        "location": location
    }