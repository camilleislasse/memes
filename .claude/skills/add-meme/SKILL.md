---
name: add-meme
description: Add one or more memes to the repo gallery (images pasted in the conversation or local files). Use when the user says "à rajouter", "add this meme", etc.
---

# Add memes

The gallery is generated automatically: a push to `main` touching `memes/` runs `.github/workflows/auto-merge.yml`, which renames badly named files, converts images to WebP (`.github/optimize_images.py`) and regenerates `images.json`, `images.js` and `README.md` ("chore: update gallery" commit). Never edit `README.md`, `images.json` or `images.js` by hand.

## Steps

1. `git pull -q origin main` to get the latest gallery commit.
2. Check that each image is actually a meme, not a random screenshot.
3. Copy it into `memes/` as `meme-<timestamp in ms>.<lowercase ext>`, adding 1 to the timestamp for each following image:
   `ts=$(python3 -c 'import time;print(int(time.time()*1000))')`
4. Convert the new files: `python3 .github/optimize_images.py memes/meme-<ts>.<ext> ...` (needs Pillow).
5. Check for duplicates:
   - exact duplicate: compare `md5 -q` of the new `.webp` with the existing `memes/*.webp` (the conversion is deterministic, so the same source gives the same file); if it matches, delete the new file;
   - if it might be a visual duplicate (same meme cropped or recompressed), look at the existing memes that could match and ask.
6. `git add memes && git commit -m "Add N memes"` ("Add 1 meme" for a single one), then `git push origin main`.
