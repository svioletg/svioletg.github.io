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

    png: list[str] = [f.stem for f in map(Path, root_png.iterdir()) if f.suffix == '.png']
    jpg: list[str] = [f.stem for f in map(Path, root_jpg.iterdir()) if f.suffix == '.jpg']

    files = set(jpg + png)

    with open('photo_authors.json', 'r', encoding='utf-8') as f:
        authors: dict[str, str] = json.load(f)
    with open('photo_titles.json', 'r', encoding='utf-8') as f:
        titles: dict[str, dict[str, dict[str, str]]] = json.load(f)

    new_authors: list[str] = []

    for img in tqdm(files):
        if (author := img.split('-')[0]) not in authors:
            new_authors.append(author)
            authors[author] = author
        # TODO

    if new_authors:
        print(f'{len(new_authors)} new authors were added to JSON:')
        print('\n  - '.join(new_authors))

    with open('photo_authors.json', 'w', encoding='utf-8') as f:
        json.dump(authors, f, indent=4)

if __name__ == '__main__':
    main()
