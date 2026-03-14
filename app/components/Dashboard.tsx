'use client';

import { useState } from 'react';
import { ConnectWallet } from './ConnectWallet';
import { Navigation } from './Navigation';
import { RegisterUser } from './RegisterUser';
import { UserProfile } from './UserProfile';
import { LogSession } from './LogSession';
import { VerifySession } from './VerifySession';
import { Leaderboard } from './Leaderboard';
import { Governance } from './Governance';
import { useWallet } from '../context/WalletContext';
import { useUser } from '../hooks/useContract';

type Tab = 'dashboard' | 'sessions' | 'leaderboard' | 'governance';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const { address, isConnected } = useWallet();
  const { user } = useUser(address);

  const renderContent = () => {
    if (!isConnected) {
      return (
        <div className="animate-reveal" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="glass-card" style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url("/images/hero.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
              zIndex: 0
            }}></div>
            
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="animate-float" style={{ fontSize: '5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.4))' }}>
                🧊
              </div>
              <h1 className="text-gradient" style={{ 
                fontSize: '5rem', 
                fontWeight: 900,
                lineHeight: 1,
                marginBottom: '1.5rem',
                letterSpacing: '-0.05em',
                textAlign: 'center'
              }}>
                Arctic Peer <br/> Mentorship
              </h1>
              <p style={{ 
                fontSize: '1.4rem', 
                color: 'var(--color-text-muted)', 
                marginBottom: '3.5rem',
                maxWidth: '650px',
                lineHeight: 1.6,
                textAlign: 'center',
                fontWeight: 500
              }}>
                A high-performance decentralized network on Polygon. <br/>
                Earn reputation through knowledge transfer, verified on-chain.
              </p>
              <ConnectWallet />
            </div>
          </div>

          <div className="card-grid" style={{ marginTop: '4rem' }}>
            <div className="glass-card" style={{ padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>💠</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Pure Consensus</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>Direct mentee validation eliminates middle-man friction, creating a transparent record of growth.</p>
            </div>
            <div className="glass-card" style={{ padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>❄️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Arctic Reputation</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>Your knowledge is your asset. Build a permanent, verifiable legacy in the mentorship ecosystem.</p>
            </div>
            <div className="glass-card" style={{ padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌌</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Sovereign DAO</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>Participate in decentralized governance and steer the future of global peer learning.</p>
            </div>
          </div>
        </div>
      );
    }

    if (!user?.registered) {
      return (
        <div className="animate-reveal" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '3rem' }}>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>
              Arctic Identity Initiation
            </h2>
            <RegisterUser />
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12 animate-reveal">
            <UserProfile />
            
            <div className="card-grid">
              <div className="glass-card" style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ fontSize: '2rem' }}>💠</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Core Actions</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {user.role === 1 && <LogSession />}
                  {user.role === 2 && <VerifySession />}
                </div>
              </div>
              
              <div className="glass-card" style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ fontSize: '2rem' }}>🔥</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Council Leaders</h3>
                </div>
                <Leaderboard />
              </div>
            </div>
          </div>
        );

      case 'sessions':
        return (
          <div className="animate-reveal" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Arctic Intelligence</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Manage and validate secure mentorship sessions.</p>
            </div>
            {user.role === 1 ? <LogSession /> : <VerifySession />}
          </div>
        );

      case 'leaderboard':
        return (
          <div className="animate-reveal" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Arctic Hall of Fame</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>The highest-reputation contributors in the network.</p>
            </div>
            <Leaderboard />
          </div>
        );

      case 'governance':
        return (
          <div className="animate-reveal" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Consensus Chamber</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Participate in the decentralized evolution of the ecosystem.</p>
            </div>
            <Governance />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '8rem' }}>
      {/* Header */}
      <header className="glass" style={{ 
        padding: '1.5rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="animate-float" style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              ❄️
            </div>
            <h1 className="text-gradient" style={{ 
              fontSize: '2rem', 
              fontWeight: 900,
              letterSpacing: '-0.04em'
            }}>
              ArcticPeer
            </h1>
          </div>
          <ConnectWallet />
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' }}>
        {isConnected && user?.registered && (
          <div style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
}
