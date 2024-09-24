import json
import os
import sys
from pathlib import Path

import colorama
import regex as re
from bs4 import BeautifulSoup
from colorama import Back, Fore, Style


def main():
    colorama.init(autoreset=True)
    no_png = False

    with open('photo_authors.json') as f:
        authors = json.load(f)

    if len(sys.argv) > 1:
        folder = sys.argv[1]
    else:
        import inquirer
        q = [inquirer.List('folder', message='Choose image root folder', choices=['bcr1', 'bcr2', 'bcr3', 'bcr4', 'bcr5'], carousel=True)]
        folder = inquirer.prompt(q)['folder']

    try:
        local_img_paths = os.listdir(f'{folder}/png')
    except FileNotFoundError:
        no_png = True
        local_img_paths = os.listdir(f'{folder}/jpg')

    with open(f'{folder}-gallery.html', 'r') as f:
        soup = BeautifulSoup(f, 'html.parser')

    existing_figure_tags = soup.find_all('figure')

    figure_urls = [re.search(r"\('(.*?)'\)", tag['style']).group(1) for tag in existing_figure_tags]
    local_image_names = [Path(img).stem for img in local_img_paths]

    new_images = []
    for img in local_image_names:
        if not any(img in src for src in figure_urls):
            new_images.append(img)

    if new_images == []:
        print('Nothing to generate.')

    newfig_template = """
    <figure style="background-image: url('{FOLDER_NAME}/jpg/{IMAGE_NAME}.jpg');"><figcaption>{CAPTION_NAME}
        <a href="{FOLDER_NAME}/png/{IMAGE_NAME}.png">[PNG]</a><br><sup>(from {AUTHOR_NAME})</sup></figcaption></figure>
    """

    newfig_template_no_png = """
    <figure style="background-image: url('{FOLDER_NAME}/jpg/{IMAGE_NAME}.jpg');"><figcaption>{CAPTION_NAME}
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

if __name__ == '__main__':
    main()