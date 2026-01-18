'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { ensureSeeded, getPoolPreview, joinPool, type PoolPreview } from '../../../lib/store';
import { Card, CardBody, Label, Page, PrimaryButton, Subtitle, Title } from '../../../components/ui';

export default function JoinPoolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const { login } = useLogin();

  const [preview, setPreview] = useState<PoolPreview | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    ensureSeeded();
    const p = getPoolPreview(id);
    setPreview(p);
    setNotFound(!p);
  }, [id]);

  const inviteTitle = useMemo(() => {
    if (!preview) return 'Join a Pool';
    const inviter = preview.founder?.displayName;
    const poolName = preview.pool.name;
    if (inviter) return `${inviter} invited you to join ${poolName}`;
    return `You’ve been invited to join ${poolName}`;
  }, [preview]);

  if (notFound) {
    return (
      <Page>
        <Card>
          <CardBody>
            <Title>Pool not found</Title>
            <Subtitle>This invite link may be invalid or expired.</Subtitle>
          </CardBody>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <Card>
        <CardBody>
          <Label>Invite</Label>
          <Title>{inviteTitle}</Title>
          <Subtitle>
            {preview ? (
              <>
                {preview.memberCount} member{preview.memberCount === 1 ? '' : 's'} · 10% contribution · 5% founder bonus
              </>
            ) : (
              'Loading pool preview…'
            )}
          </Subtitle>

          <div style={{ marginTop: 20, padding: 16, background: '#fafafa', borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#111', marginBottom: 8 }}>Terms</div>
            <TermRow label="Contribution" value="10% of $ENERGY rewards" />
            <TermRow label="Founder bonus" value="5% from each distribution" />
            <TermRow label="Distribution" value="Weekly (mocked)" />
          </div>

          {!ready ? (
            <div style={{ marginTop: 16, color: '#666' }}>Loading…</div>
          ) : !authenticated ? (
            <PrimaryButton onClick={login} style={{ marginTop: 16 }}>
              Log in to join
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={() => {
                if (!user?.id) throw new Error('Missing Privy user');
                const displayName =
                  user?.email?.address?.split('@')[0] ||
                  (user as any)?.google?.name ||
                  (user as any)?.apple?.name ||
                  'Member';
                const walletAddress = (user as any)?.wallet?.address as string | undefined;
                joinPool({ poolId: id, member: { userId: user.id, displayName, walletAddress } });
                router.push(`/pool/${encodeURIComponent(id)}`);
              }}
              style={{ marginTop: 16 }}
            >
              Confirm & join
            </PrimaryButton>
          )}
        </CardBody>
      </Card>
    </Page>
  );
}

function TermRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontSize: 13, color: '#666' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{value}</span>
    </div>
  );
}

