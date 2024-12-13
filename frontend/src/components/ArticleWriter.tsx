'use client';

import { useState } from 'react';

export default function ArticleWriter() {
  const [topic, setTopic] = useState('');
  const [article, setArticle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic })
      });

      if (!response.ok) {
        throw new Error('Failed to generate article');
      }

      const data = await response.json();
      setArticle(data.article);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate article');
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/test');
      const data = await response.json();
      alert(data.message);
    } catch (err) {
      console.error('Test failed:', err);
      alert('Failed to connect to API');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={testConnection}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Test API Connection
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={generateArticle} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">
            Article Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter a topic for your article"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate Article'}
        </button>
      </form>

      {article && (
        <div className="prose prose-invert max-w-none">
          <h2 className="text-xl font-semibold mb-4">Generated Article</h2>
          <div className="bg-gray-800 p-6 rounded-lg whitespace-pre-wrap">
            {article}
          </div>
        </div>
      )}
    </div>
  );
}
