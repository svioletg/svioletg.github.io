import inquirer
import os
from tqdm import tqdm

q = [inquirer.List('folder', message='Choose image root folder', choices=['bcr1', 'bcr2', 'bcr3', 'bcr4', 'bcr5', 'bcr6'], carousel=True)]
folder = inquirer.prompt(q)['folder']

pngs = os.listdir(f'{folder}/png')
jpgs = os.listdir(f'{folder}/jpg')

pngs = [i.split('.')[0] for i in pngs]
jpgs = [i.split('.')[0] for i in jpgs]

diff = list(set(pngs) - set(jpgs))

for i in tqdm(diff):
	print(i)
	os.system(f'ffmpeg -i {folder}/png/{i}.png {folder}/jpg/{i}.jpg -q:v 0 -loglevel error')

input('Done. Press ENTER to continue.')