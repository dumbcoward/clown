import requests
import re
from html.parser import HTMLParser
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

class TennisCourtChecker(HTMLParser):
    def __init__(self):
        self.time: int = 0
        self.table_level: int = 0
        self.cal_level: int = 0
        self.court: str = ""
        self.inside_calendar: bool = False
        self.inside_court: bool = False
        self.inside_slot: bool = False
        self.inside_slot_data: bool = False
        self.last_attr: list
        self.availabilities: list = []
        self.date: date
        self.link: str
        super().__init__()

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
            self.inside_slot = False
        elif tag == 'a':
            self.inside_slot_data = False

    # Method called when parsing the data between tags
    def handle_data(self, data) -> None:
        # Only handle data within calendar
        if self.inside_calendar:
            if self.inside_court:
                self.court = re.search('(?<=\\r\\n).*[A-Z].*(?=\\r\\n)', data).group()
                self.court = self.court.strip()
            elif self.inside_slot:
                if re.search(':', data) is not None:
                    # The little r in front of the regex expression is to indicate the following
                    # string is a regex pattern. Otherwise the compiler returns a warning that \d
                    # is not a valid escape
                    timeslot = int(re.search(r"\d\d(?=:00)", data).group())
                    avail = Availability(self.date, timeslot, self.court, "https://book.stadeiga.com/courtbooking/home/" + self.link)

                    if (date.today() == self.date and timeslot > curr_time) or date.today() < self.date:
                        self.availabilities.append(avail)
        
        if self.inside_calendar or self.inside_court or self.inside_slot:
            return super().handle_data(data)

class Availability():
    def __init__(self, date: date, time: int, court: str, link: str):
        self.date = date
        self.time = time
        self.court = court
        self.link = link

parser = TennisCourtChecker()

tz = ZoneInfo('America/New_York')

curr_time = datetime.now(tz).hour

# number of days to check including today
# i is 0 base
for i in range(4):
    yr = (date.today() + timedelta(days=i)).year
    mth = (date.today() + timedelta(days=i)).month
    day = (date.today() + timedelta(days=i)).day

    # Stade IGA url month argument is 0 base, so 0 = January, 1 = February, etc. Hence the - 1.
    url = "https://book.stadeiga.com/courtbooking/home/calendarDayView.do?id=29&iYear={}&iMonth={}&iDate={}".format(yr, mth - 1, day)

    # Loads page contents to a variable
    page = requests.get(url)

    parser.date = date.today() + timedelta(days=i)

    # Within the feed method, each tag in the html code is treated individually in this order: handle_starttag, handle_data, handle_endtag
    # handle_data will recursively apply the same logic for inner tags
    parser.feed(page.text)

for a in parser.availabilities:
    a: Availability
    print('%s, %s, %s, %s' % (a.date, a.time, a.court, a.link))


