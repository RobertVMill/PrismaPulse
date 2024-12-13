'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface BookmarkButtonProps {
  article: {
    url: string;
    title: string;
    source: string;
    category: string;
  };
}

export default function BookmarkButton({ article }: BookmarkButtonProps) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if article is already bookmarked
    const checkBookmarkStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .select('id')
          .eq('user_id', user.id)
          .eq('article_url', article.url)
          .single();
        
        if (error && error.code !== 'PGRST116') { // Ignore "no rows returned" error
          console.error('Error checking bookmark status:', error);
          return;
        }
        
        setIsBookmarked(!!data);
      } catch (error) {
        console.error('Error in checkBookmarkStatus:', error);
      }
    };

    checkBookmarkStatus();
  }, [user, article.url]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    // Prevent the click from bubbling up to the article card
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login page
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .match({ user_id: user.id, article_url: article.url });
          
        if (error) {
          console.error('Error deleting bookmark:', error);
          throw error;
        }
      } else {
        // Add bookmark with a UUID
        const bookmarkData = {
          id: uuidv4(),
          user_id: user.id,
          article_url: article.url,
          article_title: article.title,
          article_source: article.source,
          article_category: article.category,
          created_at: new Date().toISOString()
        };

        console.log('Attempting to insert bookmark:', bookmarkData);
        
        const { error } = await supabase
          .from('bookmarks')
          .insert(bookmarkData);
          
        if (error) {
          console.error('Error inserting bookmark:', error);
          throw error;
        }
      }
      setIsBookmarked(!isBookmarked);
    } catch (error: any) {
      console.error('Error toggling bookmark:', error);
      alert(error?.message || 'Failed to update bookmark. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors ${
        isBookmarked 
          ? 'bg-blue-500/20 text-blue-400' 
          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
      }`}
      title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {isBookmarked ? (
        <BookmarkFilledIcon className="w-5 h-5" />
      ) : (
        <BookmarkOutlineIcon className="w-5 h-5" />
      )}
    </button>
  );
}

function BookmarkOutlineIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
      />
    </svg>
  );
}

function BookmarkFilledIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path 
        d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" 
      />
    </svg>
  );
}
