
from Article import *
from Wiki.location import *

# my metrics

def directRef(raw, verbose=False):
  words = [s for s in tokenizer(raw) if s not in STOPWORDS]
  return matchDirectReference(words, verbose)

def namesRef(raw, verbose=False):
  return searchNames(raw, verbose)

getEventLocation = genericEventLocation([directRef, searchNames], 
                                        [1, 0.5])


def signal_handler(signal, frame):
  print('Exiting')
  dumpCache()
  sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

count = {}

articles = load_articles('onthisday-nolocation.json')
print('ok')
i = 0
for art in articles:
  print(i)
  i+=1
  if art.country == "USA":
    art.country = 'united states'
  elif art.country != '' and art.country != None:
    continue
  else:
    art.country = getEventLocation(art.headline, False)
    if art.country == 'undefined':
      art.country = 'united states' # = None
    #print(art.country + ": " + art.headline, art.category)
    
    if art.country not in count:
      count[art.country] = 0
    count[art.country] += 1

dump_articles(articles, 'onthisday-final.json')

print(count)
