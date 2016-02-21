from Article import *
import urllib3
from bs4 import BeautifulSoup
from unidecode import unidecode

bing_url = "http://www.bing.com/search?q="
http = urllib3.PoolManager()

def get_url(url):
  global http
  #print(url)
  r = http.request('GET', unidecode(url))
  return BeautifulSoup(r.data, 'html.parser')

articles = load_articles('no-relevance.json')

i = 0
for art in articles:
  print(i)
  i += 1
  if art.n_results == 0:
    l = '+'.join(art.headline.split())
    bs = get_url(bing_url + l)
    try:
      s = bs.find('span', {'class', 'sb_count'}).get_text()
      s = s.split()[:-1]
      n = int(''.join(s))
      #print(n)
      art.n_results = n
    except Exception as e:
      continue

dump_articles(articles, 'final-relevance.json')
