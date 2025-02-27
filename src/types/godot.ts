import type { Address } from 'viem';

export type GodotWindow = Window & {
  isWalletConnected?: boolean;
  userId?: string;
  walletAddress?: Address;
  userName?: string | null;
  connectWallet?: () => void;
  disconnectWallet?: () => void;
  toggleFullscreen?: () => void;
  sendNotification?: (message: string) => void;
  openNameDialog?: () => void;
};

export type GodotIframe = HTMLIFrameElement & {
  contentWindow?: GodotWindow | null;
};
