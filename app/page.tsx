'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PoolOnboardingPopup } from '../components/onboarding-popup';
import { Card, CardBody, Label, Page, PrimaryButton, SecondaryButton, Subtitle, Title } from '../components/ui';
import { ensureSeeded } from '../lib/store';

export default function LandingPage() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    ensureSeeded();
  }, []);

  return (
    <>
      <Page>
        <Card>
          <CardBody>
            <Label>Fuse Energy</Label>
            <Title>Collective Pool</Title>
            <Subtitle>Pool $ENERGY rewards with neighbors and earn together (demo).</Subtitle>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
              <PrimaryButton onClick={() => router.push('/create')}>Create a Pool</PrimaryButton>
              <SecondaryButton
                onClick={() => {
                  const input = window.prompt('Paste invite link or pool id');
                  if (!input) return;
                  const match = input.match(/\/join\/([^/?#]+)/);
                  const poolId = match?.[1] ?? input.trim();
                  router.push(`/join/${encodeURIComponent(poolId)}`);
                }}
              >
                Join with invite link
              </SecondaryButton>

              <button
                onClick={() => setShowOnboarding(true)}
                style={{
                  marginTop: 8,
                  background: 'none',
                  border: 'none',
                  color: '#007AFF',
                  fontSize: 14,
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: 0,
                }}
              >
                How it works →
              </button>
            </div>
          </CardBody>
        </Card>
      </Page>

      <PoolOnboardingPopup
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onCreatePool={() => {
          setShowOnboarding(false);
          router.push('/create');
        }}
        onJoinWithInvite={() => {
          setShowOnboarding(false);
          const input = window.prompt('Paste invite link or pool id');
          if (!input) return;
          const match = input.match(/\/join\/([^/?#]+)/);
          const poolId = match?.[1] ?? input.trim();
          router.push(`/join/${encodeURIComponent(poolId)}`);
        }}
      />
    </>
  );
}

