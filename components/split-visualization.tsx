import React from 'react';
import type { Member, Pool } from '../lib/store';

export function SplitVisualization({ pool, members }: { pool: Pool; members: Member[] }) {
  const founder = members.find((m) => m.userId === pool.founderUserId) ?? members.find((m) => m.isFounder);

  return (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: 20, borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>Distribution Split</span>
          <span style={{ fontSize: 12, color: '#666' }}>mocked</span>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            background: '#fefce8',
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              fontSize: 14,
            }}
          >
            ★
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>Founder Bonus</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {founder ? `${founder.displayName}${founder.walletAddress ? ` (${founder.walletAddress})` : ''}` : 'Founder'}
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{(pool.founderBonusBps / 100).toFixed(0)}%</div>
        </div>

        <div style={{ textAlign: 'center', padding: '4px 0', color: '#ccc' }}>↓</div>

        <div style={{ border: '1px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
          <div
            style={{
              padding: '12px 16px',
              background: '#fafafa',
              borderBottom: '1px solid #e5e5e5',
              fontSize: 12,
              color: '#666',
            }}
          >
            Remaining {(100 - pool.founderBonusBps / 100).toFixed(0)}% split equally
          </div>

          {members.map((member, i) => (
            <div
              key={member.userId}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: i < members.length - 1 ? '1px solid #f0f0f0' : 'none',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: `hsl(${i * 60}, 60%, 80%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  fontSize: 12,
                }}
              >
                🏠
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>
                  {member.displayName}
                  {member.isFounder ? (
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
                </div>
                {member.walletAddress ? <div style={{ fontSize: 12, color: '#999' }}>{member.walletAddress}</div> : null}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>
                {members.length > 0 ? ((100 - pool.founderBonusBps / 100) / members.length).toFixed(2) : '0.00'}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

