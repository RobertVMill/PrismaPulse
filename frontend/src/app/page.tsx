import Image from 'next/image'
import NewsFeed from '../components/NewsFeed';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">PrismaPulse News</h1>
        <NewsFeed />
      </div>
    </main>
  )
}
