# Performance audit — Collections.0rg

**Audit date:** 2026-09-22  
**Scope:** first four-post pilot, served as static GitHub Pages assets.

## Baseline

- 22 processed gallery images are currently JPEGs totaling **5,492,392 bytes (5.3 MB)**.
- The largest asset is **1,562,876 bytes** (`DdXVxMOiXA7/04.jpg`).
- Several images are much larger than their rendered grid cells:
  - up to **3000 × 4000 px** in `DdXVxMOiXA7`
  - up to **2560 × 1920 px** in `DdKUzJXCext`
  - up to **1944 × 1458 px** in `DdBg_uQEeZW`
- Images have `loading="lazy"` and `decoding="async"`, which helps offscreen loading, but each image still downloads/decodes at its source dimensions when requested.
- The gallery uses square, cropped display frames (`aspect-ratio: 1 / 1; object-fit: cover`), so a substantial part of many full-resolution images is downloaded and decoded but never visible.
- No `srcset`, `sizes`, intrinsic image dimensions, WebP/AVIF derivatives, or image CDN are currently used.
- GitHub Pages serves the static files but does not transform or optimize uploaded images.
- The Google font is loaded through `fonts.googleapis.com` with preconnect hints. It is not the primary loading cost relative to the image payload.

## Diagnosis

The slow gallery is primarily caused by original-resolution JPEGs being delivered directly to small thumbnail-like frames. The issue is image transfer and decode work, not the gallery JavaScript.

## Recommended next change

Generate local display derivatives before publishing:

1. Keep the current downloaded JPEGs as source captures in a non-public/archive location if needed.
2. Generate a **480px-wide WebP** thumbnail and a **960px-wide WebP** high-density derivative for each item, preserving aspect ratio.
3. Add intrinsic `width`/`height` and responsive `srcset`/`sizes` to each gallery image.
4. Use the 480px derivative for the default row and let the browser choose the 960px derivative only where the 150% hover state or viewport warrants it.
5. Retain a JPEG fallback only if required after browser testing.

## Expected effect

This should substantially reduce the 5.3 MB pilot payload and the cost of decoding large source images, especially on mobile and when several carousel rows enter the viewport.

## Optimization applied — 2026-09-22

- Original JPEG captures were retained locally under `media/incoming/archive/` and excluded from Git deployment.
- Generated 43 local WebP derivatives: a 480px display source plus a no-upscale high-density source for every item that benefits from it.
- Added responsive `srcset` / `sizes` and intrinsic dimensions to every gallery item.
- The published derivative set totals **1,707,076 bytes (1.7 MB)**, compared with **5,492,392 bytes (5.3 MB)** for the previously deployed JPEG set: a **68.9% reduction** in total static gallery media bytes.
- Validated: 4 posts, 43 responsive derivative paths, and 0 missing files; `app.js` and `posts.json` parse successfully; the gallery renders locally.

## Remaining validation

- Check image quality at default and 150% hover sizes on mobile and desktop after deployment.
- Compare real browser network transfer after the GitHub Pages build completes.
