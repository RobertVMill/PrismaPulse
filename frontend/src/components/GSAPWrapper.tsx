'use client';

import { ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Navbar from './Navbar';

// Register GSAP plugins
gsap.registerPlugin(useGSAP);

interface GSAPWrapperProps {
  children: ReactNode;
}

export default function GSAPWrapper({ children }: GSAPWrapperProps) {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
    </>
  );
} 