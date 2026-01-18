import React, { useState } from 'react';

// Shared styles
const styles = {
  page: {
    minHeight: '100vh',
    background: '#fafafa',
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    border: '1px solid #e5e5e5',
    width: '100%',
    maxWidth: '420px',
    overflow: 'hidden'
  },
  header: {
    padding: '24px 24px 0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontSize: '10px',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
    lineHeight: 1.5
  },
  body: {
    padding: '24px'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  buttonPrimary: {
    width: '100%',
    padding: '14px',
    background: '#111',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  buttonSecondary: {
    width: '100%',
    padding: '14px',
    background: 'white',
    color: '#111',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  footer: {
    padding: '16px 24px 24px 24px',
    borderTop: '1px solid #f0f0f0',
    textAlign: 'center'
  }
};

// ============================================
// SCREEN 1: Sign In (Privy-style)
// ============================================
function SignInScreen({ onNext }) {
  const [email, setEmail] = useState('');
  
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={{ padding: '32px 24px 24px 24px', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#111',
            borderRadius: '16px',
            margin: '0 auto 16px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '28px' }}>⚡</span>
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>Login or sign up</div>
        </div>
        
        <div style={styles.body}>
          {/* Email input */}
          <div style={{
            display: 'flex',
            border: '1px solid #6366f1',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '12px'
          }}>
            <div style={{ padding: '14px 12px', color: '#999' }}>
              <span>✉️</span>
            </div>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '15px',
                padding: '14px 0'
              }}
            />
            <button
              onClick={onNext}
              style={{
                background: 'none',
                border: 'none',
                color: '#6366f1',
                fontWeight: '500',
                padding: '14px 16px',
                cursor: 'pointer'
              }}
            >
              Submit
            </button>
          </div>
          
          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
            <span style={{ fontSize: '12px', color: '#999' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
          </div>
          
          {/* Social buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button style={styles.buttonSecondary}>
              <span style={{ marginRight: '8px' }}>🔵</span> Google
            </button>
            <button style={styles.buttonSecondary}>
              <span style={{ marginRight: '8px' }}>🍎</span> Apple
            </button>
          </div>
        </div>
        
        {/* Privy footer */}
        <div style={{ ...styles.footer, borderTop: 'none' }}>
          <span style={{ fontSize: '12px', color: '#999' }}>Protected by </span>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#666' }}>● privy</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 2: Create Pool
// ============================================
function CreatePoolScreen({ onNext }) {
  const [poolName, setPoolName] = useState('');
  
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.label}>New Pool</span>
          <button style={{ background: 'none', border: 'none', fontSize: '18px', color: '#999', cursor: 'pointer' }}>×</button>
        </div>
        
        <div style={styles.body}>
          <h2 style={styles.title}>Create a Pool</h2>
          <p style={styles.subtitle}>
            Start a Pool with your neighbors. You'll be the founder and earn a 5% bonus on all distributions.
          </p>
          
          <div style={{ marginTop: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#333', display: 'block', marginBottom: '8px' }}>
              Pool name
            </label>
            <input
              type="text"
              placeholder="e.g., Bristol Gardens"
              value={poolName}
              onChange={(e) => setPoolName(e.target.value)}
              style={styles.input}
            />
          </div>
          
          {/* Pool settings preview */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#fafafa',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              Pool Settings
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>Member contribution</span>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#111' }}>10% of rewards</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>Founder bonus</span>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#111' }}>5% of pool</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>Distribution</span>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#111' }}>Weekly</span>
            </div>
          </div>
          
          <button onClick={onNext} style={{ ...styles.buttonPrimary, marginTop: '24px' }}>
            Create Pool
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 3: Pool Created - Share Link
// ============================================
function PoolCreatedScreen({ onNext }) {
  const inviteLink = 'fuse.energy/pool/bristol-gardens';
  
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.body}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#f0fdf4',
              borderRadius: '50%',
              margin: '0 auto 16px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '28px' }}>✓</span>
            </div>
            <h2 style={{ ...styles.title, marginBottom: '8px' }}>Pool Created!</h2>
            <p style={styles.subtitle}>
              Bristol Gardens is ready. Invite neighbors to start earning together.
            </p>
          </div>
          
          {/* Invite link */}
          <div style={{
            display: 'flex',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <input
              type="text"
              value={inviteLink}
              readOnly
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                padding: '14px 16px',
                background: '#fafafa',
                color: '#666'
              }}
            />
            <button style={{
              background: '#111',
              border: 'none',
              color: 'white',
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Copy
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ ...styles.buttonSecondary, flex: 1 }}>
              Share via WhatsApp
            </button>
            <button style={{ ...styles.buttonSecondary, flex: 1 }}>
              Share via SMS
            </button>
          </div>
          
          <button onClick={onNext} style={{ ...styles.buttonPrimary, marginTop: '16px' }}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 4: Pool Dashboard
// ============================================
function PoolDashboard({ onShowSplits }) {
  const members = [
    { name: 'Sarah', address: '0x1a2b...3c4d', earnings: 125.0, isFounder: true },
    { name: 'Tom', address: '0x5e6f...7g8h', earnings: 78.5, isFounder: false },
    { name: 'Lisa', address: '0x9i0j...1k2l', earnings: 92.0, isFounder: false },
    { name: 'James', address: '0x3m4n...5o6p', earnings: 64.0, isFounder: false }
  ];
  
  const totalPooled = members.reduce((sum, m) => sum + m.earnings * 0.1, 0);
  
  return (
    <div style={{ ...styles.page, alignItems: 'flex-start', paddingTop: '40px' }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <span style={styles.label}>Pool</span>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#111', margin: '4px 0 0 0' }}>
            Bristol Gardens
          </h1>
        </div>
        
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ ...styles.card, padding: '20px' }}>
            <div style={styles.label}>Pool Balance</div>
            <div style={{ fontSize: '32px', fontWeight: '600', color: '#111', marginTop: '8px' }}>
              {totalPooled.toFixed(1)}
            </div>
            <div style={{ fontSize: '13px', color: '#999' }}>$ENERGY</div>
          </div>
          <div style={{ ...styles.card, padding: '20px' }}>
            <div style={styles.label}>Your Share</div>
            <div style={{ fontSize: '32px', fontWeight: '600', color: '#22c55e', marginTop: '8px' }}>
              +{(totalPooled * 0.05 + totalPooled * 0.95 / 4).toFixed(1)}
            </div>
            <div style={{ fontSize: '13px', color: '#999' }}>next distribution</div>
          </div>
        </div>
        
        {/* Split visualization - Crowdmuse style */}
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={styles.label}>Distribution Split</span>
              <button 
                onClick={onShowSplits}
                style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                View contract →
              </button>
            </div>
          </div>
          
          {/* Waterfall visualization */}
          <div style={{ padding: '20px' }}>
            {/* Founder bonus tier */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              background: '#fefce8',
              borderRadius: '8px',
              marginBottom: '8px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                fontSize: '14px'
              }}>
                ★
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>Founder Bonus</div>
                <div style={{ fontSize: '12px', color: '#999' }}>Sarah (0x1a2b...3c4d)</div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>5%</div>
            </div>
            
            {/* Arrow */}
            <div style={{ textAlign: 'center', padding: '4px 0', color: '#ccc' }}>↓</div>
            
            {/* Equal split tier */}
            <div style={{
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '12px 16px',
                background: '#fafafa',
                borderBottom: '1px solid #e5e5e5',
                fontSize: '12px',
                color: '#666'
              }}>
                Remaining 95% split equally
              </div>
              
              {members.map((member, i) => (
                <div
                  key={member.address}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: i < members.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: `hsl(${i * 60}, 60%, 80%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    fontSize: '12px'
                  }}>
                    🏠
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>
                      {member.name}
                      {member.isFounder && (
                        <span style={{
                          marginLeft: '6px',
                          fontSize: '10px',
                          color: '#999',
                          background: '#f5f5f5',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          founder
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{member.address}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>23.75%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Recent activity */}
        <div style={styles.card}>
          <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
            <span style={styles.label}>Recent Distributions</span>
          </div>
          <div style={{ padding: '12px 20px' }}>
            {[
              { date: 'Jan 13, 2026', amount: 62.4 },
              { date: 'Jan 6, 2026', amount: 58.1 },
              { date: 'Dec 30, 2025', amount: 51.2 }
            ].map((dist, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none'
                }}
              >
                <span style={{ fontSize: '14px', color: '#666' }}>{dist.date}</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#22c55e' }}>+{dist.amount}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Invite button */}
        <button style={{ ...styles.buttonPrimary, marginTop: '24px' }}>
          Invite Neighbors
        </button>
        
        {/* Footer */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#999' }}>Powered by </span>
          <span style={{ fontSize: '12px', color: '#666' }}>Privy · Fuse · Splits</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 5: Splits Contract View
// ============================================
function SplitsContractView({ onBack }) {
  const recipients = [
    { address: '0x1a2b...3c4d', name: 'Sarah', share: '28.75%', color: '#f87171' },
    { address: '0x5e6f...7g8h', name: 'Tom', share: '23.75%', color: '#fb923c' },
    { address: '0x9i0j...1k2l', name: 'Lisa', share: '23.75%', color: '#a3e635' },
    { address: '0x3m4n...5o6p', name: 'James', share: '23.75%', color: '#38bdf8' }
  ];
  
  return (
    <div style={styles.page}>
      <div style={{ ...styles.card, maxWidth: '480px' }}>
        <div style={styles.header}>
          <button 
            onClick={onBack}
            style={{ background: 'none', border: 'none', fontSize: '14px', color: '#666', cursor: 'pointer' }}
          >
            ← Back
          </button>
        </div>
        
        <div style={styles.body}>
          <h2 style={{ ...styles.title, fontSize: '20px' }}>Display Split</h2>
          <p style={{ ...styles.subtitle, marginBottom: '24px' }}>
            React component to display all details for a Split contract, including the ability to distribute balances.
          </p>
          
          {/* Contract address */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            background: '#fafafa',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #38bdf8, #a78bfa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '12px' }}>⬡</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>0xF884...f719</span>
              <span style={{ fontSize: '12px', color: '#6366f1', cursor: 'pointer' }}>↗</span>
            </div>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#627eea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontSize: '10px' }}>◆</span>
            </div>
          </div>
          
          {/* Recipients */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#999' }}>Recipients ({recipients.length})</span>
              <span style={{ fontSize: '13px', color: '#999' }}>Share</span>
            </div>
            
            {recipients.map((r, i) => (
              <div
                key={r.address}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: i < recipients.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: r.color,
                  marginRight: '12px'
                }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '14px', color: '#111' }}>{r.address}</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>{r.share}</span>
              </div>
            ))}
          </div>
          
          {/* Balances */}
          <div style={{
            padding: '16px',
            background: '#fafafa',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '8px' }}>Balances</div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              This Split's earnings will show up here once funds have been received.
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div style={styles.footer}>
          <span style={{ fontSize: '12px', color: '#999' }}>⁂ Powered by Splits</span>
          <span style={{ fontSize: '12px', color: '#999', marginLeft: '16px' }}>splits.org</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP - Flow Controller
// ============================================
export default function PoolFlow() {
  const [screen, setScreen] = useState('signin');
  
  const screens = {
    signin: <SignInScreen onNext={() => setScreen('create')} />,
    create: <CreatePoolScreen onNext={() => setScreen('created')} />,
    created: <PoolCreatedScreen onNext={() => setScreen('dashboard')} />,
    dashboard: <PoolDashboard onShowSplits={() => setScreen('splits')} />,
    splits: <SplitsContractView onBack={() => setScreen('dashboard')} />
  };
  
  return (
    <div>
      {screens[screen]}
      
      {/* Screen navigation (for demo purposes) */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        background: 'white',
        padding: '8px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {['signin', 'create', 'created', 'dashboard', 'splits'].map(s => (
          <button
            key={s}
            onClick={() => setScreen(s)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              border: 'none',
              borderRadius: '4px',
              background: screen === s ? '#111' : '#f5f5f5',
              color: screen === s ? 'white' : '#666',
              cursor: 'pointer'
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
