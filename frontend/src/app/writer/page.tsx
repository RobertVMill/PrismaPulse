'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ArticleWriter from '@/components/ArticleWriter';

export default function WriterPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isLoading && !user) {
          router.push('/login?redirect=/writer');
        }
      } catch (err) {
        setError('Authentication error. Please try logging in again.');
        router.push('/login');
      }
    };

    checkAuth();
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Article Writer Assistant</h1>
        <ArticleWriter />
      </div>
    </main>
  );
}
