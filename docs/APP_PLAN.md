# Party Spin Wheel — App Plan

## Product goal

Create a quick, welcoming party game in which a player spins a wheel and receives a randomly selected outcome. The first release should work well with a mouse, keyboard, or touch screen and require no account or server.

## Version 1 scope

1. Display a responsive wheel with clearly labelled segments.
2. Start a spin from a large button or keyboard control.
3. Select outcomes fairly and prevent additional input during a spin.
4. Announce the result visually and through an accessible live region.
5. Allow a host to build or clear a 0–30 entry list in a collapsible drawer; require five entries only when spinning.
6. Import and export reusable name lists as JSON files, with browser storage to follow.
7. Offer reset, reduced-motion, and sound controls.

## Component structure

```text
App
├── GameHeader
├── WheelStage
│   ├── SpinWheel
│   ├── WheelPointer
│   └── ResultBanner
└── WheelControls
    ├── SpinButton
    ├── EntryEditor
    └── GameSettings
```

The starter implements `GameHeader`, `SpinWheel`, `ResultBanner`, `WheelControls`, and the collapsible `EntryDrawer`. Inline editing and settings are planned next.

## State model

- `entries`: ordered wheel segments with stable IDs, labels, colours, and optional metadata.
- `status`: `idle`, `spinning`, or `complete`.
- `rotation`: accumulated wheel angle, retained between spins.
- `selectedEntry`: the result of the latest completed spin.
- `settings`: sound, reduced motion, spin duration, and removal-after-spin options.

Spin selection and animation should remain separate: choose an unbiased entry first, then calculate a final rotation that places that entry beneath the pointer.

## Milestones

### Milestone 1 — Playable foundation

- React/Vite/TypeScript setup
- Responsive SVG wheel
- Spin lifecycle and result announcement
- Segment click audio and selected-wedge highlight
- Keyboard and reduced-motion basics

### Milestone 2 — Host controls

- Entry editor with validation
- Add, remove, reorder, and recolour entries
- Local storage and reset-to-default action

### Milestone 3 — Game polish

- Optional sound and confetti
- Full-screen party mode
- Spin history and remove-winner option
- Automated unit and interaction tests

### Milestone 4 — Delivery

- Original branded art direction
- Performance and accessibility review
- GitHub Pages or another static deployment target

## Acceptance criteria for the first playable release

- Wheel supports 2–16 entries without overlapping labels at common screen sizes.
- Spin controls cannot trigger overlapping spins.
- Every configured entry can be selected.
- Result is visible and announced to assistive technology.
- Core game is usable at 320 px wide and with keyboard-only input.
- Production build completes without TypeScript or lint errors.
