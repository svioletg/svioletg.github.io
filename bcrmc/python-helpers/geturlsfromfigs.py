import re
import json

from pathlib import Path

pat = re.compile(r"""<figure.*url\('.*?/(.*)'\).*?<figcaption>(.*?[ '\w]*)\W""")

out = {}

for i in range(5):
    out[f'bcr{i+1}'] = {}
    with open(Path(f'bcr{i+1}/gallery.html'), encoding='utf-8') as f:
        html = f.read()
        matches = re.findall(pat, html)
        if matches:
            for m in matches:
                out[f'bcr{i+1}'][m[0]] = m[1]

print(out)
with open('_out.json', 'w', encoding='utf-8') as f:
    f.write(json.dumps(out, indent=4))
