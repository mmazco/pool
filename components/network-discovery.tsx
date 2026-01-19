'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { createPool, joinPool, loadDb, saveDb } from '../lib/store';

type DiscoveredNode = {
  id: string;
  name: string;
  type: 'house' | 'pool';
  poolName?: string;
  poolId?: string;
  memberCount?: number;
  distance: number; // 0-1, affects position
  angle: number; // radians
  discoveredAt: number;
};

// Mock nearby houses/pools to discover
const MOCK_NEARBY: Omit<DiscoveredNode, 'discoveredAt'>[] = [
  { id: 'h1', name: 'The Johnsons', type: 'house', distance: 0.3, angle: 0.5 },
  { id: 'h2', name: 'Unit 4B', type: 'house', distance: 0.45, angle: 1.8 },
  { id: 'h3', name: 'The Garcias', type: 'house', distance: 0.55, angle: 3.2 },
  { id: 'p1', name: 'Maple Street Pool', type: 'pool', poolId: 'maple-st', poolName: 'Maple Street', memberCount: 7, distance: 0.6, angle: 4.5 },
  { id: 'h4', name: '12 Oak Lane', type: 'house', distance: 0.7, angle: 5.8 },
  { id: 'h5', name: 'The Nguyens', type: 'house', distance: 0.4, angle: 2.5 },
  { id: 'p2', name: 'Green Valley Collective', type: 'pool', poolId: 'green-valley', poolName: 'Green Valley', memberCount: 12, distance: 0.8, angle: 1.2 },
  { id: 'h6', name: 'Flat 7', type: 'house', distance: 0.35, angle: 4.0 },
];

type ScanPhase = 'idle' | 'scanning' | 'complete';

