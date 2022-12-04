import requests
import re
from html.parser import HTMLParser
from datetime import date, timedelta

class TennisCourtChecker(HTMLParser):
    def __init__(self):
        self.time: int = 0
        self.table_level: int = 0
        self.cal_level: int = 0
        self.court: str = ""
        self.inside_court: bool = False
        self.inside_slot: bool = False
        self.inside_a: bool = False
        self.last_attr: list
        self.availabilities: list = []
        self.date: date
        self.link: str
        super().__init__()

    def InsideCalendar(self) -> bool:
        return self.table_level == self.cal_level

    def handle_starttag(self, tag, attrs):
        if tag == "table":
            self.table_level += 1
            if attrs == [("class", "calendar")]:
                self.cal_level = self.table_level
        elif tag == "tr" and self.InsideCalendar() and attrs == [("class", "calodd")] or attrs == [("class", "caleve")]:
            self.time = 0
        elif tag == "td":
            self.inside_court = attrs == [("class", "caltimeslot")]
            self.inside_slot = not self.inside_court
            if self.inside_slot:
                if self.time == 0:
                    self.time = 7
                else:
                    self.time += 1
        elif tag == "a":
            self.inside_a = True
            self.link = attrs[min(1, len(attrs) - 1)][1]

    def handle_endtag(self, tag):
        if tag == "table":
            self.cal_level -= 1
        elif tag == "td":
            self.inside_court = False
            self.inside_slot = False
        elif tag == "a":
            self.inside_a = False

    def handle_data(self, data) -> None:
        if self.InsideCalendar():
            if self.inside_court:
                self.court = re.search('(?<=\\r\\n  )[A-Z].*(?=\\r\\n)', data).group()
            elif self.inside_slot and self.inside_a:
                if re.search('Available', data) is not None:
                    if re.search('\\r\\n', data) is not None:
                        time_slot: int = re.search('\d\d(<=:00)', data).group()
                        self.availabilities.append([self.date.strftime("%A, %#d %B"), self.court, re.search('(?<=\\r\\n   )[A-Z].*(?=\\r\\n)', data).group(), "https://book.stadeiga.com/courtbooking/home/{}".format(self.link)])
                    else:

                        self.availabilities.append([self.date.strftime("%A, %#d %B"), self.court, data, "https://book.stadeiga.com/courtbooking/home/{}".format(self.link)])
        
        
        return super().handle_data(data)

parser = TennisCourtChecker()

for i in range(3):
    curr_yr = (date.today() + timedelta(days=i)).year
    curr_mon = (date.today() + timedelta(days=i)).month
    curr_day = (date.today() + timedelta(days=i)).day

    url = "https://book.stadeiga.com/courtbooking/home/calendarDayView.do?id=29&iYear={}&iMonth={}&iDate={}".format(curr_yr, curr_mon - 1, curr_day)
    page = requests.get(url)
    parser.date = date(curr_yr, curr_mon, curr_day) + timedelta(days=i)
    parser.feed(page.text)

for a in parser.availabilities:
    print('%s, %s, %s, %s' % (a[0], a[1], a[2], a[3]))

#some comment

