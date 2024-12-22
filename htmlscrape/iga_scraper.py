import re
from html.parser import HTMLParser
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo
import time

# Review config file before running

class TennisCourtChecker(HTMLParser):
    """
    Uses the HTMLParser to scrape a website for tennis court availabilities.
    
    Attributes:
        time (int): The current time slot being processed.
        table_level (int): The current table level in the HTML structure.
        cal_level (int): The current calendar level in the HTML structure.
        court (str): The court surface and number.
        inside_calendar (bool): Flag to indicate if inside the calendar table.
        inside_court (bool): Flag to indicate if inside a court cell.
        inside_slot (bool): Flag to indicate if inside a slot link.
        availabilities (list): List of available court slots.
        date (date): The date being processed.
        link (str): The link to the booking page.
    """
    def __init__(self):
        self.time: int = 0
        self.table_level: int = 0
        self.cal_level: int = 0
        self.court: str = ""
        self.inside_calendar: bool = False
        self.inside_court: bool = False
        self.inside_slot: bool = False
        self.availabilities: list = []
        self.date: date
        self.link: str
        super().__init__()
        self.tz = ZoneInfo('America/New_York')

    # Method called when parsing the data in the start tag
    def handle_starttag(self, tag, attrs):
        if tag == 'table' and attrs == [('class', 'calendar')]:
            self.inside_calendar = True
        elif tag == 'tr' and self.inside_calendar and attrs == [('class', 'calodd')] or attrs == [('class', 'caleve')]:
            # Individual calendar cell data do not contain time information
            # so the timeslot is reset every time a valid row is hit
            self.time = 0
        elif tag == 'td' and attrs == [('class', 'caltimeslot')]:
            # This tag contains the court surface and number so data must be handled if True
            self.inside_court = True
        elif tag == 'a' and attrs[0] == ('class', 'calendarDayItemsLink'):
            self.inside_slot = True

            # Individual calendar cell data do not contain time information is manually incremented
            # every time a calendar cell is hit
            if self.time == 0:
                self.time = 7
            else:
                self.time += 1

            self.link = attrs[1][1]

    # Method called when parsing the data in the end tag
    def handle_endtag(self, tag):
        if tag == 'table':
            self.inside_calendar = False
        elif tag == 'td':
            self.inside_court = False
        elif tag == 'a':
            self.inside_slot = False

    # Method called when parsing the data between tags
    def handle_data(self, data) -> None:
        # Only handle data within calendar
        if self.inside_calendar:
            if self.inside_court:
                # Regular expression to match the court surface and number [Indoor/Outdoor] [Hard/Clay] [Court Number]
                self.court = re.search(r"(?<=\r\n)([ ]+)([a-zA-Z]+ [a-zA-Z]+ [a-zA-Z0-9]*)([ ]*)(?=\r\n)", data).group(2)
            elif self.inside_slot:
                if re.search(':', data) is not None:
                    # The little r in front of the regex expression is to indicate the following
                    # string is a regex pattern. Otherwise the compiler returns a warning that \d
                    # is not a valid escape
                    timeslot = int(re.search(r"\d\d(?=:00)", data).group())

                    avail = TennisCourtChecker.Availability(self.date, timeslot, self.court, "https://book.stadeiga.com/courtbooking/home/" + self.link)

                    if (date.today() == self.date and timeslot > datetime.now(self.tz).hour) or date.today() < self.date:
                        self.availabilities.append(avail)
        
        if self.inside_calendar or self.inside_court or self.inside_slot:
            return super().handle_data(data)
    
    def flag_two_hour_courts():
        # Filter out time slots that aren't part of a consecutive two hour block
        for a in super().availabilities:
            a.two_hour = False
            for b in super().availabilities:

                if a.time + 1 == b.time and a.date == b.date or a.time - 1 == b.time and a.date == b.date:
                    a.two_hour = True
                    break
    
    class Availability():
        """
        An object that contains information about a tennis court availability.
        
        Attributes:
            date (date): The date of the availability.
            time (int): The time slot of the availability.
            court (str): The court surface and number.
            link (str): The URL link to book the court.
            two_hour (bool): Flag to indicate if the availability is part of a two hour block.
        """
        def __init__(self, date: date, time: int, court: str, link: str):
            self.date = date
            self.time = time
            self.court = court
            self.link = link
            self.two_hour = False

def wait_until(hour, minute):
    while True:
        now = datetime.now()
        print(now)
        if now.hour == hour and now.minute == minute:
            break
        # Sleep for a minute before checking again
        if now.minute == minute - 1:
            time.sleep(1)
        else:
            time.sleep(60)

# Example usage: wait until 8:30 PM
# wait_until(20, 30)