class SensorReading:
   def __init__(self, nitrogen: int, potassium: int, phosphorus: int, soil_moisture: int):
        self.nitrogen = nitrogen
        self.potassium = potassium
        self.phosphorus = phosphorus
        self.soil_moisture = soil_moisture


def parse(data) -> SensorReading:
    feeds = extract_feeds(data)
    return SensorReading(
        nitrogen=int(feeds['field1']),
        potassium=int(feeds['field3']),
        phosphorus=int(feeds['field2']),
        soil_moisture=int(feeds['field4'])
    )


def extract_feeds(data):
   return data["feeds"][0]


def get_sensor_data():
    data = requests.get(url).json()
    return parse(data)


