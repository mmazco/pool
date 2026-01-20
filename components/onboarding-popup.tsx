'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { PrimaryButton, SecondaryButton } from './ui';

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

export function PoolOnboardingPopup({
  open,
  onClose,
  onCreatePool,
  onJoinWithInvite,
}: {
  open: boolean;
  onClose: () => void;
  onCreatePool: () => void;
  onJoinWithInvite: () => void;
}) {
  const [step, setStep] = useState(0);
  const isMobile = useIsMobile();

  const steps = useMemo(
    () => [
      {
        title: 'Earn more together',
        content: (
          <>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              You earn $ENERGY when you shift energy usage to off-peak times. The more value you create for the grid, the more you
              earn.
            </p>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: '#111' }}>A Pool</strong> lets you share rewards with neighbors — not once, but every week.
              When they earn, you earn. When you earn, they earn.
            </p>
          </>
        ),
      },
      {
        title: 'How it works',
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { num: '1', text: 'Create or join a Pool with neighbors in your area' },
              { num: '2', text: 'Each member contributes 10% of their $ENERGY rewards to the Pool' },
              { num: '3', text: 'Every week, the Pool distributes equally to all members' },
            ].map((item) => (
              <div key={item.num} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#111',
                    flexShrink: 0,
                  }}
                >
                  {item.num}
                </div>
                <p style={{ fontSize: 15, color: '#666', lineHeight: 1.5, margin: 0 }}>{item.text}</p>
              </div>
            ))}
            <div
              style={{
                background: '#EBF5FF',
                border: '1px solid #bbf7d0',
                borderRadius: 8,
                padding: '12px 16px',
                fontSize: 14,
                color: '#166534',
              }}
            >
              This isn’t a one-time referral bonus. It’s ongoing — as long as you’re in the Pool together.
            </div>
          </div>
        ),
      },
      {
        title: 'Why it pays to grow your Pool',
        content: (
          <>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.6, margin: '0 0 20px 0' }}>More neighbors in your Pool means:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'More $ENERGY flowing into the Pool each week',
                'Coordinated usage = more value for the grid = higher rewards',
                'A bigger share back to you, every distribution',
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ color: '#007AFF' }}>↑</span>
                  <p style={{ fontSize: 14, color: '#666', margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 14, color: '#999', lineHeight: 1.6, margin: '20px 0 0 0', fontStyle: 'italic' }}>
              Unlike a referral, you stay connected. Their success is your success.
            </p>
          </>
        ),
      },
      {
        title: 'Start a Pool',
        content: (
          <>
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.6, margin: '0 0 20px 0' }}>
              Create a new Pool and you become the founder. Founders receive a <strong style={{ color: '#111' }}>5% bonus</strong>{' '}
              from the Pool before it distributes — a reward for building the group.
            </p>
            <div style={{ background: '#fafafa', borderRadius: 8, padding: 16, fontSize: 13, color: '#666' }}>
              <div style={{ marginBottom: 12, fontWeight: 500, color: '#111' }}>Example weekly distribution:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Pool total</span>
                <span style={{ color: '#111' }}>100 $ENERGY</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Founder bonus (5%)</span>
                <span style={{ color: '#007AFF', fontWeight: 500 }}>+5.0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #e5e5e5' }}>
                <span>Each member (4 total)</span>
                <span style={{ color: '#111', fontWeight: 500 }}>23.75 each</span>
              </div>
            </div>
          </>
        ),
      },
      {
        title: 'Ready?',
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <PrimaryButton onClick={onCreatePool}>Create a Pool</PrimaryButton>
            <SecondaryButton onClick={onJoinWithInvite}>Join with invite link</SecondaryButton>
            <p style={{ fontSize: 13, color: '#999', textAlign: 'center', margin: '8px 0 0 0' }}>
              You can leave a Pool anytime. Your share up to that point stays with you. (Mocked for demo.)
            </p>
          </div>
        ),
      },
    ],
    [onCreatePool, onJoinWithInvite]
  );

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: isMobile ? 0 : 20,
        zIndex: 50,
      }}
    >
      <div style={{ 
        width: '100%', 
        maxWidth: isMobile ? '100%' : 400, 
        maxHeight: isMobile ? '90vh' : 'auto',
        background: 'white', 
        borderRadius: isMobile ? '16px 16px 0 0' : 16, 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ 
          padding: isMobile ? '20px 20px 0 20px' : '24px 24px 0 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>Pool</div>
          <button
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: 20, 
              color: '#999', 
              cursor: 'pointer', 
              padding: 8, 
              margin: -8,
              lineHeight: 1,
              minWidth: 44,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ 
          padding: isMobile ? '16px 20px 20px 20px' : '20px 24px 24px 24px',
          overflowY: 'auto',
          flex: 1,
        }}>
          <h2 style={{ fontSize: isMobile ? 22 : 24, fontWeight: 600, color: '#111', margin: '0 0 20px 0' }}>{steps[step].title}</h2>
          {steps[step].content}
        </div>

        <div style={{ 
          padding: isMobile ? '16px 20px 24px 20px' : '16px 24px 24px 24px', 
          display: 'flex', 
          flexDirection: isMobile ? 'column-reverse' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 12 : 0,
          flexShrink: 0,
          borderTop: isMobile ? '1px solid #f0f0f0' : 'none',
        }}>
          <div style={{ display: 'flex', gap: 6, justifyContent: isMobile ? 'center' : 'flex-start' }}>
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: i === step ? '#111' : '#e5e5e5',
                  cursor: 'pointer',
                }}
                onClick={() => setStep(i)}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: isMobile ? 'stretch' : 'flex-end' }}>
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  flex: isMobile ? 1 : 'none',
                  padding: isMobile ? '14px 20px' : '10px 20px',
                  background: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#666',
                  cursor: 'pointer',
                  minHeight: 44,
                }}
              >
                Back
              </button>
            ) : null}
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                style={{
                  flex: isMobile ? 1 : 'none',
                  padding: isMobile ? '14px 20px' : '10px 20px',
                  background: '#111',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  color: 'white',
                  cursor: 'pointer',
                  minHeight: 44,
                }}
              >
                Next
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

