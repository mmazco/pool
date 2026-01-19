'use client';

import { useMemo } from 'react';
import type { Pool, Member } from '../lib/store';

type ForecastCardProps = {
  pool: Pool;
  members: Member[];
  isFounder: boolean;
  onInvite?: () => void;
  onRedeem?: () => void;
  redeemableAmount?: number;
};

export function ForecastCard({ pool, members, isFounder, onInvite, onRedeem, redeemableAmount = 0 }: ForecastCardProps) {
  const currentCount = members.length;

  // Assume average weekly contribution per member is ~50 $ENERGY (10% of ~500 earned)
  const avgContributionPerMember = 50;

  const projections = useMemo(() => {
    const scenarios = [
      { neighbors: currentCount },
      { neighbors: Math.max(currentCount + 2, 6) },
      { neighbors: Math.max(currentCount + 4, 10) },
      { neighbors: Math.max(currentCount + 8, 15) },
    ];

    return scenarios.map(({ neighbors }) => {
      const poolTotal = neighbors * avgContributionPerMember;
      const founderBonus = poolTotal * (pool.founderBonusBps / 10_000);
      const remainder = poolTotal - founderBonus;
      const perMember = remainder / neighbors;
      const yourShare = isFounder ? founderBonus + perMember : perMember;

      return {
        neighbors,
        poolTotal: Math.round(poolTotal * 10) / 10,
        yourShare: Math.round(yourShare * 10) / 10,
      };
    });
  }, [currentCount, pool.founderBonusBps, isFounder]);

  const current = projections[0];
  const future = projections.slice(1);

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e5e5e5',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: 20, borderBottom: '1px solid #f0f0f0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Growth Forecast
          </div>
          <div
            style={{
              fontSize: 11,
              color: '#007AFF',
              fontWeight: 500,
            }}
          >
            Weekly projection
          </div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* Current state */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: '#EBF5FF',
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>
              Current: {current.neighbors} neighbors
            </div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
              Your weekly share
            </div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#007AFF' }}>
            ~{current.yourShare} $ENERGY
          </div>
        </div>

        {/* Future projections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {future.map((proj) => {
            const growth = ((proj.yourShare - current.yourShare) / current.yourShare) * 100;
            return (
              <div
                key={proj.neighbors}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  background: '#fafafa',
                  borderRadius: 8,
                }}
              >
                <div style={{ fontSize: 14, color: '#666' }}>
                  With {proj.neighbors} neighbors
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>
                    ~{proj.yourShare}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: '#007AFF',
                      fontWeight: 500,
                      background: '#EBF5FF',
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    +{Math.round(growth)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {onInvite && (
            <button
              onClick={onInvite}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'white',
                color: '#111',
                border: '1px solid #e5e5e5',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Invite neighbors
            </button>
          )}
          {onRedeem && (
            <button
              onClick={onRedeem}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Redeem {redeemableAmount > 0 ? `${redeemableAmount.toFixed(1)}` : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
