"""Convert memes to lightweight WebP in place (max 1200px wide).

Every non-WebP image in memes/ is replaced by memes/<same name>.webp.
Animated GIFs are left untouched. Already converted files are skipped,
so the script is safe to run on every CI run.

Usage: python3 .github/optimize_images.py [files...]   (default: memes/*)
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps

MAX_WIDTH = 1200
QUALITY = 85

paths = [Path(p) for p in sys.argv[1:]] or sorted(Path('memes').iterdir())

for src in paths:
    if src.suffix.lower() not in ('.png', '.jpg', '.jpeg', '.gif'):
        continue
    with Image.open(src) as img:
        if getattr(img, 'is_animated', False):
            continue
        img = ImageOps.exif_transpose(img)
        img = img.convert('RGBA' if img.mode in ('RGBA', 'LA', 'P') else 'RGB')
        img.thumbnail((MAX_WIDTH, MAX_WIDTH * 4))
        dest = src.with_suffix('.webp')
        img.save(dest, 'WEBP', quality=QUALITY, method=6)
    src.unlink()
    print(f'{src} -> {dest}')
