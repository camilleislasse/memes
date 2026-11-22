"""Write images.js from images.json so index.html also works from file://."""
import json

with open('images.json') as f:
    images = json.load(f)

with open('images.js', 'w') as f:
    f.write('window.MEMES = ' + json.dumps(images, indent=2) + ';\n')
