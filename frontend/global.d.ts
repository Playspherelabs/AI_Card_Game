declare global {
  interface Window {
    connectWallet: () => Promise<string | undefined>;
    getGameDetails: (gameId: number) => Promise<any>;
    createGame: () => Promise<void>;
    signMessage: (message: string) => Promise<string>;
    disconnectWallet: () => Promise<void>;
  }
}

