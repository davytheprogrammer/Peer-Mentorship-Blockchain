# Peer Mentorship Network (On-Chain)

A decentralized peer mentorship platform where mentors earn points for verified mentoring sessions. Every action is recorded directly on the Polygon blockchain.

## Features

- **User Registration**: Connect with MetaMask and register as a Mentor or Mentee
- **Session Tracking**: Mentors log sessions on-chain, mentees verify them
- **Contribution Points**: Mentors earn points for verified sessions (15 points per session)
- **Leaderboards**: Real-time ranking of top contributors
- **Governance**: Token holders with 50+ points can create and vote on proposals
- **Badges**: Automatic badge awards at milestone points (50, 100, 250, 500 points)

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Blockchain | Polygon | Stores all sessions, points, and votes |
| Smart Contracts | Solidity 0.8.20 | Session logging, verification, points, governance |
| Frontend | Next.js 16 + React 19 | Web interface |
| Wallet | MetaMask | Web3 authentication |
| Blockchain Library | wagmi + viem + ethers.js | Smart contract interaction |
| Build Tool | Foundry | Smart contract compilation and deployment |

## Getting Started

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- Foundry (for contract deployment)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your contract address after deployment.

3. **Compile the smart contract**
   ```bash
   forge build
   ```

4. **Deploy to Polygon (optional)**
   ```bash
   # Set your private key in .env
   export PRIVATE_KEY=your_private_key
   export POLYGON_RPC_URL=https://polygon-rpc.com
   
   # Deploy
   forge script script/DeployPeerMentorship.s.sol --rpc-url $POLYGON_RPC_URL --broadcast
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Smart Contract Details

### Key Functions

- `register(role)`: Register as Mentor (1) or Mentee (2)
- `logSession(mentee, topic, duration)`: Log a mentoring session (Mentors only)
- `verifySession(sessionId)`: Verify a session (Mentees only)
- `getTopMentors(limit)`: Get top mentors by points
- `createProposal(description)`: Create governance proposal (50+ points required)
- `vote(proposalId, support)`: Vote on a proposal

### Points System

- **Base Points**: 10 points per verified session
- **Verification Bonus**: 5 points per verified session
- **Total per Session**: 15 points

### Badge Tiers

| Badge | Points Required |
|-------|-----------------|
| Rising Mentor | 50 |
| Experienced Mentor | 100 |
| Master Mentor | 250 |
| Legend Mentor | 500 |

## Project Structure

```
├── app/
│   ├── components/       # React components
│   │   ├── ConnectWallet.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Governance.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── LogSession.tsx
│   │   ├── Navigation.tsx
│   │   ├── RegisterUser.tsx
│   │   ├── UserProfile.tsx
│   │   └── VerifySession.tsx
│   ├── context/          # React Context providers
│   │   └── WalletContext.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── useContract.ts
│   ├── lib/              # Utilities and constants
│   │   ├── contract.ts
│   │   └── wagmi.ts
│   ├── layout.tsx
│   └── page.tsx
├── src/
│   ├── PeerMentorship.sol    # Main smart contract
│   └── types/                # Generated TypeScript types
├── script/
│   └── DeployPeerMentorship.s.sol  # Deployment script
└── test/
    └── PeerMentorship.t.sol  # Contract tests
```

## Usage Guide

### For Mentors

1. Connect your MetaMask wallet
2. Register as a Mentor
3. Log mentoring sessions with mentee address, topic, and duration
4. Earn 15 points for each verified session
5. Climb the leaderboard and earn badges
6. Gain voting rights at 50 points

### For Mentees

1. Connect your MetaMask wallet
2. Register as a Mentee
3. Request sessions from mentors
4. Verify completed sessions
5. Help mentors earn their points

## Testing

Run the contract tests:

```bash
forge test
```

## Deployment to Polygon

1. Get MATIC for gas fees
2. Export your private key securely
3. Run the deployment script:

```bash
forge script script/DeployPeerMentorship.s.sol \
  --rpc-url https://polygon-rpc.com \
  --broadcast \
  --verify
```

4. Update `.env.local` with the deployed contract address
5. Rebuild your Next.js app: `npm run build`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
