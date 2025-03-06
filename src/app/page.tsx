'use client';

import type { GodotIframe } from '@/types/godot';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useDisconnect } from 'wagmi';
import Maintenance from './_components/Maintenance';
import UsernameDialog from './_components/UsernameDialog';

const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE === 'true';

export default function Home() {
  const godotRef = useRef<GodotIframe>(null);
  const { openConnectModal } = useConnectModal();
  const { data: session } = useSession();
  const { disconnect } = useDisconnect();
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);

  const disconnectWallet = () => {
    disconnect();
    signOut({ redirect: false });
  };

  // Expose functions to the game
  useEffect(() => {
    const godotWindow = godotRef.current?.contentWindow;

    if (godotWindow) {
      godotWindow.connectWallet = () => openConnectModal?.();
      godotWindow.disconnectWallet = disconnectWallet;
      godotWindow.toggleFullscreen = toggleFullscreen;
      godotWindow.sendNotification = (message: string) => toast(message);
      godotWindow.openUsernameDialog = () => setIsUsernameDialogOpen(true);
    }
  }, []);

  // Sync wallet state with the game
  useEffect(() => {
    const godotWindow = godotRef.current?.contentWindow;

    if (godotWindow) {
      godotWindow.isWalletConnected = !!session;
      godotWindow.userId = session?.user.id;
      godotWindow.walletAddress = session?.user.walletAddress;
      godotWindow.username = session?.user.username;
    }
  }, [session]);

  if (isMaintenance) return <Maintenance />;

  return (
    <>
      <iframe
        ref={godotRef}
        title="Velocity Rush"
        src="/velocity-rush/index.html"
        className="h-screen w-full"
      />

      <UsernameDialog
        open={isUsernameDialogOpen}
        onClose={() => setIsUsernameDialogOpen(false)}
      />
    </>
  );
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
