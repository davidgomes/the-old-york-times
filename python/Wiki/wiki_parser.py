from location import *
import signal
import sys

def cleanText(t):
	return re.sub('\[[0-9]+\]', '', t) #removes wikipedia references

getEventLocation = genericEventLocation([directReference, linkReference, nameReference], 
										[1, 0.5, 0.4])

def getEvents(bs, year):
	global src
	events = []

	start = bs.find("span", {"id": "Events"}).parent
	end1 = bs.find("span", {"id": "Births"})
	end2 = bs.find("span", {"id": "Deaths"})
	if end1 != None:
		end1 = end1.parent
	if end2 != None:
		end2 = end2.parent

	for month in start.next_siblings:
		if month == end1 or month == end2:
			break

		if month and month.name == 'ul':
			lis = month.find_all('li')
			for day in lis:
				date = ""
				try:
					date = parseDate(day.next['title'])
				except Exception as e:
					# TODO: FIX THIS SHIT
					#print(e)
					continue
					date = str(months[day.next.split()[0]]) + '-' + '1' + '-'
				else:
					day.next.extract()

				date += str(year)
				
				if day.next.next_sibling and day.next.next_sibling.name == 'ul':
					for ev in day.ul.find_all('li'):
						refs = getRefs(ev)
						title = ev.get_text()
						
						if title[0:3] == ' – ':
							title = title[3:]
						
						title = cleanText(title)
						
						location = getEventLocation(ev, False)
						if location == 'undefined':
							getEventLocation(day, True)
							#print(location, title)

						events.append({"title": title, "date": date, "src": SRC, "refs": refs, "_year": year, "location": location})
				else:
					refs = getRefs(day)
					title = day.get_text()

					if title[0:3] == ' – ':
						title = title[3:]

					title = cleanText(title)
					
					location = getEventLocation(day, False)
					if location == 'undefined':
						getEventLocation(day, True)
						#print(location, title)

					events.append({"title": title, "date": date, "src": SRC, "refs": refs, "_year": year, "location": location})
					
	return events

def signal_handler(signal, frame):
	print('Exiting')
	dumpCache()
	sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

events = []
file_count = 1

for year in range(1500, 2016):
	print('Year', year)
	link = "https://en.wikipedia.org/wiki/" + str(year) + "#Events"
	data = None
	try:
		f = open('pages/' + str(year) + '.html', 'r', encoding="unicode")
		data = f.read()
	except Exception as e:
		req = http.request('GET', link)
		data = req.data
		f = open('pages/' + str(year) + '.html', 'w')
		f.write(str(data))
		f.close()

	bs = BeautifulSoup(data, 'html.parser')
	events.extend(getEvents(bs, year))

	print(len(wikiCache))

if len(events) > 0:
	s = json.dumps(events)
	f = open('wiki.json', 'w')
	print('solved cases: ', len([1 for i in events if i['location'] != 'undefined']) / len(events))
	f.write(s)
	f.close()

dumpCache()

