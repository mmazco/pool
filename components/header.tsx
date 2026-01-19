'use client';

import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth';

export function Header() {
  const { ready, authenticated, user } = usePrivy();
  const { login } = useLogin();
  const { logout } = useLogout();

  const displayName =
    user?.email?.address?.split('@')[0] ||
    (user as any)?.google?.name ||
    (user as any)?.apple?.name ||
    'User';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        background: 'white',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 100,
      }}
    >
      <a
        href="/"
        style={{
          textDecoration: 'none',
          color: '#111',
          fontWeight: 600,
          fontSize: 15,
        }}
      >
        Fuse Pool
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {!ready ? (
          <span style={{ fontSize: 13, color: '#999' }}>Loading...</span>
        ) : !authenticated ? (
          <button
            onClick={login}
            style={{
              padding: '8px 14px',
              background: '#111',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Log in
          </button>
        ) : (
          <>
            <a
              href="/network"
              style={{
                fontSize: 13,
                color: '#666',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: 6,
                background: '#f5f5f5',
              }}
            >
              Network
            </a>
            <span style={{ fontSize: 13, color: '#666' }}>{displayName}</span>
            <button
              onClick={logout}
              style={{
                padding: '8px 14px',
                background: 'white',
                color: '#666',
                border: '1px solid #e5e5e5',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
