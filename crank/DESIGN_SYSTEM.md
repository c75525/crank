# Crank design system

## Intent

A sparse interactive mechanism study. The SVG artwork is the visual focus; the surrounding interface is limited to an instruction header.

## Type

- **Family:** Arial, with system sans-serif fallback.
- **Header title:** 1rem, weight 600, uppercase, `.04em` letter spacing.
- **Instruction:** .82rem.

## Color

| Token | Value | Use |
| --- | --- | --- |
| Page background | `#f7f6f3` | Mechanism canvas background |
| Header background | `#fff` | Header fill |
| Main mechanism brown | `#534741` | SVG outlines, primary text |
| Secondary header border | `#c9c5c1` | Header divider |
| Instruction text | `#6e625b` | Instruction copy |
| Crank green | `#89ac91` | Crank body |
| Crank pale gray | `#f1f2f2` | Handle and mechanism surfaces |

## Layout and spacing

- Full viewport-height page with an auto-height header and centered mechanism area.
- Header padding: `1rem 1.5rem`.
- Header items use baseline alignment and a `2rem` gap.
- Scene width: `min(100%, 1200px)`.
- Main scene padding: `1rem`.
- The SVG’s maximum height is viewport height less 74px; on screens up to 560px, header stacks and the SVG maximum height becomes viewport height less 105px.

## Interaction

- The handle uses grab/grabbing cursors and pointer capture.
- The central bearing remains fixed.
- The arm rotates around the bearing; the outer grip follows while preserving its camera-aligned depth treatment.
- Z1 rotates clockwise at 1 RPM, Z2 counterclockwise at 4 RPM, and Z3 clockwise at 3 RPM around their native centers.
- Dragging the crank applies a parallax orbit about the core: Z1, Z2, Z3 use increasing angular ratios and orbit radii.
- Arrow keys adjust crank rotation in 10° increments while the handle is focused.
