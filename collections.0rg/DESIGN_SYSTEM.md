# Collections.0rg design system

## Intent

A minimal single-column archive for Instagram-derived carousel posts. Images are the primary interface; navigation and type remain deliberately restrained.

## Type

- **Family:** Major Mono Display, followed by Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, then monospace fallback. Emoji runs are explicitly marked to use the emoji fallback stack, preserving Unicode symbols unsupported by the primary font.
- **Base size:** 14px.
- **Image description / post metadata:** 12px, `1.2` line height.
- All display type inherits the site font.

## Color

| Token | Value | Use |
| --- | --- | --- |
| Page / sticky-header background | `#fffbcf` | Entire site background and header fill |
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

- A visual image line contains at most five items. Carousels with more than five items continue into consecutive lines within the same post.
- At rest, all items in each line have equal width using one fractional grid column per item.
- Images use local responsive WebP derivatives selected through `srcset` / `sizes`, fill their allocated width, and use a square display frame with `object-fit: cover`.
- Original captures are retained locally in `media/incoming/archive/`; only optimized display derivatives publish under `media/processed/`.
- Each image line reveals as a unit after its images load: 420ms from 12px-lowered / 12px-blurred to sharp. Lines reveal in top-to-bottom queue order; reduced-motion users receive no reveal transition.
- Image links point to their source Instagram post.

## Hover and focus behavior

- The active image expands to exactly 150% of its measured rest width.
- Sibling images shrink to preserve the fixed column width; the active row gap changes to 30px.
- The active item reveals only its own caption below the image.
- The expanded state persists while the pointer crosses an item edge or inter-item gap; it resets only after the pointer leaves the full row.
- Caption alignment follows the item’s position in the row: left third = left aligned; middle = centered; right third = right aligned.
- Keyboard focus has the same behavior as hover. A 1px `#111` focus outline is used.
- Column-width and gap transitions are 160ms and use `pmndrs/math`’s `easing.cubicInOut`; they are removed for `prefers-reduced-motion: reduce`. Only the locally vendored `math/time` easing submodule is included.

## Content rule

Post captions remain indexed in `data/posts.json` but are not displayed by default. Captions visible on the site are per-image descriptions only.

## Header links

- `instagram gallery` links to the Instagram account.
- `playlist` links to the Spotify playlist.
- Both remain anchored at the top during scroll.
