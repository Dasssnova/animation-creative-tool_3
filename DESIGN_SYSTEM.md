# Creative Tool Design System

This file defines reusable tokens and component classes for the Creative Tool UI.

## Tokens
- Colors: neutrals, overlays, accent, semantic text/border/surface aliases.
- Typography: 9/11/13/14 scales, semibold/medium weights, uppercase UI labels.
- Radius: pill, card, panel, frame.
- Spacing: 2, 4, 6, 8, 12, 16, 20, 24, 32, 40.
- Effects: soft inset + elevation shadows, blur for player controls.

## Component primitives
- `.ds-btn`, `.ds-btn--primary`, `.ds-btn--secondary`, `.ds-btn--icon`
- `.ds-input`, `.ds-input--filled`, `.ds-input--empty`
- `.ds-toggle`, `.ds-switch-tab`, `.ds-chip`
- `.ds-card`

## UX conventions
- Primary actions always use accent fill.
- Secondary actions stay low-emphasis until hover/focus.
- Input states map to Figma: default, hover, active, filled.
- Disabled state reduces opacity and blocks interactions.
