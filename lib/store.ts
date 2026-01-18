'use client';

import { seedDb } from './mock-data';

export type Pool = {
  id: string;
  name: string;
  founderUserId: string;
  contributionBps: number; // 1000 = 10%
  founderBonusBps: number; // 500 = 5%
  createdAt: string;
  updatedAt: string;
  totalPooledLifetime: number;
  lastDistributionAt?: string;
};

export type Member = {
  userId: string;
  displayName: string;
  walletAddress?: string;
  joinedAt: string;
  isFounder: boolean;
  lifetimeReceived: number;
};

export type Distribution = {
  id: string;
  poolId: string;
  createdAt: string;
  poolAmount: number;
  memberCount: number;
};

export type Db = {
  pools: Record<string, Pool>;
  membersByPoolId: Record<string, Member[]>;
  distributionsByPoolId: Record<string, Distribution[]>;
};

const STORAGE_KEY = 'fuse_collective_pool_v1';

function assertClient() {
  if (typeof window === 'undefined') throw new Error('Mock store is client-only (requires localStorage).');
}

function safeParseDb(raw: string | null): Db | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Db;
  } catch {
    return null;
  }
}

export function loadDb(): Db {
  assertClient();
  const db = safeParseDb(window.localStorage.getItem(STORAGE_KEY));
  if (db) return db;
  const seeded = seedDb();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

export function saveDb(db: Db) {
  assertClient();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function ensureSeeded() {
  loadDb();
}

export type PoolPreview = {
  pool: Pool;
  founder?: Member;
  memberCount: number;
};

export function getPoolPreview(poolId: string): PoolPreview | null {
  const db = loadDb();
  const pool = db.pools[poolId];
  if (!pool) return null;
  const members = db.membersByPoolId[poolId] ?? [];
  const founder = members.find((m) => m.userId === pool.founderUserId) ?? members.find((m) => m.isFounder);
  return { pool, founder, memberCount: members.length };
}

export function getPool(poolId: string): { pool: Pool; members: Member[]; distributions: Distribution[] } | null {
  const db = loadDb();
  const pool = db.pools[poolId];
  if (!pool) return null;
  return {
    pool,
    members: db.membersByPoolId[poolId] ?? [],
    distributions: db.distributionsByPoolId[poolId] ?? [],
  };
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export type CreatePoolInput = {
  name: string;
  founder: { userId: string; displayName: string; walletAddress?: string };
};

// Dummy neighbors to auto-add when creating a pool for realistic splits demo
const DUMMY_NEIGHBORS = [
  { name: 'Tom', wallet: '0x5e6f...7g8h' },
  { name: 'Lisa', wallet: '0x9i0j...1k2l' },
  { name: 'James', wallet: '0x3m4n...5o6p' },
];

export function createPool({ name, founder }: CreatePoolInput): Pool {
  const db = loadDb();
  const poolId = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'pool'}-${Math
    .random()
    .toString(16)
    .slice(2, 6)}`;

  const now = new Date().toISOString();
  const pool: Pool = {
    id: poolId,
    name,
    founderUserId: founder.userId,
    contributionBps: 1000,
    founderBonusBps: 500,
    createdAt: now,
    updatedAt: now,
    totalPooledLifetime: 0,
    lastDistributionAt: undefined,
  };

  const founderMember: Member = {
    userId: founder.userId,
    displayName: founder.displayName,
    walletAddress: founder.walletAddress,
    joinedAt: now,
    isFounder: true,
    lifetimeReceived: 0,
  };

  // Add dummy neighbors so splits look realistic in demo
  const dummyMembers: Member[] = DUMMY_NEIGHBORS.map((neighbor, i) => ({
    userId: `dummy_${neighbor.name.toLowerCase()}_${randomId('u')}`,
    displayName: neighbor.name,
    walletAddress: neighbor.wallet,
    joinedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(), // stagger join dates
    isFounder: false,
    lifetimeReceived: 0,
  }));

  db.pools[poolId] = pool;
  db.membersByPoolId[poolId] = [founderMember, ...dummyMembers];
  db.distributionsByPoolId[poolId] = [];
  saveDb(db);

  // Auto-simulate 3 past distributions so the pool looks alive
  for (let i = 0; i < 3; i++) {
    simulateDistributionWithDate(poolId, new Date(Date.now() - (3 - i) * 7 * 86400000)); // weekly intervals
  }

  return db.pools[poolId]; // return updated pool with distributions
}

export type JoinPoolInput = {
  poolId: string;
  member: { userId: string; displayName: string; walletAddress?: string };
};

export function joinPool({ poolId, member }: JoinPoolInput): { added: boolean } {
  const db = loadDb();
  const pool = db.pools[poolId];
  if (!pool) throw new Error('Pool not found');
  const members = db.membersByPoolId[poolId] ?? [];
  const exists = members.some((m) => m.userId === member.userId);
  if (exists) return { added: false };
  members.push({
    userId: member.userId,
    displayName: member.displayName,
    walletAddress: member.walletAddress,
    joinedAt: new Date().toISOString(),
    isFounder: false,
    lifetimeReceived: 0,
  });
  db.membersByPoolId[poolId] = members;
  pool.updatedAt = new Date().toISOString();
  saveDb(db);
  return { added: true };
}

export function simulateDistribution(poolId: string): Distribution {
  return simulateDistributionWithDate(poolId, new Date());
}

function simulateDistributionWithDate(poolId: string, date: Date): Distribution {
  const db = loadDb();
  const pool = db.pools[poolId];
  if (!pool) throw new Error('Pool not found');
  const members = db.membersByPoolId[poolId] ?? [];
  if (members.length === 0) throw new Error('Pool has no members');

  const poolAmount = Number((40 + Math.random() * 40).toFixed(1)); // 40–80
  const founderBonus = Number((poolAmount * (pool.founderBonusBps / 10_000)).toFixed(1));
  const remainder = poolAmount - founderBonus;
  const perMember = Number((remainder / members.length).toFixed(1));

  const founder = members.find((m) => m.userId === pool.founderUserId) ?? members.find((m) => m.isFounder);
  for (const m of members) {
    const payout = m.userId === founder?.userId ? founderBonus + perMember : perMember;
    m.lifetimeReceived = Number((m.lifetimeReceived + payout).toFixed(1));
  }

  const dist: Distribution = {
    id: randomId('dist'),
    poolId,
    createdAt: date.toISOString(),
    poolAmount,
    memberCount: members.length,
  };

  db.distributionsByPoolId[poolId] = [dist, ...(db.distributionsByPoolId[poolId] ?? [])];
  pool.totalPooledLifetime = Number((pool.totalPooledLifetime + poolAmount).toFixed(1));
  pool.lastDistributionAt = dist.createdAt;
  pool.updatedAt = dist.createdAt;

  saveDb(db);
  return dist;
}

