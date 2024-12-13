'use client';

import { useState, useEffect } from 'react';

interface Update {
  id: string;
  company: string;
  category: string;
  title: string;
  content: string;
  date: string;
  source_url: string;
}

interface CompanyMatrix {
  [company: string]: {
    [category: string]: Update;
  };
}

export default function BigTechTracker() {
  const [matrix, setMatrix] = useState<CompanyMatrix | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const companies = ['NVIDIA', 'META', 'APPLE', 'MICROSOFT', 'ALPHABET', 'AMAZON', 'TESLA'];
  const categories = ['REGULATORY', 'PRODUCT', 'INVESTMENT', 'AI_DEVELOPMENT', 'PARTNERSHIPS', 'MARKET_IMPACT'];

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/big-tech-matrix`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setMatrix(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMatrix();
  }, []);

  if (loading) return (
    <div className="text-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-400">Loading big tech updates...</p>
    </div>
  );

  if (error) return (
    <div className="text-red-500 p-8 text-center">
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-6">Big Tech Tracker</h2>
      
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        {companies.map((company) => (
          <button
            key={company}
            onClick={() => setSelectedCompany(company === selectedCompany ? null : company)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              company === selectedCompany
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {company}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category} className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-gray-300 mb-4">
              {category.replace('_', ' ')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {companies
                .filter((company) => !selectedCompany || company === selectedCompany)
                .map((company) => {
                  const update = matrix?.[company]?.[category];
                  return update ? (
                    <div
                      key={`${company}-${category}`}
                      className="bg-gray-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-blue-400 font-medium">{company}</h4>
                        <span className="text-xs text-gray-400">
                          {new Date(update.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h5 className="text-white font-medium mb-2">{update.title}</h5>
                      <p className="text-gray-300 text-sm mb-3">{update.content}</p>
                      <a
                        href={update.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-sm hover:underline"
                      >
                        Read More →
                      </a>
                    </div>
                  ) : null;
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 