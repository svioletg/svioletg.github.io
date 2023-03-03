import colorama
import inquirer
import json
import os
import regex as re
from bs4 import BeautifulSoup
from colorama import Style, Fore, Back

colorama.init(autoreset=True)
no_png = False

with open('photo_authors.json') as f:
    authors = json.load(f)

q = [inquirer.List('folder', message='Choose image root folder', choices=['bcr1', 'bcr2', 'bcr3', 'bcr4'], carousel=True)]
folder = inquirer.prompt(q)['folder']

try:
    images = os.listdir(f'{folder}/png')
except FileNotFoundError:
    no_png = True
    images = os.listdir(f'{folder}/jpg')

with open(f'{folder}-gallery.html', 'r') as f:
    soup = BeautifulSoup(f, 'html.parser')

existing_figure_tags = soup.find_all('figure')

figure_srcs = [re.search(r'[ \w-]+?(?=\.)', i.img['src'])[0] for i in existing_figure_tags]
image_names = [re.search(r'[ \w-]+?(?=\.)', i)[0] for i in images]
# new_images  = [i for i in image_names if i not in figure_srcs]
new_images = image_names

if new_images == []: print('Nothing to generate.')

newfig_template = """
<figure><img src="{FOLDER_NAME}/jpg/{IMAGE_NAME}.jpg"><figcaption>{CAPTION_NAME}
    <a href="{FOLDER_NAME}/png/{IMAGE_NAME}.png">[PNG]</a><br><sup>(from {AUTHOR_NAME})</sup></figcaption></figure>
"""

newfig_template_no_png = """
<figure><img src="{FOLDER_NAME}/jpg/{IMAGE_NAME}.jpg"><figcaption>{CAPTION_NAME}
    <br><sup>(from {AUTHOR_NAME})</sup></figcaption></figure>
"""

new_figure_tags = []

print(Style.BRIGHT+Fore.GREEN+'New images found:')

for i in new_images:
    prefix = i.split('-')[0]
    author = None

    if prefix in authors:
        author = authors[prefix]
    else:
        author = input(f'Author prefix "{prefix}" not found in JSON, enter new author name: ')
        authors[prefix] = author
        with open('photo_authors.json', 'w') as f:
            json.dump(authors, f, ensure_ascii=False, indent=4)
    
    print('Generating: '+Style.BRIGHT+Fore.BLUE+i)
    vals = input('').split(';')
    caption = vals[0].strip()

    # If nothing was provided earlier, ask for it just in case
    if author == '':
        try:
            author = vals[1].strip()
        except IndexError:
            author = input('Author of photo: ').strip()
    
    if not no_png:
        new_figure_tags.append(newfig_template.format(FOLDER_NAME=folder, IMAGE_NAME=i, CAPTION_NAME=caption, AUTHOR_NAME=author))
    else:
        new_figure_tags.append(newfig_template_no_png.format(FOLDER_NAME=folder, IMAGE_NAME=i, CAPTION_NAME=caption, AUTHOR_NAME=author))

try:
    os.remove('newfigs.txt')
except FileNotFoundError:
    pass

with open('newfigs.txt', 'w') as f:
    f.write(''.join(new_figure_tags))
    print(f'Wrote {Style.BRIGHT+Fore.BLUE}{len(new_figure_tags)}{Style.RESET_ALL} new tags into newfigs.txt.')

input('Done. Press ENTER to close.')