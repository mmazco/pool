'use client';

import React from 'react';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { Card, CardBody, Label, Page, PrimaryButton, Subtitle, Title } from './ui';

export function AuthGate({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin();

  if (!ready) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 40 }}>
        <div style={{ color: '#666' }}>Loading…</div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <Page>
        <Card>
          <CardBody>
            <Label>Sign in</Label>
            <Title>{title}</Title>
            {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
            <PrimaryButton onClick={login} style={{ marginTop: 16 }}>
              Log in
            </PrimaryButton>
          </CardBody>
        </Card>
      </Page>
    );
  }

  return <>{children}</>;
}

