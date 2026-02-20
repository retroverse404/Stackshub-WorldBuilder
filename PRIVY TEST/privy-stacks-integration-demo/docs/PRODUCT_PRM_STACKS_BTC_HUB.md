# PRM: Stacks Hub / BTC Hub

Date: `2026-02-17`

Priority keys:

- `P0`: required for grant demo
- `P1`: next iteration
- `P2`: later

## Requirements Matrix

| ID | Requirement | Priority | Acceptance |
|---|---|---|---|
| PRM-01 | Shared shell for `stackshub.space` and `btchub.space` | P0 | Brand copy switches by config. |
| PRM-02 | Email OTP auth (Privy) | P0 | User can login and logout. |
| PRM-03 | Wallet connect in shell | P0 | Wallet state persists in session. |
| PRM-04 | Module catalog | P0 | Cards render from metadata. |
| PRM-05 | Module route container | P0 | Module loads without auth reset. |
| PRM-06 | Story module read flow | P0 | Root is free. Child read can be paid. |
| PRM-07 | Story module vote flow | P0 | Paid vote updates funding counters. |
| PRM-08 | Canon recalculation | P0 | Highest-funded sibling is Canon. |
| PRM-09 | HTTP `402` response | P0 | Unpaid request returns payment requirements. |
| PRM-10 | `x-payment` verify and settle | P0 | Paid request verifies before success response. |
| PRM-11 | Payment persistence | P0 | Amount, payer, tx hash, network are stored. |
| PRM-12 | Duplicate tx safety | P0 | Duplicate tx hash is rejected. |
| PRM-13 | Dev free mode | P1 | Paywall bypass works when payment receiver is unset. |
| PRM-14 | `Finding Nakamoto` module entry | P1 | Listed as ARG module in docs and module map. |
| PRM-15 | Creative vertical tags | P1 | Module tags include music, storytelling, and games. |
| PRM-16 | Mobile core screens | P1 | Landing, auth, catalog, and story pages are usable on mobile. |
| PRM-17 | Metrics events | P2 | Track module open, read, vote, and wallet connect events. |
| PRM-18 | Ecosystem reference in docs | P2 | `aibtcdev` link is present in architecture docs. |

## Milestones

### M1: Submission baseline

- Includes: `PRM-01` to `PRM-12`
- Result: modular shell + Story Fork mechanics + verified payment flow

### M2: Module expansion

- Includes: `PRM-13` to `PRM-16`
- Result: better module coverage and UX

### M3: Reporting

- Includes: `PRM-17`, `PRM-18`
- Result: evaluation-friendly tracking and references
