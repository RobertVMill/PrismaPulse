'use client';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <input
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-xl rounded-2xl
                 border border-gray-700/50 focus:border-blue-500/50
                 text-white placeholder-gray-400 
                 shadow-lg focus:shadow-blue-500/25
                 outline-none
                 transition-all duration-300"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 
                   text-gray-400 hover:text-white
                   w-8 h-8 flex items-center justify-center
                   rounded-full hover:bg-gray-700/50
                   transition-all duration-200"
        >
          ×
        </button>
      )}
    </div>
  );
} 