'use client';

import { useTopMentors } from '../hooks/useContract';

export function Leaderboard() {
  const { mentors, points, isLoading } = useTopMentors(10);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <div className="loading-orbit"></div>
      </div>
    );
  }

  if (!mentors || mentors.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
        No mentors yet. Be the first to register!
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {mentors.map((mentor, index) => {
        const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
        
        return (
          <div
            key={mentor || index}
            className="glass-card animate-reveal"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.75rem',
              borderRadius: '20px',
              border: index === 0 ? '1px solid rgba(250, 204, 21, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: index === 0 ? 'rgba(250, 204, 21, 0.05)' : undefined
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  background: index === 0 
                    ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' 
                    : index === 1 
                    ? 'linear-gradient(135deg, #cbd5e1 0%, #cbd5e1 100%)' 
                    : index === 2 
                    ? 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)' 
                    : 'rgba(255,255,255,0.05)',
                  boxShadow: index < 3 ? '0 8px 20px rgba(0, 0, 0, 0.2)' : 'none'
                }}
              >
                {rankEmoji}
              </div>
              <div>
                <p style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '1rem', marginBottom: '0.125rem', color: index === 0 ? '#fde047' : 'white' }}>
                  {mentor?.slice(0, 6)}...{mentor?.slice(-4)}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {index === 0 ? 'Master Mentor' : index === 1 ? 'Rising Star' : `Rank #${index + 1}`}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="text-gradient" style={{ 
                fontWeight: 900, 
                fontSize: '1.75rem',
                lineHeight: 1
              }}>
                {points[index]?.toString() || '0'}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Points</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
