from datetime import datetime
from enum import Enum

class SaffronSeason(Enum):
    DORMANCY = "Dormancy"
    VEGETATIVE = "Vegetative Growth"
    FLOWERING = "Flowering"
    HARVEST = "Harvest"

class SeasonInfo:
    def __init__(self, season: SaffronSeason, description: str, care_tips: list):
        self.season = season
        self.description = description
        self.care_tips = care_tips

def get_current_season() -> SeasonInfo:
    now = datetime.now()
    month = now.month
    day = now.day
    
    if month in [12, 1, 2, 3, 4, 5]:
        return SeasonInfo(
            season=SaffronSeason.DORMANCY,
            description="Corms are dormant underground. Minimal activity.",
            care_tips=[
                "Minimal watering required",
                "Prepare soil for next cycle",
                "Check for pest damage in stored corms"
            ]
        )
    
    elif month in [6, 7, 8, 9]:
        return SeasonInfo(
            season=SaffronSeason.VEGETATIVE,
            description="Leaves emerge and grow. Corms develop.",
            care_tips=[
                "Regular watering needed",
                "Apply organic fertilizer",
                "Monitor for weeds and pests",
                "Ensure good drainage"
            ]
        )
    
    elif month == 10 and day <= 20:
        return SeasonInfo(
            season=SaffronSeason.FLOWERING,
            description="Purple flowers bloom. Critical period for saffron production.",
            care_tips=[
                "Monitor daily for flower emergence",
                "Prepare for harvest",
                "Protect from heavy rain",
                "Early morning inspection recommended"
            ]
        )
    
    elif (month == 10 and day > 20) or month == 11:
        return SeasonInfo(
            season=SaffronSeason.HARVEST,
            description="Active harvesting of saffron stigmas.",
            care_tips=[
                "Harvest flowers early morning",
                "Pick flowers before they fully open",
                "Separate stigmas immediately",
                "Dry stigmas properly in shade",
                "Store in airtight containers"
            ]
        )
    
    return SeasonInfo(
        season=SaffronSeason.DORMANCY,
        description="Season transition period",
        care_tips=["Monitor conditions"]
    )

def get_days_until_next_season() -> dict:
    now = datetime.now()
    year = now.year
    
    vegetative_start = datetime(year, 6, 1)
    flowering_start = datetime(year, 10, 1)
    harvest_start = datetime(year, 10, 21)
    dormancy_start = datetime(year, 12, 1)
    
    if now.month == 12:
        vegetative_start = datetime(year + 1, 6, 1)
        flowering_start = datetime(year + 1, 10, 1)
    
    upcoming = []
    for date, season in [
        (vegetative_start, "Vegetative Growth"),
        (flowering_start, "Flowering"),
        (harvest_start, "Harvest"),
        (dormancy_start, "Dormancy")
    ]:
        if date > now:
            days = (date - now).days
            upcoming.append({"season": season, "days": days, "date": date.strftime("%B %d")})
    
    return upcoming[0] if upcoming else {"season": "Vegetative Growth", "days": (vegetative_start - now).days, "date": vegetative_start.strftime("%B %d")}

