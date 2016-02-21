import json

def load(n):
	l = []
	for idx in range(1, n+1):
		f = open('data/parsed' + str(idx) + '.json', 'r')
		l.extend(json.loads(f.read()))

	return l

n = 8
dataset = load(n)
print(len(dataset))
