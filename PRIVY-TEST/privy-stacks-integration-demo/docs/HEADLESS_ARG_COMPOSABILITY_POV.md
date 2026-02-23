# Headless ARG Composability POV

Date: `2026-02-19`

## Core Thesis

This POC is a **headless app for evolutionary media**.

- Frontend scenes can change over time.
- Narrative state is not hardcoded into one page.
- Consensus activity determines which branches become canonical parent/child paths.

In short: **consensus shapes narrative structure**.

## Product Framing

- `stackshub.space` is the authored shell.
- Modules are composable narrative units.
- ARG progression can be surfaced as branches, remixes, and canon transitions.
- `Finding Nakamoto` is one active narrative module in this structure.

This is intentionally an **experimental sandbox** first, production system second.

## System Model

The platform is treated as three layers:

1. Experience Layer:
- Gate pages, scenes, and interaction surfaces.
- Human-readable narrative and UI pacing.

2. Protocol Layer:
- Auth, wallet context, payment requirements, vote and read gates.
- Canon update logic.

3. Evolution Layer:
- AI-assisted branch generation and remixing.
- Parent/child relationship updates based on economic and social consensus.

## Consensus-Driven Parent/Child Graph

Narratives are represented as a directed graph:

- Node: a branch or scene version.
- Edge: parent -> child relationship.
- Canon: currently dominant sibling path based on defined ranking logic.

Consensus signals can include:

- Paid read and vote participation.
- On-chain settlement signals.
- Curatorial weight from module owners.

This allows narrative progression to be **computed**, not only manually edited.

## Branching Narrative + ARG

ARG is implemented as branching pathways rather than a single linear script.

- A module can fork into multiple child paths.
- Users can unlock, vote, and financially signal preferred outcomes.
- Canon can shift over time as participation changes.

`Finding Nakamoto` is treated as one branch family in this broader ARG lattice.

## AI Authoring and Composability

AI is used for authoring acceleration, not as a replacement for direction.

- Authors define constraints, tone, and module goals.
- AI generates candidate branches/remixes.
- Consensus and curation decide what persists as canon.
- Interface implementation stays faithful to authored design intent.
- Original authored content remains the source narrative; GenAI assists expansion and iteration.

Composability means modules can share:

- Auth identity
- Wallet/payment rails
- Narrative state conventions
- Reusable branch mechanics

## Experimental Sandbox Rules

This repo should be described as:

- Research + product experiment
- Modular and fork-friendly
- Safe to iterate quickly
- Explicitly non-final for production guarantees

## Suggested GitBook Placement

Use this order:

1. Vision: Headless Evolutionary Media
2. Architecture: Consensus Graph + Module Layers
3. Narrative Modules: `Finding Nakamoto` and others
4. Authoring: AI-assisted composability workflow
5. Sandbox Scope: what is experimental vs production
