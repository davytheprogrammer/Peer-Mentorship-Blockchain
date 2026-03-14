'use client';

import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useVerifySession, useUserSessions, useUser } from '../hooks/useContract';

export function VerifySession() {
  const { address } = useWallet();
  const { user } = useUser(address);
  const { sessions } = useUserSessions(address, false);
  const { verifySession, isPending } = useVerifySession();
  const [selectedSession, setSelectedSession] = useState<number | null>(null);

  const isMentee = user?.role === 2;

  const handleVerify = (sessionId: number) => {
    setSelectedSession(sessionId);
    verifySession(sessionId);
  };

  if (!isMentee) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎓</div>
        <p style={{ fontWeight: 600 }}>Mentee Access Only</p>
        <p style={{ fontSize: '0.875rem' }}>Only mentees can verify Arctic sessions to validate knowledge transfer.</p>
      </div>
    );
  }

  const pendingSessions = sessions?.filter((s) => s && !s.verified) || [];

  if (!pendingSessions || pendingSessions.length === 0) {
    return (
      <div className="glass-card animate-reveal" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-muted)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-success)' }}>✨</div>
        <p style={{ fontWeight: 700, fontSize: '1.25rem', color: 'white', marginBottom: '0.5rem' }}>All Clear!</p>
        <p style={{ opacity: 0.7 }}>You have no pending sessions to verify. Good work!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Pending Validations</h3>
        <span className="badge-tag badge-tag-blue">{pendingSessions.length} Required</span>
      </div>

      <div className="card-grid">
        {pendingSessions.map((session, index) => (
          <div
            key={session.id?.toString()}
            className="glass-card animate-reveal"
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              animationDelay: `${index * 0.1}s`,
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '1.125rem', color: 'white', marginBottom: '0.5rem' }}>
                {session.topic}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>👨‍🏫</span> Mentor: <span style={{ fontFamily: 'monospace', color: 'var(--color-secondary)', fontWeight: 700 }}>{session.mentor?.slice(0, 6)}...{session.mentor?.slice(-4)}</span>
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>⏱️</span> Duration: <span style={{ color: 'white', fontWeight: 700 }}>{session.duration?.toString()} min</span>
                </p>
              </div>
            </div>

            <div className="glass" style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Reward potential
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                +10 points for mentor • +5 verification bonus
              </p>
            </div>

            <button
              onClick={() => handleVerify(Number(session.id))}
              disabled={isPending || selectedSession === Number(session.id)}
              className="btn btn-success"
              style={{ width: '100%', padding: '0.875rem' }}
            >
              {selectedSession === Number(session.id) ? (
                <>
                  <div className="loading-orbit" style={{ width: '18px', height: '18px' }}></div>
                  Verifying...
                </>
              ) : (
                '✓ Validate Session'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
