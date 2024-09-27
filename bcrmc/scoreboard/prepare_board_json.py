"""An interactive script for preparing a Minecraft scoreboard .dat file into JSON
to use with the website's scoreboard viewer."""
import json
import sys
from pathlib import Path

from tqdm import tqdm

sys.path.append('..')

import scoreboard_utils as sc
from explorer_script import explorer_script  # pylint: disable=import-error; its fine


@explorer_script
def main(dat_file: str | Path):
    dat_file = Path(dat_file)
    if not dat_file.is_file():
        print(f'File "{dat_file}" doesn\'t exist or is not a file.')
        return

    print(f'Using file "{dat_file}"...')
    whitelist: Path = Path(input('Provide the path to whitelist.json: ').strip('"'))
    board = sc.Scoreboard(dat_file, player_whitelist=whitelist, show_progress=True)
    dotted_names = [p for p in board.player_scores if p.startswith('.')]
    if dotted_names:
        print(f'Found {len(dotted_names)} players with a dot preceding their name.')
        print()
        for n, i in enumerate(dotted_names):
            print(f'{n+1}. {i}')
        print()
        while True:
            response = input('Perform an action? (merge/remove/continue, index) ').split(' ')
            action = response[0].lower()
            if action not in ['merge', 'remove', 'continue']:
                print('[!] Invalid response; cancelled.')
                continue
            if action == 'continue':
                break
            try:
                which = dotted_names[int(response[1]) - 1]
            except ValueError:
                print('[!] Not an integer; cancelled.')
                continue
            if action == 'remove':
                del board.player_scores[which]
                print(f'Removed "{which}" from the scoreboard.')
                continue
            if action == 'merge':
                print('WARN: This will remove the dotted name entry from the scoreboard after merging.')
                target = input('With who? ').strip()
                if target not in board.player_scores:
                    print(f'"{target}" is not in the scoreboard.')
                    continue
                for obj, score in tqdm(board.player_scores[which].items()):
                    board.player_scores[target][obj] += score
                del board.player_scores[which]
                print(f'Merged "{which}" scores into "{target}".')
                continue
    with open('scoreboard_out.json', 'w', encoding='utf-8') as f:
        json.dump(board.to_dict(), f, indent=4)
    print('Scoreboard written to "scoreboard_out.json".')

if __name__ == '__main__':
    main(*sys.argv[1:])
