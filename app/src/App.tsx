import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { RPC_ENDPOINT } from "./lib/solana";
import { WalletButton } from "./components/WalletButton";
import { InitializeButton } from "./components/InitializeButton";
import { CreatePollForm } from "./components/CreatePollForm";
import { PollList } from "./components/PollList";

function App() {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-10">
              <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">Voting App</h1>
                <WalletButton />
              </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-6">
              <InitializeButton />
              <CreatePollForm />
              <PollList />
            </main>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
