'use client';

import { AuthGate } from '../../../components/auth-gate';
import { use, useEffect, useMemo, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ensureSeeded, getPool, simulateDistribution, type Distribution, type Member, type Pool } from '../../../lib/store';
import { MemberList } from '../../../components/member-list';
import { SplitVisualization } from '../../../components/split-visualization';
import { InviteActions } from '../../../components/invite-actions';

export default function PoolDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AuthGate title="View Pool" subtitle="Log in to view this Pool dashboard.">
      <PoolDashboardInner poolId={id} />
    </AuthGate>
  );
}

function PoolDashboardInner({ poolId }: { poolId: string }) {
  const { user } = usePrivy();
  const [pool, setPool] = useState<Pool | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const refresh = () => {
    ensureSeeded();
    const data = getPool(poolId);
    if (!data) {
      setNotFound(true);
      setPool(null);
      setMembers([]);
      setDistributions([]);
      return;
    }
    setNotFound(false);
    setPool(data.pool);
    setMembers(data.members);
    setDistributions(data.distributions);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolId]);

  const viewer = useMemo(() => members.find((m) => m.userId === user?.id), [members, user?.id]);
  const isFounder = viewer?.userId && pool?.founderUserId ? viewer.userId === pool.founderUserId : viewer?.isFounder ?? false;

  const lastDist = distributions[0];
  const lastDistAmount = lastDist?.poolAmount ?? 0;
  const founderBonus = pool ? lastDistAmount * (pool.founderBonusBps / 10_000) : 0;
  const remainder = lastDistAmount - founderBonus;
  const perMember = members.length > 0 ? remainder / members.length : 0;
  const yourShare = isFounder ? founderBonus + perMember : perMember;

  if (notFound) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 520, background: 'white', border: '1px solid #e5e5e5', borderRadius: 16, padding: 24 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#111' }}>Pool not found</h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#666', lineHeight: 1.5 }}>
            This Pool may not exist on this device yet. Try opening the invite link first, or create a new Pool.
          </p>
        </div>
      </main>
    );
  }

  if (!pool) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 40 }}>
        <div style={{ color: '#666' }}>Loading…</div>
      </main>
    );
  }

  const inviteLink = typeof window === 'undefined' ? `/join/${pool.id}` : new URL(`/join/${pool.id}`, window.location.origin).toString();

  return (
    <main style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Pool</div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: '#111', margin: 0 }}>{pool.name}</h1>
          </div>
          <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end' }}>
            <button
              onClick={() => setShowInvite((v) => !v)}
              style={{
                padding: '10px 14px',
                background: 'white',
                color: '#111',
                border: '1px solid #e5e5e5',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                height: 40,
              }}
            >
              Invite neighbors
            </button>
            <button
              onClick={() => {
                simulateDistribution(pool.id);
                refresh();
              }}
              style={{
                padding: '10px 14px',
                background: '#111',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                height: 40,
              }}
            >
              Simulate distribution
            </button>
          </div>
        </div>

        {showInvite ? (
          <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>Invite link</div>
            <input
              value={inviteLink}
              readOnly
              style={{
                width: '100%',
                padding: '12px 12px',
                border: '1px solid #e5e5e5',
                borderRadius: 8,
                background: '#fafafa',
                color: '#666',
                marginBottom: 12,
              }}
            />
            <InviteActions inviteLink={inviteLink} poolName={pool.name} />
          </div>
        ) : null}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <StatCard label="Pool Balance" value={pool.totalPooledLifetime.toFixed(1)} sub="$ENERGY" />
          <StatCard
            label="Your Share"
            value={`${yourShare >= 0 ? '+' : ''}${yourShare.toFixed(1)}`}
            sub={lastDist ? 'last distribution' : 'no distributions yet'}
            valueColor="#22c55e"
          />
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, marginBottom: 24, overflow: 'hidden' }}>
          <SplitVisualization pool={pool} members={members} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <MemberList pool={pool} members={members} viewerUserId={user?.id} />
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: 20, borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>Recent Distributions</div>
          </div>
          <div style={{ padding: '8px 20px' }}>
            {distributions.length === 0 ? (
              <div style={{ padding: '12px 0', fontSize: 14, color: '#666' }}>No distributions yet.</div>
            ) : (
              distributions.slice(0, 6).map((d, i) => (
                <div
                  key={d.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: i < Math.min(5, distributions.length - 1) ? '1px solid #f0f0f0' : 'none',
                  }}
                >
                  <span style={{ fontSize: 14, color: '#666' }}>{formatDate(d.createdAt)}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#22c55e' }}>+{d.poolAmount.toFixed(1)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  sub,
  valueColor = '#111',
}: {
  label: string;
  value: string;
  sub: string;
  valueColor?: string;
}) {
  return (
    <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 600, color: valueColor, marginTop: 8 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#999' }}>{sub}</div>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

