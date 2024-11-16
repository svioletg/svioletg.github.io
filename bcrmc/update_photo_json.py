import json
import os
import sys
from pathlib import Path

from keepopen import keep_open
from tqdm import tqdm


@keep_open
def main():
    root = Path(sys.argv[1])
    if not root.is_dir():
        print(f'Given argument "{sys.argv[1]}" is not a directory.')

    root_png = root / 'png'
    root_jpg = root / 'jpg'

    png: list[str] = [f.stem for f in map(Path, root_png.glob('*.png'))]
    jpg: list[str] = [f.stem for f in map(Path, root_jpg.glob('*.jpg'))]

    files = set(jpg + png)

    with open('photo_authors.json', 'r', encoding='utf-8') as f:
        authors: dict[str, str] = json.load(f)
    with open('photo_titles.json', 'r', encoding='utf-8') as f:
        photo_data: dict[str, dict[str, dict[str, str | bool]]] = json.load(f)

    new_authors: list[str] = []

    for img in tqdm(files):
        if img not in jpg:
            tqdm.write(f'[!] Image not found in JPG folder: "{img}"')
            tqdm.write('Gallery images must exist in JPG format, you may need to run galleryjpgs.py first.')
            tqdm.write('Quitting...')
            return
        if (author := img.split('-')[0]) not in authors:
            tqdm.write(f'Author "{author}" not recognized, adding as new.')
            new_authors.append(author)
            authors[author] = author
        if img not in photo_data[root.stem]:
            tqdm.write(f'New image discovered: "{img}"')
            photo_data[root.stem][img] = {
                'title': img,
                'has_png': img in png
            }
        else:
            tqdm.write(f'Image already in JSON: "{img}"')

    if new_authors:
        print(f'{len(new_authors)} new authors were added to JSON:')
        print('\n  - '.join(new_authors))

    if input('Save new authors to JSON? ').lower() in ('y', 'yes'):
        with open('photo_authors.json', 'w', encoding='utf-8') as f:
            json.dump(authors, f, indent=4)
        print('Done.')
    else:
        print('No changes made to disk.')

    if input('Save new images to JSON? ').lower() in ('y', 'yes'):
        with open('photo_titles.json', 'w', encoding='utf-8') as f:
            json.dump(photo_data, f, indent=4)
    else:
        print('No changes made to disk.')

if __name__ == '__main__':
    main()
