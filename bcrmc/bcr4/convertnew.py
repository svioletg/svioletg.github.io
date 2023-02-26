import os, shutil, glob

pngs = os.listdir('png')
jpgs = os.listdir('jpg')

pngs = [i.split('.')[0] for i in pngs]
jpgs = [i.split('.')[0] for i in jpgs]

diff = list(set(pngs) - set(jpgs))

for i in diff:
	os.system(f'ffmpeg -i png/{i}.png jpg/{i}.jpg -q:v 0 -loglevel error')
	print(i)
