import nltk
from nltk.tokenize import RegexpTokenizer
import Article
from datetime import datetime

reg_tokenizer = RegexpTokenizer(r'\w+')
stopwords = nltk.corpus.stopwords.words("english") + ["v", "f", "j", "u", "tx", "us", "w", "g", "tm", "m", "h"]
stemmer = nltk.stem.wordnet.WordNetLemmatizer()

def cleanup_word(word):
  if (word.istitle()):
    return word.lower()
  return stemmer.lemmatize(word.lower())

def days_between(d1, d2):
  d1 = datetime.strptime(d1, "%m-%d-%Y")
  d2 = datetime.strptime(d2, "%m-%d-%Y")
  return abs((d2 - d1).days)

def sentence_distance(sent1, sent2):
  s1 = set([cleanup_word(w) for w in reg_tokenizer.tokenize(sent1)])
  s2 = set([cleanup_word(w) for w in reg_tokenizer.tokenize(sent2)])

  return nltk.metrics.distance.jaccard_distance(s1, s2)

article_list = Article.load_articles("joined-noimg.json")
article_list = sorted(article_list, key = lambda article: article.date)

article_list_unique = []
mark = [False] * len(article_list)
ct = 0
for i in range(len(article_list)):
  if mark[i]:
    continue

  article_list_unique.append(article_list[i])

  for j in range(i + 1, len(article_list)):
    if days_between(article_list[i].date, article_list[j].date) >= 1:
      break

    if sentence_distance(article_list[i].headline, article_list[j].headline) < 0.3:
      mark[j] = True

Article.dump_articles(article_list_unique, "joined-merged-noimg.json")

