'use client';

interface BookmarkButtonProps {
  article: {
    title: string;
    link: string;
    source: string;
    category: string;
    summary?: string;
    published?: string;
    full_content?: string;
  };
}

export default function BookmarkButton({ article }: BookmarkButtonProps) {
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Your bookmark logic here
    console.log('Bookmarking article:', article);
  };

  return (
    <button
      onClick={handleBookmark}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                bg-purple-500/10 hover:bg-purple-500/20 
                text-purple-300 hover:text-purple-200
                transition-all duration-300 ease-in-out"
    >
      <svg
        className="w-5 h-5"
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
      <span>Save</span>
    </button>
  );
}
