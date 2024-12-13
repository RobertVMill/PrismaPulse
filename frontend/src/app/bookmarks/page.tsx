'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import BookmarkButton from '@/components/BookmarkButton';

interface Bookmark {
  id: string;
  article_url: string;
  article_title: string;
  article_source: string;
  article_category: string;
  created_at: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        // Your fetch bookmarks logic here
        setBookmarks([]); // Replace with actual bookmarks data
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Your Bookmarks</h1>
      
      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No bookmarks yet</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-gray-800/30 hover:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 
                        border border-gray-700/30 hover:border-gray-600/50 
                        transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
                  <span className="bg-gray-700/40 text-gray-300 px-3 py-1 rounded-full text-xs">
                    {bookmark.article_source}
                  </span>
                  <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs">
                    {bookmark.article_category}
                  </span>
                </div>

                <a
                  href={bookmark.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-400 font-medium block mb-4"
                >
                  {bookmark.article_title}
                </a>

                <div className="mt-auto">
                  <BookmarkButton
                    article={{
                      link: bookmark.article_url,
                      title: bookmark.article_title,
                      source: bookmark.article_source,
                      category: bookmark.article_category,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
