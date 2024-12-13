'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface CategoryFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function CategoryFilters({ selectedCategory, setSelectedCategory }: CategoryFiltersProps) {
  const containerRef = useRef(null);
  
  const categories = [
    'All',
    'AI & Machine Learning',
    'Startups & Business',
    'Cybersecurity',
    'Mobile & Apps',
    'Web & Cloud',
    'Hardware & Gadgets',
    'Social Media',
    'Gaming',
    'Other Tech'
  ];

  useGSAP(() => {
    // Stagger animation for category pills
    gsap.from('.category-pill', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out"
    });

    // Click animation
    const pills = gsap.utils.toArray('.category-pill');
    pills.forEach((pill: any) => {
      pill.addEventListener('click', () => {
        gsap.to(pill, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="flex flex-wrap gap-2 py-4">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`category-pill px-4 py-2 rounded-full text-sm transition-all duration-300 ${
            selectedCategory === category
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
} 