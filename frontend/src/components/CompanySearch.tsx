'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  founded_year?: number;
}

export default function CompanySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/companies/search?q=${encodeURIComponent(query)}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to search companies. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search companies..."
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((company) => (
          <div
            key={company.id}
            onClick={() => router.push(`/companies/${company.id}`)}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-lg cursor-pointer transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">{company.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{company.description}</p>
            <div className="flex gap-2 text-xs text-gray-500">
              <span>{company.industry}</span>
              <span>•</span>
              <span>{company.location}</span>
              {company.founded_year && (
                <>
                  <span>•</span>
                  <span>Founded {company.founded_year}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && !isLoading && query && (
        <div className="text-center text-gray-500 mt-8">
          No companies found matching your search.
        </div>
      )}
    </div>
  );
}
