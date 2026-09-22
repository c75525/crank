# Daily capture handoff

The future capture process writes one canonical post index at `data/posts.json` and processed media beneath `media/processed/`.

## Required post fields

- `id`: stable post identifier (prefer Instagram shortcode or captured post ID)
- `publishedAt`: ISO date
- `sourceUrl`: canonical post URL
- `caption`: post-level caption
- `items`: ordered image/video items

## Required item fields

- `id`: stable item identifier, e.g. `{post-id}-{position}`
- `position`: one-based carousel position
- `processedPath`: repository-relative optimized asset path

## Capture when available

- `description`: per-carousel-item description
- `altText`: Instagram-provided or accessible alt text
- per-item `sourceUrl`
- source filename, content hash, MIME type, dimensions, duration, capture timestamp, and processing profile

Keep operational metadata in a separate machine-readable log/database if it is not intended for browser display. The gallery only needs the public index fields above.

## Source-media convention

1. Write raw downloads to `media/incoming/{post-id}/`.
2. Preserve the original filename in operational metadata.
3. Transcode/copy publishable media to `media/processed/{post-id}/{position}.{extension}`.
4. Atomically write the updated `data/posts.json` after every post’s files are present.
5. Retain enough metadata to detect duplicate post IDs and duplicate media hashes.

No post should be published without a stable ID, canonical source URL, date, ordered items, and processed paths.
