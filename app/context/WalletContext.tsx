'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import { PEER_MENTORSHIP_ABI, PEER_MENTORSHIP_ADDRESS } from '../lib/contract';

interface WalletContextType {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  isConnecting: boolean;
  chainId: number | undefined;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected, chainId } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connect({ connector: metaMask() });
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        connect: handleConnect,
        disconnect,
        isConnecting,
        chainId,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
