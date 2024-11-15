// App.ts
// x
"use client"
import { useEffect, useState, useRef } from 'react';
import { WagmiProvider} from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useDisconnect, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import {abi} from "./abi";
// Types for Godot communication
interface GodotMessage {
  type: string;
  data?: any;
}

function App() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { writeContract } = useWriteContract();
  const godotIframeRef = useRef<HTMLIFrameElement>(null);
  const ChainSmashABI = abi;
  // Function to send messages to Godot
  const sendToGodot = (message: GodotMessage) => {
    if (godotIframeRef.current?.contentWindow) {
      godotIframeRef.current.contentWindow.postMessage(message, '*');
    }
  };

  // Initialize bridge functions
  useEffect(() => {
    if (!ready) return;

    // Bridge functions for direct Godot calls
    window.chainSmashBridge = {
      // Wallet functions
      async connectWallet() {
        try {
          if (!authenticated) {
            await login();
          }
          return { success: true, address };
        } catch (error) {
          console.error('Error connecting wallet:', error);
          return { success: false, error: 'Failed to connect wallet' };
        }
      },

      async disconnectWallet() {
        try {
          await disconnect();
          await logout();
          return { success: true };
        } catch (error) {
          console.error('Error disconnecting wallet:', error);
          return { success: false, error: 'Failed to disconnect wallet' };
        }
      },

      // Game functions
      async createGame(entryFee: string) {
        try {
          if (!isConnected) return { success: false, error: 'Wallet not connected' };
          
          const tx = await writeContract({
            address: process.env.VITE_CONTRACT_ADDRESS as `0x${string}`,
            abi: ChainSmashABI,
            functionName: 'createGame',
            value: parseEther(0)
          });
          
          const receipt = await tx.wait();
          const event = receipt.logs.find(log => log.eventName === 'GameCreated');
          
          if (event) {
            return { 
              success: true, 
              gameId: event.args.gameId.toString() 
            };
          }
          return { success: false, error: 'Game creation failed' };
        } catch (error) {
          console.error('Error creating game:', error);
          return { success: false, error: 'Failed to create game' };
        }
      },

      async joinGame(gameId: string, entryFee: string) {
        try {
          if (!isConnected) return { success: false, error: 'Wallet not connected' };

          const tx = await writeContract({
            address: process.env.VITE_CONTRACT_ADDRESS as `0x${string}`,
            abi: ChainSmashABI,
            functionName: 'joinGame',
            args: [BigInt(gameId)],
            value: parseEther(entryFee)
          });

          await tx.wait();
          return { success: true };
        } catch (error) {
          console.error('Error joining game:', error);
          return { success: false, error: 'Failed to join game' };
        }
      },

      async performToss(gameId: string) {
        try {
          if (!isConnected) return { success: false, error: 'Wallet not connected' };

          const tx = await writeContract({
            address: process.env.VITE_CONTRACT_ADDRESS as `0x${string}`,
            abi: ChainSmashABI,
            functionName: 'toss',
            args: [BigInt(gameId)]
          });

          const receipt = await tx.wait();
          const event = receipt.logs.find(log => log.eventName === 'TossResult');

          if (event) {
            return { 
              success: true, 
              winner: event.args.tossWinner 
            };
          }
          return { success: false, error: 'Toss failed' };
        } catch (error) {
          console.error('Error performing toss:', error);
          return { success: false, error: 'Failed to perform toss' };
        }
      },

      async selectGameMode(gameId: string, mode: number) {
        try {
          if (!isConnected) return { success: false, error: 'Wallet not connected' };

          const tx = await writeContract({
            address: process.env.VITE_CONTRACT_ADDRESS as `0x${string}`,
            abi: ChainSmashABI,
            functionName: 'selectGameMode',
            args: [BigInt(gameId), mode]
          });

          await tx.wait();
          return { success: true };
        } catch (error) {
          console.error('Error selecting game mode:', error);
          return { success: false, error: 'Failed to select game mode' };
        }
      },

      async submitScores(gameId: string, p1Score: string, p2Score: string) {
        try {
          if (!isConnected) return { success: false, error: 'Wallet not connected' };

          const tx = await writeContract({
            address: process.env.VITE_CONTRACT_ADDRESS as `0x${string}`,
            abi: ChainSmashABI,
            functionName: 'submitScores',
            args: [BigInt(gameId), BigInt(p1Score), BigInt(p2Score)]
          });

          await tx.wait();
          return { success: true };
        } catch (error) {
          console.error('Error submitting scores:', error);
          return { success: false, error: 'Failed to submit scores' };
        }
      }
    };

    // Listen for messages from Godot
    const handleGodotMessage = (event: MessageEvent) => {
      if (!event.data?.type) return;

      switch (event.data.type) {
        case 'CONNECT_WALLET':
          window.chainSmashBridge.connectWallet()
            .then(result => sendToGodot({ 
              type: 'WALLET_CONNECTED', 
              data: result 
            }));
          break;

        case 'DISCONNECT_WALLET':
          window.chainSmashBridge.disconnectWallet()
            .then(result => sendToGodot({ 
              type: 'WALLET_DISCONNECTED', 
              data: result 
            }));
          break;

        // Add other message handlers as needed
      }
    };

    window.addEventListener('message', handleGodotMessage);
    return () => window.removeEventListener('message', handleGodotMessage);
  }, [ready, authenticated, isConnected, address]);

  return (
      <div className="w-screen h-screen bg-gray-900">
        <iframe
          ref={godotIframeRef}
          src="/godot.html"
          className="w-full h-full border-none"
          allow="autoplay"
        />
      </div>
  );
}

export default App;

// Add TypeScript declarations
declare global {
  interface Window {
    chainSmashBridge: {
      connectWallet: () => Promise<{ success: boolean; address?: string; error?: string }>;
      disconnectWallet: () => Promise<{ success: boolean; error?: string }>;
      createGame: (entryFee: string) => Promise<{ success: boolean; gameId?: string; error?: string }>;
      joinGame: (gameId: string, entryFee: string) => Promise<{ success: boolean; error?: string }>;
      performToss: (gameId: string) => Promise<{ success: boolean; winner?: string; error?: string }>;
      selectGameMode: (gameId: string, mode: number) => Promise<{ success: boolean; error?: string }>;
      submitScores: (gameId: string, p1Score: string, p2Score: string) => Promise<{ success: boolean; error?: string }>;
    };
  }
}
