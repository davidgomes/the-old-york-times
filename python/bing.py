import sys
from Article import *
from bs4 import BeautifulSoup
import time
import urllib3
from unidecode import unidecode

f = sys.argv[1]
articles = load_articles(f)
http = urllib3.PoolManager(10)


def work(articles, t):
	global res
	print('Thread', t)
	for art in articles:
		words = art.headline.split()
		q = '+'.join(words)
		link = 'https://www.google.pt/?q=' + unidecode(q) + '&hl=en'
		print(link)
		
		req = http.request('GET', link)
		bs = BeautifulSoup(req.data, 'html.parser')
		try:
			div = bs.find('div', {'id': 'resultStats'})
			s = div.get_text()
		except:
			print('fuck')
		try:
			s = s.split()[1]
			art.n_results = int(''.join(s.split(',')))
		except Exception as e:
			pass
		print(art.n_results)
		res[t].append(art)
		time.sleep(1)

'''
l = len(articles)
p = 1
d = l // p
threads = [None] * 4
for i in range(p):
	threads[i] = Thread(target = work, args = (articles[i*d:(i+1)*d], i) )
	threads[i].start()

for i in range(p):
	threads[i].join()

res = res[0] + res[1] + res[2] + res[3]
dump_articles(res, 'final-classified.json')
'''
work(articles, 1)
dump_articles(res[0], 'final-classified.json')
