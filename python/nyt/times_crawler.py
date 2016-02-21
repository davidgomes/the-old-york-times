import urllib2
import json
import math
import time
import datetime
import Article
from datetime import date

ny_times_url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=2016%02d%02d&end_date=2016%02d%02d&page=%d&sort=newest&api-key=sample-key"
#Arts -> Arts and Entertainment
#Business Day -> Technology and Science
#Movies -> Arts and Entertainment
#Sports -> Sports
#Technology -> Technology and Science
#U.S. -> World
#World -> World

class NYT_Article:
  def __init__(self, title, text, date, section, subsection, link, image_link):
    self.title = title
    self.text = text
    self.date = date
    self.section = section
    self.subsection = subsection
    if (self.subsection == "None"):
      self.subsection = None
    self.link = link
    self.image_link = image_link
    if (self.image_link == "None"):
      self.image_link = None

  def get_section(self):
    if (self.subsection):
      return self.section + "/" + str(self.subsection.encode('ascii', 'ignore'))
    return self.section

  def __str__(self):
    return "\n".join([self.title, self.text, self.date,
                      self.get_section(), self.link, str(self.image_link)])

def get_pretty_print(json_object):
  return json.dumps(json_object, sort_keys=True, indent=4, separators=(',', ': '))

def get_json(day, month, page):
  cur_url = ny_times_url % (month, day, month, day, page)
  req = urllib2.Request(cur_url, None, {'user-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:43.0) Gecko/20100101 Firefox/43.0'})
  opener = urllib2.build_opener()
  f = opener.open(req)
  return json.load(f)

def get_image_link(mult):
  if len(mult) < 2:
    return None
  return mult[1]['url']

def get_date_num_articles(day, month):
  res = get_json(day, month, 1)
  return int(math.ceil(res['response']['meta']['hits'] / 10.0))

def get_date_all_articles(day, month):
  hits = get_date_num_articles(day, month)
  article_list = []

  for i in range(min(hits, 99)):
    print "Getting", (i + 1)
    time.sleep(1)
    res = get_json(day, month, i + 1)

    if (res['status'] == 'OK'):
      for article in res['response']['docs']:
        if (article['type_of_material'].lower() != 'news' or not('print_headline' in article['headline'].keys())):
          continue
        nya = NYT_Article(article['headline']['print_headline'], article['lead_paragraph'], str(date(2016, month, day)),
                          article['section_name'], article['subsection_name'], article['web_url'], get_image_link(article['multimedia']))
        article_list.append(nya)
  return article_list

def get_all_articles_from_file(filename):
  f = open(filename, 'r')
  article_list = []
  res = json.load(f)

  for article in res:
    nya = NYT_Article(article['title'], article['text'], article['date'],
                      article['section'], article['subsection'], article['link'], article['image_link'])
    article_list.append(nya)
  return article_list

def dump_articles_to_file(article_list, filename):
  f = open(filename, "w")
  f.write(json.dumps([art.__dict__ for art in article_list]))
  f.close()

def get_and_dump(day, month):
  al = get_date_all_articles(day, month)
  dump_articles_to_file(al, "nyt_%0d_%0d_2016.txt" % (day, month))

def add_to_database(article_list, previous_list = []):
  g_article_list = list(previous_list)
  for art in article_list:
    if art.section == "Arts" or art.section == "Movies":
      category = "Arts and Entertainment"
    elif art.section == "Business Day" or art.section == "Technology" or art.section == "Automobiles":
      category = "Technology and Science"
    elif art.section == "Sports":
      category = "Sports"
    elif art.section == "U.S." or art.section == "World":
      category = "World"
    else:
      continue

    region = "World"
    if art.section == "World":
      if art.subsection == "Africa":
        region = "Africa"
      elif art.subsection == "Americas":
        region = "South America"
      elif art.subsection == "Asia Pacific":
        region = "East Asia"
      elif art.subsection == "Australia":
        region = "Oceania"
      elif art.subsection == "Europe":
        region = "Europe"
      elif art.subsection == "Middle East":
        region = "West Asia"

    if art.section == "U.S.":
      region = "North America"

    g_art = Article.Article(art.title, art.date, region, art.link, "The New York Times",
                    text = art.text, category = category,
                    image_link = art.image_link)
    g_article_list.append(g_art)

  print len(g_article_list)
  Article.dump_articles(g_article_list, "news_database.txt")

if __name__ == "__main__":
  '''month = 2
  al = []
  for day in range(1, 9):
    al += get_all_articles_from_file("nyt_%0d_%0d_2016.txt" % (day, month))
  exit()'''

  get_and_dump(14, 2)
  exit()

  al = get_all_articles_from_file("nyt_%0d_%0d_2016.txt" % (31, 1))
  for art in al:
    if "factbox" in art.title.lower():
      print str(art)
  exit()

  month = 2
  al = []
  for day in range(1, 8):
    al += get_all_articles_from_file("nyt_%0d_%0d_2016.txt" % (day, month))

  sec_list = []
  for art in al:
    sec_list.append(art.get_section())
  sec_list = list(set(sec_list))
  sec_list.sort()

  print sec_list
