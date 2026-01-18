import React from 'react';
import type { Member, Pool } from '../lib/store';

export function MemberList({ pool, members, viewerUserId }: { pool: Pool; members: Member[]; viewerUserId?: string }) {
  return (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: 20, borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Members ({members.length})
        </div>
      </div>
      <div style={{ padding: '8px 20px' }}>
        {members.map((m, i) => (
          <div
            key={m.userId}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: i < members.length - 1 ? '1px solid #f0f0f0' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                }}
              >
                🏠
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>
                  {m.displayName}
                  {m.userId === pool.founderUserId || m.isFounder ? (
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: 10,
                        color: '#999',
                        background: '#f5f5f5',
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      founder
                    </span>
                  ) : null}
                  {viewerUserId && m.userId === viewerUserId ? (
                    <span style={{ marginLeft: 6, fontSize: 10, color: '#999' }}>(you)</span>
                  ) : null}
                </div>
                {m.walletAddress ? <div style={{ fontSize: 12, color: '#999' }}>{m.walletAddress}</div> : null}
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#666' }}>{m.lifetimeReceived.toFixed(1)} received</div>
          </div>
        ))}
      </div>
    </div>
  );
}

