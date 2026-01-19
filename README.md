# Fuse Pool

A demo showcasing a "Pool" feature for [Fuse Energy](https://privy.io/blog/rebuilding-the-energy-grid-with-fuse-energy) — neighbors pool $ENERGY rewards and earn together in perpetuity.

Built with Next.js + [Privy](https://privy.io) authentication. All pool data is mocked (localStorage).

## Quick Start

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_PRIVY_APP_ID` in `.env.local`.

---

## How It Works

### Pool Rewards & Distribution

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

1. **Create a Pool** — Founder deploys a pool, earns 5% founder bonus on all distributions
2. **Invite Neighbors** — Share link via WhatsApp/SMS/copy
3. **Join the Pool** — Neighbors sign in with email, automatically added
4. **Earn Together** — 10% of each member's $ENERGY flows to pool

**Distribution math:**
- Pool receives $100 from weekly member contributions
- Founder bonus (5%): $5 to founder
- Residual ($95) split equally among all members (including founder)
- With 5 members: each gets $19 from split + founder gets extra $5

### Simulate Distribution

The dashboard has a "Simulate distribution" button that:
1. Generates a random weekly pool amount (50-150 $ENERGY)
2. Calculates founder bonus (5%)
3. Splits remainder equally among all members
4. Updates pool balance, member shares, and distribution history
5. Plays an animation showing the waterfall flow

---

## Growth Forecast

The forecast card shows how earnings scale with more neighbors:

| Neighbors | Weekly Pool | Your Share |
|-----------|-------------|------------|
| Current (4) | ~60 $ENERGY | ~15 $ENERGY |
| +2 neighbors | ~90 $ENERGY | ~18 $ENERGY |
| +5 neighbors | ~135 $ENERGY | ~20 $ENERGY |

**Formula:**
- Weekly pool = members × 15 $ENERGY (avg contribution)
- Your share = (pool × 0.95) / members + (founder bonus if applicable)

The forecast demonstrates the network effect: more neighbors = larger pool = higher absolute earnings (even as % share decreases).

---

## Network Discovery

The `/network` page simulates discovering nearby Fuse households via Bluetooth radar scan.

### How It Could Work in Production

Inspired by [bitchat](https://bitchat.free/) mesh networking:

**Layer 1: Bluetooth (Immediate Proximity)**
- Range: ~10-100m
- Fuse app uses BLE to broadcast/scan for other Fuse users
- Works offline, no internet required
- Use case: same building, immediate neighbors

**Layer 2: Mesh Relay (Extended Local)**
- Range: ~500m-1km  
- Devices relay discovery pings between each other
- Messages "hop" through neighbors' phones
- Still works without internet

**Layer 3: Internet + Location Channels (Wide Area)**
- For neighborhood/city/region scale
- Hierarchical location channels (block → neighborhood → city → region)
- Only share coarse geohash, not exact address
- Optional Tor routing for privacy

```
#location channels

node         (Bluetooth, ~10-50m)
block        (4 people, ~0.1km)
neighborhood (8 people, ~1.2km)
city         (24 people, ~4.9km)
region       (18 people, ~39.2km)
```

**For Fuse:**
- Every household has a smart meter + the Fuse app
- Meters could act as BLE beacons
- App discovers nearby households → invite to pool or join existing

---

## Business Model

### For Fuse Energy

| Benefit | Impact |
|---------|--------|
| **Viral growth** | Existing users recruit neighbors (network effect) |
| **Denser networks** | More devices in proximity = better grid flexibility |
| **Higher retention** | Leaving Fuse = leaving your Pool & neighbors |
| **Community moat** | Social bonds > price competition |

### For Users

| Benefit | vs Current |
|---------|------------|
| **Ongoing rewards** | vs one-time £150 referral spin |
| **Skin in the game** | Pool performance tied to neighborhood |
| **Transparent splits** | See exactly who earns what |

### Revenue Mechanics

Fuse makes money on the underlying energy flexibility (shifting usage to off-peak). Pools increase:
1. **User acquisition cost efficiency** — users recruit each other
2. **Retention** — social lock-in
3. **Flexibility density** — more devices per area = better grid response = higher wholesale value captured

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Auth | Privy SDK (email login) |
| Data | localStorage (mocked) |
| Styling | Inline styles |

### File Structure

```
/app
  /page.tsx              # Landing
  /create/page.tsx       # Create Pool
  /pool/[id]/page.tsx    # Dashboard
  /join/[id]/page.tsx    # Join Pool (invite)
  /network/page.tsx      # Network Discovery
/components
  /privy-provider.tsx    # Privy wrapper
  /auth-gate.tsx         # Login gate
  /header.tsx            # App header
  /split-visualization.tsx
  /member-list.tsx
  /invite-actions.tsx
  /forecast-card.tsx
  /distribution-animation.tsx
  /network-discovery.tsx
/lib
  /store.ts              # localStorage mock store
  /mock-data.ts          # Seed data
```

---

## Demo Flow

1. **Create Pool** — Sign in with email, name your pool, get invite link
2. **Invite Neighbors** — Share link (pre-populated with dummy members for demo)
3. **View Dashboard** — Pool balance, split visualization, member list
4. **Simulate Distribution** — Click button to see $ENERGY flow through waterfall
5. **Network Discovery** — Scan for nearby houses (mocked radar)

---

## Future Enhancements

- [ ] Real Splits contracts on Base for onchain distributions
- [ ] Fuse API integration for actual $ENERGY balances
- [ ] Push notifications for distributions
- [ ] Pool leaderboards (neighborhood, city)
- [ ] Mesh network discovery (Bluetooth + internet hybrid)

---

*Demo built for [Privy](https://privy.io) to showcase invisible wallet infrastructure for mainstream energy customers.*
