import re
import json
import os

from pathlib import Path

pat = re.compile(r"""<figure.*url\('.*?/(.*)'\).*?<figcaption>(.*?[^<]+)""")

out = {}

for i in range(5):
    out[f'bcr{i + 1}'] = {}
    with open(Path(f'gallery{i + 1}.html'), encoding='utf-8') as f:
        html = f.read()
        matches = re.findall(pat, html)
        if matches:
            for m in matches:
                filename = Path(m[0]).stem
                out[f'bcr{i + 1}'][Path(filename).stem] = {
                    'title': m[1].strip(),
                    'has_png': Path(f'../bcr{i + 1}/png/{filename}.png').exists()
                }

with open('_out.json', 'w', encoding='utf-8') as f:
    f.write(json.dumps(out, indent=4))
