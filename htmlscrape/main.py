from iga_scraper import TennisCourtChecker
from email_utils import send_email
from config import access_montreal, from_email, password, recipients
import requests
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo
import webbrowser
import time

tz = ZoneInfo('America/New_York')

curr_hour = datetime.now(tz).hour

look_ahead_days = 4 if access_montreal else 3

parser = TennisCourtChecker()

# number of days to check including today
# i is 0 base
for i in range(look_ahead_days):
    yr = (date.today() + timedelta(days=i)).year
    mth = (date.today() + timedelta(days=i)).month
    day = (date.today() + timedelta(days=i)).day

    # Stade IGA url month argument is 0 base, so 0 = January, 1 = February, etc. Hence the - 1.
    url = "https://book.stadeiga.com/courtbooking/home/calendarDayView.do?id=29&iYear={}&iMonth={}&iDate={}".format(yr, mth - 1, day)

    # The latest bookable day only opens up at 8:30 PM
    if i == 3 + 1 if access_montreal else 0:
        # Access Montreal grants access to book 4 days in advance insted of 3
        in_booking_hours = datetime.now(tz).hour < 20 and datetime.now(tz).minute < 30
    else:
        in_booking_hours = True

    # Loads page contents to a variable
    page = requests.get(url)

    parser.date = date.today() + timedelta(days=i)

    # Within the feed method, each tag in the html code is treated individually in this order: handle_starttag, handle_data, handle_endtag
    # handle_data will recursively apply the same logic for inner tags
    parser.feed(page.text)

parser.flag_two_hour_courts

if len(parser.availabilities) == 0:
    print("No availabilities found.")
    exit()

html_body = ''
for a in parser.availabilities:
    a: TennisCourtChecker.Availability
    court_info = ('%s, %s, %s, %s' % (a.date, a.time, a.court, a.link))
    
    html_body += f"<p>{court_info}</p>"
    if a.two_hour: print(court_info)
    # webbrowser.open(a.link)

html_message = f"""
    <!DOCTYPE html>
    <html>
        <head>
            <title>These courts are available</title>
        </head>
        <body>
            {html_body}
        </body>
    </html>
"""
send_email(from_email, password, 'there''s availabilities!', html_message, ", ".join(recipients), is_html=True)
