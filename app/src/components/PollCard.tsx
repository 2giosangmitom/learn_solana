import { useState } from "react";
import { useVoting } from "../hooks/useVoting";
import type { Poll } from "../types";

export function PollCard({ poll }: { poll: Poll }) {
  const { vote } = useVoting();
  const [votingIndex, setVotingIndex] = useState<number | null>(null);
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleVote = async (optionIndex: number) => {
    setVotingIndex(optionIndex);
    try {
      await vote(poll.id, optionIndex);
    } catch (err) {
      console.error("Vote failed:", err);
    } finally {
      setVotingIndex(null);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-5">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-semibold">{poll.title}</h3>
        <span className="text-xs text-gray-400 font-mono">
          #{poll.id}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4">{poll.description}</p>

      <div className="space-y-3">
        {poll.options.map((opt, i) => {
          const pct = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
          return (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{opt.label}</span>
                <span className="text-gray-500">
                  {opt.votes} vote{opt.votes !== 1 ? "s" : ""} ({pct.toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 relative overflow-hidden">
                <div
                  className="bg-violet-500 h-2.5 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <button
                onClick={() => handleVote(i)}
                disabled={votingIndex !== null}
                className="mt-1 text-xs text-violet-600 hover:text-violet-800 disabled:text-gray-400 font-medium"
              >
                {votingIndex === i ? "Voting..." : "Vote"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
