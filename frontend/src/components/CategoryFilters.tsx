'use client';

import { useRef } from 'react';

interface CategoryFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function CategoryFilters({ 
  selectedCategory, 
  setSelectedCategory 
}: CategoryFiltersProps) {
  const categories = [
    'All',
    'AI & Machine Learning',
    'Business & Finance',
    'Cybersecurity',
    'Hardware',
    'Software Development',
    'Startups'
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
            ${selectedCategory === category
              ? 'bg-blue-500 text-white'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
} 