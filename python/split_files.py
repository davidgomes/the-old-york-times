from Article import *

arts = load_articles('final-database.json')
arts = [a for a in arts if a.source != 'https://en.wikipedia.org']

dump_articles(arts, 'onthisday-nolocation.json')

