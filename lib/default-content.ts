import { SiteContent } from './content-types';

export const defaultSiteContent: SiteContent = {
  theme: {
    primaryAccent: "#927A50",
    primaryAccentHover: "#7D6740",
    secondaryAccent: "#C5A059",
    backgroundColor: "#F9F9F7",
    textColor: "#1C1C1A",
    headingFont: "Hanken Grotesk",
    bodyFont: "Inter",
    logoUrl: "https://priscilac3.sg-host.com/wp-content/uploads/2026/08/logo-harmoni.png",
    logoAlt: "Harmony Homes"
  },
  nav: {
    home: "Home",
    about: "About",
    properties: "Properties",
    careers: "Legacy",
    contact: "Contact",
    cta: "Inquire"
  },
  hero: {
    location: "Las Vegas, Nevada",
    title: "We develop and build luxury custom homes.",
    subtitle: "Residences shaped by architecture, landscape, and the way you choose to live",
    scroll: "Scroll",
    videoUrl: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/hero-video.mp4",
    posterUrl: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/Front-Exterior-Entry.jpg"
  },
  experience: {
    label: "Discover",
    title: "The Harmony Experience",
    description: "From the first conversation to the final walkthrough, every Harmony home follows one client’s vision. We begin in pre-design, aligning style, goals, and budget, then move through design and construction as a single, considered process. The result is a home that’s entirely yours, delivered without compromise.",
    button: "Learn More",
    videoUrl: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/hero-video.mp4",
    stat1Value: "40+",
    stat1Label: "Years of Legacy",
    stat2Value: "12,000+",
    stat2Label: "Homes Built"
  },
  featuredDevelopments: [
    {
      id: "egan-crest",
      status: "Coming 2026",
      title: "Egan Crest",
      description: "A modern luxury residence in Las Vegas, designed to align your life with light, landscape, and purpose. Now in development: an invitation to shape a home from the ground up.",
      button: "Learn More",
      image: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/Front-Exterior-Entry.jpg",
      url: "https://egancrest.com/"
    },
    {
      id: "skyfire-estate",
      status: "Completed",
      title: "SkyFire Estate",
      description: "Every aspect of the process is uniquely guided for each client: from pre-design, where style, goals, and budget are set, through construction, to the finished work. SkyFire is that process, realized. Designed and built by Harmony.",
      button: "Learn More",
      image: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/Las-Vegas-Custom-Home.jpg",
      url: "https://www.skyfirehomes.com/"
    }
  ],
  signatureResidences: {
    label: "FEATURED PROJECTS",
    title: "Selected developments across Las Vegas.",
    projects: [
      {
        id: "signature-1",
        badge: "Under Development",
        subheading: "Under Development",
        title: "Egan Crest",
        description: "A single-level desert-modern estate organized around a central courtyard, private pool, and outdoor loggia.",
        image: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/Rear-Yard.jpg.webp",
        buttonText: "Inquire",
        url: "#contact"
      },
      {
        id: "signature-2",
        badge: "Completed",
        subheading: "Sold",
        title: "SkyFire Estate",
        description: "An elevated multi-tiered modern sanctuary featuring floor-to-ceiling architectural glass and sweeping mountain views.",
        image: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/5212-Spanish-Heights-Dr-133.jpg",
        buttonText: "Completed",
        url: "#contact"
      }
    ]
  },
  aCloserLook: {
    label: "Explore The Portfolio",
    title: "A Closer Look",
    projects: [
      {
        id: "closer-1",
        title: "Spanish Heights Estate",
        category: "Exterior Architecture",
        image: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/5212-Spanish-Heights-Dr-138.jpg"
      },
      {
        id: "closer-2",
        title: "Spanish Heights Great Room",
        category: "Interior Architecture",
        image: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/5212-Spanish-Heights-Dr-101.jpg"
      },
      {
        id: "closer-3",
        title: "Spanish Heights Dining & Kitchen",
        category: "Culinary & Living Spaces",
        image: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/5212-Spanish-Heights-Dr-133.jpg"
      },
      {
        id: "closer-4",
        title: "Spanish Heights Courtyard",
        category: "Modernist Courtyard",
        image: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/Screenshot-2026-08-13-at-5.32.27-PM.png"
      },
      {
        id: "closer-5",
        title: "Spanish Heights Master Suite",
        category: "Private Quarters",
        image: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/5212-Spanish-Heights-Dr-109.jpg"
      },
      {
        id: "closer-6",
        title: "Spanish Heights Pool & Terrace",
        category: "Outdoor Living",
        image: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/5212-Spanish-Heights-Dr-141.jpg"
      },
      {
        id: "closer-7",
        title: "Desert Horizon Rear Grounds",
        category: "Landscape & Sanctuary",
        image: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/Rear-Yard.jpg.webp"
      }
    ]
  },
  legacy: {
    kicker: "CHAPTER 01 — OUR FOUNDER & LEGACY",
    title: "For those who expect more than excellence.",
    paragraphs: [
      "Harmony Homes is led by Jim Rhodes, a Las Vegas native whose career in residential construction began as a carpenter and grew into one of Nevada's most recognized homebuilding legacies.",
      "Over more than four decades, Jim has planned, built, and sold more than 12,000 homes while helping shape communities throughout the Las Vegas Valley — acting as a single point of control, aligning design, craftsmanship, timelines, and execution into one seamless vision."
    ],
    quote: "“Our clients choose us not just for what we build, but for what we eliminate: uncertainty, inefficiencies, and unnecessary risk.”",
    image: "https://staging.harmonyhomes.com/wp-content/uploads/2026/08/Jim_Rhodes-photo.jpeg",
    ctaText: "Discover Jim's Story",
    ctaLink: "/legacy"
  },
  testimonials: [
    {
      id: 1,
      quote: "Building with Harmony Homes was an exercise in absolute precision. Their unified architectural and construction team translated our abstract lifestyle goals into a desert masterpiece with meticulous discretion.",
      author: "Eleanor Vance",
      designation: "Egan Crest Resident & Design Patron",
      project: "Custom Estate"
    },
    {
      id: 2,
      quote: "Every detail—from the orientation of the morning light across the limestone floor to the seamless alignment of the terrace doors—feels intentional. They didn't just build a house; they shaped how we live.",
      author: "Arthur Pendleton",
      designation: "SkyFire Estate Client & Collector",
      project: "Modernist Residence"
    },
    {
      id: 3,
      quote: "The pre-design process aligned our goals perfectly before a single shovel touched the ground. Their attention to detail, execution speed, and ongoing support are entirely without parallel in modern architecture.",
      author: "Dr. Marcus Sterling",
      designation: "Henderson Estate Owner",
      project: "Signature Residence I"
    }
  ],
  concierge: {
    agentName: "Harmony Private Concierge",
    agentTitle: "Executive Client Services",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    greetingMessage: "Welcome to Harmony Homes. We offer bespoke private consultations, land acquisition advisory, and exclusive helicopter site tours.",
    vipPassword: "RH2024",
    whatsAppNumber: "17025707240",
    whatsAppPrefill: "Hello, I am interested in Harmony Homes developments.",
    enableHelicopterTours: true,
    helicopterTourTitle: "Exclusive Helicopter Visit",
    helicopterTourDesc: "Includes air transport and executive reception at the private helipad.",
    documents: [
      {
        title: "Price List & Lots",
        desc: "Updated pricing and reserved availability.",
        file: "Price_List_VIP.pdf",
        tag: "PDF VIP"
      },
      {
        title: "Architectural Guidelines",
        desc: "Descriptive memorandum and luxury finishes.",
        file: "Architectural_Guidelines.pdf",
        tag: "PDF VIP"
      },
      {
        title: "Flight & Helipad Protocols",
        desc: "Specifications for landing and air transport.",
        file: "Helipad_Protocols.pdf",
        tag: "PDF VIP"
      }
    ]
  },
  footer: {
    cta: {
      title: "START YOUR PROJECT",
      description: "Whether you are acquiring land, developing a new project, or building a private residence, we provide the expertise, structure, and execution to bring it to life.",
      button: "Inquire"
    },
    contactInfo: {
      title: "Contact",
      address: ["8912 Spanish Ridge Avenue", "Suite #200", "Las Vegas, NV 89148"],
      email: "info@harmonyhomes.com",
      phone: "702.570.7240"
    },
    usefulLinks: [
      { label: "About", href: "#harmony-experience" },
      { label: "Properties", href: "#featured-developments" },
      { label: "Legacy", href: "#legacy" },
      { label: "Contact", href: "#contact" },
      { label: "Terms & Conditions", href: "#terms" },
      { label: "Privacy Policy", href: "#privacy" }
    ],
    legal: "Renderings are artist's conceptions and may differ from the finished home. Features and specifications are subject to change without notice.",
    copyright: "Harmony Homes © 2026 All Rights Reserved."
  }
};
