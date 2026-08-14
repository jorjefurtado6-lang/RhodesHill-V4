'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Save, 
  RotateCcw, 
  ExternalLink, 
  Palette, 
  Type, 
  Layout, 
  Layers, 
  Sparkles, 
  Image as ImageIcon, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  Eye, 
  UserCheck, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  FolderKanban, 
  Compass, 
  Send,
  Download,
  Calendar,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SiteContent, LeadItem, DevelopmentItem, SignatureProject, PortfolioItem, TestimonialItem, VipDocument } from '@/lib/content-types';
import { defaultSiteContent } from '@/lib/default-content';

type TabKey = 
  | 'branding'
  | 'hero'
  | 'experience'
  | 'developments'
  | 'signature'
  | 'gallery'
  | 'legacy'
  | 'testimonials'
  | 'concierge'
  | 'footer'
  | 'leads';

const COLOR_PRESETS = [
  {
    name: 'Desert Gold & Limestone (Default)',
    primaryAccent: '#927A50',
    primaryAccentHover: '#7D6740',
    secondaryAccent: '#C5A059',
    backgroundColor: '#F9F9F7',
    textColor: '#1C1C1A'
  },
  {
    name: 'Charcoal & Champagne',
    primaryAccent: '#A38F6B',
    primaryAccentHover: '#8C7752',
    secondaryAccent: '#D4AF37',
    backgroundColor: '#F5F5F2',
    textColor: '#181816'
  },
  {
    name: 'Warm Bronze & Sandstone',
    primaryAccent: '#8C6D46',
    primaryAccentHover: '#755835',
    secondaryAccent: '#B89058',
    backgroundColor: '#FAF8F5',
    textColor: '#211D19'
  },
  {
    name: 'Modern Slate & Minimal Ochre',
    primaryAccent: '#706558',
    primaryAccentHover: '#594F43',
    secondaryAccent: '#9E8B75',
    backgroundColor: '#FAFAF8',
    textColor: '#191919'
  }
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem('harmony_admin_token'));
    }
    return false;
  });
  const [authChecking, setAuthChecking] = useState<boolean>(false);
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<TabKey>('branding');
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [originalContent, setOriginalContent] = useState<SiteContent>(defaultSiteContent);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<{ show: boolean; msg: string; isError?: boolean }>({ show: false, msg: '' });

  // Leads
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [leadsLoading, setLeadsLoading] = useState<boolean>(false);
  const [leadFilter, setLeadFilter] = useState<'all' | 'new' | 'contacted' | 'in_review' | 'archived'>('all');

  // Reset Modal
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      const json = await res.json();
      if (json.success && json.data) {
        setContent(json.data);
        setOriginalContent(json.data);
      }
    } catch (err) {
      console.error('Error fetching content:', err);
    }
  };

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch('/api/leads');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setLeads(json.data);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLeadsLoading(false);
    }
  };

  // Fetch initial data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [contentRes, leadsRes] = await Promise.all([
          fetch('/api/content'),
          fetch('/api/leads')
        ]);
        const contentJson = await contentRes.json();
        const leadsJson = await leadsRes.json();

        if (isMounted) {
          if (contentJson.success && contentJson.data) {
            setContent(contentJson.data);
            setOriginalContent(contentJson.data);
          }
          if (leadsJson.success && Array.isArray(leadsJson.data)) {
            setLeads(leadsJson.data);
          }
        }
      } catch (err) {
        console.error('Error loading admin data:', err);
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Derived state: has unsaved modifications
  const hasChanges = isAuthenticated && JSON.stringify(content) !== JSON.stringify(originalContent);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem('harmony_admin_token', data.token);
        setIsAuthenticated(true);
        fetchContent();
        fetchLeads();
      } else {
        setLoginError(data.message || 'Invalid username or password.');
      }
    } catch {
      setLoginError('Server connection error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setLoginUsername('admin');
    setLoginPassword('harmony2026');
  };

  const handleLogout = () => {
    localStorage.removeItem('harmony_admin_token');
    setIsAuthenticated(false);
  };

  const showNotification = (msg: string, isError = false) => {
    setSaveToast({ show: true, msg, isError });
    setTimeout(() => {
      setSaveToast({ show: false, msg: '', isError: false });
    }, 4000);
  };

  const handleSaveAll = async () => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      const data = await res.json();
      if (data.success) {
        setOriginalContent(content);
        showNotification('Site content saved and published successfully!');
      } else {
        showNotification(data.message || 'Failed to save changes.', true);
      }
    } catch {
      showNotification('Network error while saving changes.', true);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleResetToDefaults = async () => {
    setSaveLoading(true);
    try {
      const res = await fetch('/api/content', { method: 'DELETE' });
      const data = await res.json();
      if (data.success && data.data) {
        setContent(data.data);
        setOriginalContent(data.data);
        setShowResetModal(false);
        showNotification('All sections reset to initial factory layout.');
      }
    } catch {
      showNotification('Error resetting content.', true);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: LeadItem['status']) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
        );
        showNotification(`Lead status updated to ${newStatus}.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead inquiry?')) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
        showNotification('Lead removed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#141413] flex items-center justify-center text-white">
        <RefreshCw className="animate-spin text-[#C5A059]" size={32} />
      </div>
    );
  }

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E0E0D] text-[#E8E8E3] flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-sans">
        {/* Modern Warm Gold Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#927A50]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative w-full max-w-md bg-[#151513] border border-[#2D2A24] shadow-2xl p-8 md:p-10 flex flex-col">
          {/* Top Decorative Border Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#927A50] via-[#C5A059] to-[#927A50]" />

          <div className="text-center mb-8">
            <div className="relative w-44 h-10 mx-auto mb-5">
              <img 
                src="https://priscilac3.sg-host.com/wp-content/uploads/2026/08/logo-harmoni.png" 
                alt="Harmony Homes"
                className="object-contain w-full h-full brightness-0 invert"
                onError={(e) => {
                  // Fallback if logo fails to render
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            
            <span className="text-[10px] tracking-[0.35em] font-semibold text-[#C5A059] uppercase block mb-2">
              Control Studio
            </span>
            <h1 className="font-serif text-2xl text-white font-normal tracking-wide">
              Executive Administration
            </h1>
            <p className="text-xs text-stone-400 mt-2.5 font-light leading-relaxed max-w-sm mx-auto">
              Authenticate with your credentials to manage active developments, customize typography themes, and view elite client inquiries.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-900/50 rounded-lg text-red-200 text-xs flex items-start gap-3">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-300 block mb-2">
                Administrative Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#87735A]">
                  <UserCheck size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#1C1C1A] border border-[#2D2A24] rounded-lg text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-300 block mb-2">
                Console Security Passkey
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#87735A]">
                  <KeyRound size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#1C1C1A] border border-[#2D2A24] rounded-lg text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-2 bg-[#927A50] hover:bg-[#A68C5D] active:bg-[#7D6740] text-white font-bold text-xs uppercase tracking-[0.25em] py-4 rounded-lg shadow-lg hover:shadow-[#927A50]/10 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? <RefreshCw size={15} className="animate-spin" /> : <Lock size={15} />}
              <span>{loginLoading ? 'Authenticating...' : 'Access Control Studio'}</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#2D2A24]/60 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-[11px] text-[#C5A059] hover:text-[#D9B873] transition-colors font-medium tracking-wide cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              <span>Autofill Demo Credentials (admin / harmony2026)</span>
            </button>
            <Link
              href="/"
              className="text-xs text-stone-400 hover:text-white inline-flex items-center gap-1.5 transition-colors font-light tracking-wide"
            >
              <span>Return to Public Website</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Navigation Items
  const navItems: { key: TabKey; label: string; icon: any; count?: number }[] = [
    { key: 'branding', label: 'Theme & Typography', icon: Palette },
    { key: 'hero', label: 'Hero Header', icon: Layout },
    { key: 'experience', label: 'The Experience', icon: Compass },
    { key: 'developments', label: 'Developments', icon: FolderKanban, count: content.featuredDevelopments.length },
    { key: 'signature', label: 'Featured Projects', icon: Layers, count: content.signatureResidences.projects.length },
    { key: 'gallery', label: 'Portfolio Gallery', icon: ImageIcon, count: content.aCloserLook.projects.length },
    { key: 'legacy', label: 'Legacy & Founder', icon: Briefcase },
    { key: 'testimonials', label: 'Testimonials', icon: MessageSquare, count: content.testimonials.length },
    { key: 'concierge', label: 'Concierge & VIP', icon: Sparkles },
    { key: 'footer', label: 'Contact & Footer', icon: MapPin },
    { key: 'leads', label: 'Inquiries & CRM', icon: Send, count: leads.filter((l) => l.status === 'new').length },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0D] text-[#E8E8E3] font-sans antialiased flex flex-col">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#161614]/95 backdrop-blur-md border-b border-white/10 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#927A50]/20 border border-[#927A50]/40 flex items-center justify-center text-[#C5A059]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] font-semibold text-[#C5A059] uppercase block">
                HARMONY HOMES
              </span>
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Control Studio
              </h2>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/10 text-xs text-stone-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Server Connected</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-950/60 border border-amber-600/40 rounded-full text-amber-300 text-[11px]">
              <AlertCircle size={12} />
              <span>Unsaved changes</span>
            </div>
          )}

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
          >
            <Eye size={14} />
            <span>View Live Site</span>
          </Link>

          <button
            onClick={() => setShowResetModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="Reset site to original template"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saveLoading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#927A50] hover:bg-[#A68C5D] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {saveLoading ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saveLoading ? 'Saving...' : 'Publish Live'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-950/50 hover:text-red-300 text-stone-400 transition-colors cursor-pointer"
            title="Sign out of Admin Panel"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Floating Save Toast Notification */}
      <AnimatePresence>
        {saveToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-16 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-medium ${
              saveToast.isError
                ? 'bg-red-900/90 text-white border border-red-500/50'
                : 'bg-emerald-900/90 text-white border border-emerald-500/50'
            }`}
          >
            {saveToast.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} className="text-emerald-300" />}
            <span>{saveToast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 bg-[#141412] border-r border-white/5 p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0">
          <span className="hidden md:block text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500 px-3 py-2">
            Navigation Sections
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap md:whitespace-normal ${
                  isActive
                    ? 'bg-[#927A50] text-white shadow-md font-semibold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-white' : 'text-[#C5A059]'} />
                  <span>{item.label}</span>
                </div>
                {typeof item.count === 'number' && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-black/25 text-white' : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Form Body Area */}
        <main className="flex-1 bg-[#10100F] p-6 md:p-10 overflow-y-auto max-h-[calc(100vh-60px)]">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* 1. Theme & Typography */}
            {activeTab === 'branding' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-2xl text-white font-normal mb-1">
                    Theme, Color Palette &amp; Typography
                  </h3>
                  <p className="text-xs text-stone-400 font-light">
                    Customize the visual identity, primary gold accents, neutral canvas backgrounds, and font hierarchy across all pages.
                  </p>
                </div>

                {/* Color Scheme Presets */}
                <div className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                    Curated Luxury Color Schemes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COLOR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setContent((prev) => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              primaryAccent: preset.primaryAccent,
                              primaryAccentHover: preset.primaryAccentHover,
                              secondaryAccent: preset.secondaryAccent,
                              backgroundColor: preset.backgroundColor,
                              textColor: preset.textColor,
                            },
                          }))
                        }
                        className="p-4 rounded-xl bg-stone-900 border border-white/5 hover:border-[#C5A059]/60 text-left transition-all flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <span className="text-xs font-semibold text-white block">
                            {preset.name}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">
                            {preset.primaryAccent} • {preset.backgroundColor}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.primaryAccent }} />
                          <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.secondaryAccent }} />
                          <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.backgroundColor }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Pickers */}
                <div className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
                    Individual Color Variables
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-2">
                        Primary Accent (Gold/Taupe)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={content.theme.primaryAccent}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, primaryAccent: e.target.value },
                            }))
                          }
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={content.theme.primaryAccent}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, primaryAccent: e.target.value },
                            }))
                          }
                          className="flex-1 px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-2">
                        Hover Accent
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={content.theme.primaryAccentHover}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, primaryAccentHover: e.target.value },
                            }))
                          }
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={content.theme.primaryAccentHover}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, primaryAccentHover: e.target.value },
                            }))
                          }
                          className="flex-1 px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-2">
                        Secondary Gold Accent
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={content.theme.secondaryAccent}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, secondaryAccent: e.target.value },
                            }))
                          }
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={content.theme.secondaryAccent}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, secondaryAccent: e.target.value },
                            }))
                          }
                          className="flex-1 px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-2">
                        Canvas Neutral Background
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={content.theme.backgroundColor}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, backgroundColor: e.target.value },
                            }))
                          }
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={content.theme.backgroundColor}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, backgroundColor: e.target.value },
                            }))
                          }
                          className="flex-1 px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-2">
                        Dark Text Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={content.theme.textColor}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, textColor: e.target.value },
                            }))
                          }
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={content.theme.textColor}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, textColor: e.target.value },
                            }))
                          }
                          className="flex-1 px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography Settings */}
                <div className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
                    Typography Families
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-2">
                        Heading Font Style
                      </label>
                      <select
                        value={content.theme.headingFont}
                        onChange={(e: any) =>
                          setContent((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, headingFont: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-3 bg-stone-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="Hanken Grotesk">Hanken Grotesk (Modern Architectural Editorial)</option>
                        <option value="Playfair Display">Playfair Display (Classical Luxury Serif)</option>
                        <option value="Fraunces">Fraunces (Bespoke Warm Serif)</option>
                        <option value="Inter">Inter (Clean Modernist Sans)</option>
                      </select>
                      <p className="mt-2 text-[11px] text-stone-500 font-light">
                        Used for major section titles, numbers, and high-impact hero headings.
                      </p>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-2">
                        Body Font Style
                      </label>
                      <select
                        value={content.theme.bodyFont}
                        onChange={(e: any) =>
                          setContent((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, bodyFont: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-3 bg-stone-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="Inter">Inter (Ultra-legible, geometric neutral)</option>
                        <option value="Hanken Grotesk">Hanken Grotesk (Slightly warm grotesque)</option>
                      </select>
                      <p className="mt-2 text-[11px] text-stone-500 font-light">
                        Used for paragraph descriptions, labels, navigation items, and forms.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logo & Brand Assets */}
                <div className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
                    Brand Logo Assets
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Brand Logo Image URL
                      </label>
                      <input
                        type="url"
                        value={content.theme.logoUrl}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, logoUrl: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Logo Alt Text
                      </label>
                      <input
                        type="text"
                        value={content.theme.logoAlt}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, logoAlt: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Hero Section */}
            {activeTab === 'hero' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-2xl text-white font-normal mb-1">
                    Hero Section Configuration
                  </h3>
                  <p className="text-xs text-stone-400 font-light">
                    Manage the main video background, location pill, large display statement, and scroll indicators.
                  </p>
                </div>

                <div className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-5">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                      Location Label (Kicker)
                    </label>
                    <input
                      type="text"
                      value={content.hero.location}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, location: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-3 bg-stone-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                      Main Hero Headline
                    </label>
                    <textarea
                      rows={2}
                      value={content.hero.title}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, title: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-3 bg-stone-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                      Hero Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={content.hero.subtitle}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, subtitle: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-3 bg-stone-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Background Video URL (MP4 / Safari Safe)
                      </label>
                      <input
                        type="url"
                        value={content.hero.videoUrl}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, videoUrl: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Poster Fallback Image URL
                      </label>
                      <input
                        type="url"
                        value={content.hero.posterUrl}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, posterUrl: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. The Experience */}
            {activeTab === 'experience' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-2xl text-white font-normal mb-1">
                    The Harmony Experience
                  </h3>
                  <p className="text-xs text-stone-400 font-light">
                    Brand narrative video showcase, experience copy, and key milestones.
                  </p>
                </div>

                <div className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Section Label
                      </label>
                      <input
                        type="text"
                        value={content.experience.label}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            experience: { ...prev.experience, label: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={content.experience.title}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            experience: { ...prev.experience, title: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                      Narrative Description
                    </label>
                    <textarea
                      rows={4}
                      value={content.experience.description}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          experience: { ...prev.experience, description: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-3 bg-stone-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                      Showcase Video URL
                    </label>
                    <input
                      type="url"
                      value={content.experience.videoUrl}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          experience: { ...prev.experience, videoUrl: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-stone-900/80 rounded-xl border border-white/5 space-y-2">
                      <label className="text-[10px] uppercase font-bold text-stone-400 block">
                        Stat Milestone 1
                      </label>
                      <input
                        type="text"
                        value={content.experience.stat1Value}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            experience: { ...prev.experience, stat1Value: e.target.value },
                          }))
                        }
                        placeholder="40+"
                        className="w-full px-3 py-1.5 bg-stone-800 border border-white/10 rounded-lg text-xs text-white"
                      />
                      <input
                        type="text"
                        value={content.experience.stat1Label}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            experience: { ...prev.experience, stat1Label: e.target.value },
                          }))
                        }
                        placeholder="Years of Legacy"
                        className="w-full px-3 py-1.5 bg-stone-800 border border-white/10 rounded-lg text-xs text-stone-300"
                      />
                    </div>

                    <div className="p-4 bg-stone-900/80 rounded-xl border border-white/5 space-y-2">
                      <label className="text-[10px] uppercase font-bold text-stone-400 block">
                        Stat Milestone 2
                      </label>
                      <input
                        type="text"
                        value={content.experience.stat2Value}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            experience: { ...prev.experience, stat2Value: e.target.value },
                          }))
                        }
                        placeholder="12,000+"
                        className="w-full px-3 py-1.5 bg-stone-800 border border-white/10 rounded-lg text-xs text-white"
                      />
                      <input
                        type="text"
                        value={content.experience.stat2Label}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            experience: { ...prev.experience, stat2Label: e.target.value },
                          }))
                        }
                        placeholder="Homes Built"
                        className="w-full px-3 py-1.5 bg-stone-800 border border-white/10 rounded-lg text-xs text-stone-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Featured Developments */}
            {activeTab === 'developments' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-white font-normal mb-1">
                      Featured Developments
                    </h3>
                    <p className="text-xs text-stone-400 font-light">
                      Major projects showcase (e.g. Egan Crest &amp; SkyFire Estate).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        featuredDevelopments: [
                          ...prev.featuredDevelopments,
                          {
                            id: 'dev-' + Date.now(),
                            status: 'Now In Planning',
                            title: 'New Desert Sanctuary',
                            description: 'A bespoke modernist residence crafted for high-desert living.',
                            button: 'Learn More',
                            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                            url: '#contact',
                          },
                        ],
                      }))
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#927A50] hover:bg-[#A68C5D] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Development</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {content.featuredDevelopments.map((dev, idx) => (
                    <div
                      key={dev.id || idx}
                      className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-white/5">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                          Development #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setContent((prev) => ({
                              ...prev,
                              featuredDevelopments: prev.featuredDevelopments.filter((_, i) => i !== idx),
                            }))
                          }
                          className="text-stone-500 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={dev.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.featuredDevelopments];
                                list[idx].title = val;
                                return { ...prev, featuredDevelopments: list };
                              });
                            }}
                            className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                            Status Badge
                          </label>
                          <input
                            type="text"
                            value={dev.status}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.featuredDevelopments];
                                list[idx].status = val;
                                return { ...prev, featuredDevelopments: list };
                              });
                            }}
                            className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={dev.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setContent((prev) => {
                              const list = [...prev.featuredDevelopments];
                              list[idx].description = val;
                              return { ...prev, featuredDevelopments: list };
                            });
                          }}
                          className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                            Image URL
                          </label>
                          <input
                            type="url"
                            value={dev.image}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.featuredDevelopments];
                                list[idx].image = val;
                                return { ...prev, featuredDevelopments: list };
                              });
                            }}
                            className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                            Website / Link URL
                          </label>
                          <input
                            type="text"
                            value={dev.url}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.featuredDevelopments];
                                list[idx].url = val;
                                return { ...prev, featuredDevelopments: list };
                              });
                            }}
                            className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Signature Residences / Featured Projects */}
            {activeTab === 'signature' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-white font-normal mb-1">
                      Featured Projects (Signature Residences)
                    </h3>
                    <p className="text-xs text-stone-400 font-light">
                      Manage selected developments, badges, subheadings, and action buttons.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        signatureResidences: {
                          ...prev.signatureResidences,
                          projects: [
                            ...prev.signatureResidences.projects,
                            {
                              id: 'sig-' + Date.now(),
                              badge: 'Under Development',
                              subheading: 'Under Development',
                              title: 'Private Estate',
                              description: 'An architectural statement in the heart of Las Vegas.',
                              image: 'https://staging.harmonyhomes.com/wp-content/uploads/2026/08/Rear-Yard.jpg.webp',
                              buttonText: 'Inquire',
                              url: '#contact',
                            },
                          ],
                        },
                      }))
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#927A50] hover:bg-[#A68C5D] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                        Section Label
                      </label>
                      <input
                        type="text"
                        value={content.signatureResidences.label}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            signatureResidences: {
                              ...prev.signatureResidences,
                              label: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                        Section Headline
                      </label>
                      <input
                        type="text"
                        value={content.signatureResidences.title}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            signatureResidences: {
                              ...prev.signatureResidences,
                              title: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {content.signatureResidences.projects.map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-white/5">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                          Project #{idx + 1} — {proj.title}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setContent((prev) => ({
                              ...prev,
                              signatureResidences: {
                                ...prev.signatureResidences,
                                projects: prev.signatureResidences.projects.filter((_, i) => i !== idx),
                              },
                            }))
                          }
                          className="text-stone-500 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.signatureResidences.projects];
                                list[idx].title = val;
                                return {
                                  ...prev,
                                  signatureResidences: { ...prev.signatureResidences, projects: list },
                                };
                              });
                            }}
                            className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                            Top Photo Badge
                          </label>
                          <input
                            type="text"
                            value={proj.badge}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.signatureResidences.projects];
                                list[idx].badge = val;
                                return {
                                  ...prev,
                                  signatureResidences: { ...prev.signatureResidences, projects: list },
                                };
                              });
                            }}
                            className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                            Subheading (Below Photo)
                          </label>
                          <input
                            type="text"
                            value={proj.subheading}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.signatureResidences.projects];
                                list[idx].subheading = val;
                                return {
                                  ...prev,
                                  signatureResidences: { ...prev.signatureResidences, projects: list },
                                };
                              });
                            }}
                            className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setContent((prev) => {
                              const list = [...prev.signatureResidences.projects];
                              list[idx].description = val;
                              return {
                                ...prev,
                                signatureResidences: { ...prev.signatureResidences, projects: list },
                              };
                            });
                          }}
                          className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                            Photo URL
                          </label>
                          <input
                            type="url"
                            value={proj.image}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.signatureResidences.projects];
                                list[idx].image = val;
                                return {
                                  ...prev,
                                  signatureResidences: { ...prev.signatureResidences, projects: list },
                                };
                              });
                            }}
                            className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                            Button Text
                          </label>
                          <input
                            type="text"
                            value={proj.buttonText}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.signatureResidences.projects];
                                list[idx].buttonText = val;
                                return {
                                  ...prev,
                                  signatureResidences: { ...prev.signatureResidences, projects: list },
                                };
                              });
                            }}
                            className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                            Target Link URL
                          </label>
                          <input
                            type="text"
                            value={proj.url}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.signatureResidences.projects];
                                list[idx].url = val;
                                return {
                                  ...prev,
                                  signatureResidences: { ...prev.signatureResidences, projects: list },
                                };
                              });
                            }}
                            className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Portfolio Gallery */}
            {activeTab === 'gallery' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-white font-normal mb-1">
                      Portfolio Carousel (&ldquo;A Closer Look&rdquo;)
                    </h3>
                    <p className="text-xs text-stone-400 font-light">
                      High-resolution architectural photography slider items.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        aCloserLook: {
                          ...prev.aCloserLook,
                          projects: [
                            ...prev.aCloserLook.projects,
                            {
                              id: 'closer-' + Date.now(),
                              title: 'Private Quarters & Sanctuary',
                              category: 'Bespoke Architecture',
                              image: 'https://staging.harmonyhomes.com/wp-content/uploads/2026/08/5212-Spanish-Heights-Dr-138.jpg',
                            },
                          ],
                        },
                      }))
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#927A50] hover:bg-[#A68C5D] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Photo Item</span>
                  </button>
                </div>

                <div className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                        Gallery Label
                      </label>
                      <input
                        type="text"
                        value={content.aCloserLook.label}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            aCloserLook: { ...prev.aCloserLook, label: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                        Gallery Headline
                      </label>
                      <input
                        type="text"
                        value={content.aCloserLook.title}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            aCloserLook: { ...prev.aCloserLook, title: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {content.aCloserLook.projects.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-[#181816] p-5 rounded-2xl border border-white/5 space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">
                          Slide #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setContent((prev) => ({
                              ...prev,
                              aCloserLook: {
                                ...prev.aCloserLook,
                                projects: prev.aCloserLook.projects.filter((_, i) => i !== idx),
                              },
                            }))
                          }
                          className="text-stone-500 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                          Slide Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setContent((prev) => {
                              const list = [...prev.aCloserLook.projects];
                              list[idx].title = val;
                              return { ...prev, aCloserLook: { ...prev.aCloserLook, projects: list } };
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                          Category Label
                        </label>
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            setContent((prev) => {
                              const list = [...prev.aCloserLook.projects];
                              list[idx].category = val;
                              return { ...prev, aCloserLook: { ...prev.aCloserLook, projects: list } };
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                          Image Source URL
                        </label>
                        <input
                          type="url"
                          value={item.image}
                          onChange={(e) => {
                            const val = e.target.value;
                            setContent((prev) => {
                              const list = [...prev.aCloserLook.projects];
                              list[idx].image = val;
                              return { ...prev, aCloserLook: { ...prev.aCloserLook, projects: list } };
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-stone-900 border border-white/10 rounded-lg text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Legacy & Founder */}
            {activeTab === 'legacy' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-2xl text-white font-normal mb-1">
                    Founder Story &amp; Editorial Legacy
                  </h3>
                  <p className="text-xs text-stone-400 font-light">
                    Full-bleed split-screen chapter for Jim Rhodes and the 40-year Las Vegas legacy.
                  </p>
                </div>

                <div className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Chapter Kicker
                      </label>
                      <input
                        type="text"
                        value={content.legacy.kicker}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            legacy: { ...prev.legacy, kicker: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Editorial Title
                      </label>
                      <input
                        type="text"
                        value={content.legacy.title}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            legacy: { ...prev.legacy, title: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block">
                        Story Paragraphs
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setContent((prev) => ({
                            ...prev,
                            legacy: {
                              ...prev.legacy,
                              paragraphs: [...prev.legacy.paragraphs, 'New legacy narrative paragraph.'],
                            },
                          }))
                        }
                        className="text-xs text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={13} />
                        <span>Add Paragraph</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {content.legacy.paragraphs.map((p, idx) => (
                        <div key={idx} className="flex gap-2">
                          <textarea
                            rows={3}
                            value={p}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.legacy.paragraphs];
                                list[idx] = val;
                                return { ...prev, legacy: { ...prev.legacy, paragraphs: list } };
                              });
                            }}
                            className="flex-1 px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                          />
                          {content.legacy.paragraphs.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setContent((prev) => ({
                                  ...prev,
                                  legacy: {
                                    ...prev.legacy,
                                    paragraphs: prev.legacy.paragraphs.filter((_, i) => i !== idx),
                                  },
                                }))
                              }
                              className="text-stone-500 hover:text-red-400 p-2 cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                      Highlighted Quote Box
                    </label>
                    <textarea
                      rows={2}
                      value={content.legacy.quote}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          legacy: { ...prev.legacy, quote: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Founder Portrait Image URL
                      </label>
                      <input
                        type="url"
                        value={content.legacy.image}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            legacy: { ...prev.legacy, image: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={content.legacy.ctaText}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            legacy: { ...prev.legacy, ctaText: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        CTA Target URL
                      </label>
                      <input
                        type="text"
                        value={content.legacy.ctaLink}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            legacy: { ...prev.legacy, ctaLink: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Testimonials */}
            {activeTab === 'testimonials' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-white font-normal mb-1">
                      Client Endorsements &amp; Testimonials
                    </h3>
                    <p className="text-xs text-stone-400 font-light">
                      High-end quotes, client titles, and project associations.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        testimonials: [
                          ...prev.testimonials,
                          {
                            id: Date.now(),
                            quote: "Harmony Homes achieved an unprecedented standard of finish and structural poise.",
                            author: "Victoria Ashford",
                            designation: "Private Patron",
                            project: "Spanish Heights Estate",
                          },
                        ],
                      }))
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#927A50] hover:bg-[#A68C5D] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {content.testimonials.map((test, idx) => (
                    <div
                      key={test.id || idx}
                      className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                          Endorsement #{idx + 1} — {test.author}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setContent((prev) => ({
                              ...prev,
                              testimonials: prev.testimonials.filter((_, i) => i !== idx),
                            }))
                          }
                          className="text-stone-500 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                          Quote Text
                        </label>
                        <textarea
                          rows={3}
                          value={test.quote}
                          onChange={(e) => {
                            const val = e.target.value;
                            setContent((prev) => {
                              const list = [...prev.testimonials];
                              list[idx].quote = val;
                              return { ...prev, testimonials: list };
                            });
                          }}
                          className="w-full px-3 py-2 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                            Client Name
                          </label>
                          <input
                            type="text"
                            value={test.author}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.testimonials];
                                list[idx].author = val;
                                return { ...prev, testimonials: list };
                              });
                            }}
                            className="w-full px-3 py-1.5 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                            Designation / Title
                          </label>
                          <input
                            type="text"
                            value={test.designation}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.testimonials];
                                list[idx].designation = val;
                                return { ...prev, testimonials: list };
                              });
                            }}
                            className="w-full px-3 py-1.5 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
                            Project Association
                          </label>
                          <input
                            type="text"
                            value={test.project}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.testimonials];
                                list[idx].project = val;
                                return { ...prev, testimonials: list };
                              });
                            }}
                            className="w-full px-3 py-1.5 bg-stone-900 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. Concierge Agent & VIP Lounge */}
            {activeTab === 'concierge' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-2xl text-white font-normal mb-1">
                    Concierge Agent &amp; VIP Lounge Configuration
                  </h3>
                  <p className="text-xs text-stone-400 font-light">
                    Manage the personal VIP concierge desk, instant WhatsApp direct routing, helicopter booking flags, and gated PDF materials.
                  </p>
                </div>

                <div className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                    Concierge Agent Profile
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Agent Name
                      </label>
                      <input
                        type="text"
                        value={content.concierge.agentName}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            concierge: { ...prev.concierge, agentName: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Agent Title / Department
                      </label>
                      <input
                        type="text"
                        value={content.concierge.agentTitle}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            concierge: { ...prev.concierge, agentTitle: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                      Concierge Avatar Photo URL
                    </label>
                    <input
                      type="url"
                      value={content.concierge.avatarUrl}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          concierge: { ...prev.concierge, avatarUrl: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                      Welcome Greeting Message
                    </label>
                    <textarea
                      rows={2}
                      value={content.concierge.greetingMessage}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          concierge: { ...prev.concierge, greetingMessage: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        VIP Passcode Key
                      </label>
                      <input
                        type="text"
                        value={content.concierge.vipPassword}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            concierge: { ...prev.concierge, vipPassword: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Direct WhatsApp Number (No spaces)
                      </label>
                      <input
                        type="text"
                        value={content.concierge.whatsAppNumber}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            concierge: { ...prev.concierge, whatsAppNumber: e.target.value },
                          }))
                        }
                        placeholder="17025707240"
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        WhatsApp Prefill Message
                      </label>
                      <input
                        type="text"
                        value={content.concierge.whatsAppPrefill}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            concierge: { ...prev.concierge, whatsAppPrefill: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* VIP Documents List */}
                <div className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                      Confidential VIP Documents (Gated Downloadables)
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) => ({
                          ...prev,
                          concierge: {
                            ...prev.concierge,
                            documents: [
                              ...prev.concierge.documents,
                              {
                                title: 'New VIP Dossier',
                                desc: 'Exclusive specifications and confidential lot maps.',
                                file: 'Lot_Dossier_VIP.pdf',
                                tag: 'PDF VIP',
                              },
                            ],
                          },
                        }))
                      }
                      className="text-xs text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Add Document</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {content.concierge.documents.map((doc, idx) => (
                      <div key={idx} className="p-4 bg-stone-900/80 rounded-xl border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-stone-300 uppercase">
                            Document #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setContent((prev) => ({
                                ...prev,
                                concierge: {
                                  ...prev.concierge,
                                  documents: prev.concierge.documents.filter((_, i) => i !== idx),
                                },
                              }))
                            }
                            className="text-stone-500 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 size={12} />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                              Document Title
                            </label>
                            <input
                              type="text"
                              value={doc.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setContent((prev) => {
                                  const list = [...prev.concierge.documents];
                                  list[idx].title = val;
                                  return { ...prev, concierge: { ...prev.concierge, documents: list } };
                                });
                              }}
                              className="w-full px-3 py-1.5 bg-stone-800 border border-white/10 rounded-lg text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                              File Identifier / URL
                            </label>
                            <input
                              type="text"
                              value={doc.file}
                              onChange={(e) => {
                                const val = e.target.value;
                                setContent((prev) => {
                                  const list = [...prev.concierge.documents];
                                  list[idx].file = val;
                                  return { ...prev, concierge: { ...prev.concierge, documents: list } };
                                });
                              }}
                              className="w-full px-3 py-1.5 bg-stone-800 border border-white/10 rounded-lg text-xs text-white font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={doc.desc}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const list = [...prev.concierge.documents];
                                list[idx].desc = val;
                                return { ...prev, concierge: { ...prev.concierge, documents: list } };
                              });
                            }}
                            className="w-full px-3 py-1.5 bg-stone-800 border border-white/10 rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 10. Contact & Footer */}
            {activeTab === 'footer' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-2xl text-white font-normal mb-1">
                    Contact &amp; Footer Structure
                  </h3>
                  <p className="text-xs text-stone-400 font-light">
                    Office addresses, direct contact channels, legal notices, and start project banner.
                  </p>
                </div>

                {/* Start Your Project CTA */}
                <div className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                    Call to Action Banner (&ldquo;START YOUR PROJECT&rdquo;)
                  </h4>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                      CTA Title
                    </label>
                    <input
                      type="text"
                      value={content.footer.cta.title}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          footer: { ...prev.footer, cta: { ...prev.footer.cta, title: e.target.value } },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                      CTA Description
                    </label>
                    <textarea
                      rows={2}
                      value={content.footer.cta.description}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          footer: { ...prev.footer, cta: { ...prev.footer.cta, description: e.target.value } },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                {/* Information / Contact Office */}
                <div className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                    Corporate Contact Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Column Title
                      </label>
                      <input
                        type="text"
                        value={content.footer.contactInfo.title}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              contactInfo: { ...prev.footer.contactInfo, title: e.target.value },
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={content.footer.contactInfo.email}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              contactInfo: { ...prev.footer.contactInfo, email: e.target.value },
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={content.footer.contactInfo.phone}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              contactInfo: { ...prev.footer.contactInfo, phone: e.target.value },
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                      Address Lines (comma or line separated)
                    </label>
                    <textarea
                      rows={3}
                      value={content.footer.contactInfo.address.join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n');
                        setContent((prev) => ({
                          ...prev,
                          footer: {
                            ...prev.footer,
                            contactInfo: { ...prev.footer.contactInfo, address: lines },
                          },
                        }));
                      }}
                      className="w-full px-4 py-2.5 bg-stone-900 border border-white/10 rounded-xl text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-1.5">
                      Legal Disclaimer
                    </label>
                    <textarea
                      rows={2}
                      value={content.footer.legal}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          footer: { ...prev.footer, legal: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-2 bg-stone-900 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 11. Leads & Inquiries CRM */}
            {activeTab === 'leads' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-white font-normal mb-1">
                      Client Inquiries &amp; VIP Bookings
                    </h3>
                    <p className="text-xs text-stone-400 font-light">
                      Real-time submissions from contact forms and VIP helicopter tour reservations.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchLeads}
                      className="p-2 rounded-lg bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
                      title="Refresh inquiries"
                    >
                      <RefreshCw size={14} className={leadsLoading ? 'animate-spin' : ''} />
                    </button>
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {(['all', 'new', 'contacted', 'in_review', 'archived'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setLeadFilter(st)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                        leadFilter === st
                          ? 'bg-[#927A50] text-white'
                          : 'bg-stone-900 text-stone-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {leads
                    .filter((l) => leadFilter === 'all' || l.status === leadFilter)
                    .map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-[#181816] p-6 rounded-2xl border border-white/5 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                lead.type === 'vip_booking'
                                  ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40'
                                  : 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                              }`}
                            >
                              {lead.type === 'vip_booking' ? 'VIP Helicopter Tour' : 'General Contact'}
                            </span>
                            <span className="text-xs font-bold text-white">{lead.name}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={lead.status}
                              onChange={(e: any) => handleUpdateLeadStatus(lead.id, e.target.value)}
                              className="px-2.5 py-1 bg-stone-900 border border-white/10 rounded-lg text-[11px] text-stone-300 focus:outline-none"
                            >
                              <option value="new">Status: New</option>
                              <option value="contacted">Status: Contacted</option>
                              <option value="in_review">Status: In Review</option>
                              <option value="archived">Status: Archived</option>
                            </select>

                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                              title="Delete inquiry"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <span className="text-stone-500 block text-[10px] uppercase">Email</span>
                            <a href={`mailto:${lead.email}`} className="text-stone-200 underline hover:text-[#C5A059]">
                              {lead.email}
                            </a>
                          </div>
                          <div>
                            <span className="text-stone-500 block text-[10px] uppercase">Phone / WhatsApp</span>
                            <a href={`tel:${lead.phone}`} className="text-stone-200 hover:text-[#C5A059]">
                              {lead.phone}
                            </a>
                          </div>
                          <div>
                            <span className="text-stone-500 block text-[10px] uppercase">Received</span>
                            <span className="text-stone-300">
                              {new Date(lead.createdAt).toLocaleDateString()} at{' '}
                              {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {lead.date && (
                          <div className="text-xs bg-stone-900/60 p-3 rounded-lg border border-white/5">
                            <span className="text-stone-400 font-semibold block mb-0.5">Requested Tour Date:</span>
                            <span className="text-[#C5A059] font-medium">{lead.date}</span>
                          </div>
                        )}

                        {lead.message && (
                          <div className="text-xs bg-stone-900/60 p-3 rounded-lg border border-white/5">
                            <span className="text-stone-400 font-semibold block mb-0.5">Message:</span>
                            <p className="text-stone-300 leading-relaxed font-light">{lead.message}</p>
                          </div>
                        )}
                      </div>
                    ))}

                  {leads.filter((l) => leadFilter === 'all' || l.status === leadFilter).length === 0 && (
                    <div className="py-12 text-center text-stone-500 text-xs">
                      No inquiries found in this category.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1C1C1A] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-amber-400">
                <AlertCircle size={24} />
                <h4 className="font-serif text-lg text-white">
                  Reset Site to Factory Defaults?
                </h4>
              </div>

              <p className="text-xs text-stone-400 font-light leading-relaxed">
                This action will restore all typography, palette settings, Jim Rhodes legacy texts, developments, and concierge assets to the original preset configuration.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetToDefaults}
                  disabled={saveLoading}
                  className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
