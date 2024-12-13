'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ArticleCard from './ArticleCard';

interface Article {
  title: string;
  link: string;
  source: string;
  category: string;
  summary?: string;
  published?: string;
  full_content?: string;
}

export default function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/news');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchArticles();
    }
  }, [user]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400">Loading latest articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-lg">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Latest Tech News</h1>
          <p className="text-gray-400">Stay updated with the latest in technology</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <ArticleCard 
            key={article.link} 
            article={article} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
