# Square Jump — Design System

## Source geometry

- `Menu.svg` defines the resting menu: eight black 91.6px squares in a vertical stack on `#d32a00`.
- `Menu with 1st Item Populated.svg` defines the target: a black `835.54px × 835.54px` square at `(631.46, 130.03)`.
- The target side length is exactly the source stack’s full vertical height.
- `animation-path.png` is the supplied interaction reference and is retained as source documentation, not displayed in the site.

## Layout

- The scene uses the SVG’s original 1920 × 1080 coordinate system and fills the viewport.
- The canvas/background is `#d32a00`; menu squares are black.
- There is no added copy, navigation, or decoration.

## Scroll interaction

- Eight sequential scroll segments correspond to the top-to-bottom square order.
- Within a segment, the active square first springs horizontally from the stack toward the target boundary.
- It then scales and rises into the exact 835.54px target square.
- As the next square starts, the previously expanded square springs back to its stack position, allowing one active large square at a time.
- Scrolling backward reverses the same continuous positions.
- With reduced motion enabled, the scroll sequence is shortened to one viewport height.