export function NetworkDiscovery() {
  const router = useRouter();
  const { user } = usePrivy();
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [scanAngle, setScanAngle] = useState(0);
  const [discovered, setDiscovered] = useState<DiscoveredNode[]>([]);
  const [selected, setSelected] = useState<DiscoveredNode | null>(null);
  const [inviteSent, setInviteSent] = useState<Set<string>>(new Set());
  const [joinRequested, setJoinRequested] = useState<Set<string>>(new Set());

  const startScan = useCallback(() => {
    setPhase('scanning');
    setDiscovered([]);
    setScanAngle(0);
    setSelected(null);
  }, []);

  // Scanning animation
  useEffect(() => {
    if (phase !== 'scanning') return;

    const scanDuration = 4000; // 4 seconds for full scan
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / scanDuration, 1);
      const currentAngle = progress * Math.PI * 2;
      setScanAngle(currentAngle);

      // Discover nodes as scan passes them
      MOCK_NEARBY.forEach((node) => {
        const nodeAngle = node.angle % (Math.PI * 2);
        const angleDiff = Math.abs(currentAngle - nodeAngle);
        if (angleDiff < 0.3 || angleDiff > Math.PI * 2 - 0.3) {
          setDiscovered((prev) => {
            if (prev.some((d) => d.id === node.id)) return prev;
            return [...prev, { ...node, discoveredAt: Date.now() }];
          });
        }
      });

      if (progress >= 1) {
        clearInterval(interval);
        setPhase('complete');
      }
    }, 50);

    return () => clearInterval(interval);
  }, [phase]);

  const handleInvite = (node: DiscoveredNode) => {
    setInviteSent((prev) => new Set(prev).add(node.id));
    // In a real app, this would send an invite
  };

  const handleJoinPool = (node: DiscoveredNode) => {
    if (!node.poolId || !user?.id) return;
    
    // Create the pool in our mock store if it doesn't exist
    const db = loadDb();
    if (!db.pools[node.poolId]) {
      // Create a mock pool for demo
      const pool = {
        id: node.poolId,
        name: node.poolName || node.name,
        founderUserId: 'founder_' + node.poolId,
        contributionBps: 1000,
        founderBonusBps: 500,
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        totalPooledLifetime: Math.round(Math.random() * 500 + 200),
        lastDistributionAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      };
      db.pools[node.poolId] = pool;
      
      // Add some mock members
      const mockMembers = [
        { userId: 'founder_' + node.poolId, displayName: 'Original Founder', isFounder: true },
        { userId: 'member_1_' + node.poolId, displayName: 'Alex', isFounder: false },
        { userId: 'member_2_' + node.poolId, displayName: 'Sam', isFounder: false },
      ];
      db.membersByPoolId[node.poolId] = mockMembers.map((m, i) => ({
        ...m,
        joinedAt: new Date(Date.now() - (30 - i * 5) * 86400000).toISOString(),
        lifetimeReceived: Math.round(Math.random() * 100 + 50),
        walletAddress: `0x${Math.random().toString(16).slice(2, 10)}...`,
      }));
      db.distributionsByPoolId[node.poolId] = [];
      saveDb(db);
    }

    // Join the pool
    const displayName = user?.email?.address?.split('@')[0] || 'Member';
    joinPool({
      poolId: node.poolId,
      member: {
        userId: user.id,
        displayName,
        walletAddress: (user as any)?.wallet?.address,
      },
    });

    setJoinRequested((prev) => new Set(prev).add(node.id));
    
    // Navigate to the pool
    setTimeout(() => {
      router.push(`/pool/${node.poolId}`);
    }, 800);
  };

  const handleCreatePoolWithInvites = () => {
    if (!user?.id) return;
    
    const displayName = user?.email?.address?.split('@')[0] || 'Founder';
    const pool = createPool({
      name: 'My Neighborhood Pool',
      founder: {
        userId: user.id,
        displayName,
        walletAddress: (user as any)?.wallet?.address,
      },
    });
    
    router.push(`/pool/${pool.id}`);
  };

  const houses = discovered.filter((d) => d.type === 'house');
  const pools = discovered.filter((d) => d.type === 'pool');

  return (
    <main style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 800 }}>
        <button
          onClick={() => router.back()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            padding: 0,
            marginBottom: 16,
            fontSize: 14,
            color: '#007AFF',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
            Energy Network
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#111', margin: 0 }}>Discover Neighbors</h1>
          <p style={{ fontSize: 14, color: '#666', marginTop: 8, lineHeight: 1.5 }}>
            Find other Fuse households in your area. Invite them to your Pool or join an existing one.
          </p>
        </div>

        {/* Radar visualization */}
        <div
          style={{
            background: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: 16,
            padding: 32,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 400,
              aspectRatio: '1',
              margin: '0 auto',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #EBF5FF 0%, #fafafa 100%)',
              border: '2px solid #e5e5e5',
              overflow: 'hidden',
            }}
          >
            {/* Grid circles */}
            {[0.33, 0.66, 1].map((r) => (
              <div
                key={r}
                style={{
                  position: 'absolute',
                  top: `${50 - r * 50}%`,
                  left: `${50 - r * 50}%`,
                  width: `${r * 100}%`,
                  height: `${r * 100}%`,
                  borderRadius: '50%',
                  border: '1px solid #e5e5e5',
                  pointerEvents: 'none',
                }}
              />
            ))}

            {/* Scan line */}
            {phase === 'scanning' && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '50%',
                  height: 2,
                  background: 'linear-gradient(90deg, #007AFF 0%, transparent 100%)',
                  transformOrigin: 'left center',
                  transform: `rotate(${scanAngle}rad)`,
                  boxShadow: '0 0 20px #007AFF',
                }}
              />
            )}

            {/* Center (You) */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 12,
                fontWeight: 600,
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              You
            </div>

            {/* Discovered nodes */}
            {discovered.map((node) => {
              const x = 50 + Math.cos(node.angle) * node.distance * 45;
              const y = 50 + Math.sin(node.angle) * node.distance * 45;
              const isPool = node.type === 'pool';
              const isSelected = selected?.id === node.id;

              return (
                <button
                  key={node.id}
                  onClick={() => setSelected(isSelected ? null : node)}
                  style={{
                    position: 'absolute',
                    top: `${y}%`,
                    left: `${x}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isPool ? 56 : 40,
                    height: isPool ? 56 : 40,
                    borderRadius: isPool ? 12 : '50%',
                    background: '#007AFF',
                    border: isSelected ? '3px solid #111' : '2px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: isPool ? 11 : 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    animation: 'fadeIn 0.3s ease',
                    zIndex: isSelected ? 5 : 1,
                  }}
                >
                  {isPool ? `${node.memberCount}` : '🏠'}
                </button>
              );
            })}
          </div>

          {/* Scan button / status */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            {phase === 'idle' && (
              <button
                onClick={startScan}
                style={{
                  padding: '14px 32px',
                  background: '#111',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Start scanning
              </button>
            )}
            {phase === 'scanning' && (
              <div style={{ color: '#007AFF', fontSize: 14, fontWeight: 500 }}>
                <span style={{ display: 'inline-block', animation: 'pulse 1s infinite' }}>●</span>
                {' '}Scanning for neighbors...
              </div>
            )}
            {phase === 'complete' && (
              <div style={{ color: '#666', fontSize: 14 }}>
                Found <strong>{houses.length}</strong> house{houses.length !== 1 ? 's' : ''} and{' '}
                <strong>{pools.length}</strong> pool{pools.length !== 1 ? 's' : ''} nearby
              </div>
            )}
          </div>
        </div>

        {/* Selected node details */}
        {selected && (
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    background: '#EBF5FF',
                    color: '#007AFF',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  {selected.type === 'pool' ? 'Pool' : 'House'}
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111' }}>{selected.name}</h3>
                {selected.type === 'pool' && (
                  <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#666' }}>
                    {selected.memberCount} members · Est. ~{Math.round((selected.memberCount || 1) * 15)} $ENERGY/week
                  </p>
                )}
              </div>

              <div>
                {selected.type === 'house' ? (
                  inviteSent.has(selected.id) ? (
                    <span style={{ fontSize: 13, color: '#007AFF', fontWeight: 500 }}>Invite sent</span>
                  ) : (
                    <button
                      onClick={() => handleInvite(selected)}
                      style={{
                        padding: '10px 16px',
                        background: '#007AFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Invite to my Pool
                    </button>
                  )
                ) : joinRequested.has(selected.id) ? (
                  <span style={{ fontSize: 13, color: '#007AFF', fontWeight: 500 }}>Joining...</span>
                ) : (
                  <button
                    onClick={() => handleJoinPool(selected)}
                    style={{
                      padding: '10px 16px',
                      background: '#007AFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Join this Pool
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results list */}
        {phase === 'complete' && discovered.length > 0 && (
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Discovered ({discovered.length})
              </div>
            </div>
            <div>
              {discovered.map((node, i) => (
                <button
                  key={node.id}
                  onClick={() => setSelected(node)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '12px 16px',
                    background: selected?.id === node.id ? '#fafafa' : 'white',
                    border: 'none',
                    borderBottom: i < discovered.length - 1 ? '1px solid #f0f0f0' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: node.type === 'pool' ? 8 : '50%',
                        background: '#007AFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: node.type === 'pool' ? 11 : 14,
                      }}
                    >
                      {node.type === 'pool' ? node.memberCount : '🏠'}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{node.name}</div>
                      <div style={{ fontSize: 12, color: '#999' }}>
                        {node.type === 'pool' ? `${node.memberCount} members` : 'Individual house'}
                      </div>
                    </div>

                  </div>
                  <div style={{ fontSize: 12, color: '#999' }}>
                    {node.type === 'house'
                      ? inviteSent.has(node.id)
                        ? 'Invited'
                        : 'Tap to invite'
                      : joinRequested.has(node.id)
                      ? 'Joined'
                      : 'Tap to join'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Create pool CTA */}
        {phase === 'complete' && houses.length > 0 && (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button
              onClick={handleCreatePoolWithInvites}
              style={{
                padding: '14px 24px',
                background: '#111',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Create new Pool & invite all
            </button>
            <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
              Start your own neighborhood Pool and invite discovered houses
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </main>
  );
}
