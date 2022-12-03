import requests
import re
from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
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

    def handle_endtag(self, tag):
        if tag == "table":
            self.cal_level -= 1
        elif tag == "tr":
            print("nothing")
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
                        self.availabilities.append([self.court, re.search('(?<=\\r\\n   )[A-Z].*(?=\\r\\n)', data).group()])
                    else:
                        self.availabilities.append([self.court, data])
            



        return super().handle_data(data)


URL = "https://book.stadeiga.com/courtbooking/home/calendarDayView.do?id=29&iYear=2022&iMonth=11&iDate=6"
page = requests.get(URL)

parser = MyHTMLParser()
parser.feed(page.text)
print(page.text)

