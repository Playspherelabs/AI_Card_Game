'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import Button from 'components/Button';
import Image from 'next/image';
import wagmiPrivyLogo from '../public/wagmi_privy_logo.png';
import { shorten } from 'lib/utils';

export default function Home() {
  // Privy and WAGMI hooks
  const { ready, authenticated, login, logout } = usePrivy();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!ready) {
    return null;
  }

  return (
    <>
      <main className="min-h-screen bg-slate-200 p-4 text-slate-800 relative">

        {/* Button on top right */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {/* Display user's address */}
          {isConnected && address && (
            <div className="text-sm text-slate-800">
              <span className="font-medium">Address: </span>
              <span className="bg-slate-200 px-2 py-1 rounded-xl font-mono">
                {shorten(address)}
              </span>
            </div>
          )}

          {/* Login or Logout button */}
          {!authenticated ? (
            <Button cta="Login with Privy" onClick_={login} />
          ) : (
            <>
              <Button cta="Logout from Privy" onClick_={logout} />
              {/* Disconnect button for WAGMI */}
              <Button cta="Disconnect" onClick_={disconnect} />
            </>
          )}

          {/* Play Game button */}
          <Button cta="Play Game" onClick_={() => alert("Game button clicked!")} />
        </div>

        {/* Blank space in the middle */}
        <div className="flex justify-center items-center h-full">
          {/* This space is intentionally left blank */}
        </div>

        {/* Iframe for game */}
        <div className="mt-8">
          <iframe
            src="https://your-game-url.com"
            width="100%"
            height="600"
            className="border rounded-lg"
            title="Game Iframe"
          />
        </div>
      </main>
    </>
  );
}

