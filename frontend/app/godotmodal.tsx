'use client';
import { useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import { useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';

// Initialize Godot JavaScriptBridge callback handlers
const initGodotCallbacks = (JavaScriptBridge) => {
  if (!JavaScriptBridge) return;

  // Create callbacks for each game function
  const callbacks = {
    onGameCreated: JavaScriptBridge.create_callback((gameId) => {
      console.log('Game created:', gameId);
    }),
    onPlayerMatched: JavaScriptBridge.create_callback((gameId, player) => {
      console.log('Player matched:', gameId, player);
    }),
    onGameStateUpdated: JavaScriptBridge.create_callback((gameId, state) => {
      console.log('Game state updated:', gameId, state);
    }),
    onTossResult: JavaScriptBridge.create_callback((gameId, winner) => {
      console.log('Toss result:', gameId, winner);
    })
  };

  return callbacks;
};

export default function Web3GodotBridge() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const contractAddress = "0xFA443F4E9F7A22dcaBD87bc70B04cc00470a40ff";

  // Contract write operations
  const { writeContract: createGame } = useWriteContract();
  const { writeContract: joinGame } = useWriteContract();
  const { writeContract: toss } = useWriteContract();
  const { writeContract: selectGameMode } = useWriteContract();
  const { writeContract: concede } = useWriteContract();
  const { writeContract: submitScores } = useWriteContract();

  useEffect(() => {
    // Window functions for Godot to call
    window.connectWallet = async () => {
      if (!authenticated) {
        await login();
      }
      return address;
    };

    window.disconnectWallet = async () => {
      disconnect();
      logout();
    };

    window.createGame = async (entryFeeEth) => {
      try {
        const tx = await createGame({
          address: contractAddress,
          abi: contractABI,
          functionName: 'createGame',
          value: parseEther(entryFeeEth.toString())
        });
        return tx;
      } catch (error) {
        console.error('Error creating game:', error);
        throw error;
      }
    };

    window.joinGame = async (gameId, entryFeeEth) => {
      try {
        const tx = await joinGame({
          address: contractAddress,
          abi: contractABI,
          functionName: 'joinGame',
          args: [BigInt(gameId)],
          value: parseEther(entryFeeEth.toString())
        });
        return tx;
      } catch (error) {
        console.error('Error joining game:', error);
        throw error;
      }
    };

    window.performToss = async (gameId) => {
      try {
        const tx = await toss({
          address: contractAddress,
          abi: contractABI,
          functionName: 'toss',
          args: [BigInt(gameId)]
        });
        return tx;
      } catch (error) {
        console.error('Error performing toss:', error);
        throw error;
      }
    };

    window.selectGameMode = async (gameId, mode) => {
      try {
        const tx = await selectGameMode({
          address: contractAddress,
          abi: contractABI,
          functionName: 'selectGameMode',
          args: [BigInt(gameId), mode]
        });
        return tx;
      } catch (error) {
        console.error('Error selecting game mode:', error);
        throw error;
      }
    };

    window.concedeGame = async (gameId) => {
      try {
        const tx = await concede({
          address: contractAddress,
          abi: contractABI,
          functionName: 'concede',
          args: [BigInt(gameId)]
        });
        return tx;
      } catch (error) {
        console.error('Error conceding game:', error);
        throw error;
      }
    };

    window.submitGameScores = async (gameId, player1Score, player2Score) => {
      try {
        const tx = await submitScores({
          address: contractAddress,
          abi: contractABI,
          functionName: 'submitScores',
          args: [BigInt(gameId), BigInt(player1Score), BigInt(player2Score)]
        });
        return tx;
      } catch (error) {
        console.error('Error submitting scores:', error);
        throw error;
      }
    };

    window.getWalletAddress = () => {
      return address;
    };

    window.isWalletConnected = () => {
      return isConnected;
    };

    // Cleanup
    return () => {
      delete window.connectWallet;
      delete window.disconnectWallet;
      delete window.createGame;
      delete window.joinGame;
      delete window.performToss;
      delete window.selectGameMode;
      delete window.concedeGame;
      delete window.submitGameScores;
      delete window.getWalletAddress;
      delete window.isWalletConnected;
    };
  }, [address, authenticated, createGame, disconnect, isConnected, joinGame, login, logout, selectGameMode, submitScores, toss]);

  return null; // This component doesn't render anything
}
