'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
          <Link href="/" className="text-xl font-bold text-white mr-8">
            Signal7
          </Link>
          
          <div className="flex space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm ${
                pathname === '/' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/article-writer"
              className={`px-3 py-2 rounded-md text-sm ${
                pathname === '/article-writer' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Article Writer
            </Link>
            <Link
              href="/bookmarks"
              className={`px-3 py-2 rounded-md text-sm ${
                pathname === '/bookmarks' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Bookmarks
            </Link>
            <Link
              href="/big-tech"
              className={`px-3 py-2 rounded-md text-sm ${
                pathname === '/big-tech' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Big Tech Tracker
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
