# convert all pngs to jpg and sort them

import os
from pathlib import Path

root = input('Root folder: ')
pngs = os.listdir(Path(root, 'png'))
jpegs = os.listdir(Path(root, 'jpg'))

for item in pngs:
    print(item, f'"{root}/png/{item}"')
    if item.replace('.png', '.jpg') not in jpegs:
        os.system(f'ffmpeg -i "{root}/png/{Path(item).stem+".png"}" "{root}/jpg/{Path(item).stem+".jpg"}" -q:v 0 -hide_banner')
