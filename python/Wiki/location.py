import json
import re
import urllib3
import certifi
from bs4 import BeautifulSoup
import nltk, nltk.data, pprint
from nltk.tokenize import RegexpTokenizer
from unidecode import unidecode
import signal
import sys

from collections import Counter as SimpleCounter

SRC = 'https://en.wikipedia.org'
months = {"January" : 1, "February" : 2, "March": 3, "April": 4, "May": 5, "June": 6, "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12}

NEWS_PER_FILE = 4000

STOPWORDS = [s.upper() for s in nltk.corpus.stopwords.words('english')]
tokenizer = RegexpTokenizer(r'\w+').tokenize

countries = {"Afghanistan", "Akrotiri", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas, The", "Bahrain", "Bangladesh", "Barbados", "Bassas da India", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Clipperton Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Cook Islands", "Coral Sea Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Dhekelia", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Europa Island", "Falkland Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "Gabon", "Gambia", "The Gaza Strip", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Vatican", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Jan Mayen", "Japan", "Jersey", "Jordan", "Juan de Nova Island", "Kazakhstan", "Kenya", "Kiribati", "North Korea", "South Korea", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nauru", "Navassa Island", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paracel Islands", "Paraguay", "Peru", "Philippines", "Pitcairn Islands", "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Russia", "Rwanda", "Saint Helena", "Saint Kitts and Nevis", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Spratly Islands", "Sri Lanka", "Sudan", "Suriname", "Svalbard", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tromelin Island", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands", "Wake Island", "Wallis and Futuna", "West Bank", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"}
countries = {i.lower() for i in countries}
regions = ["North America", "South America", "Europe", "East Asia", "West Asia", "Africa", "Oceania", "World", "Southeast Asia", "South Asia", "Central Asia", "Central America", "Western Asia"]
regions = [s.lower() for s in regions]
region = {}

class Counter(SimpleCounter):
	def __rmul__(self, m):
		return self * m
	def __mul__(self, m):
		if isinstance(m, (int, float, complex)):
			d = Counter()
			for k in self.keys():
				d[k] = self[k] * m
			return d
		else:
			raise('Cannot multiply Counter by ' + type(m))
	def __div__(self, m):
		if isinstance(m, (int, float, complex)) and m != 0:
			self.__mul__()
		elif m == 0:
			raise('Cannot divide Counter by 0')
		else:
			raise('Cannot divide Counter by ' + type(m))

	def normalize(self):
		total = sum(self.values())
		for k in self.keys():
			self[k] /= total

		return self

def dumpCache():
	data = json.dumps(wikiCache)
	f = open('cache.json', 'w')
	f.write(data)

def detect_sentences(text): 
	#sentences = nltk.data.load('tokenizers/punkt/english.pickle').tokenize(text)
	sentences = nltk.tokenize.sent_tokenize(text)
	return [tokenizer(s) for s in sentences]

def matchWords(sent, words):
	c = 0
	l = len(words)
	sent = [w.lower() for w in sent]
	sent2 = []
	for w in sent:
		s = w.split('-')
		for w2 in s:
			if w2 != '':
				sent2.append(w2)
	sent = sent2

	words = [w.lower() for w in words]
	for i in range(len(sent)-l+1):
		a = " ".join(sent[i:i+l])
		b = " ".join(words)
		if a[:len(b)] == b:
			c+=1
	return c

def parseDate(t):
	global months
	
	month, day = t.split()
	return str(months[month]) + '-' + day + '-'

def getRefs(bs):
	return [s['href'] for s in bs.find_all('a')]

def getWikiText(link):
	if link in wikiCache:
		return wikiCache[link]
	req = http.request('GET', SRC + link)
	bs = BeautifulSoup(req.data, 'html.parser')
	div = bs.find('div', {'id': 'mw-content-text'})
	[p.extract() for p in div('p') if p.get_text() == '']
	text = div.p.get_text()

	wikiCache[link] = text
	return text

def getCountryText(link):
	if link in wikiCache and wikiCache[link] != "":
		return wikiCache[link]
	req = http.request('GET', SRC + link)
	bs = BeautifulSoup(req.data, 'html.parser')
	div = bs.find('div', {'id': 'mw-content-text'})
	[p.extract() for p in div('p') if p.get_text() == '']
	div.p.extract()
	text = div.p.get_text()

	wikiCache[link] = text
	return text

def getRegion(country):
	def matchWord(text, expressions):
		for r in expressions:
			if r in text:
				return r
		return ''

	global regions
	n = 0
	d = {}
	for i in regions:
		d[n] = i
		n += 1

	text = getCountryText('/wiki/' + country)
	sent = tokenizer(text)
	sent = [w.lower() for w in sent]
	r = matchWord(" ".join(sent), regions)
	
	if r == '':
		r = 'world'

	return r

# location metrics

# country names / denonyms mentioned in the event
def directReference(bs, verbose=False):
	raw = bs.get_text()
	return matchDirectReference(raw, verbose)

def matchDirectReference(words, verbose=False):
	occurr = Counter()

	for c in countries:
		cnt = matchWords(words, c.split())
		if cnt > 0:
			occurr[c] += cnt
	
	for d in denonyms:
		c = denonyms[d]
		cnt = matchWords(words, d.split())
		if cnt > 0:
			occurr[c] += cnt

	if verbose:
		print('direct:', words, occurr)

	return occurr

def searchLink(link, occurr, verbose=False):
	try:
		text = detect_sentences(getWikiText(link))[0]
		words = [s for s in text if s not in STOPWORDS]
		occurr += matchDirectReference(words, False)
	except Exception as e:
		if link not in wikiCache:
			wikiCache[link] = ""
		print('error', link, e)

# country names mentioned in the links of the event
def linkReference(bs, verbose=False):
	occurr = Counter()
	
	links = getRefs(bs)
	for link in links:
		searchLink(link, occurr, verbose)

	if verbose:
		print('link:', links, occurr)
	return occurr

def nameReference(bs, verbose=False):
	#[s.extract() for s in bs('a')]
	raw = bs.get_text()
	return searchNames(raw, verbose)

def searchNames(raw, verbose=False):
	words = [s for s in tokenizer(raw) if s.upper() not in STOPWORDS]
	
	'''
	i=0
	while i < len(words):
		if i > 0 and words[i-1][0].isupper() and words[i][0].isupper():
			words[i-1] += '_' + words[i]
			words.pop(i)
		else:
			i+=1
	'''

	occurr = Counter()

	for w in words:
		if w[0].isupper():
			key = unidecode(w)
			link = '/wiki/' + key
			searchLink(link, occurr)

	if verbose:
		print("names:", [w for w in words if w[0].isupper()], occurr)
	
	return occurr

def genericEventLocation(metrics, weight):
	def result(data, verbose):
		rank = Counter()
		for m, w in zip(metrics, weight):
			rank += w * m(data, verbose).normalize()

		if verbose:
			print(rank)

		if len(rank) == 0:
			return 'undefined'
		return rank.most_common(1)[0][0]

	return result

wikiCache = {}
try:
	f = open('cache.json', 'r')
	wikiCache = json.loads(f.read())
	print('Imported cache...')
except FileNotFoundError as e:
	pass

l = json.loads(open('denonyms.json', 'r').read())
denonyms = {}
for d in l:
	den = d[0].lower()
	denonyms[den] = d[1].lower()
extra = {'Scotland': 'United Kingdom', 'England': 'United Kingdom', 'Wales': 'United Kingdom', 'Scottish': 'United Kingdom', 'Welsh': 'United Kingdom',
		 'Galicia': 'Spain', 'Aragon': 'Spain', 'Aragonese': 'Spain', 'Galician': 'Spain', 'Pope': 'Vatican', 'U.S.': 'United States'}
for k, c in extra.items():
	denonyms[k] = c

http = urllib3.PoolManager(10, cert_reqs='CERT_REQUIRED', ca_certs=certifi.where())

def signal_handler(signal, frame):
	print('Exiting')
	f = open('region.json', 'w')
	f.write(json.dumps(region))
	sys.exit(0)

try:
	f = open('region.json', 'r')
	region = json.loads(f.read())
	print('Imported regions...')
except Exception as e:
	pass

signal.signal(signal.SIGINT, signal_handler)

for c in countries:
	if c not in region:
		try:
			region[c] = getRegion(c)
		except Exception as e:
			region[c] = 'World'
		#print(c, region[c])

f = open('region.json', 'w')
f.write(json.dumps(region))

