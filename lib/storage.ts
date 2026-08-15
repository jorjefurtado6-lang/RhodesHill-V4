import fs from 'fs';
import path from 'path';
import { SiteContent, LeadItem } from './content-types';
import { defaultSiteContent } from './default-content';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

// Load Firebase Config dynamically from the provisioned workspace file
let db: any = null;
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    // Initialize Firestore with specific database ID if provided
    db = getFirestore(app, config.firestoreDatabaseId || '(default)');
    console.log('Firebase Firestore storage connection initialized successfully.');
  } else {
    console.warn('firebase-applet-config.json not found. Falling back to local storage.');
  }
} catch (err) {
  console.error('Error initializing Firebase in storage:', err);
}

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

// In-memory caching for local fallback
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

// Ensure safe content shape
function sanitizeContent(parsed: any): SiteContent {
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

export async function getStoredContent(): Promise<SiteContent> {
  if (db) {
    try {
      const docRef = doc(db, 'site', 'content');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return sanitizeContent(docSnap.data());
      } else {
        // First-time seed into Firestore
        const defaultData = sanitizeContent(defaultSiteContent);
        await setDoc(docRef, defaultData);
        return defaultData;
      }
    } catch (err) {
      console.error('Failed to get content from Firestore, falling back to local files:', err);
    }
  }

  // Fallback to local files / memory
  try {
    ensureDirectory();
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, 'utf-8');
      return sanitizeContent(JSON.parse(data));
    }
  } catch (err) {
    console.error('Error reading local content file:', err);
  }
  return memoryContent;
}

export async function saveStoredContent(content: SiteContent): Promise<boolean> {
  const sanitized = sanitizeContent(content);
  memoryContent = sanitized;

  // Save to Firestore
  if (db) {
    try {
      const docRef = doc(db, 'site', 'content');
      await setDoc(docRef, sanitized);
      return true;
    } catch (err) {
      console.error('Failed to save content to Firestore:', err);
    }
  }

  // Fallback to local file
  try {
    ensureDirectory();
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(sanitized, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing local content file:', err);
    return true;
  }
}

export async function resetStoredContent(): Promise<SiteContent> {
  const defaultData = sanitizeContent(defaultSiteContent);
  memoryContent = defaultData;

  // Reset in Firestore
  if (db) {
    try {
      const docRef = doc(db, 'site', 'content');
      await setDoc(docRef, defaultData);
      return defaultData;
    } catch (err) {
      console.error('Failed to reset content in Firestore:', err);
    }
  }

  // Fallback to local file reset
  try {
    ensureDirectory();
    if (fs.existsSync(CONTENT_FILE)) {
      fs.unlinkSync(CONTENT_FILE);
    }
  } catch (err) {
    console.error('Error resetting local content file:', err);
  }
  return memoryContent;
}

export async function getStoredLeads(): Promise<LeadItem[]> {
  if (db) {
    try {
      const leadsRef = collection(db, 'leads');
      const q = query(leadsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const leadsList: LeadItem[] = [];
      querySnapshot.forEach((docSnap) => {
        leadsList.push({
          id: docSnap.id,
          ...docSnap.data()
        } as LeadItem);
      });
      
      // Seed initial leads if completely empty in Firestore
      if (leadsList.length === 0) {
        for (const lead of memoryLeads) {
          const { id, ...leadData } = lead;
          await setDoc(doc(db, 'leads', id), leadData);
          leadsList.push(lead);
        }
      }
      return leadsList;
    } catch (err) {
      console.error('Failed to get leads from Firestore, falling back to local files:', err);
    }
  }

  // Fallback to local file / memory
  try {
    ensureDirectory();
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading local leads file:', err);
  }
  return memoryLeads;
}

export async function saveStoredLead(lead: Omit<LeadItem, 'id' | 'createdAt' | 'status'> & { status?: LeadItem['status'] }): Promise<LeadItem> {
  const id = 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const newLead: LeadItem = {
    ...lead,
    id,
    status: lead.status || 'new',
    createdAt: new Date().toISOString(),
  };

  if (db) {
    try {
      const { id: _, ...leadData } = newLead;
      await setDoc(doc(db, 'leads', id), leadData);
      return newLead;
    } catch (err) {
      console.error('Failed to save lead to Firestore:', err);
    }
  }

  // Fallback to local files
  const leads = [newLead, ...(await getStoredLeads())];
  memoryLeads = leads;

  try {
    ensureDirectory();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local lead:', err);
  }

  return newLead;
}

export async function updateStoredLeadStatus(id: string, status: LeadItem['status']): Promise<boolean> {
  if (db) {
    try {
      const docRef = doc(db, 'leads', id);
      await updateDoc(docRef, { status });
      return true;
    } catch (err) {
      console.error('Failed to update lead status in Firestore:', err);
    }
  }

  // Fallback to local files
  const leads = await getStoredLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return false;

  leads[index].status = status;
  memoryLeads = leads;

  try {
    ensureDirectory();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error updating local lead status:', err);
    return true;
  }
}

export async function deleteStoredLead(id: string): Promise<boolean> {
  if (db) {
    try {
      const docRef = doc(db, 'leads', id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error('Failed to delete lead from Firestore:', err);
    }
  }

  // Fallback to local files
  const leads = (await getStoredLeads()).filter((l) => l.id !== id);
  memoryLeads = leads;

  try {
    ensureDirectory();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error deleting local lead:', err);
    return true;
  }
}
