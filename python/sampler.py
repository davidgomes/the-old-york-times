from Article import *
import random
import nltk
from nltk.tokenize import word_tokenize

STOPWORDS = [s.upper() for s in nltk.corpus.stopwords.words('english')]

def span_tokenizer(l, s):
  l2 = []
  for i in l:
    if i == '``':
      l2.append('"')
    elif i == "''":
      l2.append('"')
    else:
      l2.append(i)
  l = l2
  indexes = []
  i = 0
  for word in l:
    while word != s[i:i+len(word)]:
      i += 1
    indexes.append((i, word))

  return indexes

def detect_sentences(text): 
  sentences = nltk.tokenize.sent_tokenize(text)
  return [span_tokenizer(word_tokenize(s), s) for s in sentences]


articles = load_articles('final-database.json')

count = 0
for i in range(len(articles)):
  text = articles[i].headline
  #print(text)
  try:
    data = detect_sentences(text)
    limits = []
    for d in data:
      limits += d
  except Exception as e:
    continue
  #print(limits)
  if len(limits) >= 7:
    br = False
    pos = 0
    for idx, word in limits:
      if word in ['(', '.', ':', ';'] and pos >= 7 or (word == ',' and pos >= 30):
        br = True
        break
      pos += 1

    if br:
      count += 1
      text = (articles[i].headline[idx:]).strip()
      if len(text) > 1:
        if text[0] in [';', '.', ':', ',']:
          text = text[1:]
        text = text.strip()
        text = text[0].upper() + text[1:]

      if text == '.':
        text = ''

      articles[i].text = text
      articles[i].headline = articles[i].headline[:idx] + '.'
      #print(articles[i].text)

      #print(articles[i].headline, ';', articles[i].text)

dump_articles(articles, 'no-relevance.json')
print(count)


