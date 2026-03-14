'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useUser, useUserSessions, useHasVotingRights } from '../hooks/useContract';

export function UserProfile() {
  const { address } = useWallet();
  const { user } = useUser(address);
  const { sessions: mentorSessions } = useUserSessions(address, true);
  const { sessions: menteeSessions } = useUserSessions(address, false);
  const { hasRights } = useHasVotingRights(address);
  const [copied, setCopied] = useState(false);

  if (!user?.registered) {
    return null;
  }

  const roleName = user.role === 1 ? 'Mentor' : 'Mentee';
  const roleEmoji = user.role === 1 ? '👨‍🏫' : '🎓';

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="glass-card animate-reveal" style={{ 
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            fontSize: '3rem',
            width: '88px',
            height: '88px',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {roleEmoji}
          </div>
          <div>
            <h3 className="text-gradient" style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
              Arctic Identity
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge-tag badge-tag-blue">
                {roleName}
              </span>
              {hasRights && <span className="badge-tag badge-tag-green">DAO Council</span>}
            </div>
          </div>
        </div>

        {/* Copy Address Section - More prominent for Mentees */}
        <div style={{ 
          textAlign: 'right',
          background: user.role === 2 ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255,255,255,0.03)',
          padding: '1rem 1.75rem',
          borderRadius: '20px',
          backdropFilter: 'blur(12px)',
          border: user.role === 2 ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: user.role === 2 ? '0 8px 32px rgba(6, 182, 212, 0.1)' : 'none'
        }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', marginBottom: '0.625rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {user.role === 2 ? '📤 Share your Arctic ID' : 'Direct ID'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800, color: 'white' }}>
              {address?.slice(0, 10)}...{address?.slice(-6)}
            </p>
            <button
              onClick={copyAddress}
              className="glass"
              style={{
                background: copied ? 'var(--color-success)' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                color: 'white'
              }}
              title="Copy address"
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
          {copied && (
            <p className="animate-reveal" style={{ fontSize: '0.7rem', color: 'var(--color-success)', marginTop: '0.5rem', fontWeight: 800 }}>✓ COPIED TO CLIPBOARD</p>
          )}
        </div>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Contribution Points</p>
          <p className="text-gradient" style={{ fontSize: '2.75rem', fontWeight: 900 }}>
            {user.contributionPoints?.toString() || '0'}
          </p>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
            {user.role === 1 ? 'Legacy Sessions' : 'Validations'}
          </p>
          <p style={{ fontSize: '2.75rem', fontWeight: 900, color: 'white' }}>
            {user.role === 1 
              ? user.sessionsCompleted?.toString() || '0'
              : user.sessionsVerified?.toString() || '0'
            }
          </p>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.08)', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/images/badges.png")',
            backgroundSize: '200%',
            backgroundPosition: 'center',
            opacity: 0.1,
            zIndex: 0
          }}></div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', fontWeight: 700, textTransform: 'uppercase', position: 'relative', zIndex: 1 }}>Badge Rank</p>
          <p style={{ fontSize: '2rem', fontWeight: 900, color: 'white', position: 'relative', zIndex: 1 }}>
            {Number(user.contributionPoints) >= 500 ? 'Legend' : Number(user.contributionPoints) >= 250 ? 'Master' : Number(user.contributionPoints) >= 100 ? 'Senior' : 'Rising'}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', position: 'relative', zIndex: 1 }}>Verified Rep</p>
        </div>
      </div>
    </div>
  );
}
