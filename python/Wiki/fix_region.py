import json

articles = load_articles('final-database.json')
region = json.loads('region.json')
for art in articles:
	art.region = region[art.country.lower]


dump_articles(articles, 'final-database.json')

