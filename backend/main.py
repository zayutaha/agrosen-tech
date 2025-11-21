from sensor import parse
import requests

READ_API_KEY = "LHRD08XC1PTVOSV4"
CHANNEL_ID = "724299"

url = f"https://api.thingspeak.com/channels/{CHANNEL_ID}/feeds.json?api_key={READ_API_KEY}&results=1"


def main():
    data = requests.get(url).json()
    reading = parse(data)
    print(f"N: {reading.nitrogen}, P: {reading.phosphorus}, K: {reading.potassium}, Moisture: {reading.soil_moisture}")


if __name__ == "__main__":
    main()
