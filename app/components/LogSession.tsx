'use client';

import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useLogSession, useUser } from '../hooks/useContract';

export function LogSession() {
  const { address } = useWallet();
  const { user } = useUser(address);
  const { logSession, isPending } = useLogSession();
  
  const [mentee, setMentee] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');

  const isMentor = user?.role === 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentee || !topic || !duration) return;
    
    logSession(mentee, topic, parseInt(duration));
    setMentee('');
    setTopic('');
    setDuration('');
  };

  if (!isMentor) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
        <p style={{ fontWeight: 600 }}>Mentor Authorization Required</p>
        <p style={{ fontSize: '0.875rem' }}>Only registered mentors can log sessions in the Arctic ecosystem.</p>
      </div>
    );
  }

  return (
    <div className="glass-card animate-reveal" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3 className="text-gradient" style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2rem' }}>Log Arctic Session</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label className="label" style={{ color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem' }}>Mentee Address</label>
          <input
            type="text"
            value={mentee}
            onChange={(e) => setMentee(e.target.value)}
            placeholder="0x..."
            className="input glass"
            style={{ borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            required
          />
        </div>

        <div>
          <label className="label" style={{ color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem' }}>Session Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Arctic Cryptography"
            className="input glass"
            style={{ borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            required
          />
        </div>

        <div>
          <label className="label" style={{ color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem' }}>Duration (minutes)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="60"
            min="1"
            className="input glass"
            style={{ borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary"
          style={{ marginTop: '1rem', padding: '1rem' }}
        >
          {isPending ? (
            <>
              <div className="loading-orbit" style={{ width: '20px', height: '20px' }}></div>
              Syncing Session...
            </>
          ) : (
            '📝 Deploy Session Log'
          )}
        </button>
      </form>
    </div>
  );
}
