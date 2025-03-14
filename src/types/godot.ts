import type { Address } from 'viem';

export type GodotWindow = Window & {
  isWalletConnected?: boolean;
  userId?: string;
  walletAddress?: Address;
  username?: string | null;
  baseApiUrl?: string;
  connectWallet?: () => void;
  disconnectWallet?: () => void;
  toggleFullscreen?: () => void;
  sendNotification?: (message: string) => void;
  openUsernameDialog?: () => void;
};

export type GodotIframe = HTMLIFrameElement & {
  contentWindow?: GodotWindow | null;
};
