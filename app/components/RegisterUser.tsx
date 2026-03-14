'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useRegister, useUser } from '../hooks/useContract';

export function RegisterUser() {
  const { address, isConnected } = useWallet();
  const { user, refetch } = useUser(address);
  const { register, isPending, isSuccess, error } = useRegister();
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-refetch user data when transaction succeeds
  useEffect(() => {
    if (isSuccess) {
      // Refetch user data
      const timer = setTimeout(() => {
        refetch();
      }, 2000); // Wait for 2 seconds for blockchain to update
      return () => clearTimeout(timer);
    }
  }, [isSuccess, refetch]);

  // Show success message after registration
  useEffect(() => {
    if (isSuccess && selectedRole) {
      setShowSuccess(true);
      // Redirect to dashboard after showing success
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, selectedRole]);

  if (!isConnected) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
        Please connect your wallet to register
      </div>
    );
  }

  if (user?.registered) {
    const roleName = user.role === 1 ? 'Mentor' : 'Mentee';
    return (
      <div className="glass-card animate-reveal" style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem',
        background: 'rgba(16, 185, 129, 0.05)',
        borderRadius: '32px',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        boxShadow: '0 20px 60px rgba(16, 185, 129, 0.1)'
      }}>
        <div className="animate-float" style={{ fontSize: '5rem', filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.4))' }}>🏔️</div>
        <h3 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
          Arctic Protocol Initialized
        </h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem', maxWidth: '500px' }}>
          Welcome to the network as an authorized <strong>{roleName}</strong>.
        </p>
        <div style={{ 
          marginTop: '1rem',
          padding: '1rem 2rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          fontSize: '1.25rem'
        }}>
          Points: <strong className="text-gradient">{user.contributionPoints?.toString() || '0'}</strong>
        </div>
      </div>
    );
  }

  // Show success message while waiting for confirmation
  if (showSuccess && selectedRole) {
    return (
      <div className="glass-card" style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem',
        background: 'rgba(59, 130, 246, 0.05)',
        borderRadius: '32px',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div className="loading-orbit" style={{ width: '64px', height: '64px' }}></div>
        <h3 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 900 }}>
          Processing Wavefront...
        </h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
          Validating your Arctic Identity on the Polygon network.
        </p>
        <div className="badge-tag badge-tag-blue" style={{ fontSize: '0.8rem' }}>
          {selectedRole === 1 ? 'Deploying Mentor Profile' : 'Deploying Mentee Profile'}
        </div>
      </div>
    );
  }

  const handleRegister = (role: number) => {
    setSelectedRole(role);
    register(role);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '1.125rem' }}>
        Choose your role to begin your journey
      </p>
      
      <button
        onClick={() => handleRegister(1)}
        disabled={isPending}
        className="glass-card role-button animate-reveal"
        style={{
          border: selectedRole === 1 ? '1px solid var(--color-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
          background: selectedRole === 1 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)',
          cursor: isPending ? 'not-allowed' : 'pointer',
          padding: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem',
          width: '100%',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div style={{ 
          width: '110px',
          height: '110px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.05)',
          backgroundImage: 'url("/images/mentor.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: selectedRole === 1 ? '0 12px 32px rgba(59, 130, 246, 0.3)' : 'none'
        }} />
        <div style={{ flex: 1 }}>
          <h4 style={{ fontWeight: 900, fontSize: '1.75rem', marginBottom: '0.75rem', color: 'white' }}>
            Arctic Mentor
          </h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: '1.5' }}>
            Deploy your expertise to the network. Guide the next generation and earn verified reputation.
          </p>
        </div>
        {selectedRole === 1 && <div style={{ fontSize: '2rem' }}>💎</div>}
      </button>

      <button
        onClick={() => handleRegister(2)}
        disabled={isPending}
        className="glass-card role-button animate-reveal"
        style={{
          border: selectedRole === 2 ? '1px solid var(--color-secondary)' : '1px solid rgba(255, 255, 255, 0.08)',
          background: selectedRole === 2 ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.03)',
          cursor: isPending ? 'not-allowed' : 'pointer',
          padding: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem',
          width: '100%',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          animationDelay: '0.1s'
        }}
      >
        <div style={{ 
          width: '110px',
          height: '110px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.05)',
          backgroundImage: 'url("/images/mentee.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: selectedRole === 2 ? '0 12px 32px rgba(6, 182, 212, 0.3)' : 'none'
        }} />
        <div style={{ flex: 1 }}>
          <h4 style={{ fontWeight: 900, fontSize: '1.75rem', marginBottom: '0.75rem', color: 'white' }}>
            Arctic Mentee
          </h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: '1.5' }}>
            Absorb high-fidelity knowledge. Validate your growth tracks and lock in your skillsets.
          </p>
        </div>
        {selectedRole === 2 && <div style={{ fontSize: '2rem' }}>⚡</div>}
      </button>

      {isPending && (
        <div className="animate-reveal" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-primary)' }}>
          <div className="loading-orbit" style={{ margin: '0 auto 2rem' }}></div>
          <p style={{ fontWeight: 800, fontSize: '1.125rem' }}>Synchronizing Arctic Identity with Polygon Core...</p>
        </div>
      )}

      {error && (
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(239, 68, 68, 0.1)', 
          borderRadius: '12px',
          color: '#ef4444',
          textAlign: 'center'
        }}>
          Error: {error.message || 'Transaction failed'}
        </div>
      )}

      <style jsx>{`
        .role-button:hover:not(:disabled) {
          transform: scale(1.02);
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </div>
  );
}
