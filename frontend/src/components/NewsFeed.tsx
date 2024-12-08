'use client';

import { useEffect, useState } from 'react';
import AskAI from './AskAI';

interface NewsArticle {
  title: string;
  link: string;
  published: string;
  summary: string;
  source: string;
  key_takeaway: string | null;
}

export default function NewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const fetchNews = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`);
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setArticles(data);
      setFilteredArticles(data);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  if (loading) return (
    <div className="text-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p>Loading news...</p>
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 p-8 text-center">
      <p>Error: {error}</p>
      <button 
        onClick={fetchNews}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div>
      {selectedArticle && (
        <AskAI
          title={selectedArticle.title}
          summary={selectedArticle.summary}
          onClose={() => setSelectedArticle(null)}
        />
      )}
      
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
        <button
          onClick={fetchNews}
          disabled={isRefreshing}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="space-y-6">
        {filteredArticles.length === 0 ? (
          <p className="text-center text-gray-400">No articles found matching your search.</p>
        ) : (
          filteredArticles.map((article, index) => (
            <article 
              key={index} 
              className="bg-white/5 p-6 rounded-lg shadow-lg hover:bg-white/10 transition border border-white/10"
            >
              <div className="flex justify-between items-start gap-4">
                <h2 className="text-xl font-semibold mb-2">
                  <a 
                    href={article.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {article.title}
                  </a>
                </h2>
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition whitespace-nowrap"
                >
                  Ask AI
                </button>
              </div>
              
              {article.key_takeaway && (
                <p className="text-green-400 text-sm mb-3 border-l-2 border-green-500 pl-3">
                  Key Takeaway: {article.key_takeaway}
                </p>
              )}
              
              <p className="text-gray-300 text-sm mb-3">
                {new Date(article.published).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              
              <p className="text-gray-400 line-clamp-3">{article.summary}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
