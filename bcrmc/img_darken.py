import sys
from pathlib import Path
from PIL import Image, ImageEnhance

if len(sys.argv) == 1:
    input('No image path given.')
elif not Path(sys.argv[1]).is_file():
    input(f'Path specified: "{sys.argv[1]}" doesn\'t exist or is not a file.')

imgpath = Path(sys.argv[1])
img = Image.open(imgpath)
enhancer = ImageEnhance.Brightness(img)
img = enhancer.enhance(0.5)
img.save(f'{imgpath.parent.joinpath(imgpath.stem)}_dark{imgpath.suffix}')
