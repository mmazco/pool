# Fuse Energy Collective Pool — Implementation Brief

**Purpose:** A simulation/demo showcasing Privy SDK capabilities for Fuse Energy, demonstrating a new "Collective Pool" feature where neighbors pool rewards and earn together in perpetuity.

**Target Audience:** Privy team (to demonstrate what's possible with Privy for their existing customer Fuse)

---

## Background Context

### What is Fuse Energy?
Fuse is a UK energy company serving 200k+ households with $400M ARR. They've built "The Energy Network" — a tokenized incentive layer where users earn $ENERGY tokens by shifting energy usage to optimal times (off-peak, low grid stress).

**How users earn $ENERGY:**
- Connect devices (EV chargers, batteries, thermostats)
- Manually shift usage via the Fuse app
- Fuse reads wholesale prices + grid stress → dispatches flexibility → users earn proportional to value created

**Reference:** [Privy x Fuse Case Study](https://privy.io/blog/rebuilding-the-energy-grid-with-fuse-energy)

### The Gap
Fuse currently has an individual referral program (one-time spin for up to £150). There's **no collective/neighborhood/group plan** — no ongoing shared benefits, no pooling, no community structures.

### The Opportunity
A "Collective Pool" feature that lets neighbors:
1. Pool a portion of their $ENERGY rewards
2. Earn together in perpetuity (not one-time)
3. Track distributions transparently onchain via Splits

---

## Feature Overview

### How It Works

```
Households earn $ENERGY individually
            │
      pool 10% each
            │
    ┌───────┴───────┐
    │  WATERFALL    │
    │ (founder 5%)  │
    └───────┬───────┘
            │
    ┌───────┴───────┐
    │    SPLIT      │
    │ (equal share) │
    └───────────────┘
```

1. **Create a Pool** — Founder deploys a collective, gets 5% founder bonus
2. **Invite Neighbors** — Share link via WhatsApp/SMS
3. **Join the Pool** — Neighbors sign in with email, automatically added
4. **Earn Together** — 10% of each member's $ENERGY flows to pool, distributed equally + founder bonus

### Why It Matters
- **For Fuse:** Viral growth, denser networks, higher retention (leaving Fuse = leaving your Pool)
- **For Privy:** Demonstrates invisible wallet infra for mainstream energy customers
- **For Users:** Ongoing benefit (vs one-time referral), skin in the game, community coordination

---

## Technical Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js (App Router) | Web application |
| **Auth + Wallets** | Privy SDK | Email/social login → embedded wallets |
| **Payment Rails** | Splits (optional) | Waterfall + Split contracts for distribution |
| **Token** | Mock $ENERGY | Simulated reward flow |
| **Chain** | Base (testnet) or fully mocked | Low cost, Splits deployed |

### Privy Integration (REQUIRED)

**MCP Server for Cursor:**
```json
{
  "mcpServers": {
    "privy-docs": {
      "url": "https://docs.privy.io/mcp"
    }
  }
}
```

**Key Privy Docs:**
- Get Started with AI Tools: https://docs.privy.io/basics/get-started/using-llms
- UI Components (Login Modal): https://docs.privy.io/authentication/user-authentication/ui-component
- React Installation: https://docs.privy.io/basics/react/installation
- Configuring Appearance: https://docs.privy.io/basics/react/advanced/configuring-appearance

**Privy Implementation:**
```tsx
import { useLogin, usePrivy } from '@privy-io/react-auth';

function LoginButton() {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: ({ user, isNewUser }) => {
      // Handle post-login (create/join pool)
    }
  });
  
  return (
    <button disabled={!ready || authenticated} onClick={login}>
      Log in
    </button>
  );
}
```

### Splits Integration (OPTIONAL for demo)

For the simulation, we can either:
1. **Mock the data/flow** — Display splits visualization without actual contracts
2. **Deploy real contracts** — Use Splits SDK on Base testnet

If using real contracts:

**Waterfall SDK:** https://docs.splits.org/sdk/waterfall

```typescript
import { WaterfallClient } from '@0xsplits/splits-sdk'

// Create waterfall: founder gets first 5%, residual to split
const waterfall = await waterfallClient.createWaterfallModule({
  token: "0x...", // $ENERGY token address
  tranches: [
    { recipient: founderAddress, size: 0.05 }, // 5% founder bonus
    { recipient: splitContractAddress } // residual to equal split
  ]
})
```

**Splits V2** for equal distribution among members.

---

## Screens to Implement

### Flow A: Pool Creator (Founder)

| # | Screen | Description |
|---|--------|-------------|
| 1 | **Sign In** | Privy login modal (email/Google/Apple) |
| 2 | **Create Pool** | Name input, settings preview (10% contribution, 5% founder bonus) |
| 3 | **Pool Created** | Success + invite link (copy, WhatsApp, SMS) |
| 4 | **Dashboard** | Pool balance, member list, split visualization, recent distributions |

### Flow B: Neighbor (Invitee)

| # | Screen | Description |
|---|--------|-------------|
| 1 | **Invite Landing** | "Sarah invited you to join Bristol Gardens Pool" |
| 2 | **Sign In** | Privy login modal |
| 3 | **Confirm Join** | Preview pool (members, founder, terms) |
| 4 | **Dashboard** | Same dashboard as founder (but without founder badge) |

### Shared Components

| Component | Description |
|-----------|-------------|
| **Split Visualization** | Shows founder tier (5%) → equal split tier (members) |
| **Member List** | Avatars, names, share % |
| **Distribution History** | Recent payouts with amounts |
| **Invite Actions** | Copy link, WhatsApp share, SMS share |

---

## Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#FFFFFF` | Background |
| `--fg` | `#000000` | Primary text |
| `--muted` | `#666666` | Secondary text |
| `--active` | `#007AFF` | Apple Blue — CTAs, links, active states |
| `--border` | `#E5E5E5` | Borders, dividers |

### Typography
- **Font:** System default (SF Pro on iOS/Mac, Inter/Roboto elsewhere)
- **Headings:** 600 weight, black
- **Body:** 400 weight, `--muted` for secondary

### Components
- **Buttons:** Rounded corners (8px), solid fill for primary (blue bg, white text), outline for secondary (black border, black text)
- **Cards:** White bg, subtle border, 12px padding
- **Inputs:** Full width, 44px height, subtle border
- **Layout:** Minimal, single-column, generous whitespace

### Reference
Design similar to [Permet.co](https://permet.co/) — minimal, clean, no marketing fluff. Just the essential screens.

---

## Implementation Priorities

### P0 — Must Have for Demo
1. Privy login flow (email + social)
2. Create Pool screen
3. Invite link generation + sharing
4. Join Pool flow (for invitee)
5. Dashboard with split visualization (mocked data is fine)

### P1 — Nice to Have
1. Real Splits contract deployment
2. Animated distribution flow
3. Member avatars from Privy user data

### Out of Scope
- Actual $ENERGY token integration
- Fuse API integration
- Member removal/leaving
- Variable pool percentages

---

## Demo Script (5 minutes)

1. **Sarah creates a pool** (0:00-1:00)
   - Signs in with email via Privy
   - Names it "Bristol Gardens Pool"
   - Gets shareable invite link

2. **Tom joins via invite** (1:00-2:30)
   - Opens invite link
   - Signs in with Google via Privy
   - Confirms joining the pool

3. **Dashboard walkthrough** (2:30-4:00)
   - Show pool balance
   - Show split visualization (founder bonus + equal split)
   - Show member list with Tom added

4. **Simulate distribution** (4:00-5:00)
   - Trigger mock $ENERGY reward
   - Show it flowing through waterfall → split
   - Show updated balances for Sarah and Tom

---

## File Structure Suggestion

```
/app
  /page.tsx                 # Landing / Sign in
  /create/page.tsx          # Create Pool
  /pool/[id]/page.tsx       # Dashboard
  /join/[id]/page.tsx       # Join Pool (invite landing)
/components
  /privy-provider.tsx       # Privy wrapper
  /split-visualization.tsx  # Waterfall + split diagram
  /member-list.tsx          # Pool members
  /invite-actions.tsx       # Copy/WhatsApp/SMS buttons
/lib
  /mock-data.ts             # Mocked pool/distribution data
  /splits.ts                # Splits SDK helpers (if using real contracts)
```

---

## Questions for Implementation

1. Should we deploy real Splits contracts or mock everything? (Recommendation: mock for speed, real for impressiveness)
2. Do we need a "simulate distribution" button for the demo, or auto-trigger?
3. Should the invite link be a real URL or mocked? (Recommendation: real URL with query params for pool ID)

---

## Resources

| Resource | URL |
|----------|-----|
| Privy Docs | https://docs.privy.io |
| Privy MCP | https://docs.privy.io/basics/get-started/using-llms |
| Privy UI Components | https://docs.privy.io/authentication/user-authentication/ui-component |
| Privy x Fuse Blog | https://privy.io/blog/rebuilding-the-energy-grid-with-fuse-energy |
| Splits SDK Waterfall | https://docs.splits.org/sdk/waterfall |
| Splits V2 | https://docs.splits.org/sdk/splits-v2 |
| Design Reference | https://permet.co |

---

*This brief is for a feature simulation to demo to the Privy team. Not a production feature. Focus on clean UX and Privy integration over real blockchain functionality.*
