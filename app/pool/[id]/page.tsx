'use client';

import { AuthGate } from '../../../components/auth-gate';
import { use, useEffect, useMemo, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ensureSeeded, getPool, simulateDistribution, type Distribution, type Member, type Pool } from '../../../lib/store';
import { MemberList } from '../../../components/member-list';
import { SplitVisualization } from '../../../components/split-visualization';
import { InviteActions } from '../../../components/invite-actions';
import { ForecastCard } from '../../../components/forecast-card';
import { DistributionAnimation } from '../../../components/distribution-animation';

export default function PoolDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AuthGate title="View Pool" subtitle="Log in to view this Pool dashboard.">
      <PoolDashboardInner poolId={id} />
    </AuthGate>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function PoolDashboardInner({ poolId }: { poolId: string }) {
  const { user } = usePrivy();
  const [pool, setPool] = useState<Pool | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [animatingDist, setAnimatingDist] = useState<Distribution | null>(null);
  const isMobile = useIsMobile();

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
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: 520, background: 'white', border: '1px solid #e5e5e5', borderRadius: 16, padding: isMobile ? 20 : 24 }}>
          <h1 style={{ margin: 0, fontSize: isMobile ? 20 : 22, fontWeight: 600, color: '#111' }}>Pool not found</h1>
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
    <main style={{ minHeight: '100vh', padding: isMobile ? '24px 16px' : '40px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 900 }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'stretch' : 'flex-start', 
          gap: 16, 
          marginBottom: isMobile ? 24 : 32 
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Pool</div>
            <h1 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 600, color: '#111', margin: 0 }}>{pool.name}</h1>
          </div>
          <button
            onClick={() => {
              const dist = simulateDistribution(pool.id);
              setAnimatingDist(dist);
            }}
            style={{
              padding: isMobile ? '12px 16px' : '10px 14px',
              background: '#111',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              minHeight: 44,
            }}
          >
            Simulate distribution
          </button>
        </div>

        {showInvite ? (
          <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, padding: isMobile ? 12 : 16, marginBottom: isMobile ? 16 : 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: '#999' }}>Invite link</div>
              <button
                onClick={() => setShowInvite(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px 8px',
                  fontSize: 18,
                  color: '#999',
                  cursor: 'pointer',
                  lineHeight: 1,
                  minWidth: 44,
                  minHeight: 44,
                }}
                aria-label="Close invite panel"
              >
                ×
              </button>
            </div>
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
                fontSize: isMobile ? 13 : 14,
                marginBottom: 12,
              }}
            />
            <InviteActions inviteLink={inviteLink} poolName={pool.name} />
          </div>
        ) : null}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: isMobile ? 12 : 16, 
          marginBottom: isMobile ? 16 : 24 
        }}>
          <StatCard label="Pool Balance" value={pool.totalPooledLifetime.toFixed(1)} sub="$ENERGY" isMobile={isMobile} />
          <StatCard
            label="Your Share"
            value={`${yourShare >= 0 ? '+' : ''}${yourShare.toFixed(1)}`}
            sub={lastDist ? 'last distribution' : 'no distributions yet'}
            valueColor="#007AFF"
            isMobile={isMobile}
          />
        </div>

        {/* Growth Forecast - prominent placement */}
        <div style={{ marginBottom: isMobile ? 16 : 24 }}>
          <ForecastCard
            pool={pool}
            members={members}
            isFounder={isFounder}
            onInvite={() => setShowInvite(true)}
            onRedeem={() => alert('Redeem flow coming soon! Your $ENERGY would be sent to your wallet.')}
            redeemableAmount={viewer?.lifetimeReceived ?? yourShare}
          />
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, marginBottom: isMobile ? 16 : 24, overflow: 'hidden' }}>
          <SplitVisualization pool={pool} members={members} />
        </div>

        <div style={{ marginBottom: isMobile ? 16 : 24 }}>
          <MemberList pool={pool} members={members} viewerUserId={user?.id} />
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden', marginBottom: isMobile ? 16 : 24 }}>
          <div style={{ padding: isMobile ? 16 : 20, borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>Recent Distributions</div>
          </div>
          <div style={{ padding: isMobile ? '8px 16px' : '8px 20px' }}>
            {distributions.length === 0 ? (
              <div style={{ padding: '12px 0', fontSize: 14, color: '#666' }}>No distributions yet.</div>
            ) : (
              distributions.slice(0, 5).map((d, i) => (
                <div
                  key={d.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: i < Math.min(4, distributions.length - 1) ? '1px solid #f0f0f0' : 'none',
                  }}
                >
                  <span style={{ fontSize: 14, color: '#666' }}>{formatDate(d.createdAt)}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#007AFF' }}>+{d.poolAmount.toFixed(1)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Distribution Animation Modal */}
      {animatingDist && (
        <DistributionAnimation
          pool={pool}
          members={members}
          distribution={animatingDist}
          onComplete={() => {
            setAnimatingDist(null);
            refresh();
          }}
        />
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  sub,
  valueColor = '#111',
  isMobile = false,
}: {
  label: string;
  value: string;
  sub: string;
  valueColor?: string;
  isMobile?: boolean;
}) {
  return (
    <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, padding: isMobile ? 16 : 20 }}>
      <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: isMobile ? 28 : 32, fontWeight: 600, color: valueColor, marginTop: 8 }}>{value}</div>
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

