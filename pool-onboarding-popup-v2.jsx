import React, { useState } from 'react';

export default function PoolOnboardingPopup() {
  const [step, setStep] = useState(0);
  
  const steps = [
    // Step 0: Intro
    {
      title: "Earn more together",
      content: (
        <>
          <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, margin: '0 0 16px 0' }}>
            You earn $ENERGY when you shift energy usage to off-peak times. The more value you create for the grid, the more you earn.
          </p>
          <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: '#111' }}>A Pool</strong> lets you share rewards with neighbors — not once, but every week. When they earn, you earn. When you earn, they earn.
          </p>
        </>
      )
    },
    // Step 1: How it works
    {
      title: "How it works",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { num: '1', text: 'Create or join a Pool with neighbors in your area' },
            { num: '2', text: 'Each member contributes 10% of their $ENERGY rewards to the Pool' },
            { num: '3', text: 'Every week, the Pool distributes equally to all members' }
          ].map(item => (
            <div key={item.num} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '600',
                color: '#111',
                flexShrink: 0
              }}>
                {item.num}
              </div>
              <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.5, margin: 0 }}>
                {item.text}
              </p>
            </div>
          ))}
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            color: '#166534'
          }}>
            This isn't a one-time referral bonus. It's ongoing — as long as you're in the Pool together.
          </div>
        </div>
      )
    },
    // Step 2: Why it works
    {
      title: "Why it pays to grow your Pool",
      content: (
        <>
          <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, margin: '0 0 20px 0' }}>
            More neighbors in your Pool means:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'More $ENERGY flowing into the Pool each week',
              'Coordinated usage = more value for the grid = higher rewards',
              'A bigger share back to you, every distribution'
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: '#22c55e' }}>↑</span>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '14px', color: '#999', lineHeight: 1.6, margin: '20px 0 0 0', fontStyle: 'italic' }}>
            Unlike a referral, you stay connected. Their success is your success.
          </p>
        </>
      )
    },
    // Step 3: Founder bonus
    {
      title: "Start a Pool",
      content: (
        <>
          <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6, margin: '0 0 20px 0' }}>
            Create a new Pool and you become the founder. Founders receive a <strong style={{ color: '#111' }}>5% bonus</strong> from the Pool before it distributes — a reward for building the group.
          </p>
          <div style={{
            background: '#fafafa',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '13px',
            color: '#666'
          }}>
            <div style={{ marginBottom: '12px', fontWeight: '500', color: '#111' }}>Example weekly distribution:</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Pool total</span>
              <span style={{ color: '#111' }}>100 $ENERGY</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Founder bonus (5%)</span>
              <span style={{ color: '#22c55e', fontWeight: '500' }}>+5.0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e5e5e5' }}>
              <span>Each member (4 total)</span>
              <span style={{ color: '#111', fontWeight: '500' }}>23.75 each</span>
            </div>
          </div>
        </>
      )
    },
    // Step 4: Get started
    {
      title: "Ready?",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button style={{
            width: '100%',
            padding: '16px',
            background: '#111',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Create a Pool
          </button>
          <button style={{
            width: '100%',
            padding: '16px',
            background: 'white',
            color: '#111',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Join with invite link
          </button>
          <p style={{ fontSize: '13px', color: '#999', textAlign: 'center', margin: '8px 0 0 0' }}>
            You can leave a Pool anytime. Your share up to that point stays with you.
          </p>
        </div>
      )
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '10px',
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Pool
          </div>
          <button style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            color: '#999',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1
          }}>
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px 24px 24px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#111',
            margin: '0 0 20px 0'
          }}>
            {steps[step].title}
          </h2>
          
          {steps[step].content}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px 24px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: i === step ? '#111' : '#e5e5e5',
                  cursor: 'pointer'
                }}
                onClick={() => setStep(i)}
              />
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  padding: '10px 20px',
                  background: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#666',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
            )}
            {step < steps.length - 1 && (
              <button
                onClick={() => setStep(step + 1)}
                style={{
                  padding: '10px 20px',
                  background: '#111',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
