import json
import urllib3, certifi

from bs4 import BeautifulSoup

http = urllib3.PoolManager(10, cert_reqs='CERT_REQUIRED', ca_certs=certifi.where())

def dump(s):
	dumped = []
	
	if isinstance(s, list):
		dumped.append('[')
		l = []
		for i in s:
			l.append(dump(i))
		dumped.append(','.join(l))

		dumped.append(']')
	elif isinstance(s, dict):
		dumped.append('{')
		l = []
		for i in s:
			l.append('"' + i + '": ' + dump(s[i]))
		dumped.append(','.join(l))
		dumped.append('}')
	else:
		dumped.append('"' + str(s) + '"')

	return ''.join(dumped)

def parseText(l):
	return ''.join([i if isinstance(i, str) else str(i.contents[0]) if len(i.contents) > 0 else "" for i in l])

NEWS_PER_FILE = 1000

file_count = 1
news = []
for page in range(1, 800+1):
	f = 'data/dumps' + str(page) + '.txt'
	print(f)
	html = open(f).read()
	soup = BeautifulSoup(html, 'html.parser')

	l = soup.find_all('li', {'class': 'list-item'})

	for article in l:
		date = (str(article.article.p.time['datetime'])).split()[0].split('-')
		date = '-'.join([date[1], date[0], date[2]])
		title = parseText(article.article.h2.contents)
		link = article.article.a['href']

		req = http.request('GET', "http:" + link)
		fullHtml = req.data
		articleSoup = BeautifulSoup(fullHtml, 'html.parser')
		if articleSoup.find('div', {'itemprop': 'articleBody'}) == None or articleSoup.find('div', {'itemprop': 'articleBody'}).p == None:
			continue

		lead = parseText(articleSoup.find('div', {'itemprop': 'articleBody'}).p.contents)
		tag = link[17:].split('/')[0]
		
		if page % 20 == 1:
			print(lead)
			print(link)
			print(tag)
		
		data = {"date": date, "title": title, "link": link, "tag": tag, "lead": lead}
		
		img = article.article.img
		if img:
			link = img['src']
			l = link.split('/')
			l[-1] = [i for i in l[-1].split('/')[-1].split('&') if i[0:2] != 'w=' and i[0:2] != 'h=']
			l[-1] = '&'.join(l[-1])
			data['img'] = ('/').join(l)

		news.append(data)

		while len(news) >= NEWS_PER_FILE:
			#s = dump(news)
			s = json.dumps(news[0:NEWS_PER_FILE])
			f = open('data/parsed' + str(file_count) + '.json', 'w')
			f.write(s)
			f.close()
			news = news[NEWS_PER_FILE:]
			file_count += 1

if len(news) > 0:
	s = json.dumps(news)
	f = open('data/parsed' + str(file_count) + '.json', 'w')
	f.write(s)
	f.close()


