# FlowBond Design Direction

## Three stylistic approaches

### Theme Name: Trust Ledger
Very brief intro: A quiet, editorial fintech interface built around evidence, accountability, and visible state changes. The experience feels precise and calm rather than speculative or crypto-loud.
Probability: 0.07

### Theme Name: Signal Room
Very brief intro: A dark operations console where agent agreements, evidence signals, and settlement states are presented like mission control. The tone is technical, focused, and high-stakes.
Probability: 0.04

### Theme Name: Contract Garden
Very brief intro: A warm, human-centered system that makes machine-to-machine work feel understandable through tactile cards, soft paper textures, and clear narrative progression. The tone is approachable without becoming playful.
Probability: 0.03

## Selected approach: Trust Ledger

### Design Movement
Swiss editorial design blended with contemporary financial-infrastructure dashboards: strict typographic hierarchy, asymmetric rhythm, measured data density, and a restrained material palette.

### Core Principles
1. Evidence before assertion: every major state is paired with the signal or proof that supports it.
2. Calm accountability: FlowBond should make risk legible without visual panic or speculative crypto theatrics.
3. Editorial hierarchy: use large, declarative headlines and small precise metadata to guide the eye from agreement to evidence to decision.
4. Human-readable infrastructure: technical concepts should be explained in plain language alongside their machine-readable state.

### Color Philosophy
The signature color is **acid chartreuse** used sparingly as a verified-state marker, not as decoration. Ink-black and deep ocean blue provide trust and depth; warm bone and muted mineral surfaces make the system feel tangible and editorial. Coral is reserved for disputes and pauses so risk is unmistakable.

### Layout Paradigm
Use a split-rail composition: a narrow left rail for the FlowBond mark and navigation, a wide evidence canvas for the active agreement, and a persistent right-side settlement rail that keeps the financial consequence visible. Avoid centered landing-page symmetry; let the layout feel like a working instrument.

### Signature Elements
- A thin **evidence spine** running through agreement, milestone, evidence, and settlement states.
- **Proof chips** that pair a state with a short human-readable reason.
- A **settlement horizon**: a horizontal visual that shows budget moving from locked to released, paused, or returned.

### Interaction Philosophy
Every action should answer “what changes if I do this?” Buttons preview the resulting state; evidence cards expand into their source and decision rationale. Destructive or financial actions require an explicit second confirmation. Empty states teach the next useful move instead of pretending data exists.

### Animation
Use short, deliberate transitions: 180ms state changes, 240ms card expansion, and a 700ms settlement-horizon draw only when a decision is confirmed. Evidence chips should arrive in a 40ms stagger. Never animate fake money movement continuously; animate only a documented state transition. Respect reduced-motion preferences.

### Typography System
Use **Space Grotesk** for display labels and section headlines, with **IBM Plex Mono** for addresses, hashes, amounts, and system metadata. Body copy uses **DM Sans** for readability. Headlines are tight and editorial; metadata is uppercase, tracked, and compact.

### Brand Essence
FlowBond is the accountable settlement rail for autonomous work: it helps one agent hire another without relying on blind trust. Personality: **measured, exacting, humane**.

### Brand Voice
Headlines are short and consequential. CTAs describe the next state, not a vague action. Microcopy explains evidence in plain language and never overclaims certainty.

Example lines:
- “Make the promise machine-checkable.”
- “Payment follows proof—not optimism.”

### Wordmark & Logo
A bold, text-free symbol formed from two offset links that almost touch, with a small chartreuse verification notch where the links meet. It should read as a bond, a flow channel, and a proof checkpoint at once. The wordmark uses a custom geometric cut in the “o” to echo the verification notch.

### Signature Brand Color
**FlowBond Chartreuse — #C7F36B**. It is ownable, high-contrast, and signals a verified path through a darker infrastructure palette.

## Style Decisions

- Use the Trust Ledger direction consistently across the FlowBond product UI, demo narrative, and submission visuals.
- Do not use purple gradients, generic crypto imagery, or fabricated live transaction states.
- Label unfinished capabilities as Prototype or Planned Flow.
- Keep the current demo focused on agreement definition, evidence review, dispute pause, and settlement decision; present USDC movement as a planned next layer unless it is genuinely implemented.
