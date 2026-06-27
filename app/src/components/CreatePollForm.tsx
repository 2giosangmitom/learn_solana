import { useState } from "react";
import { useVoting } from "../hooks/useVoting";

export function CreatePollForm() {
  const { createPoll } = useVoting();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addOption = () => {
    if (options.length < 10) setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required");
    if (!description.trim()) return setError("Description is required");
    const filledOptions = options.filter((o) => o.trim());
    if (filledOptions.length < 2) return setError("At least 2 options required");

    setSubmitting(true);
    try {
      await createPoll(title.trim(), description.trim(), filledOptions);
      setTitle("");
      setDescription("");
      setOptions(["", ""]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create poll");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-5 mb-6">
      <h2 className="text-lg font-semibold mb-4">Create New Poll</h2>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your poll about?"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
          maxLength={100}
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add some context..."
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none"
          rows={2}
          maxLength={200}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
                maxLength={100}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="text-red-400 hover:text-red-600 px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 10 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-2 text-violet-600 hover:text-violet-700 text-sm font-medium"
          >
            + Add option
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {submitting ? "Creating..." : "Create Poll"}
      </button>
    </form>
  );
}
