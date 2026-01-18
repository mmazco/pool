import type { Db } from './store';

export function seedDb(): Db {
  const poolId = 'bristol-gardens';
  const now = new Date('2026-01-13T12:00:00.000Z').toISOString();

  return {
    pools: {
      [poolId]: {
        id: poolId,
        name: 'Bristol Gardens',
        founderUserId: 'seed_sarah',
        contributionBps: 1000,
        founderBonusBps: 500,
        createdAt: now,
        updatedAt: now,
        totalPooledLifetime: 247.5,
        lastDistributionAt: '2026-01-13T12:00:00.000Z',
      },
    },
    membersByPoolId: {
      [poolId]: [
        {
          userId: 'seed_sarah',
          displayName: 'Sarah',
          walletAddress: '0x1a2b...3c4d',
          joinedAt: now,
          isFounder: true,
          lifetimeReceived: 61.8,
        },
        {
          userId: 'seed_tom',
          displayName: 'Tom',
          walletAddress: '0x5e6f...7g8h',
          joinedAt: now,
          isFounder: false,
          lifetimeReceived: 45.2,
        },
        {
          userId: 'seed_lisa',
          displayName: 'Lisa',
          walletAddress: '0x9i0j...1k2l',
          joinedAt: now,
          isFounder: false,
          lifetimeReceived: 46.1,
        },
        {
          userId: 'seed_james',
          displayName: 'James',
          walletAddress: '0x3m4n...5o6p',
          joinedAt: now,
          isFounder: false,
          lifetimeReceived: 44.4,
        },
      ],
    },
    distributionsByPoolId: {
      [poolId]: [
        { id: 'dist_2026_01_13', poolId, createdAt: '2026-01-13T12:00:00.000Z', poolAmount: 62.4, memberCount: 4 },
        { id: 'dist_2026_01_06', poolId, createdAt: '2026-01-06T12:00:00.000Z', poolAmount: 58.1, memberCount: 4 },
        { id: 'dist_2025_12_30', poolId, createdAt: '2025-12-30T12:00:00.000Z', poolAmount: 51.2, memberCount: 3 },
      ],
    },
  };
}

