'use client';

import React, { useEffect, useState } from 'react';
import type { Member, Pool } from '../lib/store';

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

export function MemberList({ pool, members, viewerUserId }: { pool: Pool; members: Member[]; viewerUserId?: string }) {
  const isMobile = useIsMobile();
  
  return (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden', background: 'white' }}>
      <div style={{ padding: isMobile ? 16 : 20, borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Members ({members.length})
        </div>
      </div>
      <div style={{ padding: isMobile ? '8px 16px' : '8px 20px' }}>
        {members.map((m, i) => (
          <div
            key={m.userId}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: i < members.length - 1 ? '1px solid #f0f0f0' : 'none',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 12, minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                🏠
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 500, color: '#111', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.displayName}</span>
                  {m.userId === pool.founderUserId || m.isFounder ? (
                    <span
                      style={{
                        fontSize: 10,
                        color: '#999',
                        background: '#f5f5f5',
                        padding: '2px 6px',
                        borderRadius: 4,
                        flexShrink: 0,
                      }}
                    >
                      founder
                    </span>
                  ) : null}
                  {viewerUserId && m.userId === viewerUserId ? (
                    <span style={{ fontSize: 10, color: '#999', flexShrink: 0 }}>(you)</span>
                  ) : null}
                </div>
                {m.walletAddress ? (
                  <div style={{ 
                    fontSize: 11, 
                    color: '#999', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    maxWidth: isMobile ? 120 : 200,
                  }}>
                    {m.walletAddress}
                  </div>
                ) : null}
              </div>
            </div>
            <div style={{ fontSize: isMobile ? 12 : 13, color: '#666', flexShrink: 0, textAlign: 'right' }}>
              {m.lifetimeReceived.toFixed(1)}
              {!isMobile && ' received'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

