import { useState } from "react";
import { useVoting } from "../hooks/useVoting";

export function InitializeButton() {
  const { globalState, initialize } = useVoting();
  const [initializing, setInitializing] = useState(false);

  const handleInitialize = async () => {
    setInitializing(true);
    try {
      await initialize();
    } catch (err) {
      console.error("Initialize failed:", err);
    } finally {
      setInitializing(false);
    }
  };

  if (globalState !== null) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <p className="text-amber-800 text-sm mb-3">
        Program not initialized. Click the button below to initialize it (one-time admin setup).
      </p>
      <button
        onClick={handleInitialize}
        disabled={initializing}
        className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {initializing ? "Initializing..." : "Initialize Program"}
      </button>
    </div>
  );
}
