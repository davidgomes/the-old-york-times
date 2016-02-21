# Shitty python 2 code

import os, sys, inspect
currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.insert(0,parentdir) 

from location import region
from Article import *

def capitalize(r):
	return ' '.join([s[0].upper() + s[1:] for s in r.split(' ')])

def convertRegion(r):
	if r == 'undefined':
		r = 'World'
	else:
		r = region[r.lower()]
		r = capitalize(r)
		if r == 'Central America':
			r = 'South America'
		elif r == 'Western Asia':
			r = 'West Asia'
		elif r == 'Central Asia' or r == 'South Asia':
			r = 'East Asia'
		

	if r not in regions:
		print('TODO: Convert <' + r + '>')
		sys.exit(0)
	return r

def load_wiki_articles(filename):
  f = open(filename, 'r')
  article_list = []
  res = json.load(f)

  for article in res:
    art = Article(article['title'], article['date'], convertRegion(article['location']), '', article['src'],
                country = article['location'], image_link = '')
    article_list.append(art)
  return article_list

if __name__ == "__main__":
  articles_list = load_wiki_articles("wiki.json")
  dump_articles(articles_list, 'wiki-normalized-no-categories.json')

