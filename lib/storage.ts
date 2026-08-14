import fs from 'fs';
import path from 'path';
import { SiteContent, LeadItem } from './content-types';
import { defaultSiteContent } from './default-content';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

// In-memory caching
let memoryContent: SiteContent = JSON.parse(JSON.stringify(defaultSiteContent));
let memoryLeads: LeadItem[] = [
  {
    id: 'lead-1',
    type: 'vip_booking',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@vanceholdings.com',
    phone: '+1 (702) 555-0192',
    date: '2026-09-15',
    isHelicopterSelected: true,
    status: 'contacted',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'lead-2',
    type: 'contact_form',
    name: 'Julian Sterling',
    email: 'j.sterling@sterlingarch.com',
    phone: '+1 (310) 555-0144',
    message: 'We are seeking a 2-acre private enclave in Spanish Heights for a modernist residence.',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  }
];

function ensureDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Non-fatal if read-only filesystem
  }
}

export function getStoredContent(): SiteContent {
  try {
    ensureDirectory();
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      // Merge with defaultSiteContent to ensure any missing field has safe defaults
      return {
        ...defaultSiteContent,
        ...parsed,
        theme: { ...defaultSiteContent.theme, ...(parsed.theme || {}) },
        nav: { ...defaultSiteContent.nav, ...(parsed.nav || {}) },
        hero: { ...defaultSiteContent.hero, ...(parsed.hero || {}) },
        experience: { ...defaultSiteContent.experience, ...(parsed.experience || {}) },
        signatureResidences: { ...defaultSiteContent.signatureResidences, ...(parsed.signatureResidences || {}) },
        aCloserLook: { ...defaultSiteContent.aCloserLook, ...(parsed.aCloserLook || {}) },
        legacy: { ...defaultSiteContent.legacy, ...(parsed.legacy || {}) },
        concierge: { ...defaultSiteContent.concierge, ...(parsed.concierge || {}) },
        footer: { ...defaultSiteContent.footer, ...(parsed.footer || {}) },
      };
    }
  } catch (err) {
    console.error('Error reading content file, using in-memory state:', err);
  }
  return memoryContent;
}

export function saveStoredContent(content: SiteContent): boolean {
  try {
    memoryContent = content;
    ensureDirectory();
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing content file, preserved in-memory:', err);
    return true;
  }
}

export function resetStoredContent(): SiteContent {
  try {
    memoryContent = JSON.parse(JSON.stringify(defaultSiteContent));
    ensureDirectory();
    if (fs.existsSync(CONTENT_FILE)) {
      fs.unlinkSync(CONTENT_FILE);
    }
  } catch (err) {
    console.error('Error resetting content file:', err);
  }
  return memoryContent;
}

export function getStoredLeads(): LeadItem[] {
  try {
    ensureDirectory();
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading leads file, using memory:', err);
  }
  return memoryLeads;
}

export function saveStoredLead(lead: Omit<LeadItem, 'id' | 'createdAt' | 'status'> & { status?: LeadItem['status'] }): LeadItem {
  const newLead: LeadItem = {
    ...lead,
    id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    status: lead.status || 'new',
    createdAt: new Date().toISOString(),
  };

  const leads = [newLead, ...getStoredLeads()];
  memoryLeads = leads;

  try {
    ensureDirectory();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving lead to disk:', err);
  }

  return newLead;
}

export function updateStoredLeadStatus(id: string, status: LeadItem['status']): boolean {
  const leads = getStoredLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return false;

  leads[index].status = status;
  memoryLeads = leads;

  try {
    ensureDirectory();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error updating lead status on disk:', err);
    return true;
  }
}

export function deleteStoredLead(id: string): boolean {
  const leads = getStoredLeads().filter((l) => l.id !== id);
  memoryLeads = leads;

  try {
    ensureDirectory();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error deleting lead from disk:', err);
    return true;
  }
}
