import urllib3
import re
import json
import time
from datetime import date
from BeautifulSoup import BeautifulSoup
from BeautifulSoup import NavigableString

td_url = "http://www.onthisday.com/events/date/%d?p=%d"
month_list = { "jan" : 1, "feb" : 2, "mar" : 3, "apr" : 4,
               "may" : 5, "jun" : 6, "jul" : 7, "aug" : 8,
               "sep" : 9, "oct" : 10, "nov": 11, "dec" : 12 }

class TD_Article:
  def __init__(self, title, date):
    self.title = title
    self.date = date

  def print_article(self):
    print "On " + self.date + ": " + self.title

  def __repr__(self):
    return "On " + self.date + ": " + self.title

def get_page(page_url):
  http = urllib3.PoolManager()
  r = http.request('GET', page_url)
  return r.data

def parse_date(year, soup):
  month, day = soup.contents[0].split()
  month = month_list[month.lower()]
  day = int(day[:-2])
  return str(date(year, month, day))

def safestring(txt):
  if not(txt):
    return ""
  return txt

def remove_empty(txt_list):
  return [a for a in txt_list if a != "\n"]

def parse_news(year, doc):
  soup = BeautifulSoup(doc, convertEntities=BeautifulSoup.HTML_ENTITIES)
  print "Processed page, generating articles..."

  news_list = []
  for item in soup.findAll('li', { "class" : "event-list__item" }):
    extract_text = ''.join([a.string for a in item.contents[1:]])
    news_list.append(TD_Article(extract_text.encode('utf-8').strip(), parse_date(year, item.contents[0].contents[0])))

  for item in soup.findAll('div', { "class" : re.compile(r'\bsection--highlight\b') }):
    if type(remove_empty(item.contents[0].contents[0].contents)[0]) == NavigableString:
      extract_text = remove_empty(item.contents[0].contents[0].contents)[0].string
    else:
      extract = remove_empty(item.contents[0].contents[0].contents)[0].contents[-1].contents
      extract_text = u''.join([safestring(a.string) for a in extract[1:]])
    news_list.append(TD_Article(extract_text.strip()
                                , parse_date(year, extract[0])))

  return news_list

def parse_page_number(doc):
  soup = BeautifulSoup(doc)
  
  if (not(soup.find('ul', { "class" : "pag" }))):
    return 1
  return len([a for a in soup.find('ul', { "class" : "pag" }).contents if a != "\n"]) - 2

def get_news_from_year(year):
  pages = parse_page_number(get_page(td_url % (year, 1)))

  news_list = []
  for i in range(pages):
    news_list += parse_news(year, get_page(td_url % (year, i + 1)))
  return news_list

def get_all_articles_from_file(filename):
  f = open(filename, 'r')
  article_list = []
  res = json.load(f, encoding="utf-8")

  for article in res:
    tda = TD_Article(article['title'], article['date'])
    article_list.append(tda)
  return article_list

def gen_filename(year):
  return "td_%d.txt" % (year)

def dump_articles_to_file(article_list, filename):
  f = open(filename, "w")
  f.write(json.dumps([art.__dict__ for art in article_list]))
  f.close()

if __name__ == "__main__":
  #al = get_all_articles_from_file("td_2015.txt")
  #for art in al:
  #  art.print_article()
  #  print ""
  #exit()

  for year in range(1500, 1600):
    time.sleep(1)
    print "Getting", year
    al = get_news_from_year(year)
    dump_articles_to_file(al, "td_%d.txt" % (year))
