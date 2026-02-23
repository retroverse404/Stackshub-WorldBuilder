# PRD: Stacks Hub / BTC Hub

Date: `2026-02-17`

## Scope

- Domains: `stackshub.space`, `btchub.space`
- Submission context: Stacks grant evaluation
- Product type: modular dapp hub

## Product Statement

- One stack.
- Many modules.
- Shared auth, wallet, payment, and routing.

## POC Direction

- POC framing: **headless app / evolutionary media**.
- Consensus determines how parent/child branch relationships gain canonical status.
- Branching narrative and ARG are core mechanics, not optional add-ons.
- AI is used to accelerate authoring and composability across modules.
- Interface updates should remain faithful to authored original design language.
- Original authored content is preserved; GenAI is an assistive layer for iteration.
- `Finding Nakamoto` is one narrative module in this shared ARG structure.
- The repo is intentionally positioned as an experimental sandbox.

## Module Context

- `Finding Nakamoto` is an ARG module.
- Status: pre-production.
- Story Fork mechanics are a reference module pattern.
- Reference repo: `https://github.com/retroverse404/story-fork-Study-Remix-`
- Ecosystem reference: `https://github.com/aibtcdev`

## Verified Story Fork Mechanics

- Browse: list stories on home.
- Read: depth `0` is free.
- Read paywall default: `10 uSTX`.
- Vote paywall default: `100 uSTX`.
- Pay step: wallet signs transfer payload.
- Verify step: server verifies via x402 flow.
- Settle step: server settles and records payment.
- Canon rule: highest-funded sibling becomes Canon.
- AI loop: every `10` minutes.

## User Flows

### Flow A: Explore

```text
Landing -> Connect wallet -> Open module -> Interact
```

### Flow B: Story Module

```text
Browse -> Read -> Pay -> Unlock -> Vote -> Canon update -> New branches
```

## Functional Requirements

- FR-1: User can authenticate with email OTP.
- FR-2: User can connect wallet once and reuse session across modules.
- FR-3: Hub can render module cards with tags and status.
- FR-4: Module routes load inside shared shell.
- FR-5: Paid actions can return HTTP `402` with requirements.
- FR-6: Paid actions accept `x-payment` and verify before success.
- FR-7: Payment events are stored with amount, payer, tx hash, and network.
- FR-8: Rank logic updates Canon after vote events.
- FR-9: `Finding Nakamoto` is represented as one module, not a separate stack.
- FR-10: Docs include source links and no unverified claims.

## Non-Functional Requirements

- NFR-1: Secrets are server-only.
- NFR-2: Write routes enforce auth.
- NFR-3: Duplicate tx hash is rejected.
- NFR-4: Dev mode supports payment-off fallback.
- NFR-5: Mobile layout is supported for core pages.

## Screenshots to UX Mapping

- `Programming on Bitcoin w//Stacks` -> onboarding scene module.
- `Learn by building / Enter Dojo` -> guided module entry.
- `Explore Micro Worlds` -> module directory.
- `Connect Wallet` -> global action in shell and modules.

## Resources

- `https://github.com/retroverse404/story-fork-Study-Remix-`
- `https://github.com/aibtcdev`
- Internal context docs:
  - `docs/HEADLESS_ARG_COMPOSABILITY_POV.md`
  - `docs/STACKS_ARCHITECTURE.md`
  - `docs/STORY_FORK_EXTRACTION_FOR_STACKS_BTC_HUB.md`
  - `docs/PRODUCT_PRM_STACKS_BTC_HUB.md`
