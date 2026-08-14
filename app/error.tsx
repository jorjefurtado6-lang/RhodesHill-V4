'use client';

import { useEffect } from 'react';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1C1C1A] flex flex-col items-center justify-center px-6 text-center">
      <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#87735A] mb-4">
        System Notice
      </span>
      <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#1C1C1A] mb-6">
        An unexpected error occurred
      </h1>
      <p className="font-sans text-base text-[#1C1C1A]/70 max-w-md mb-10 font-light leading-relaxed">
        Our technical concierge team has been notified. You can attempt to refresh the session or return to the main showcase.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-[#927A50] hover:bg-[#7D6740] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all duration-300 shadow-md cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-[#1C1C1A]/20 hover:border-[#1C1C1A] text-[#1C1C1A] text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all duration-300"
        >
          <ArrowLeft size={14} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
