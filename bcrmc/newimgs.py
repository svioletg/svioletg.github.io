import os
import regex as re
from bs4 import BeautifulSoup

pngs = os.listdir('bcr4/png')
jpgs = os.listdir('bcr4/jpg')

with open('bcr4-gallery.html', 'r') as f:
    soup = BeautifulSoup(f, 'html.parser')

figs = soup.find_all('figure')

srcs = [re.search(r'[ \w-]+?(?=\.)', i.img['src'])[0] for i in figs]
imgs = [re.search(r'[ \w-]+?(?=\.)', i)[0] for i in pngs]

new = [i for i in imgs if i not in srcs]

if new == []: print('Nothing to generate.')

newfig_template = """
<figure><img src="bcr4/jpg/{IMAGE_NAME}.jpg"><figcaption>{CAPTION_NAME}
    <a href="bcr4/png/{IMAGE_NAME}.png">[PNG]</a><br><sup>(from {AUTHOR_NAME})</sup></figcaption></figure>
"""

newfigs = []

for i in new:
    print('Generating: '+i)
    vals = input('').split(';')
    caption = vals[0].strip()
    author = vals[1].strip()
    newfigs.append(newfig_template.replace('{IMAGE_NAME}', i).replace('{CAPTION_NAME}', caption).replace('{AUTHOR_NAME}', author))

try:
    os.remove('newfigs.txt')
except FileNotFoundError:
    pass

with open('newfigs.txt', 'w') as f:
    f.write(''.join(newfigs))

input('Done. Press ENTER to close.')