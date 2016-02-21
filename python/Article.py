import json
from datetime import date

regions = ["North America", "South America", "Europe", "East Asia", "West Asia", "Africa", "Oceania", "World"]
categories = ["Arts and Entertainment", "Sports", "Technology and Science", "World"]

class Article:
  def __init__(self, headline, date, region, link, source, text = None, country = None, category = None, image_link = None, score = None):
    self.headline = headline
    self.text = text
    self.date = date
    self.region = region # ["North America", "South America", "Europe", "East Asia", "West Asia", "Africa", "Oceania"]
    self.country = country
    self.category = category # ["Arts and Entertainment", "Sports", "Technology and Science", "World"]
    self.link = link
    self.image_link = image_link
    self.score = score
    self.source = source
    self.n_results = 0

  def __str__(self):
    if not(self.text):
      return "On %s: %s" % (self.date, self.headline)
    return "%s, %s: %s" % (self.date, self.headline, self.text)

def load_articles(filename):
  f = open(filename, 'r')
  article_list = []
  res = json.load(f)

  for article in res:
    art = Article(article['headline'], article['date'], article['region'], article['link'], article['source'],
                  text = article['text'], country = article['country'], category = article['category'],
                  image_link = article['image_link'], score = article['score'])
    article_list.append(art)
  return article_list

def dump_articles(article_list, filename):
  f = open(filename, "w")
  f.write(json.dumps([art.__dict__ for art in article_list]))
  f.close()

if __name__ == "__main__":
  '''
  a = [Article("Michel wins big at 2016 oscars", str(date(2016, 02, 28)), "Europe", "http://michel.pt", "NYTimes", country = "Portugal", category = "Arts and Entertainment"),
       Article("LA to receive Michel in concert of the year", str(date(2016, 02, 29)), "North America", "Reuters", "http://michel.pt", text = "A young singer goes big in LA")]
  dump_articles(a, "test_articles.txt")
  b = load_articles("test_articles.txt")
  for i in b:
    print(str(i))
  '''

