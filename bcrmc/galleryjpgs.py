"""Scans a directory for PNG files and creates JPG duplicates if they don't exist,
sorting them into the JPG subdirectory of the given directory."""
import os
import sys
from pathlib import Path

from tqdm import tqdm

from keepopen import keep_open


@keep_open
def main():
    root = Path(sys.argv[1])
    pngs = os.listdir(Path(root, 'png'))
    jpegs = os.listdir(Path(root, 'jpg'))

    print(f'Found {len(pngs)} png files.')
    print(f'Found {len(jpegs)} jpg files.')
    print()

    processed = 0
    for item in tqdm(pngs):
        if item.replace('.png', '.jpg') not in jpegs:
            tqdm.write(f'"{item}" -> "{Path(item).with_suffix('.jpg')}"')
            os.system(f'ffmpeg -i "{Path(item)}" "{Path(item).with_suffix('.jpg')}" -q:v 0 -hide_banner')
            processed += 1

    if processed == 0:
        print('No files to convert.')

if __name__ == '__main__':
    main()
