# Pill — Performance Audit

## Baseline

The original page loaded `pill.svg` through a runtime `fetch()` before it could initialize the interaction. That added a separate blocking request and required XML parsing/importing after initial JavaScript evaluation. Initial snake-path setup also sampled the SVG path 12,006 times to find six known starting positions.

## Optimization applied — 2026-09-23

- Inlined the unmodified `pill.svg` artwork into `index.html`, removing the runtime SVG request and XML parse/import step.
- Replaced path-sampling startup work with the six known orb positions from the supplied SVG geometry.
- Kept `pill.svg` as a local source asset; the inlined page renders the same artwork and interaction.

## Transfer impact

- `pill.svg`: 5,900 bytes.
- Optimized `index.html` (including the same SVG): 6,281 bytes.
- The initial payload remains essentially the same size, but the critical render path uses one fewer request and eliminates runtime document parsing plus 12,006 path samples.

## Validation

- Verify the SVG appears immediately on the deployed page.
- Verify full slider travel still yields one black-pill rotation and three colored-orb laps.
