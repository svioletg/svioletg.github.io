import colorama
import inquirer
import os
import regex as re
from bs4 import BeautifulSoup
from colorama import Style, Fore, Back

colorama.init(autoreset=True)

q = [inquirer.List('folder', message='Choose image root folder', choices=['bcr1', 'bcr2', 'bcr3', 'bcr4'], carousel=True)]
folder = inquirer.prompt(q)['folder']

pngs = os.listdir(f'{folder}/png')
jpgs = os.listdir(f'{folder}/jpg')

with open(f'{folder}-gallery.html', 'r') as f:
    soup = BeautifulSoup(f, 'html.parser')

figs = soup.find_all('figure')

srcs = [re.search(r'[ \w-]+?(?=\.)', i.img['src'])[0] for i in figs]
imgs = [re.search(r'[ \w-]+?(?=\.)', i)[0] for i in pngs]

new = [i for i in imgs if i not in srcs]

if new == []: print('Nothing to generate.')

newfig_template = """
<figure><img src="{FOLDER_NAME}/jpg/{IMAGE_NAME}.jpg"><figcaption>{CAPTION_NAME}
    <a href="{FOLDER_NAME}/png/{IMAGE_NAME}.png">[PNG]</a><br><sup>(from {AUTHOR_NAME})</sup></figcaption></figure>
"""

newfigs = []

print(Style.BRIGHT+Fore.GREEN+'New images found:')

for i in new:
    print('Generating: '+Style.BRIGHT+Fore.BLUE+i)
    vals = input('').split(';')
    caption = vals[0].strip()
    try:
        author = vals[1].strip()
    except IndexError:
        author = input('Author of photo: ').strip()
    newfigs.append(newfig_template.replace('{IMAGE_NAME}', i).replace('{CAPTION_NAME}', caption).replace('{AUTHOR_NAME}', author).replace('{FOLDER_NAME}', folder))

try:
    os.remove('newfigs.txt')
except FileNotFoundError:
    pass

with open('newfigs.txt', 'w') as f:
    f.write(''.join(newfigs))

input('Done. Press ENTER to close.')