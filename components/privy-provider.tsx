'use client';

import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

export function PrivyAppProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    return (
      <div style={{ padding: 24, maxWidth: 720, margin: '40px auto', color: '#111' }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Missing Privy App ID</h2>
        <p style={{ margin: '8px 0 0 0', color: '#666', lineHeight: 1.5 }}>
          Set <code>NEXT_PUBLIC_PRIVY_APP_ID</code> in <code>.env.local</code> to enable authentication.
        </p>
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#007AFF',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        loginMethods: ['email'],
      }}
    >
      {children}
    </PrivyProvider>
  );
}

