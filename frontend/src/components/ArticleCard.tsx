'use client';

import BookmarkButton from './BookmarkButton';
import { useAuth } from '@/context/AuthContext';

interface ArticleCardProps {
  article: {
    title: string;
    link: string;
    source: string;
    category: string;
    summary?: string;
    published?: string;
    full_content?: string;
  };
  index: number;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { user } = useAuth();

  const handleArticleClick = () => {
    if (article?.link) {
      window.open(article.link, '_blank', 'noopener,noreferrer');
    } else {
      console.error('No link available for article:', article);
    }
  };

  return (
    <div className="group h-full">
      <div 
        onClick={handleArticleClick}
        className="h-full glass-effect rounded-xl p-6 
                  hover:scale-[1.02] hover-glass-effect
                  transform transition-all duration-300 ease-out
                  cursor-pointer"
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
            <span className="bg-gray-700/40 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
              {article.source}
            </span>
            <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
              {article.category}
            </span>
            {article.published && (
              <span className="text-gray-500 text-xs">
                {new Date(article.published).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-white/90 group-hover:text-white 
                         leading-tight mb-3 line-clamp-3">
              {article.title}
            </h2>
            {article.summary && (
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 group-hover:text-gray-300">
                {article.summary}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 mt-auto">
            {user && <BookmarkButton article={article} />}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleArticleClick();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                       bg-blue-500/10 hover:bg-blue-500/20 
                       text-blue-300 hover:text-blue-200
                       transition-all duration-300 ease-in-out ml-auto"
            >
              Read More
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14 5l7 7m0 0l-7 7m7-7H3" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
