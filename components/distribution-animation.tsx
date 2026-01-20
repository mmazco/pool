'use client';

import { useEffect, useState } from 'react';
import type { Pool, Member, Distribution } from '../lib/store';

type DistributionAnimationProps = {
  pool: Pool;
  members: Member[];
  distribution: Distribution;
  onComplete: () => void;
};

type AnimationPhase = 'idle' | 'pool' | 'founder' | 'split' | 'members' | 'complete';

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

export function DistributionAnimation({
  pool,
  members,
  distribution,
  onComplete,
}: DistributionAnimationProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [countedAmount, setCountedAmount] = useState(0);
  const [founderAmount, setFounderAmount] = useState(0);
  const [memberAmounts, setMemberAmounts] = useState<number[]>(members.map(() => 0));
  const isMobile = useIsMobile();

  const totalAmount = distribution.poolAmount;
  const founderBonus = totalAmount * (pool.founderBonusBps / 10_000);
  const remainder = totalAmount - founderBonus;
  const perMember = remainder / members.length;

  const founder = members.find((m) => m.userId === pool.founderUserId) ?? members.find((m) => m.isFounder);

  useEffect(() => {
    // Start animation sequence
    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Show pool amount counting up
    timers.push(setTimeout(() => setPhase('pool'), 200));

    // Count up pool amount
    const countDuration = 800;
    const countSteps = 20;
    const countIncrement = totalAmount / countSteps;
    for (let i = 1; i <= countSteps; i++) {
      timers.push(
        setTimeout(() => {
          setCountedAmount(Math.min(countIncrement * i, totalAmount));
        }, 200 + (countDuration / countSteps) * i)
      );
    }

    // Phase 2: Founder bonus
    timers.push(setTimeout(() => setPhase('founder'), 1200));

    // Count founder bonus
    for (let i = 1; i <= 10; i++) {
      timers.push(
        setTimeout(() => {
          setFounderAmount(Math.min((founderBonus / 10) * i, founderBonus));
        }, 1200 + 50 * i)
      );
    }

    // Phase 3: Split
    timers.push(setTimeout(() => setPhase('split'), 1800));

    // Phase 4: Members
    timers.push(setTimeout(() => setPhase('members'), 2200));

    // Count member amounts
    for (let i = 1; i <= 10; i++) {
      timers.push(
        setTimeout(() => {
          setMemberAmounts(
            members.map((m) => {
              const target = m.userId === founder?.userId ? founderBonus + perMember : perMember;
              return Math.min((target / 10) * i, target);
            })
          );
        }, 2200 + 60 * i)
      );
    }

    // Phase 5: Complete
    timers.push(setTimeout(() => setPhase('complete'), 3200));

    return () => timers.forEach(clearTimeout);
  }, [totalAmount, founderBonus, perMember, members, founder?.userId]);

  const getPhaseOpacity = (targetPhase: AnimationPhase) => {
    const phases: AnimationPhase[] = ['idle', 'pool', 'founder', 'split', 'members', 'complete'];
    const currentIndex = phases.indexOf(phase);
    const targetIndex = phases.indexOf(targetPhase);
    return currentIndex >= targetIndex ? 1 : 0.3;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: isMobile ? 0 : 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && phase === 'complete') onComplete();
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: isMobile ? '16px 16px 0 0' : 16,
          width: '100%',
          maxWidth: isMobile ? '100%' : 400,
          maxHeight: isMobile ? '90vh' : 'auto',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: isMobile ? '16px 20px' : '20px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Distribution
          </div>
          {phase === 'complete' && (
            <button
              onClick={onComplete}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 18,
                color: '#999',
                cursor: 'pointer',
                padding: 8,
                margin: -8,
                minWidth: 44,
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          )}
        </div>

        <div style={{ padding: isMobile ? 20 : 24, overflowY: 'auto', flex: 1 }}>
          {/* Pool total */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: isMobile ? 20 : 24,
              opacity: getPhaseOpacity('pool'),
              transition: 'opacity 0.3s ease',
            }}
          >
            <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Pool Total</div>
            <div
              style={{
                fontSize: isMobile ? 32 : 36,
                fontWeight: 600,
                color: '#111',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {countedAmount.toFixed(1)}
            </div>
            <div style={{ fontSize: 13, color: '#999' }}>$ENERGY</div>
          </div>

          {/* Arrow */}
          <div
            style={{
              textAlign: 'center',
              color: phase === 'founder' || phase === 'split' || phase === 'members' || phase === 'complete' ? '#007AFF' : '#e5e5e5',
              fontSize: 20,
              marginBottom: 16,
              transition: 'color 0.3s ease',
            }}
          >
            ↓
          </div>

          {/* Founder bonus */}
          <div
            style={{
              padding: '12px 16px',
              background: '#fefce8',
              borderRadius: 8,
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: getPhaseOpacity('founder'),
              transition: 'opacity 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                }}
              >
                *
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>Founder Bonus</div>
                <div style={{ fontSize: 11, color: '#999' }}>{founder?.displayName}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111', fontVariantNumeric: 'tabular-nums' }}>
              +{founderAmount.toFixed(1)}
            </div>
          </div>

          {/* Arrow */}
          <div
            style={{
              textAlign: 'center',
              color: phase === 'split' || phase === 'members' || phase === 'complete' ? '#007AFF' : '#e5e5e5',
              fontSize: 20,
              marginBottom: 8,
              transition: 'color 0.3s ease',
            }}
          >
            ↓
          </div>

          {/* Split header */}
          <div
            style={{
              fontSize: 12,
              color: '#666',
              marginBottom: 8,
              opacity: getPhaseOpacity('split'),
              transition: 'opacity 0.3s ease',
            }}
          >
            Remaining {(100 - pool.founderBonusBps / 100).toFixed(0)}% split equally
          </div>

          {/* Members */}
          <div
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: 8,
              overflow: 'hidden',
              opacity: getPhaseOpacity('members'),
              transition: 'opacity 0.3s ease',
            }}
          >
            {members.map((member, i) => (
              <div
                key={member.userId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderBottom: i < members.length - 1 ? '1px solid #f0f0f0' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: `hsl(${i * 60 + 30}, 60%, 80%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                    }}
                  >
                    {member.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, color: '#111' }}>{member.displayName}</span>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#007AFF',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  +{memberAmounts[i]?.toFixed(1) ?? '0.0'}
                </span>
              </div>
            ))}
          </div>

          {/* Complete button */}
          {phase === 'complete' && (
            <button
              onClick={onComplete}
              style={{
                width: '100%',
                marginTop: 20,
                padding: isMobile ? '14px 16px' : '12px 16px',
                background: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                minHeight: 48,
              }}
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
