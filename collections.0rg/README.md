# Collections.org

A static prototype for an automatically populated Collections.org Instagram portfolio.

## Run locally

```powershell
cd 'C:\Users\sampl\Desktop\Website Testing\Collections.org'
python -m http.server 8000
```

Open `http://localhost:8000`.

## Structure

- `index.html`, `styles.css`, `app.js` — static gallery site
- `data/posts.json` — generated post index consumed by the site
- `data/posts.schema.json` — index contract for the future capture process
- `media/incoming/` — unprocessed source downloads; do not publish
- `media/processed/` — optimized publishable assets; update `processedPath` in the index
- `assets/placeholders/` — local demo-only SVG media
- `docs/automation-handoff.md` — required input/output contract for the daily capture tool

## Layout behavior

Each post is one row. At rest, each image item is equal width with a 15px gap. Rows begin at least 60px apart. Hovering or keyboard-focusing an image sets the active image to exactly 150% of its measured resting width and changes all gaps in that row to 30px. Neighboring items resize to keep the row within the column.

The future automation should replace demo records in `data/posts.json`, write processed files to `media/processed/`, and never edit the site code to add a post.
