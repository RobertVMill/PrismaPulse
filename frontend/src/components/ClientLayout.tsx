'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
    </div>
  );
} 