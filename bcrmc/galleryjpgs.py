# convert all pngs to jpg and sort them

import os
import sys
from pathlib import Path

from keepopen import keep_open

@keep_open
def main():
    root = Path(sys.argv[1])
    pngs = os.listdir(Path(root, 'png'))
    jpegs = os.listdir(Path(root, 'jpg'))

    for item in pngs:
        print(item, f'"{root}/png/{item}"')
        if item.replace('.png', '.jpg') not in jpegs:
            os.system(f'ffmpeg -i "{Path(item)}" "{Path(item).with_suffix('.jpg')}" -q:v 0 -hide_banner')

if __name__ == '__main__':
    main()
