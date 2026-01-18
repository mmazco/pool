'use client';

import { AuthGate } from '../../components/auth-gate';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPool, ensureSeeded, getPoolPreview } from '../../lib/store';
import { usePrivy } from '@privy-io/react-auth';
import { InviteActions } from '../../components/invite-actions';
import { Card, CardBody, Label, Page, PrimaryButton, Subtitle, Title } from '../../components/ui';

export default function CreatePoolPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createdId = searchParams.get('created');

  const { user } = usePrivy();
  const [poolName, setPoolName] = useState('Bristol Gardens');

  const inviteLink = useMemo(() => {
    if (!createdId) return null;
    if (typeof window === 'undefined') return `/join/${createdId}`;
    return new URL(`/join/${createdId}`, window.location.origin).toString();
  }, [createdId]);

  return (
    <AuthGate title="Create a Pool" subtitle="Log in to create a Pool and invite neighbors to earn together.">
      <CreatePoolInner
        poolName={poolName}
        setPoolName={setPoolName}
        createdId={createdId}
        inviteLink={inviteLink}
        onCreate={() => {
          ensureSeeded();
          if (!user?.id) throw new Error('Missing Privy user');
          const displayName =
            user?.email?.address?.split('@')[0] ||
            (user as any)?.google?.name ||
            (user as any)?.apple?.name ||
            'Member';
          const walletAddress = (user as any)?.wallet?.address as string | undefined;
          const pool = createPool({ name: poolName.trim() || 'New Pool', founder: { userId: user.id, displayName, walletAddress } });
          router.replace(`/create?created=${encodeURIComponent(pool.id)}`);
        }}
        onGoToDashboard={() => {
          if (!createdId) return;
          router.push(`/pool/${encodeURIComponent(createdId)}`);
        }}
      />
    </AuthGate>
  );
}

function CreatePoolInner({
  poolName,
  setPoolName,
  createdId,
  inviteLink,
  onCreate,
  onGoToDashboard,
}: {
  poolName: string;
  setPoolName: (v: string) => void;
  createdId: string | null;
  inviteLink: string | null;
  onCreate: () => void;
  onGoToDashboard: () => void;
}) {
  const [createdPoolName, setCreatedPoolName] = useState<string>('Your Pool');

  useEffect(() => {
    if (!createdId) return;
    ensureSeeded();
    const p = getPoolPreview(createdId);
    if (p?.pool?.name) setCreatedPoolName(p.pool.name);
  }, [createdId]);

  if (createdId && inviteLink) {
    return (
      <Page>
        <Card>
          <CardBody>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: '#f0fdf4',
                  borderRadius: '50%',
                  margin: '0 auto 16px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                }}
              >
                ✓
              </div>
              <Title>Pool Created!</Title>
              <Subtitle>Your Pool is ready. Invite neighbors to start earning together.</Subtitle>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 6 }}>Invite link</div>
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
                }}
              />
            </div>

            <InviteActions inviteLink={inviteLink} poolName={createdPoolName} />

            <PrimaryButton onClick={onGoToDashboard} style={{ marginTop: 12 }}>
              Go to Dashboard
            </PrimaryButton>
          </CardBody>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <Card>
        <CardBody>
          <Label>New Pool</Label>
          <Title>Create a Pool</Title>
          <Subtitle>Start a Pool with your neighbors. You’ll be the founder and earn a 5% bonus on all distributions.</Subtitle>

          <div style={{ marginTop: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#333', display: 'block', marginBottom: 8 }}>Pool name</label>
            <input
              value={poolName}
              onChange={(e) => setPoolName(e.target.value)}
              placeholder="e.g., Bristol Gardens"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: 15,
                border: '1px solid #e5e5e5',
                borderRadius: 8,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginTop: 24, padding: 16, background: '#fafafa', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
              Pool Settings
            </div>
            <Row label="Member contribution" value="10% of rewards" />
            <Row label="Founder bonus" value="5% of pool" />
            <Row label="Distribution" value="Weekly" />
          </div>

          <PrimaryButton onClick={onCreate} style={{ marginTop: 24, background: '#007AFF' }}>
            Create Pool
          </PrimaryButton>
        </CardBody>
      </Card>
    </Page>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <span style={{ fontSize: 13, color: '#666' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{value}</span>
    </div>
  );
}

