'use client';

import type { GodotIframe } from '@/types/godot';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { signOut, useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useDisconnect } from 'wagmi';
import UsernameDialog from './_components/UsernameDialog';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Home() {
  const godotRef = useRef<GodotIframe>(null);
  const { data: session } = useSession();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);

  const disconnectWallet = useCallback(() => {
    disconnect();
    signOut({ redirect: false });
  }, [disconnect]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Expose necessary functions and variables to the game
  useEffect(() => {
    const godotWindow = godotRef.current?.contentWindow;

    if (godotWindow) {
      godotWindow.apiBaseUrl = apiBaseUrl;
      godotWindow.connectWallet = () => openConnectModal?.();
      godotWindow.disconnectWallet = disconnectWallet;
      godotWindow.toggleFullscreen = toggleFullscreen;
      godotWindow.sendNotification = (message: string) => toast(message);
      godotWindow.openUsernameDialog = () => setIsUsernameDialogOpen(true);
    }
  }, [disconnectWallet, openConnectModal, toggleFullscreen]);

  // Sync wallet/session state with the game
  useEffect(() => {
    const godotWindow = godotRef.current?.contentWindow;

    if (godotWindow) {
      godotWindow.isWalletConnected = !!session;
      godotWindow.userId = session?.user.id;
      godotWindow.walletAddress = session?.user.walletAddress;
      godotWindow.username = session?.user.username;
    }
  }, [session]);

  return (
    <>
      <iframe
        ref={godotRef}
        title="Velocity Rush"
        src="/velocity-rush/index.html"
        className="h-screen w-full"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />

      <UsernameDialog
        isOpen={isUsernameDialogOpen}
        onClose={() => setIsUsernameDialogOpen(false)}
      />
    </>
  );
}
