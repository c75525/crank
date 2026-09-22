# Collections.0rg design system

## Intent

A minimal single-column archive for Instagram-derived carousel posts. Images are the primary interface; navigation and type remain deliberately restrained.

## Type

- **Family:** Major Mono Display, followed by Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, then monospace fallback. The emoji fallbacks preserve Unicode symbols unsupported by the primary font.
- **Base size:** 14px.
- **Image description / post metadata:** 12px, `1.2` line height.
- All display type inherits the site font.

## Color

| Token | Value | Use |
| --- | --- | --- |
| Page / sticky-header background | `#e2d9e2` | Entire site background and header fill |
| Primary text / rules | `#111` | Text, link color, border |
| Muted metadata | `#555` | Date text |

## Column and spacing

- Main content column: `min(calc(100% - 20px), 1100px)`, centered.
- Sticky header uses the same column width.
- Header inset: 5px on all sides; left and right links sit 5px from the column edges.
- Default image-row gap: 15px.
- Active/hovered image-row gap: 30px.
- Minimum vertical spacing between posts: 60px.
- Posts container top padding: 60px; bottom padding: 180px, reserving room for captions revealed below the final row.

## Image grid

- One row represents one Instagram post/carousel.
- At rest, all items in a row have equal width using one fractional grid column per item.
- Images use local responsive WebP derivatives selected through `srcset` / `sizes`, fill their allocated width, and use a square display frame with `object-fit: cover`.
- Original captures are retained locally in `media/incoming/archive/`; only optimized display derivatives publish under `media/processed/`.
- Image links point to their source Instagram post.

## Hover and focus behavior

- The active image expands to exactly 150% of its measured rest width.
- Sibling images shrink to preserve the fixed column width; the active row gap changes to 30px.
- The active item reveals only its own caption below the image.
- The expanded state persists while the pointer crosses an item edge or inter-item gap; it resets only after the pointer leaves the full row.
- Caption alignment follows the item’s position in the row: left third = left aligned; middle = centered; right third = right aligned.
- Keyboard focus has the same behavior as hover. A 1px `#111` focus outline is used.
- Transitions are 160ms; they are removed for `prefers-reduced-motion: reduce`.

## Content rule

Post captions remain indexed in `data/posts.json` but are not displayed by default. Captions visible on the site are per-image descriptions only.

## Header links

- `collections.0rg` links to the Instagram account.
- `playlist` links to the Spotify playlist.
- Both remain anchored at the top during scroll.
