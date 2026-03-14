'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { PEER_MENTORSHIP_ABI, PEER_MENTORSHIP_ADDRESS } from '../lib/contract';

export function useRegister() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
    hash 
  });

  const register = async (role: number) => {
    writeContract({
      address: PEER_MENTORSHIP_ADDRESS as `0x${string}`,
      abi: PEER_MENTORSHIP_ABI,
      functionName: 'register',
      args: [role],
    });
  };

  return { register, hash, isPending: isPending || isConfirming, isSuccess, error };
}

export function useUser(address?: `0x${string}`) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: PEER_MENTORSHIP_ADDRESS as `0x${string}`,
    abi: PEER_MENTORSHIP_ABI,
    functionName: 'getUser',
    args: [address || '0x0000000000000000000000000000000000000000'],
    query: {
      enabled: !!address,
    },
  });

  return {
    user: data as any,
    isLoading,
    error,
    refetch,
  };
}

export function useLogSession() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
    hash 
  });

  const logSession = async (mentee: string, topic: string, duration: number) => {
    writeContract({
      address: PEER_MENTORSHIP_ADDRESS as `0x${string}`,
      abi: PEER_MENTORSHIP_ABI,
      functionName: 'logSession',
      args: [mentee as `0x${string}`, topic, BigInt(duration)],
    });
  };

  return { logSession, hash, isPending: isPending || isConfirming, isSuccess, error };
}

export function useVerifySession() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
    hash 
  });

  const verifySession = async (sessionId: number) => {
    writeContract({
      address: PEER_MENTORSHIP_ADDRESS as `0x${string}`,
      abi: PEER_MENTORSHIP_ABI,
      functionName: 'verifySession',
      args: [BigInt(sessionId)],
    });
  };

  return { verifySession, hash, isPending: isPending || isConfirming, isSuccess, error };
}

export function useTopMentors(limit: number = 10) {
  const { data, isLoading, error } = useReadContract({
    address: PEER_MENTORSHIP_ADDRESS as `0x${string}`,
    abi: PEER_MENTORSHIP_ABI,
    functionName: 'getTopMentors',
    args: [BigInt(limit)],
  });

  return {
    mentors: data ? (data[0] as any[]) : [],
    points: data ? (data[1] as bigint[]) : [],
    isLoading,
    error,
  };
}

export function useUserSessions(address?: `0x${string}`, asMentor: boolean = true) {
  const { data, isLoading, error } = useReadContract({
    address: PEER_MENTORSHIP_ADDRESS as `0x${string}`,
    abi: PEER_MENTORSHIP_ABI,
    functionName: 'getUserSessions',
    args: [address || '0x0000000000000000000000000000000000000000', asMentor],
    query: {
      enabled: !!address,
    },
  });

  return {
    sessions: data as any[] || [],
    isLoading,
    error,
  };
}

export function useCreateProposal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const createProposal = async (description: string) => {
    writeContract({
      address: PEER_MENTORSHIP_ADDRESS as `0x${string}`,
      abi: PEER_MENTORSHIP_ABI,
      functionName: 'createProposal',
      args: [description],
    });
  };

  return { createProposal, hash, isPending, error };
}

export function useVote() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const vote = async (proposalId: number, support: boolean) => {
    writeContract({
      address: PEER_MENTORSHIP_ADDRESS as `0x${string}`,
      abi: PEER_MENTORSHIP_ABI,
      functionName: 'vote',
      args: [BigInt(proposalId), support],
    });
  };

  return { vote, hash, isPending, error };
}

export function useProposal(proposalId?: number) {
  const { data, isLoading, error } = useReadContract({
    address: PEER_MENTORSHIP_ADDRESS as `0x${string}`,
    abi: PEER_MENTORSHIP_ABI,
    functionName: 'getProposal',
    args: [proposalId ? BigInt(proposalId) : BigInt(0)],
    query: {
      enabled: !!proposalId,
    },
  });

  return {
    proposal: data as any,
    isLoading,
    error,
  };
}

export function useHasVotingRights(address?: `0x${string}`) {
  const { data, isLoading } = useReadContract({
    address: PEER_MENTORSHIP_ADDRESS as `0x${string}`,
    abi: PEER_MENTORSHIP_ABI,
    functionName: 'hasVotingRights',
    args: [address || '0x0000000000000000000000000000000000000000'],
    query: {
      enabled: !!address,
    },
  });

  return {
    hasRights: data as boolean || false,
    isLoading,
  };
}

export function useSessionCount() {
  const { data, isLoading } = useReadContract({
    address: PEER_MENTORSHIP_ADDRESS as `0x${string}`,
    abi: PEER_MENTORSHIP_ABI,
    functionName: 'sessionCount',
  });

  return {
    count: (data as bigint) || BigInt(0),
    isLoading,
  };
}

export function useProposalCount() {
  const { data, isLoading } = useReadContract({
    address: PEER_MENTORSHIP_ADDRESS as `0x${string}`,
    abi: PEER_MENTORSHIP_ABI,
    functionName: 'proposalCount',
  });

  return {
    count: (data as bigint) || BigInt(0),
    isLoading,
  };
}
