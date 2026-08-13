'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, Award, ShieldCheck, Landmark, Hammer, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function JimRhodesLegacyPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1C1C1A] font-sans antialiased selection:bg-[#87735A] selection:text-[#F9F9F7]">
      
      {/* Navigation Header */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-[#F9F9F7]/95 backdrop-blur-md shadow-sm py-4 border-b border-[#1C1C1A]/5' 
            : 'bg-transparent py-6 md:py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center transition-opacity duration-300 hover:opacity-90">
            <div className="relative w-36 h-10 md:w-44 md:h-12">
              <Image 
                src="https://priscilac3.sg-host.com/wp-content/uploads/2026/08/logo-harmoni.png" 
                alt="Harmony Homes"
                fill
                unoptimized
                className="object-contain brightness-0"
                referrerPolicy="no-referrer"
              />
            </div>
          </Link>

          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#927A50] hover:text-[#7D6740] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-32 md:pt-40 pb-24">
        
        {/* Editorial Heading */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
          <span className="text-[14px] tracking-[0.3em] font-semibold text-[#87735A] uppercase block mb-3">
            The Visionary Behind Harmony Homes
          </span>
          <h1 className="font-serif text-[48px] md:text-[68px] font-bold text-[#1C1C1A] leading-none mb-6">
            JIM RHODES
          </h1>
          <p className="font-serif text-lg md:text-2xl font-light text-[#1C1C1A]/70 max-w-3xl leading-relaxed">
            A native son of Las Vegas who dedicated more than four decades to elevating residential craftsmanship from the bedrock up.
          </p>
        </div>

        {/* Feature Wide Hero Image */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24">
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-gray-100 border border-[#1C1C1A]/5 shadow-md">
            <Image 
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80"
              alt="Luxury Desert Architecture designed under the legacy of Jim Rhodes"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
              priority
            />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column: Quick Stats & Biography Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-10">
              
              {/* Profile Card Fragment */}
              <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden border border-[#1C1C1A]/5 shadow-sm">
                <Image 
                  src="https://staging.harmonyhomes.com/wp-content/uploads/2026/08/Jim_Rhodes-photo.jpeg"
                  alt="Jim Rhodes Biography"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Fast Facts Card */}
              <div className="bg-[#F2F1EC] p-8 border border-[#1C1C1A]/5">
                <h3 className="font-serif text-lg font-bold text-[#1C1C1A] mb-6">
                  Legacy Milestones
                </h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="p-2.5 bg-white border border-[#1C1C1A]/5 text-[#927A50]">
                      <Hammer size={18} />
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#1C1C1A]">Begun as a Carpenter</h4>
                      <p className="text-sm text-[#1C1C1A]/70 font-light mt-1">Deep respect for physical materials, joint integrity, and hands-on craftsmanship.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="p-2.5 bg-white border border-[#1C1C1A]/5 text-[#927A50]">
                      <Landmark size={18} />
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#1C1C1A]">12,000+ Residences</h4>
                      <p className="text-sm text-[#1C1C1A]/70 font-light mt-1">Planned, structured, and constructed throughout the sovereign communities of Nevada.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="p-2.5 bg-white border border-[#1C1C1A]/5 text-[#927A50]">
                      <Award size={18} />
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#1C1C1A]">Four Decades</h4>
                      <p className="text-sm text-[#1C1C1A]/70 font-light mt-1">Over 40 years of continuous active design direction, land planning, and construction management.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder's Motto Quote block */}
              <div className="border-l-2 border-[#927A50] pl-6 py-2">
                <p className="font-serif text-lg text-[#1C1C1A]/80 italic leading-relaxed">
                  &ldquo;We don&apos;t build to fill spaces. We build to capture the silent majesty of the terrain and create safe, enduring sanctuaries for families.&rdquo;
                </p>
                <span className="text-xs font-bold uppercase tracking-widest text-[#927A50] block mt-3">— Jim Rhodes</span>
              </div>

            </div>

            {/* Right Column: Full Narrative Biography */}
            <div className="lg:col-span-8 space-y-10">
              
              <section className="space-y-6">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1C1C1A]">
                  Origins in Craftsmanship
                </h2>
                <div className="h-[1px] bg-[#1C1C1A]/10 w-24 mb-6" />
                <p className="text-[#1C1C1A]/80 font-light leading-relaxed text-base md:text-lg">
                  Born and raised in the heart of Las Vegas, Jim Rhodes didn&apos;t begin his trajectory inside an executive office. His career in residential construction took root in the field, working directly with raw lumber, cement, and measuring tapes as an apprentice carpenter. 
                </p>
                <p className="text-[#1C1C1A]/80 font-light leading-relaxed text-base md:text-lg">
                  This early, hands-on immersion shaped an uncompromising standard of physical execution. For Jim, every load-bearing wall, custom rafter connection, and alignment of limestone tiles is a silent testament to structural honesty. This visceral understanding of field labor, carpentry, and architectural engineering remains the core DNA of Harmony Homes.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1C1C1A]">
                  Shaping the Valley
                </h2>
                <div className="h-[1px] bg-[#1C1C1A]/10 w-24 mb-6" />
                <p className="text-[#1C1C1A]/80 font-light leading-relaxed text-base md:text-lg">
                  As the Las Vegas Valley expanded from a small desert crossroads into a global destination, Jim grew alongside it. Over more than forty years, he transitioned from building individual custom family residences to planning large-scale sovereign communities. 
                </p>
                <p className="text-[#1C1C1A]/80 font-light leading-relaxed text-base md:text-lg">
                  With over 12,000 homes successfully built, Jim&apos;s impact on Nevada&apos;s real estate history is indelible. Yet, throughout this immense volume of work, his true dedication remained focused on bespoke high-end quality. He recognized early on that a true luxury home is not defined by sheer scale, but by its architectural alignment with the surrounding topography and the private narrative of the client.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1C1C1A]">
                  A New Paradigm of Desert Modernism
                </h2>
                <div className="h-[1px] bg-[#1C1C1A]/10 w-24 mb-6" />
                <p className="text-[#1C1C1A]/80 font-light leading-relaxed text-base md:text-lg">
                  Today, Harmony Homes represents the crystallization of Jim&apos;s life work. Under his watchful eyes, the firm designs residences that act as direct extensions of their environment. By utilizing expansive glass panels, central modernist courtyards, local earth materials, and passive geothermal layouts, every residence honors the surrounding Nevada desert.
                </p>
                <p className="text-[#1C1C1A]/80 font-light leading-relaxed text-base md:text-lg">
                  For Jim, a house is an intricate living organism. It requires a flawless marriage of infrastructure, layout design, fluid geometry, and light. Under his active guidance, Harmony Homes remains dedicated to delivering custom estates that are visually spectacular, architecturally timeless, and built to endure for generations to come.
                </p>
              </section>

              {/* Call To Action Box */}
              <div className="bg-[#1C1C1A] text-white p-8 md:p-12 border border-white/5 relative overflow-hidden mt-12">
                <div className="relative z-10">
                  <span className="text-[10px] tracking-[0.25em] text-white/60 font-bold uppercase block mb-2">Build Your Future</span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                    Ready to shape your own residence?
                  </h3>
                  <p className="text-sm md:text-base text-white/70 font-light leading-relaxed mb-8 max-w-xl">
                    Every custom build starts with a confidential, highly secure conversation regarding your private site, budget, and design aspirations.
                  </p>
                  
                  <Link 
                    href="/#contact"
                    className="inline-flex items-center gap-2 bg-[#927A50] hover:bg-[#7D6740] text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 px-8 py-4 shadow-sm"
                  >
                    <span>Request a Private Consultation</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>

                {/* Subtle design grid watermark */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none">
                  <div className="absolute top-0 left-1/3 w-[1px] h-full bg-white" />
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white" />
                </div>
              </div>

            </div>

          </div>
        </div>

      </main>

      {/* Simplified Footer */}
      <footer className="bg-[#1C1C1A] text-white border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-serif text-lg font-bold tracking-widest uppercase">Harmony Homes</span>
            <p className="text-xs text-white/50 mt-1 font-light">Las Vegas, Nevada</p>
          </div>
          
          <p className="text-[11px] text-white/40 text-center md:text-right font-light leading-relaxed max-w-sm">
            Harmony Homes © 2026 All Rights Reserved. Jim Rhodes and the Harmony group represent uncompromised quality, built to endure.
          </p>
        </div>
      </footer>

    </div>
  );
}
