import React from 'react';

export default function CollectiveDashboard() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      padding: '40px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '48px',
        maxWidth: '900px',
        margin: '0 auto 48px auto'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Collective
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#111', margin: 0 }}>
            Bristol Gardens
          </h1>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'white',
          borderRadius: '6px',
          border: '1px solid #e5e5e5',
          fontSize: '13px',
          color: '#666',
          cursor: 'pointer'
        }}>
          <span>Invite neighbors</span>
          <span style={{ color: '#999' }}>→</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        
        {/* Pool Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
          padding: '32px',
          gridColumn: 'span 2'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Pool Balance
              </div>
              <div style={{ fontSize: '48px', fontWeight: '600', color: '#111', lineHeight: 1 }}>
                247.5
              </div>
              <div style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>
                $ENERGY
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Your Share
              </div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: '#22c55e', lineHeight: 1 }}>
                +61.8
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                includes +4.2 founder bonus
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999', marginBottom: '8px' }}>
              <span>Next distribution</span>
              <span>Jan 20, 2026</span>
            </div>
            <div style={{ height: '4px', background: '#f0f0f0', borderRadius: '2px' }}>
              <div style={{ width: '65%', height: '100%', background: '#111', borderRadius: '2px' }} />
            </div>
          </div>
        </div>

        {/* Members Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
          padding: '24px'
        }}>
          <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '20px' }}>
            Members (4)
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'Sarah', earnings: '125.0', founder: true },
              { name: 'Tom', earnings: '78.5' },
              { name: 'Lisa', earnings: '92.0' },
              { name: 'James', earnings: '64.0' }
            ].map(member => (
              <div key={member.name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}>
                    🏠
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>
                      {member.name}
                      {member.founder && (
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
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  {member.earnings} earned
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
          padding: '24px'
        }}>
          <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '20px' }}>
            Recent Distributions
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { date: 'Jan 13', amount: '62.4', members: 4 },
              { date: 'Jan 6', amount: '58.1', members: 4 },
              { date: 'Dec 30', amount: '51.2', members: 3 },
              { date: 'Dec 23', amount: '47.8', members: 3 }
            ].map((dist, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  {dist.date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    {dist.members} members
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>
                    {dist.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works - small */}
        <div style={{
          gridColumn: 'span 2',
          padding: '24px',
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e5e5'
        }}>
          <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
            How it works
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px'
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#666' }}>Each member pools</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#111', marginTop: '4px' }}>10%</div>
              <div style={{ fontSize: '12px', color: '#999' }}>of rewards</div>
            </div>
            <div style={{ color: '#ccc' }}>→</div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#666' }}>Founder receives</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#111', marginTop: '4px' }}>5%</div>
              <div style={{ fontSize: '12px', color: '#999' }}>bonus first</div>
            </div>
            <div style={{ color: '#ccc' }}>→</div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#666' }}>Rest splits</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#111', marginTop: '4px' }}>equally</div>
              <div style={{ fontSize: '12px', color: '#999' }}>to all members</div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        maxWidth: '900px',
        margin: '48px auto 0 auto',
        paddingTop: '24px',
        borderTop: '1px solid #e5e5e5',
        display: 'flex',
        justifyContent: 'center',
        gap: '32px'
      }}>
        {['Privy', 'Fuse', 'Splits'].map(name => (
          <span key={name} style={{ fontSize: '12px', color: '#999' }}>{name}</span>
        ))}
      </div>
    </div>
  );
}
