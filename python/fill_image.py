import Article
import urllib
import urllib3
from BeautifulSoup import BeautifulSoup

bing_url = "http://www.bing.com/search?q="
http = urllib3.PoolManager()

def url_string(headline):
  return bing_url % urllib.urlencode({"q" : headline})

def get_url(headline):
  global http
  cur_url = url_string(headline)
  r = http.request('GET', cur_url)
  return r.data


articles = load_articles('joined-noimg.json')

for art in articles:
  
  if not(art.image_link):
    art.image_link = parse_headline(art.headline)

dump_articles(articles, 'joined-noimg-wtext.json')
