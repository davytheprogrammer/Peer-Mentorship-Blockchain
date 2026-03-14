'use client';

import { useWallet } from '../context/WalletContext';

export function ConnectWallet() {
  const { address, isConnected, connect, disconnect, isConnecting } = useWallet();

  if (isConnected && address) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          padding: '0.75rem 1.5rem', 
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#60a5fa',
          borderRadius: '16px',
          fontSize: '0.875rem',
          fontWeight: 700,
          fontFamily: 'monospace',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={disconnect}
          className="btn btn-secondary"
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '0.875rem',
            background: 'rgba(239, 68, 68, 0.05)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className={`btn ${isConnecting ? 'btn-secondary' : 'btn-primary'}`}
      style={{
        padding: '1rem 2rem',
        fontSize: '1rem',
        minWidth: '200px'
      }}
    >
      {isConnecting ? (
        <>
          <div className="loading-orbit" style={{ width: '20px', height: '20px' }}></div>
          Crossing Bridges...
        </>
      ) : (
        <>
          <span>🔗</span> Connect Wallet
        </>
      )}
    </button>
  );
}
