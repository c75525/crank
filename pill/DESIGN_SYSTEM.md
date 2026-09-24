# Pill — Design System

## Purpose

An interactive test derived directly from `pill.svg`. The yellow circular slider controls the mechanical motion.

## Visual source

- `pill.svg` is the source artwork and is loaded without visual redrawing or asset substitution.
- Page background: `#fffbcf`.
- The illustration preserves its original black outer pill, white inner outlined pill, yellow slider, and six colored orbs.
- No supporting interface copy or decorative controls are shown.

## Layout

- The illustration is centered in a maximum 1400px content area.
- Horizontal inset is 20px desktop and 10px mobile.
- The SVG permits overflow so the black pill remains visible as it rotates.

## Interaction

- Drag the yellow slider from its left start point to its right endpoint.
- The colored orbs travel the capsule-shaped path surrounding the inner slider container, preserving their individual offsets like a continuous snake.
- At full travel, every colored orb completes exactly three laps of that capsule path.
- At full travel, the outer black pill rotates exactly one complete turn (360°) about its own center.
- Motion is proportional and directly follows slider position; there is no autonomous animation.
- The yellow slider supports keyboard operation: arrow keys adjust by 2%, Home resets, and End completes the motion.
