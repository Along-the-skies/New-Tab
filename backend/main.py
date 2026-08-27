from flask import Flask,jsonify ,request ,send_from_directory
from backend.wallpaper import get_wallpaper
from backend.weather import get_weather

app = Flask(__name__)

FRONTEND = "../frontend"

@app.route("/")
def home():
    return send_from_directory(FRONTEND,"index.html")

@app.route("/<path:filename>")
def frontend(filename):
    return send_from_directory(FRONTEND,filename)

@app.route("/api/wallpaper")
def wallpaper():
    return get_wallpaper()

@app.route("/api/weather")
def weather():
    latitude = request.args.get("lat")
    longitude = request.args.get("lon")
    return jsonify(get_weather(
        latitude,
        longitude
    ))

if __name__ == "__main__":
    app.run(debug=True)