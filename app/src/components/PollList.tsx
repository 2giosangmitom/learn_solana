import { useEffect } from "react";
import { useVoting } from "../hooks/useVoting";
import { PollCard } from "./PollCard";

export function PollList() {
  const { polls, loading, fetchPolls } = useVoting();

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  if (loading && polls.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">Loading polls...</div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No polls yet. Create one above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Polls ({polls.length})</h2>
        <button
          onClick={fetchPolls}
          disabled={loading}
          className="text-sm text-violet-600 hover:text-violet-700 font-medium"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
