from Article import *

arts = load_articles('onthisday-final.json')
arts2 = load_articles('Wiki/wiki-normalized-final.json')

f = arts + arts2
dump_articles(f, 'joined-noimg.json')

