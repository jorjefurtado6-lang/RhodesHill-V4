'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  ArrowDown, 
  Maximize2, 
  Check, 
  Crown,
  Lock,
  Unlock,
  FileText,
  Download,
  ShieldCheck,
  KeyRound,
  User,
  Sparkles,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { SiteContent } from '@/lib/content-types';
import { defaultSiteContent } from '@/lib/default-content';

function SafeImage({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  className,
  fill,
  unoptimized = true,
  ...props
}: any) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return (
    <Image
      {...props}
      src={failedSrc === src ? fallbackSrc : src}
      alt={alt || "Harmony Residence"}
      fill={fill}
      unoptimized={unoptimized}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        setFailedSrc(src);
      }}
    />
  );
}

function SafariVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  const fallback = 'https://staging.harmonyhomes.com/wp-content/uploads/2026/08/hero-video.mp4';
  const effectiveSrc = videoFailed ? fallback : src;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy fallback
      });
    }
  }, [effectiveSrc]);

  return (
    <video
      ref={videoRef}
      key={effectiveSrc}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={poster}
      onError={() => {
        if (!videoFailed) {
          setVideoFailed(true);
        }
      }}
      className={className}
    >
      <source src={effectiveSrc} type="video/mp4" />
    </video>
  );
}

export default function HarmonyPage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [closerSlideIndex, setCloserSlideIndex] = useState(0);

  // Fetch dynamic content from CMS API on mount
  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const resJson = await res.json();
          if (resJson.success && resJson.data) {
            setContent(resJson.data);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic site content:', err);
      }
    }
    loadContent();
  }, []);

  const projectsCount = content.aCloserLook?.projects?.length || 1;

  const nextCloserSlide = () => {
    setCloserSlideIndex((prev) => (prev + 1) % projectsCount);
  };

  const prevCloserSlide = () => {
    setCloserSlideIndex((prev) => (prev - 1 + projectsCount) % projectsCount);
  };

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Testimonials Slider State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = content.testimonials && content.testimonials.length > 0
    ? content.testimonials
    : defaultSiteContent.testimonials;

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;
    setFormSubmitting(true);
    
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact_form',
          name: formName,
          email: formEmail,
          phone: formPhone,
          message: formMessage
        })
      });
    } catch (err) {
      console.error('Lead error:', err);
    } finally {
      setFormSubmitting(false);
      setFormSuccess(true);
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormMessage('');
    }
  };

  // VIP Concierge Widget State
  const [vipQuickMenuOpen, setVipQuickMenuOpen] = useState(false);
  const [vipModalOpen, setVipModalOpen] = useState(false);
  const [vipUnlocked, setVipUnlocked] = useState(false);
  const [vipPasswordInput, setVipPasswordInput] = useState('');
  const [vipPasswordError, setVipPasswordError] = useState(false);

  // VIP Booking Form State
  const [vipHelicopterSelected, setVipHelicopterSelected] = useState(true);
  const [vipBookingName, setVipBookingName] = useState('');
  const [vipBookingPhone, setVipBookingPhone] = useState('');
  const [vipBookingEmail, setVipBookingEmail] = useState('');
  const [vipBookingDate, setVipBookingDate] = useState('');
  const [vipBookingSubmitted, setVipBookingSubmitted] = useState(false);
  const [vipDownloadToast, setVipDownloadToast] = useState<string | null>(null);

  const handleVipPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = content.concierge?.vipPassword || 'RH2024';
    if (vipPasswordInput.trim().toUpperCase() === correctPassword.trim().toUpperCase()) {
      setVipUnlocked(true);
      setVipPasswordError(false);
      setVipPasswordInput('');
    } else {
      setVipPasswordError(true);
    }
  };

  const handleVipBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipBookingName || !vipBookingEmail) return;
    
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'vip_booking',
          name: vipBookingName,
          email: vipBookingEmail,
          phone: vipBookingPhone,
          date: vipBookingDate,
          isHelicopterSelected: vipHelicopterSelected,
          message: `VIP Booking for date: ${vipBookingDate} | Helicopter Service: ${vipHelicopterSelected ? 'YES' : 'NO'}`
        })
      });
    } catch (err) {
      console.error('VIP Lead error:', err);
    } finally {
      setVipBookingSubmitted(true);
    }
  };

  const handleVipDownload = (docName: string) => {
    setVipDownloadToast(docName);
    setTimeout(() => {
      setVipDownloadToast(null);
    }, 3500);
  };

  const accentColor = content.theme?.primaryAccent || "#927A50";
  const conciergePhone = content.concierge?.whatsAppNumber || "17025707240";
  const conciergePrefill = encodeURIComponent(content.concierge?.whatsAppPrefill || "Hello, I would like exclusive information about Harmony Homes VIP Concierge.");

  return (
    <div 
      className="min-h-screen selection:bg-[#87735A] selection:text-[#F9F9F7] font-sans antialiased text-[#1C1C1A] bg-[#F9F9F7]"
      style={{
        backgroundColor: content.theme?.backgroundColor || "#F9F9F7"
      }}
    >
      
      {/* 1. Header & Navigation */}
      <header 
        id="header-nav"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-[#F9F9F7]/95 backdrop-blur-md shadow-sm py-4 border-b border-[#1C1C1A]/5' 
            : 'bg-transparent py-6 md:py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo Brand */}
          <a 
            href="#hero" 
            id="nav-logo"
            className="flex items-center transition-opacity duration-300 hover:opacity-90"
          >
            <div className="relative w-36 h-10 md:w-44 md:h-12">
              <Image 
                src={content.theme?.logoUrl || "https://priscilac3.sg-host.com/wp-content/uploads/2026/08/logo-harmoni.png"} 
                alt={content.theme?.logoAlt || "Harmony Homes"}
                fill
                unoptimized
                className={`object-contain transition-all duration-300 ${scrolled ? 'brightness-0' : 'brightness-0 invert'}`}
                referrerPolicy="no-referrer"
                priority
              />
            </div>
          </a>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {[
              { id: 'hero', label: content.nav?.home || "Home" },
              { id: 'harmony-experience', label: content.nav?.about || "About" },
              { id: 'featured-developments', label: content.nav?.properties || "Properties" },
              { id: 'legacy', label: content.nav?.careers || "Legacy" },
              { id: 'contact', label: content.nav?.contact || "Contact" }
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                id={`nav-link-${link.id}`}
                className={`text-[16px] uppercase tracking-widest font-medium transition-all duration-300 relative py-1 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:transition-all after:duration-300 hover:after:w-full ${
                  scrolled 
                    ? 'text-[#1C1C1A]/80 hover:text-[#1C1C1A] after:bg-[#1C1C1A]' 
                    : 'text-white/80 hover:text-white after:bg-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Controls (CTA & Menu Toggle) */}
          <div className="flex items-center gap-4 md:gap-6">
            <a 
              href="#contact" 
              id="header-cta"
              className={`hidden md:inline-flex items-center justify-center text-[16px] font-bold uppercase tracking-widest border transition-all duration-300 px-6 py-2.5 rounded-none ${
                scrolled 
                  ? 'border-[#927A50] text-[#927A50] hover:bg-[#927A50] hover:text-white' 
                  : 'border-white/50 text-white hover:bg-white hover:text-[#1C1C1A]'
              }`}
              style={{ width: '160.1771px' }}
            >
              {content.nav?.cta || "Inquire"}
            </a>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-1.5 rounded-none transition-colors duration-300 ${
                scrolled ? 'text-[#1C1C1A] hover:bg-[#1C1C1A]/5' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-nav-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#F9F9F7] pt-28 px-8 pb-10 flex flex-col justify-between overflow-y-auto lg:hidden"
          >
            <div className="flex flex-col gap-6 mt-4">
              {[
                { id: 'hero', label: content.nav?.home || "Home" },
                { id: 'harmony-experience', label: content.nav?.about || "About" },
                { id: 'featured-developments', label: content.nav?.properties || "Properties" },
                { id: 'legacy', label: content.nav?.careers || "Legacy" },
                { id: 'contact', label: content.nav?.contact || "Contact" }
              ].map((link, idx) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <a
                    href={`#${link.id}`}
                    id={`mobile-nav-link-${link.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-3xl font-light text-[#1C1C1A] hover:text-[#87735A] transition-colors block py-2"
                  >
                    {link.label}
                  </a>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-[#1C1C1A]/10 pt-8 flex flex-col gap-4">
              <a 
                href="#contact" 
                id="mobile-cta-btn"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 bg-[#87735A] hover:bg-[#6E5C47] text-white text-center text-xs tracking-widest font-bold uppercase transition-colors"
              >
                {content.nav?.cta || "Inquire"}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* 2. Hero Section */}
      <section 
        id="hero"
        className="relative min-h-screen flex flex-col justify-between text-white overflow-hidden bg-black"
      >
        <div className="absolute inset-0 z-0 opacity-80 select-none pointer-events-none overflow-hidden">
          <SafariVideo
            src={content.hero?.videoUrl || "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/hero-video.mp4"}
            poster={content.hero?.posterUrl || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80"}
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-16 flex flex-col justify-between min-h-screen">
          <div />

          <div className="max-w-4xl my-auto">
            <span 
              id="hero-eyebrow"
              className="text-xs md:text-sm tracking-[0.3em] font-medium uppercase text-white block mb-4"
            >
              {content.hero?.location || "Las Vegas, Nevada"}
            </span>
            <h1 
              id="hero-title"
              style={{ fontFamily: 'var(--font-hanken)', fontSize: '61px', lineHeight: '62px', fontWeight: 'normal', textTransform: 'uppercase' }}
              className="text-[61px] font-normal tracking-tight leading-[62px] mb-6 text-white uppercase font-hanken"
            >
              {content.hero?.title || "We develop and build luxury custom homes."}
            </h1>
            <p 
              id="hero-subtitle"
              className="font-sans text-[21px] text-white/80 font-light tracking-wide leading-relaxed max-w-2xl mb-10"
            >
              {content.hero?.subtitle || "Residences shaped by architecture, landscape, and the way you choose to live"}
            </p>
            <div className="flex flex-wrap gap-4 mb-4">
              <a 
                href="#contact" 
                id="hero-cta-btn"
                className="inline-flex items-center justify-center text-xs tracking-[0.25em] font-bold uppercase bg-[#87735A] hover:bg-[#927A50] text-white transition-all duration-300 px-8 py-4 shadow-md active:scale-95"
              >
                Request a private consultation
              </a>
            </div>
          </div>

          <div className="w-full flex items-center justify-between border-t border-white/10 pt-6">
            <div />
            
            <a 
              href="#harmony-experience" 
              id="hero-scroll"
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group text-xs tracking-widest uppercase"
            >
              <span>{content.hero?.scroll || "Scroll"}</span>
              <span className="p-1 border border-white/20 rounded-full group-hover:translate-y-1 transition-transform">
                <ArrowDown size={14} />
              </span>
            </a>
          </div>
        </div>
      </section>


      {/* 3. The Harmony Experience */}
      <section 
        id="harmony-experience"
        className="py-24 md:py-32 bg-[#F9F9F7] relative border-b border-[#1C1C1A]/5"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl flex flex-col items-center justify-center text-center">
            <span 
              id="experience-eyebrow"
              className="text-[16px] tracking-[0.3em] font-semibold text-[#87735A] uppercase block mb-3"
            >
              {content.experience?.label || "Discover"}
            </span>
            <h2 
              id="experience-title"
              className="font-serif text-[41px] font-bold text-[#1C1C1A] mb-8"
              style={{ fontSize: "41px" }}
            >
              {content.experience?.title || "The Harmony Experience"}
            </h2>
            <p 
              id="experience-desc"
              className="font-sans text-base md:text-lg text-[#1C1C1A]/70 leading-relaxed font-light mb-10"
            >
              {content.experience?.description}
            </p>
            <a 
              href="#featured-developments"
              id="experience-btn"
              className="inline-flex items-center gap-2 bg-[#927A50] hover:bg-[#7D6740] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all duration-300 shadow-md hover:-translate-y-0.5"
            >
              <span>{content.experience?.button || "Learn More"}</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>



      {/* 4. Featured Developments */}
      <section 
        id="featured-developments"
        className="py-24 md:py-32 bg-white border-b border-[#1C1C1A]/5"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 text-center">
          <span className="text-[16px] tracking-[0.3em] font-semibold text-[#87735A] uppercase block mb-3">
            DEVELOPMENTS
          </span>
          <h2 className="font-serif text-[41px] font-bold text-[#1C1C1A]" style={{ fontSize: "41px" }}>
            Featured Projects &amp; Developments
          </h2>
        </div>

        <div className="space-y-32">
          {(content.featuredDevelopments || []).map((item) => (
            <div 
              key={item.id}
              id={`dev-item-${item.id}`}
              className="w-full flex flex-col items-center group"
            >
              <div className="w-full relative h-[450px] md:h-[650px] overflow-hidden bg-gray-100">
                <SafeImage 
                  src={item.image} 
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-[#1C1C1A] text-white text-[10px] tracking-[0.2em] font-bold uppercase py-1.5 px-4 shadow-sm">
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="max-w-4xl mx-auto px-6 pt-12 text-center flex flex-col items-center">
                <span className="text-[16px] tracking-[0.25em] text-[#927A50] uppercase font-normal block mb-4">
                  {item.status}
                </span>
                <h3 
                  className="font-serif text-3xl md:text-5xl font-bold text-[#1C1C1A] mb-6 leading-tight"
                >
                  {item.title}
                </h3>
                <p className="font-sans text-base md:text-lg text-[#1C1C1A]/70 leading-relaxed font-light mb-8 max-w-2xl">
                  {item.description}
                </p>
                <a 
                  href={item.url || "#contact"}
                  target={item.url?.startsWith("http") ? "_blank" : undefined}
                  rel={item.url?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 border border-[#927A50] text-[#927A50] hover:bg-[#927A50] hover:text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer shadow-sm"
                >
                  <span>{item.button || "Learn More"}</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Video full width below developments */}
        <div className="mt-24 md:mt-32 w-full relative h-[450px] md:h-[650px] overflow-hidden bg-black">
          <SafariVideo
            src={content.experience?.videoUrl || "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/hero-video.mp4"}
            poster="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </section>


      {/* 5. Signature Residences */}
      <section 
        id="signature-residences"
        className="py-24 md:py-32 bg-[#F9F9F7] border-b border-[#1C1C1A]/5"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16 text-center">
            <span id="signature-label" className="text-[16px] tracking-[0.3em] font-semibold text-[#87735A] uppercase block mb-3">
              {content.signatureResidences?.label || "FEATURED PROJECTS"}
            </span>
            <h2 id="signature-title" className="font-serif text-[41px] font-bold text-[#1C1C1A]" style={{ fontSize: "41px" }}>
              {content.signatureResidences?.title || "Selected developments across Las Vegas."}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {(content.signatureResidences?.projects || []).map((proj) => (
              <div 
                key={proj.id}
                id={`signature-card-${proj.id}`}
                className="bg-white border border-[#1C1C1A]/5 overflow-hidden group flex flex-col"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <SafeImage 
                    src={proj.image}
                    alt={proj.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#927A50] text-white text-[9px] tracking-widest font-bold uppercase py-1 px-3">
                      {proj.badge}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[16px] tracking-widest text-[#927A50] uppercase block mb-1">
                      {proj.subheading}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#1C1C1A] mb-3">
                      {proj.title}
                    </h3>
                    <p className="text-base text-[#1C1C1A]/70 leading-relaxed font-light mb-6">
                      {proj.description}
                    </p>
                  </div>
                  <a 
                    href={proj.url || "#contact"} 
                    className="inline-flex items-center justify-center gap-2 bg-[#927A50] hover:bg-[#7D6740] text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-95 cursor-pointer"
                    style={{ width: '290.368px', height: '54.1979px' }}
                  >
                    <span>{proj.buttonText || "Inquire"}</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 6. A Closer Look - Slide Carousel */}
      <section 
        id="a-closer-look"
        className="py-24 md:py-32 bg-white border-b border-[#1C1C1A]/5"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header with Title & Navigation Controls */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span id="closer-label" className="text-[16px] tracking-[0.3em] font-semibold text-[#927A50] uppercase block mb-3">
                {content.aCloserLook?.label || "Explore The Portfolio"}
              </span>
              <h2 id="closer-title" className="font-serif text-[41px] font-bold text-[#1C1C1A]" style={{ fontSize: "41px" }}>
                {content.aCloserLook?.title || "A Closer Look"}
              </h2>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-6">
              <span className="text-sm tracking-widest text-[#1C1C1A]/70 font-semibold uppercase">
                0{closerSlideIndex + 1} <span className="text-[#927A50]">/</span> 0{content.aCloserLook?.projects?.length || 1}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevCloserSlide}
                  aria-label="Previous Slide"
                  className="w-12 h-12 border border-[#1C1C1A]/20 hover:border-[#927A50] hover:bg-[#927A50] hover:text-white text-[#1C1C1A] flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextCloserSlide}
                  aria-label="Next Slide"
                  className="w-12 h-12 border border-[#1C1C1A]/20 hover:border-[#927A50] hover:bg-[#927A50] hover:text-white text-[#1C1C1A] flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Slider Content */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {content.aCloserLook?.projects && content.aCloserLook.projects.length > 0 && (
                <motion.div
                  key={closerSlideIndex}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
                >
                  {[
                    content.aCloserLook.projects[closerSlideIndex],
                    content.aCloserLook.projects[(closerSlideIndex + 1) % content.aCloserLook.projects.length]
                  ].filter(Boolean).map((item, localIdx) => {
                    const actualIdx = (closerSlideIndex + localIdx) % content.aCloserLook.projects.length;
                    return (
                      <div 
                        key={item.id || localIdx}
                        id={`closer-item-${item.id}`}
                        onClick={() => setLightboxIndex(actualIdx)}
                        className="relative aspect-[3/2] group cursor-pointer bg-gray-100 overflow-hidden border border-[#1C1C1A]/5 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <SafeImage 
                          src={item.image} 
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 text-white">
                          <span className="text-[10px] tracking-[0.25em] uppercase text-white/80 block mb-2">
                            {item.category}
                          </span>
                          <h3 className="font-serif text-xl md:text-2xl font-bold flex items-center justify-between">
                            {item.title}
                            <Maximize2 size={18} className="text-white/85" />
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dot Indicators */}
          <div className="mt-10 flex justify-center items-center gap-3">
            {(content.aCloserLook?.projects || []).map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => setCloserSlideIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 transition-all duration-300 cursor-pointer ${
                  idx === closerSlideIndex 
                    ? 'w-10 bg-[#927A50]' 
                    : 'w-3 bg-[#1C1C1A]/20 hover:bg-[#1C1C1A]/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>


      {/* 7. Legacy Section */}
      <section id="legacy" className="w-full bg-[#FAFAF8] border-b border-[#1C1C1A]/5 overflow-hidden">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-stretch">
          
          {/* Left Column: Full-Bleed Image */}
          <div className="relative w-full min-h-[420px] sm:min-h-[520px] lg:min-h-[750px] bg-stone-900 overflow-hidden">
            <SafeImage 
              src={content.legacy?.image || "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/Jim_Rhodes-photo.jpeg"}
              alt="Jim Rhodes - Founder of Harmony Homes"
              fill
              className="object-cover object-top transition-transform duration-1000 ease-out hover:scale-105"
              fallbackSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            />
          </div>

          {/* Right Column: Editorial Typographic Content */}
          <div className="flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-16 xl:px-24 py-16 sm:py-20 lg:py-24 bg-white">
            <div className="max-w-xl">
              <span className="text-[11px] sm:text-xs tracking-[0.3em] font-medium text-stone-500 uppercase block mb-6 font-sans">
                {content.legacy?.kicker || "CHAPTER 01 — OUR FOUNDER & LEGACY"}
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[50px] text-[#1C1C1A] leading-[1.12] tracking-tight mb-8 font-normal">
                {content.legacy?.title || "For those who expect more than excellence."}
              </h2>
              
              <div className="space-y-6 text-[#2C2C2A]/85 font-normal leading-[1.75] text-[15px] sm:text-base">
                {(content.legacy?.paragraphs || []).map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
                {content.legacy?.quote && (
                  <p className="font-serif italic text-[#1C1C1A] text-lg sm:text-xl leading-relaxed text-stone-800 pt-2 border-l-2 border-[#927A50]/40 pl-5">
                    {content.legacy.quote}
                  </p>
                )}
              </div>

              <div className="mt-10 pt-4 flex items-center gap-6">
                <a 
                  href={content.legacy?.ctaLink || "/legacy"} 
                  className="inline-flex items-center gap-3 bg-[#1C1C1A] hover:bg-[#927A50] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 px-8 py-4 shadow-sm hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <span>{content.legacy?.ctaText || "Discover Jim's Story"}</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* 8. Testimonials Section */}
      <section 
        id="testimonials-slider"
        className="py-24 bg-[#F2F1EC] border-b border-[#1C1C1A]/5 relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <span className="text-[16px] tracking-[0.3em] font-semibold text-[#927A50] uppercase block mb-3">
            Client Reflections
          </span>
          <h2 className="font-serif text-[41px] font-bold text-[#1C1C1A] mb-12" style={{ fontSize: "41px" }}>
            The Harmony Reputation
          </h2>

          <div className="relative min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {testimonials.length > 0 && (
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full"
                >
                  <p 
                    className="font-serif text-lg md:text-2xl font-light text-[#1C1C1A]/80 italic leading-relaxed max-w-3xl mx-auto mb-8"
                  >
                    &ldquo;{testimonials[currentTestimonial]?.quote}&rdquo;
                  </p>
                  <div className="space-y-1">
                    <p className="font-sans text-xs md:text-sm font-semibold text-[#1C1C1A]">
                      {testimonials[currentTestimonial]?.author}
                    </p>
                    <p className="font-sans text-[10px] md:text-xs text-[#927A50] tracking-wider uppercase font-light">
                      {testimonials[currentTestimonial]?.designation} &bull; {testimonials[currentTestimonial]?.project}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8 mt-12">
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="p-3 rounded-full border border-[#927A50]/20 hover:border-[#927A50]/60 text-[#927A50] hover:text-[#1C1C1A] transition-all bg-white/40 hover:bg-white cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentTestimonial === index ? 'w-6 bg-[#927A50]' : 'w-1.5 bg-[#927A50]/30 hover:bg-[#927A50]/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="p-3 rounded-full border border-[#927A50]/20 hover:border-[#927A50]/60 text-[#927A50] hover:text-[#1C1C1A] transition-all bg-white/40 hover:bg-white cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Architectural lines background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] select-none z-0">
          <div className="absolute top-0 left-1/4 w-[1px] h-full bg-black" />
          <div className="absolute top-0 left-3/4 w-[1px] h-full bg-black" />
          <div className="absolute top-1/3 left-0 w-full h-[1px] bg-black" />
        </div>
      </section>


      {/* 9. Footer */}
      <footer 
        id="contact"
        className="bg-[#1C1C1A] text-white py-24 md:py-32 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Top CTA Callout */}
          <div className="bg-white/[0.03] p-8 md:p-14 border border-white/10 mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8">
                <h2 id="footer-cta-title" className="font-serif text-[41px] font-bold text-white mb-4" style={{ fontSize: "41px" }}>
                  {content.footer?.cta?.title || "START YOUR PROJECT"}
                </h2>
                <p id="footer-cta-desc" className="font-sans text-sm md:text-base text-white font-light leading-relaxed">
                  {content.footer?.cta?.description}
                </p>
              </div>

              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <a 
                  href="#contact-form" 
                  id="footer-cta-btn"
                  className="bg-[#927A50] hover:bg-[#7D6740] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all duration-300 inline-flex items-center gap-2"
                >
                  <span>{content.footer?.cta?.button || "Inquire"}</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Information & Form Grid */}
          <div id="contact-form" className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            
            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h3 id="info-title" className="font-serif text-[41px] font-bold text-white mb-6" style={{ fontSize: "41px" }}>
                  {content.footer?.contactInfo?.title || "Contact"}
                </h3>
              </div>

              <div className="space-y-6 text-base text-white">
                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-[#927A50] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase tracking-wider text-white mb-1">Address</p>
                    {(content.footer?.contactInfo?.address || []).map((line, idx) => (
                      <p key={idx} className="font-light">{line}</p>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail size={18} className="text-[#927A50] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase tracking-wider text-white mb-1">Email</p>
                    <p className="font-light">{content.footer?.contactInfo?.email || "info@harmonyhomes.com"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone size={18} className="text-[#927A50] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase tracking-wider text-white mb-1">Phone</p>
                    <p className="font-light">{content.footer?.contactInfo?.phone || "702.570.7240"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 bg-white/[0.02] p-8 border border-white/5">
              <h4 className="font-serif text-xl font-light text-white mb-6 pb-3 border-b border-white/10 uppercase tracking-wider">
                Contact Us
              </h4>

              {formSuccess ? (
                <div className="py-10 text-center flex flex-col items-center justify-center gap-4">
                  <div className="p-3 bg-[#927A50]/20 text-[#927A50] rounded-full">
                    <Check size={28} />
                  </div>
                  <p className="font-serif text-xl font-light text-white">Thank you for reaching out.</p>
                  <p className="text-xs text-white">We will respond to your inquiry shortly.</p>
                  <button 
                    onClick={() => setFormSuccess(false)}
                    className="text-[10px] uppercase font-bold tracking-widest text-[#927A50] underline mt-4 cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input 
                      type="text" 
                      required
                      placeholder="Your Name *"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="bg-white/[0.04] border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#927A50]"
                    />
                    <input 
                      type="email" 
                      required
                      placeholder="Your Email *"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="bg-white/[0.04] border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#927A50]"
                    />
                  </div>
                  <input 
                    type="tel" 
                    placeholder="Your Phone Number"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="bg-white/[0.04] border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#927A50] w-full"
                  />
                  <textarea 
                    rows={4}
                    placeholder="Tell us about your project or inquiry..."
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="bg-white/[0.04] border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#927A50] w-full resize-none"
                  />
                  <button 
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full bg-[#927A50] hover:bg-[#7D6740] text-white text-xs font-bold uppercase tracking-widest py-4 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {formSubmitting ? "Sending..." : "Submit Inquiry"}
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Useful Links */}
          <div className="border-t border-white/10 pt-10 pb-8">
            <span className="text-[10px] tracking-[0.2em] uppercase text-white block mb-4">USEFUL LINKS</span>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs font-light text-white">
              {(content.footer?.usefulLinks || []).map((link, idx) => (
                <a key={idx} href={link.href} className="hover:underline transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal, Copyright & Admin Access */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[10px] text-white/70 leading-relaxed font-light">
            <p className="max-w-xl">{content.footer?.legal}</p>
            <div className="flex items-center gap-4 shrink-0">
              <p>{content.footer?.copyright}</p>
              <span className="text-white/30">|</span>
              <a 
                href="/admin" 
                className="hover:text-white transition-colors underline uppercase tracking-widest text-[9px] font-semibold text-[#C5A059]"
              >
                Admin Panel
              </a>
            </div>
          </div>

        </div>
      </footer>


      {/* Lightbox Modal for Gallery */}
      <AnimatePresence>
        {lightboxIndex !== null && content.aCloserLook?.projects && (
          <div 
            id="lightbox-backdrop"
            className="fixed inset-0 z-50 flex flex-col justify-between p-4 bg-black/95 text-white"
            onClick={(e) => {
              if (e.target === e.currentTarget) setLightboxIndex(null);
            }}
          >
            <div className="flex items-center justify-between py-4 px-6 relative z-10">
              <span className="text-[10px] tracking-widest uppercase text-white/50">
                {`PORTFOLIO // 0${lightboxIndex + 1} OF 0${content.aCloserLook.projects.length}`}
              </span>
              <button 
                onClick={() => setLightboxIndex(null)}
                className="p-2 text-white hover:text-[#87735A] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex items-center justify-between flex-grow max-w-7xl mx-auto w-full relative">
              <button 
                onClick={() => setLightboxIndex((prev) => prev !== null ? (prev === 0 ? content.aCloserLook.projects.length - 1 : prev - 1) : null)}
                className="p-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all absolute left-4 z-10 cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="relative w-full aspect-video md:aspect-[16/10] max-h-[70vh] flex items-center justify-center p-4">
                <SafeImage 
                  src={content.aCloserLook.projects[lightboxIndex]?.image}
                  alt={content.aCloserLook.projects[lightboxIndex]?.title}
                  fill
                  className="object-contain"
                />
              </div>

              <button 
                onClick={() => setLightboxIndex((prev) => prev !== null ? (prev === content.aCloserLook.projects.length - 1 ? 0 : prev + 1) : null)}
                className="p-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all absolute right-4 z-10 cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="text-center py-4 px-6 bg-black/60 max-w-xl mx-auto w-full border border-white/5 mb-4">
              <span className="text-[10px] tracking-widest uppercase text-[#87735A] block mb-1">
                {content.aCloserLook.projects[lightboxIndex]?.category}
              </span>
              <h4 className="font-serif text-lg font-light">
                {content.aCloserLook.projects[lightboxIndex]?.title}
              </h4>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating VIP Concierge Widget */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
        <AnimatePresence>
          {vipQuickMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="mb-4 w-80 sm:w-88 bg-white/95 backdrop-blur-xl border border-[#C5A059]/40 shadow-2xl rounded-2xl p-5 text-[#1C1C1A]"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#C5A059]/20">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#C5A059]/10 rounded-lg text-[#C5A059]">
                    <Crown size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif font-medium text-sm text-[#1C1C1A]">
                      {content.concierge?.agentName || "VIP Concierge"}
                    </h4>
                    <span className="text-[10px] text-[#87735A] tracking-wider uppercase font-medium">
                      {content.concierge?.agentTitle || "Exclusive Assistance"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setVipQuickMenuOpen(false)}
                  className="p-1 rounded-full text-[#1C1C1A]/50 hover:text-[#1C1C1A] hover:bg-black/5 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2.5">
                <a
                  href={`https://wa.me/${conciergePhone}?text=${conciergePrefill}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-medium text-xs transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Phone size={18} className="text-[#25D366]" />
                    <span>Direct WhatsApp</span>
                  </div>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>

                <button
                  onClick={() => {
                    setVipQuickMenuOpen(false);
                    setVipModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F9F6F0] hover:bg-[#F3ECE0] border border-[#C5A059]/30 text-[#1C1C1A] font-medium text-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar size={18} className="text-[#C5A059]" />
                    <span>Schedule VIP Visit</span>
                  </div>
                  <ArrowRight size={14} className="text-[#87735A] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    setVipQuickMenuOpen(false);
                    setVipModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#C5A059] hover:bg-[#B38F48] text-white font-medium text-xs transition-all shadow-md cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    {vipUnlocked ? <Unlock size={18} /> : <Lock size={18} />}
                    <span>{vipUnlocked ? 'Access VIP Lounge' : 'VIP Access / Enter Password'}</span>
                  </div>
                  <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-[#C5A059]/15 text-center">
                <span className="text-[10px] text-[#87735A]">
                  24/7 Availability for VIP Clients
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setVipQuickMenuOpen(!vipQuickMenuOpen)}
          className="relative group flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#927A50] hover:bg-[#7D6740] text-white shadow-[0_4px_25px_rgba(146,122,80,0.4)] hover:shadow-[0_6px_30px_rgba(146,122,80,0.6)] border-2 border-[#A88C5C] transition-all duration-300 hover:scale-[1.05] active:scale-95 cursor-pointer"
          aria-label="Open Concierge Agent"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>

          <span className="text-xs font-semibold uppercase tracking-wider text-white">
            Concierge Agent
          </span>
        </button>
      </div>

      {/* VIP Lounge Modal */}
      <AnimatePresence>
        {vipModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVipModalOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative w-full max-w-3xl my-auto bg-[#FDFBF7] text-[#1C1C1A] rounded-2xl shadow-2xl border border-[#C5A059]/40 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between p-6 md:px-8 bg-white border-b border-[#C5A059]/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#C5A059]/15 text-[#C5A059] rounded-xl">
                    <Crown size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-light text-[#1C1C1A]">
                      VIP Lounge Harmony Homes
                    </h3>
                    <p className="text-xs text-[#87735A]">
                      {vipUnlocked ? 'Exclusive Portal Unlocked' : 'Guest Restricted Area'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setVipModalOpen(false)}
                  className="p-2 rounded-full text-[#1C1C1A]/60 hover:text-[#1C1C1A] hover:bg-black/5 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
                {!vipUnlocked ? (
                  <div className="py-8 px-4 max-w-md mx-auto text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center text-[#C5A059] mb-5 border border-[#C5A059]/30">
                      <Lock size={28} />
                    </div>

                    <h4 className="font-serif text-2xl font-light text-[#1C1C1A] mb-2">
                      Restricted Access
                    </h4>
                    <p className="text-xs text-[#1C1C1A]/70 leading-relaxed mb-6 font-light">
                      Enter the VIP password sent by your personal concierge to access confidential materials and priority booking.
                    </p>

                    <form onSubmit={handleVipPasswordSubmit} className="w-full space-y-4">
                      <div className="relative">
                        <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#87735A]" />
                        <input
                          type="password"
                          value={vipPasswordInput}
                          onChange={(e) => {
                            setVipPasswordInput(e.target.value);
                            setVipPasswordError(false);
                          }}
                          placeholder={`Enter VIP password (e.g. ${content.concierge?.vipPassword || 'RH2024'})`}
                          className={`w-full pl-11 pr-4 py-3.5 bg-white border ${
                            vipPasswordError ? 'border-red-500' : 'border-[#C5A059]/40'
                          } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 transition-all`}
                        />
                      </div>

                      {vipPasswordError && (
                        <p className="text-xs text-red-600 font-medium">
                          Incorrect password. Hint: Use the password <span className="font-bold">{content.concierge?.vipPassword || 'RH2024'}</span>.
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-[#927A50] hover:bg-[#7D6740] text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Unlock size={16} />
                        <span>Unlock Access</span>
                      </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-[#C5A059]/15 w-full text-center">
                      <p className="text-[11px] text-[#87735A]">
                        Don&apos;t have a password yet?{' '}
                        <a 
                          href={`https://wa.me/${conciergePhone}?text=${encodeURIComponent("I request access to the VIP Lounge")}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="underline font-semibold text-[#1C1C1A] hover:text-[#C5A059]"
                        >
                          Request from Concierge
                        </a>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div className="p-6 bg-gradient-to-r from-[#C5A059]/15 via-white to-[#C5A059]/10 rounded-2xl border border-[#C5A059]/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldCheck size={28} className="text-[#C5A059]" />
                        <div>
                          <h4 className="font-serif text-xl font-light text-[#1C1C1A]">
                            VIP Portal Unlocked
                          </h4>
                          <p className="text-xs text-[#87735A]">
                            Exclusive access activated for high-priority client.
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setVipUnlocked(false)}
                        className="text-[10px] font-bold uppercase tracking-widest text-[#87735A] hover:text-[#1C1C1A] underline cursor-pointer"
                      >
                        Lock
                      </button>
                    </div>

                    <AnimatePresence>
                      {vipDownloadToast && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2"
                        >
                          <Check size={16} className="text-emerald-600" />
                          <span>The document download for <strong>{vipDownloadToast}</strong> has started.</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <FileText size={18} className="text-[#C5A059]" />
                        <h4 className="font-serif text-lg font-light text-[#1C1C1A]">
                          Confidential Documents
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(content.concierge?.documents || []).map((doc, idx) => (
                          <div 
                            key={idx} 
                            className="p-4 bg-white rounded-xl border border-[#C5A059]/25 hover:border-[#C5A059] transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded-md">
                                  {doc.tag || "PDF VIP"}
                                </span>
                                <FileText size={14} className="text-[#87735A]" />
                              </div>
                              <h5 className="font-serif text-sm font-medium text-[#1C1C1A] mb-1">
                                {doc.title}
                              </h5>
                              <p className="text-[11px] text-[#1C1C1A]/60 font-light mb-4">
                                {doc.desc}
                              </p>
                            </div>

                            <button
                              onClick={() => handleVipDownload(doc.title)}
                              className="w-full py-2 bg-[#F9F6F0] hover:bg-[#927A50] text-[#1C1C1A] hover:text-white border border-[#927A50]/30 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Download size={12} />
                              <span>Download PDF</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#C5A059]/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={18} className="text-[#C5A059]" />
                          <h4 className="font-serif text-lg font-light text-[#1C1C1A]">
                            1-Click Direct Concierge Booking
                          </h4>
                        </div>

                        <a 
                          href={`https://wa.me/${conciergePhone}?text=${encodeURIComponent("Hello, I am a VIP client and would like direct assistance.")}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-[#25D366] font-semibold hover:underline"
                        >
                          <Phone size={14} />
                          <span>WhatsApp Direct</span>
                        </a>
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-[#C5A059]/25 shadow-sm">
                        {vipBookingSubmitted ? (
                          <div className="py-8 text-center flex flex-col items-center justify-center">
                            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full mb-3">
                              <Check size={32} />
                            </div>
                            <h5 className="font-serif text-xl font-light text-[#1C1C1A] mb-1">
                              Booking Confirmed!
                            </h5>
                            <p className="text-xs text-[#1C1C1A]/70 max-w-md mx-auto mb-4 font-light">
                              Your exclusive concierge will contact you via phone and WhatsApp to confirm the details of the {vipHelicopterSelected ? 'Helicopter' : 'private'} transport.
                            </p>
                            <button
                              onClick={() => setVipBookingSubmitted(false)}
                              className="text-xs text-[#C5A059] font-bold uppercase tracking-wider underline hover:text-[#B38F48] cursor-pointer"
                            >
                              Make another booking
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleVipBookingSubmit} className="space-y-4">
                            {content.concierge?.enableHelicopterTours && (
                              <div 
                                onClick={() => setVipHelicopterSelected(!vipHelicopterSelected)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                  vipHelicopterSelected 
                                    ? 'bg-[#C5A059]/10 border-[#C5A059] ring-1 ring-[#C5A059]' 
                                    : 'bg-[#F9F6F0] border-gray-200 hover:border-[#C5A059]/50'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2.5 rounded-lg ${vipHelicopterSelected ? 'bg-[#C5A059] text-white' : 'bg-gray-200 text-gray-600'}`}>
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                      <path d="M12 2c-.55 0-1 .45-1 1v1.07C7.03 4.54 4 7.92 4 12v3c0 1.1.9 2 2 2h1v2c0 .55.45 1 1 1s1-.45 1-1v-2h6v2c0 .55.45 1 1 1s1-.45 1-1v-2h1c1.1 0 2-.9 2-2v-3c0-4.08-3.03-7.46-7-7.93V3c0-.55-.45-1-1-1zm6 13H6v-3c0-3.31 2.69-6 6-6s6 2.69 6 6v3z"/>
                                    </svg>
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#1C1C1A] block">
                                      {content.concierge?.helicopterTourTitle || "Exclusive Helicopter Visit"}
                                    </span>
                                    <span className="text-[11px] text-[#87735A] font-light">
                                      {content.concierge?.helicopterTourDesc || "Includes air transport and executive reception at the private helipad."}
                                    </span>
                                  </div>
                                </div>

                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${vipHelicopterSelected ? 'border-[#C5A059] bg-[#C5A059] text-white' : 'border-gray-300'}`}>
                                  {vipHelicopterSelected && <Check size={12} />}
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                              <div className="relative">
                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87735A]" />
                                <input
                                  type="text"
                                  required
                                  value={vipBookingName}
                                  onChange={(e) => setVipBookingName(e.target.value)}
                                  placeholder="Full Name *"
                                  className="w-full pl-10 pr-3 py-2.5 bg-[#F9F6F0] border border-[#C5A059]/30 rounded-xl text-xs text-[#1C1C1A] focus:outline-none focus:border-[#C5A059]"
                                />
                              </div>

                              <div className="relative">
                                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87735A]" />
                                <input
                                  type="tel"
                                  required
                                  value={vipBookingPhone}
                                  onChange={(e) => setVipBookingPhone(e.target.value)}
                                  placeholder="Phone / WhatsApp *"
                                  className="w-full pl-10 pr-3 py-2.5 bg-[#F9F6F0] border border-[#C5A059]/30 rounded-xl text-xs text-[#1C1C1A] focus:outline-none focus:border-[#C5A059]"
                                />
                              </div>

                              <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87735A]" />
                                <input
                                  type="email"
                                  required
                                  value={vipBookingEmail}
                                  onChange={(e) => setVipBookingEmail(e.target.value)}
                                  placeholder="Executive Email *"
                                  className="w-full pl-10 pr-3 py-2.5 bg-[#F9F6F0] border border-[#C5A059]/30 rounded-xl text-xs text-[#1C1C1A] focus:outline-none focus:border-[#C5A059]"
                                />
                              </div>

                              <div className="relative">
                                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87735A]" />
                                <input
                                  type="date"
                                  required
                                  value={vipBookingDate}
                                  onChange={(e) => setVipBookingDate(e.target.value)}
                                  className="w-full pl-10 pr-3 py-2.5 bg-[#F9F6F0] border border-[#C5A059]/30 rounded-xl text-xs text-[#1C1C1A] focus:outline-none focus:border-[#C5A059]"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-[#927A50] hover:bg-[#7D6740] text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
                            >
                              <span>Confirm VIP Booking</span>
                              <ArrowRight size={14} />
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
