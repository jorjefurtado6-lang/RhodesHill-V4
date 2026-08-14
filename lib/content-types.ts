export interface SiteTheme {
  primaryAccent: string;
  primaryAccentHover: string;
  secondaryAccent: string;
  backgroundColor: string;
  textColor: string;
  headingFont: 'Hanken Grotesk' | 'Playfair Display' | 'Fraunces' | 'Inter';
  bodyFont: 'Inter' | 'Hanken Grotesk';
  logoUrl: string;
  logoAlt: string;
}

export interface NavContent {
  home: string;
  about: string;
  properties: string;
  careers: string;
  contact: string;
  cta: string;
}

export interface HeroContent {
  location: string;
  title: string;
  subtitle: string;
  scroll: string;
  videoUrl: string;
  posterUrl: string;
}

export interface ExperienceContent {
  label: string;
  title: string;
  description: string;
  button: string;
  videoUrl: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
}

export interface DevelopmentItem {
  id: string;
  status: string;
  title: string;
  description: string;
  button: string;
  image: string;
  url: string;
}

export interface SignatureProject {
  id: string;
  badge: string;
  subheading: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  url: string;
}

export interface SignatureSection {
  label: string;
  title: string;
  projects: SignatureProject[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

export interface CloserLookSection {
  label: string;
  title: string;
  projects: PortfolioItem[];
}

export interface LegacyContent {
  kicker: string;
  title: string;
  paragraphs: string[];
  quote: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export interface TestimonialItem {
  id: number;
  quote: string;
  author: string;
  designation: string;
  project: string;
}

export interface VipDocument {
  title: string;
  desc: string;
  file: string;
  tag?: string;
}

export interface ConciergeContent {
  agentName: string;
  agentTitle: string;
  avatarUrl: string;
  greetingMessage: string;
  vipPassword: string;
  whatsAppNumber: string;
  whatsAppPrefill: string;
  enableHelicopterTours: boolean;
  helicopterTourTitle: string;
  helicopterTourDesc: string;
  documents: VipDocument[];
}

export interface FooterContent {
  cta: {
    title: string;
    description: string;
    button: string;
  };
  contactInfo: {
    title: string;
    address: string[];
    email: string;
    phone: string;
  };
  usefulLinks: { label: string; href: string }[];
  legal: string;
  copyright: string;
}

export interface SiteContent {
  theme: SiteTheme;
  nav: NavContent;
  hero: HeroContent;
  experience: ExperienceContent;
  featuredDevelopments: DevelopmentItem[];
  signatureResidences: SignatureSection;
  aCloserLook: CloserLookSection;
  legacy: LegacyContent;
  testimonials: TestimonialItem[];
  concierge: ConciergeContent;
  footer: FooterContent;
}

export interface LeadItem {
  id: string;
  type: 'contact_form' | 'vip_booking' | 'concierge_chat';
  name: string;
  email: string;
  phone: string;
  message?: string;
  date?: string;
  isHelicopterSelected?: boolean;
  status: 'new' | 'contacted' | 'in_review' | 'archived';
  createdAt: string;
}
