import requests
from sensor import parse
from flask import Flask, jsonify

READ_API_KEY = "LHRD08XC1PTVOSV4"
CHANNEL_ID = "724299"

url = f"https://api.thingspeak.com/channels/{CHANNEL_ID}/feeds.json?api_key={READ_API_KEY}&results=1"


app = Flask(__name__)

@app.route('/api/sensor-reading')
def get_reading():
    data = requests.get(url).json()
    reading = parse(data)
    return jsonify({
        "nitrogen": reading.nitrogen,
        "phosphorus": reading.phosphorus,
        "potassium": reading.potassium,
        "soil_moisture": reading.soil_moisture
    })

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8090)
