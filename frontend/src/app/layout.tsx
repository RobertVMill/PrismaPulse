import { Metadata } from 'next'
import { Providers } from '@/context/Providers'
import ClientLayout from '@/components/ClientLayout'
import './globals.css'

export const metadata: Metadata = {
  title: 'Signal7',
  description: 'AI-powered news aggregator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
        <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative">
          <Providers>
            <ClientLayout>
              {children}
            </ClientLayout>
          </Providers>
        </div>
      </body>
    </html>
  );
}
