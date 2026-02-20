# Stacksverse 3D - Proof of Concept

## Important Notice

This project is an **early proof of concept** for idea validation.

- The current design and styling are **not final**.
- The purpose is to test whether the concept can be hosted, navigated, and demonstrated end-to-end.
- Visual polish, production UX, and final interaction design will be done after validation.

## What This PoC Is Testing

1. Can an immersive onboarding/world concept be presented as a web-hosted experience?
2. Can the experience support a host-led flow (clubhouse/Twitter Spaces direction)?
3. Can we structure progression logic (checkpoints, badge concepts, gated next steps) before full build?

## Screenshot-Based Concept Summary (WORLD-1a)

Based on the current `WORLD-1a` concept screen:

- Title: `WORLD-1a`
- Theme: immersive onboarding space for learning and sharing
- Planned components:
  - AI guide
  - learning modules
  - checkpoints
  - SIP-009 progress badge concept
  - gated access to next resources/worlds
- Current status shown in the concept:
  - design and flow are defined
  - implementation is pending
- Category direction:
  - virtual learning

In short: this PoC communicates product direction and user flow, not final UI quality.

## Current Demo Scope

- Static virtual tour runtime (existing engine)
- Presentation overlay for multiple experience directions
- Optional conversational widget integration for demo interaction

## Local Run

From the project root:

```bash
python3 -m http.server 8080
```

Open:

`http://localhost:8080/index.htm`

## Hosting Feasibility

This PoC is hostable as a static site today.

Supported deployment targets:
- Vercel
- Netlify
- GitHub Pages
- Nginx/Apache static hosting

No backend is required for this validation phase.

## Out of Scope for This PoC

- Final branding/design system
- Production-grade voice room infrastructure
- Final wallet and on-chain progression implementation
- VR headset-optimized production interaction model

## Proposed Next Step After Validation

1. Lock product requirements from demo feedback.
2. Finalize UX and interaction model.
3. Start the Marblelabs next phase implementation.
4. Add option to move around inside the world (navigation/locomotion mode).
5. Implement real-time room architecture (host/speaker/listener roles).
6. Add real wallet + badge progression logic.
7. Run a VR-specific UX pass for headset usability.
