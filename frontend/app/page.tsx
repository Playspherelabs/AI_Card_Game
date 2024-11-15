'use client';
import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import { useReadContract, useWriteContract } from 'wagmi';
import Button from 'components/Button';
import { parseEther } from 'viem';
import {abi} from "./abi";
const GameState = {
  MATCHING: 0,
  CARD_DISTRIBUTION: 1,
  SWAP_PHASE: 2,
  TOSS_PHASE: 3,
  BATTLE_PHASE: 4,
  SETTLEMENT: 5
};

const GameMode = {
  NONE: 0,
  BULL_MARKET: 1,
  BEAR_MARKET: 2
};

export default function ChainSmashPage() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  const [gameId, setGameId] = useState('');
  const [entryFee, setEntryFee] = useState('0.01');
  const [scores, setScores] = useState({ player1: '0', player2: '0' });
  const [loading, setLoading] = useState(false);
 const contractABI = abi; 
  const contractAddress = "0xFA443F4E9F7A22dcaBD87bc70B04cc00470a40ff";

  // Contract read operations
  const { data: gameDetails } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'games',
    args: [gameId ? BigInt(gameId) : BigInt(0)],
    enabled: !!gameId
  });

  // Contract write operations
  const { writeContract: createGame } = useWriteContract();
  const { writeContract: joinGame } = useWriteContract();
  const { writeContract: toss } = useWriteContract();
  const { writeContract: selectGameMode } = useWriteContract();
  const { writeContract: concede } = useWriteContract();
  const { writeContract: submitScores } = useWriteContract();

  const handleCreateGame = async () => {
    try {
      setLoading(true);
      await createGame({
        address: contractAddress,
        abi: contractABI,
        functionName: 'createGame',
        value: parseEther(entryFee)
      });
    } catch (error) {
      console.error('Error creating game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    try {
      setLoading(true);
      await joinGame({
        address: contractAddress,
        abi: contractABI,
        functionName: 'joinGame',
        args: [BigInt(gameId)],
        value: parseEther(entryFee)
      });
    } catch (error) {
      console.error('Error joining game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToss = async () => {
    try {
      setLoading(true);
      await toss({
        address: contractAddress,
        abi: contractABI,
        functionName: 'toss',
        args: [BigInt(gameId)]
      });
    } catch (error) {
      console.error('Error performing toss:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGameMode = async (mode) => {
    try {
      setLoading(true);
      await selectGameMode({
        address: contractAddress,
        abi: contractABI,
        functionName: 'selectGameMode',
        args: [BigInt(gameId), mode]
      });
    } catch (error) {
      console.error('Error selecting game mode:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConcede = async () => {
    try {
      setLoading(true);
      await concede({
        address: contractAddress,
        abi: contractABI,
        functionName: 'concede',
        args: [BigInt(gameId)]
      });
    } catch (error) {
      console.error('Error conceding game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitScores = async () => {
    try {
      setLoading(true);
      await submitScores({
        address: contractAddress,
        abi: contractABI,
        functionName: 'submitScores',
        args: [
          BigInt(gameId),
          BigInt(scores.player1),
          BigInt(scores.player2)
        ]
      });
    } catch (error) {
      console.error('Error submitting scores:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Authentication Section */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex gap-4">
            {!authenticated ? (
              <Button 
                cta="Connect Wallet" 
                onClick_={login}
                disabled={loading} 
              />
            ) : (
              <>
                <span className="font-mono bg-slate-200 px-3 py-2 rounded">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Button 
                  cta="Disconnect" 
                  onClick_={() => {
                    disconnect();
                    logout();
                  }}
                  disabled={loading}
                />
              </>
            )}
          </div>
        </div>

        {authenticated && (
          <div className="space-y-8">
            {/* Create Game Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Create New Game</h2>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  value={entryFee}
                  onChange={(e) => setEntryFee(e.target.value)}
                  className="border rounded px-3 py-2 w-32"
                  placeholder="Entry Fee (ETH)"
                />
                <Button
                  cta="Create Game"
                  onClick_={handleCreateGame}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Join Game Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Join Game</h2>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  className="border rounded px-3 py-2 w-32"
                  placeholder="Game ID"
                />
                <Button
                  cta="Join Game"
                  onClick_={handleJoinGame}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Game Actions Section */}
            {gameId && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Game Actions</h2>
                <div className="space-y-4">
                  {/* Toss */}
                  <div>
                    <Button
                      cta="Perform Toss"
                      onClick_={handleToss}
                      disabled={loading || !gameDetails?.state === GameState.CARD_DISTRIBUTION}
                    />
                  </div>

                  {/* Select Game Mode */}
                  <div className="flex gap-4">
                    <Button
                      cta="Select Bull Market"
                      onClick_={() => handleSelectGameMode(GameMode.BULL_MARKET)}
                      disabled={loading || !gameDetails?.state === GameState.TOSS_PHASE}
                    />
                    <Button
                      cta="Select Bear Market"
                      onClick_={() => handleSelectGameMode(GameMode.BEAR_MARKET)}
                      disabled={loading || !gameDetails?.state === GameState.TOSS_PHASE}
                    />
                  </div>

                  {/* Submit Scores */}
                  <div className="space-y-2">
                    <div className="flex gap-4 items-center">
                      <input
                        type="text"
                        value={scores.player1}
                        onChange={(e) => setScores(prev => ({ ...prev, player1: e.target.value }))}
                        className="border rounded px-3 py-2 w-32"
                        placeholder="Player 1 Score"
                      />
                      <input
                        type="text"
                        value={scores.player2}
                        onChange={(e) => setScores(prev => ({ ...prev, player2: e.target.value }))}
                        className="border rounded px-3 py-2 w-32"
                        placeholder="Player 2 Score"
                      />
                    </div>
                    <Button
                      cta="Submit Scores"
                      onClick_={handleSubmitScores}
                      disabled={loading || !gameDetails?.state === GameState.BATTLE_PHASE}
                    />
                  </div>

                  {/* Concede */}
                  <div>
                    <Button
                      cta="Concede Game"
                      onClick_={handleConcede}
                      disabled={loading || gameDetails?.state === GameState.SETTLEMENT}
                      className="bg-red-500 hover:bg-red-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Game Details Section */}
            {gameDetails && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Game Details</h2>
                <div className="space-y-2">
                  <p><strong>Player 1:</strong> {gameDetails.player1}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
