'use client';

import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  useCreateProposal,
  useProposalCount,
  useProposal,
  useVote,
  useHasVotingRights,
} from '../hooks/useContract';

export function Governance() {
  const { address } = useWallet();
  const { count: proposalCount } = useProposalCount();
  const { hasRights } = useHasVotingRights(address);
  const { createProposal, isPending: isCreating } = useCreateProposal();
  const { vote, isPending: isVoting } = useVote();
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    createProposal(description);
    setDescription('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Create Proposal */}
      <div className="glass-card animate-reveal" style={{ 
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '180px',
          height: '180px',
          backgroundImage: 'url("/images/governance.png")',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15,
          zIndex: 0,
          transform: 'rotate(-10deg)'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Arctic Council
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Shape the future of the mentorship ecosystem through decentralized proposals.
          </p>

          {!hasRights ? (
            <div className="glass" style={{ 
              padding: '1.25rem', 
              borderRadius: '16px',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              background: 'rgba(245, 158, 11, 0.05)',
              color: '#fbbf24',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🔒</span>
              <div>
                <strong>Voting Rights Locked.</strong> You need at least 50 points to participate in governance.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Declare your vision for the community..."
                rows={3}
                className="input glass"
                style={{ 
                  borderRadius: '16px', 
                  padding: '1.25rem',
                  fontSize: '1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
                required
              />
              <button
                type="submit"
                disabled={isCreating}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start', padding: '0.875rem 2rem' }}
              >
                {isCreating ? (
                  <>
                    <div className="loading-orbit" style={{ width: '18px', height: '18px' }}></div>
                    Deploying Proposal...
                  </>
                ) : (
                  '🚀 Launch Proposal'
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Active Proposals */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Living Proposals</h3>
          <span className="badge-tag badge-tag-blue">Total: {proposalCount?.toString() || '0'}</span>
        </div>

        {proposalCount === BigInt(0) ? (
          <div className="glass-card" style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            color: 'var(--color-text-muted)',
            borderStyle: 'dashed',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ fontSize: '3rem', opacity: 0.5 }}>🗳️</div>
            <p style={{ fontWeight: 600 }}>The council chambers are quiet...</p>
            <p style={{ opacity: 0.7 }}>Be the first to propose a change to the ecosystem.</p>
          </div>
        ) : (
          <div className="card-grid">
            {Array.from({ length: Number(proposalCount) }, (_, i) => i + 1).map((id) => (
              <ProposalCard
                key={id}
                proposalId={id}
                onVote={vote}
                isVoting={isVoting}
                hasRights={hasRights}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProposalCard({
  proposalId,
  onVote,
  isVoting,
  hasRights,
}: {
  proposalId: number;
  onVote: (id: number, support: boolean) => void;
  isVoting: boolean;
  hasRights: boolean;
}) {
  const { proposal } = useProposal(proposalId);
  const [voted, setVoted] = useState(false);

  if (!proposal?.exists) return null;

  const handleVote = (support: boolean) => {
    onVote(proposalId, support);
    setVoted(true);
  };

  const totalVotes = (proposal.forVotes || BigInt(0)) + (proposal.againstVotes || BigInt(0));
  const forPercentage = totalVotes > BigInt(0)
    ? Number((proposal.forVotes * BigInt(100)) / totalVotes)
    : 0;
  const againstPercentage = totalVotes > BigInt(0)
    ? Number((proposal.againstVotes * BigInt(100)) / totalVotes)
    : 0;

  const isExpired = proposal.endTime && BigInt(Math.floor(Date.now() / 1000)) > proposal.endTime;

  return (
    <div className="glass-card animate-reveal" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem',
      padding: '1.75rem',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <h4 style={{ fontWeight: 800, fontSize: '1.125rem', color: 'white', lineHeight: 1.4 }}>{proposal.description}</h4>
        <span className={`badge-tag ${isExpired ? 'badge-tag-red' : 'badge-tag-green'}`} style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
          {isExpired ? 'Closed' : 'Voting Open'}
        </span>
      </div>
      
      {/* Voting Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
          <span style={{ color: 'var(--color-success)' }}>{forPercentage}% Support</span>
          <span style={{ color: 'var(--color-danger)' }}>{againstPercentage}% Objects</span>
        </div>
        <div className="vote-bar" style={{ height: '8px', background: 'rgba(255,255,255,0.05)' }}>
          <div className="vote-bar-for" style={{ width: `${forPercentage}%`, background: 'var(--color-success)', borderRadius: '99px' }}></div>
          <div className="vote-bar-against" style={{ width: `${againstPercentage}%`, background: 'var(--color-danger)', borderRadius: '99px' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
          <span>{proposal.forVotes?.toString() || '0'} For</span>
          <span>{proposal.againstVotes?.toString() || '0'} Against</span>
        </div>
      </div>

      {/* Vote Buttons */}
      {!voted && hasRights && !isExpired && (
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => handleVote(true)}
            disabled={isVoting}
            className="btn btn-success"
            style={{ flex: 1, padding: '0.75rem', fontSize: '0.875rem' }}
          >
            ✓ Support
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={isVoting}
            className="btn btn-danger"
            style={{ flex: 1, padding: '0.75rem', fontSize: '0.875rem' }}
          >
            ✗ Object
          </button>
        </div>
      )}

      {voted && (
        <div className="glass" style={{ 
          padding: '0.875rem', 
          borderRadius: '12px',
          color: 'var(--color-success)',
          fontSize: '0.875rem',
          textAlign: 'center',
          fontWeight: 700,
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.1)'
        }}>
          ✓ Verification Recorded
        </div>
      )}

      {!hasRights && !voted && !isExpired && (
        <div className="glass" style={{ 
          padding: '0.875rem', 
          borderRadius: '12px',
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
          textAlign: 'center',
          fontWeight: 600,
          background: 'rgba(255,255,255,0.02)'
        }}>
          🔒 Reputation too low to vote
        </div>
      )}
    </div>
  );
}
