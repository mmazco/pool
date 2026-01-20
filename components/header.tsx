'use client';

import { useState, useEffect } from 'react';
import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth';

export function Header() {
  const { ready, authenticated, user } = usePrivy();
  const { login } = useLogin();
  const { logout } = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when clicking outside or on navigation
  useEffect(() => {
    if (mobileMenuOpen) {
      const handleClickOutside = () => setMobileMenuOpen(false);
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  const displayName =
    user?.email?.address?.split('@')[0] ||
    (user as any)?.google?.name ||
    (user as any)?.apple?.name ||
    'User';

  return (
    <>
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
          padding: '0 16px',
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

        {/* Desktop navigation */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
        )}

        {/* Mobile hamburger button */}
        {isMobile && ready && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            style={{
              padding: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
            aria-label="Toggle menu"
          >
            <span
              style={{
                width: 20,
                height: 2,
                background: '#111',
                borderRadius: 1,
                transition: 'transform 0.2s ease',
                transform: mobileMenuOpen ? 'rotate(45deg) translateY(6px)' : 'none',
              }}
            />
            <span
              style={{
                width: 20,
                height: 2,
                background: '#111',
                borderRadius: 1,
                transition: 'opacity 0.2s ease',
                opacity: mobileMenuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                width: 20,
                height: 2,
                background: '#111',
                borderRadius: 1,
                transition: 'transform 0.2s ease',
                transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
              }}
            />
          </button>
        )}
      </header>

      {/* Mobile dropdown menu */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 56,
            left: 0,
            right: 0,
            background: 'white',
            borderBottom: '1px solid #e5e5e5',
            padding: 16,
            zIndex: 99,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {!authenticated ? (
            <button
              onClick={() => {
                login();
                setMobileMenuOpen(false);
              }}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#111',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Log in
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  padding: '12px 0',
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: 14,
                  color: '#666',
                }}
              >
                Signed in as <strong style={{ color: '#111' }}>{displayName}</strong>
              </div>
              <a
                href="/network"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '14px 16px',
                  background: '#f5f5f5',
                  color: '#111',
                  textDecoration: 'none',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 500,
                  textAlign: 'center',
                }}
              >
                Network
              </a>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'white',
                  color: '#666',
                  border: '1px solid #e5e5e5',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
