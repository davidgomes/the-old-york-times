#import onthisday.onthisday_crawler as otdc
import nltk
import nltk.corpus
import random
from nltk.metrics import ConfusionMatrix
from nltk.tokenize import RegexpTokenizer
from sklearn import cross_validation
import pickle
import Names
from Article import *

reg_tokenizer = RegexpTokenizer(r'\w+')
#topics = ["Arts and Entertainment", "Economy and Business", "Cinema", "Sports", "Technology and Science", "World"]
#convert_topics = [0, 2, 0, 1, 2, 3]

topics = ["Arts and Entertainment", "Sports", "Technology and Science", "World"]

stopwords = nltk.corpus.stopwords.words("english") + ["v", "f", "j", "u", "tx", "us", "w", "g", "tm", "m", "h"]
#stemmer = nltk.stem.lancaster.LancasterStemmer()
stemmer = nltk.stem.wordnet.WordNetLemmatizer()

def cleanup_word(word):
  if (word.istitle()):
    return word.lower()
  #return stemmer.stem(word.lower())
  return stemmer.lemmatize(word.lower())

def get_word_features(word_list):
  cat_words = [[], [], [], []]
  all_words = []

  for (w, tp) in word_list:
    cat_words[tp].append(cleanup_word(w))

  for i in range(len(topics)):
    all_words += list(nltk.FreqDist(cat_words[i]))[:170]
    tmp = (list(nltk.FreqDist(cat_words[i]))[:170])
    tmp.sort()
    #print tmp
    #print ""

  return list(set(all_words))

def document_features(document, word_features):
  document_words = set([cleanup_word(w) for w in reg_tokenizer.tokenize(document)])
  features = {}
  for word in word_features:
    if (word in document_words):
      features['contains({})'.format(word)] = True

  return features

def get_word_list_from_documents(documents):
  word_list = []

  for doc in documents:
    word_list += [(w, doc[1]) for w in reg_tokenizer.tokenize(doc[0]) if not(w.lower() in stopwords) and not(w.lower() in Names.male_names) and not(w.lower() in Names.female_names) and w.isalpha()]

  return word_list

def get_documents_from_years(year_range):
  documents = []

  for i in range(len(topics)):
    print "%d: %s," % (1+i, topics[i]),
  print ""

  for year in year_range:
    articles = otdc.get_all_articles_from_file("onthisday/data/" + otdc.gen_filename(year))

    random.shuffle(articles)
    articles = articles[:20]

    for art in articles:
      print art.title
      try:
        documents.append((art.title, int(raw_input()) - 1))
      except Exception: 
        pass

  return documents

def dump_documents(filename, documents):
  with open("%s_dc.txt" % filename, 'wb') as f:
    pickle.dump(documents, f)

def load_documents(filename):
  with open("%s_dc.txt" % filename, 'rb') as f:
    documents = pickle.load(f)
  return documents

def article_classify(classifier, article, output = False):
  if output:
    print document_features(article, word_features)
  
  if len(document_features(article, word_features)) != 0:
    return topics[classifier.classify(document_features(article, word_features))]
  return topics[3]

if __name__ == "__main__":
  documents = load_documents("test_class_dic")
  #documents += get_documents_from_years(range(1730, 1740))
  word_list = get_word_list_from_documents(documents)
  #dump_documents("test_class_dic", documents)

  ct = [0, 0, 0, 0]
  for (_, tp_class) in documents:
    ct[tp_class] += 1
  #print ct

  #exit()

  ct = [[], [], [], []]
  for doc in documents:
    ct[doc[1]].append(doc)

  random.shuffle(ct[0])
  ct[0] = ct[0] + ct[0][:60]
  random.shuffle(ct[1])
  ct[1] = ct[1][:250]
  random.shuffle(ct[2])
  ct[2] = ct[2] + ct[2][:50]
  random.shuffle(ct[3])
  ct[3] = ct[3][:450]

  documents = ct[0] + ct[1] + ct[2] + ct[3]

  ct = [0, 0, 0, 0]
  for (_, tp_class) in documents:
    ct[tp_class] += 1
  #print ct

  word_features = get_word_features(word_list)
  random.shuffle(documents)
  #featuresets = [(document_features(d, word_features), topics[c]) for (d, c) in documents]

  training_set = nltk.classify.apply_features((lambda x: document_features(x, word_features)), documents)
  cv = cross_validation.KFold(len(training_set), n_folds=10, shuffle=False, random_state=None)
  avg = 0

  '''  
  for traincv, testcv in cv:
    classifier = nltk.NaiveBayesClassifier.train(training_set[traincv[0]:traincv[len(traincv)-1]])
    print 'accuracy:', nltk.classify.util.accuracy(classifier, training_set[testcv[0]:testcv[len(testcv)-1]])
    avg += nltk.classify.util.accuracy(classifier, training_set[testcv[0]:testcv[len(testcv)-1]])
    print ConfusionMatrix([doc[1] for doc in training_set[testcv[0]:testcv[len(testcv)-1]]], [classifier.classify(doc[0]) for doc in training_set[testcv[0]:testcv[len(testcv)-1]]])

  print avg / 10
  print len(training_set)

  exit()'''

  classifier = nltk.NaiveBayesClassifier.train(training_set)
  '''
  art = raw_input()
  print article_classify(classifier, art, output=True)
  '''
  #classifier.show_most_informative_features(15) 
  count = {}
  articles = load_articles('Wiki/wiki-normalized-no-categories.json')
  for art in articles:
    art.category = article_classify(classifier, art.headline, output=False)
    #print(art.category, art.headline)
    if art.category not in count:
      count[art.category] = 0
    count[art.category] += 1

  dump_articles(articles, 'Wiki/wiki-normalized-final.json')
  print(count)

