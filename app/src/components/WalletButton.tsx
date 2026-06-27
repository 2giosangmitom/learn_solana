import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";

export function WalletButton() {
  const { connected } = useWallet();

  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <WalletMultiButton className="!bg-violet-600 hover:!bg-violet-700 !rounded-lg !h-10 !text-sm" />
        <WalletDisconnectButton className="!bg-gray-600 hover:!bg-gray-700 !rounded-lg !h-10 !text-sm" />
      </div>
    );
  }

  return <WalletMultiButton className="!bg-violet-600 hover:!bg-violet-700 !rounded-lg !h-10" />;
}
