import sys
from pathlib import Path

from PIL import Image

from keepopen import keep_open


@keep_open
def main():
    if len(sys.argv) == 1:
        input('No image path given.')
    for arg in sys.argv[1:]:
        source_path = Path(arg)
        if not source_path.is_file():
            input(f'Path specified: "{source_path}" doesn\'t exist or is not a file.')

        while True:
            try:
                scale = int(input('Scale to (px): '))
                break
            except ValueError:
                print('Not an integer.')

        dest_path = source_path.parent.joinpath(source_path.stem + f'_{scale}x{scale}' + source_path.suffix)
        img = Image.open(source_path)
        img = img.resize((scale, scale), resample=Image.Resampling.NEAREST)
        img.save(dest_path)
        print('Saved to', dest_path)

if __name__ == '__main__':
    main()