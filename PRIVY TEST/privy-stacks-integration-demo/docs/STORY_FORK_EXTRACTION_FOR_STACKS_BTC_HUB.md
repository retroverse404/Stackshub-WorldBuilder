# Story Fork Extraction

Date: `2026-02-17`

Reference repo:

- `https://github.com/retroverse404/story-fork-Study-Remix-`

Context:

- This is used as a mechanic reference for grant evaluation.
- `Finding Nakamoto` is an ARG module in the same modular architecture.

## Verified Mechanics

- Root read is free (`depth === 0`):
  - `src/app/api/branches/[branchId]/read/route.ts`
- Read paywall uses branch `readPrice`:
  - `src/app/api/branches/[branchId]/read/route.ts`
  - default `10`: `prisma/schema.prisma`
- Vote paywall uses branch `votePrice`:
  - `src/app/api/branches/[branchId]/vote/route.ts`
  - default `100`: `prisma/schema.prisma`
- Missing payment returns `402`:
  - `src/app/api/branches/[branchId]/read/route.ts`
  - `src/app/api/branches/[branchId]/vote/route.ts`
- Payment verify and settle helpers:
  - `src/lib/x402.ts`
- Canon update after vote:
  - `recalculateCanon(...)` in `src/app/api/branches/[branchId]/vote/route.ts`
- AI interval:
  - `CHECK_INTERVAL_MS = 10 * 60 * 1000` in `openclaw-skill/src/tools.ts`

## Mechanic Diagram

```text
GET read/vote
  -> no x-payment -> 402 + requirements
  -> wallet signs payment
  -> retry with x-payment
  -> verify + settle
  -> persist payment + update counters
  -> (vote only) recalculate Canon
```

## Reuse in This Repo

- Keep current Privy auth and Stacks signing path.
- Add module endpoints with the same paywall contract.
- Keep Canon rule as deterministic ranking logic.
- Keep tx hash uniqueness check.

## Module Mapping

- Story Fork: storytelling module pattern.
- Finding Nakamoto: ARG module pattern.
- Same base stack: auth, wallet, payment, state update.

## Additional References

- Ecosystem: `https://github.com/aibtcdev`
- Local architecture: `docs/STACKS_ARCHITECTURE.md`
- Local PRD: `docs/PRODUCT_PRD_STACKS_BTC_HUB.md`
- Local PRM: `docs/PRODUCT_PRM_STACKS_BTC_HUB.md`
