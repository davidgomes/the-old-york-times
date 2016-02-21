import json
import urllib3, certifi

http = urllib3.PoolManager(10, cert_reqs='CERT_REQUIRED', ca_certs=certifi.where())

for page in range(1, 800+1):
	s = "Pagina=" + str(page) + "&Fonte=TAGS&DadosId="

	print('Page', page)

	req = http.request('GET', "http://www.publico.pt/json/noticias/grelha/299?" + s)
	#req.add_header('Content-Type', 'application/json')

	s = json.loads(req.data.decode('utf-8'))['html']
	f = open('data/dumps' + str(page) + '.txt', 'w')
	f.write(s)

