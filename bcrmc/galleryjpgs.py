"""Scans a directory for PNG files and creates JPG duplicates if they don't exist,
sorting them into the JPG subdirectory of the given directory."""
import os
import sys
from pathlib import Path

import colorama
from colorama import Fore
from explorer_script import explorer_script
from tqdm import tqdm

colorama.init(autoreset=True)

@explorer_script
def main():
    root = Path(sys.argv[1])
    png = [*(root / 'png').glob('*.png')]
    jpg = [*(root / 'jpg').glob('*.jpg')]

    print(f'Found {len(png)} png files.')
    print(f'Found {len(jpg)} jpg files.')
    print()

    processed = 0
    for png_path in tqdm(png):
        tqdm.write(str(png_path))
        jpg_path = root / 'jpg' / f'{png_path.stem}.jpg'
        if jpg_path not in jpg:
            tqdm.write(f'{Fore.GREEN}"{png_path}" -> "{jpg_path}"')
            os.system(f'ffmpeg -i "{png_path}" "{jpg_path}" -q:v 0 -hide_banner -loglevel error')
            processed += 1
        else:
            tqdm.write(f'{Fore.YELLOW}File already exists: "{jpg_path}"')

    if processed == 0:
        print('No files to convert.')

if __name__ == '__main__':
    main()
