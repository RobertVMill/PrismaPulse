'use client';

import { useState } from 'react';

interface AskAIProps {
  title: string;
  summary: string;
  onClose: () => void;
}

export default function AskAI({ title, summary, onClose }: AskAIProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          title,
          summary,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ask AI about this article</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about this article..."
              className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Asking AI...' : 'Ask Question'}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-400 text-sm">
            Error: {error}
          </div>
        )}

        {answer && (
          <div className="mt-4 p-4 bg-gray-700 rounded">
            <p className="text-sm text-gray-300">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
