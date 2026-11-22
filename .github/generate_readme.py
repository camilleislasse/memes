import json

with open('images.json') as f:
    images = json.load(f)

with open('images.js', 'w') as f:
    f.write('window.MEMES = ' + json.dumps(images, indent=2) + ';\n')

images = list(reversed(images))
cols = 4
rows = [images[i:i+cols] for i in range(0, len(images), cols)]

lines = ['<table>']
for row in rows:
    lines.append('  <tr>')
    for img in row:
        lines.append(f'    <td><img src="{img}" width="200"/></td>')
    for _ in range(cols - len(row)):
        lines.append('    <td></td>')
    lines.append('  </tr>')
lines.append('</table>')

with open('README.md', 'w') as f:
    f.write('\n'.join(lines) + '\n')