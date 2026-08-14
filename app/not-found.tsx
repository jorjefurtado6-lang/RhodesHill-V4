import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1C1C1A] flex flex-col items-center justify-center px-6 text-center">
      <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#87735A] mb-4">
        404 — Page Not Found
      </span>
      <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#1C1C1A] mb-6">
        Architectural Void
      </h1>
      <p className="font-sans text-base md:text-lg text-[#1C1C1A]/70 max-w-md mb-10 font-light leading-relaxed">
        The residence or page you are attempting to view does not exist or has been relocated within our portfolio.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#927A50] hover:bg-[#7D6740] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all duration-300 shadow-md"
      >
        <ArrowLeft size={14} />
        <span>Return to Portfolio</span>
      </Link>
    </div>
  );
}
