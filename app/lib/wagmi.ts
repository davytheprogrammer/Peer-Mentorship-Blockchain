'use client';

import { createConfig, http } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

const polygonRpcUrl = process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://1rpc.io/matic';

export const config = createConfig({
  chains: [polygon],
  connectors: [
    metaMask(),
  ],
  transports: {
    [polygon.id]: http(polygonRpcUrl),
  },
});
