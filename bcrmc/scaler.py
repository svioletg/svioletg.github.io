import os
import sys
from pathlib import Path

if len(sys.argv) == 1:
    input('No image path given.')
elif not Path(sys.argv[1]).is_file():
    input(f'Path specified: "{sys.argv[1]}" doesn\'t exist or is not a file.')

while True:
    try:
        scale = int(input('Scale to: '))
        break
    except ValueError:
        print('Not an integer.')

image = Path(sys.argv[1])
os.system(f'ffmpeg -i {image} -s {scale}x{scale} -sws_flags neighbor {image.parent.joinpath(image.stem)}_{scale}x{scale}{image.suffix}')