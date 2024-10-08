import sys
from pathlib import Path

from PIL import Image, ImageEnhance

from explorer_script import explorer_script


@explorer_script
def main():
    for arg in sys.argv[1:]:
        source_path = Path(arg)
        if not source_path.is_file():
            print(f'Path specified: "{source_path}" doesn\'t exist or is not a file.')

        img = Image.open(source_path).convert('RGB')
        dest_path = source_path.parent.joinpath(source_path.stem + '_dark' + source_path.suffix)
        brightness = ImageEnhance.Brightness(img)
        img = brightness.enhance(0.5)
        img.save(dest_path)
        print('Saved to', dest_path)

if __name__ == '__main__':
    main()
