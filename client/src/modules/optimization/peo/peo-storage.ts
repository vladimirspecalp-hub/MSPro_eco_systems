import type { UserProfile } from './peo-engine';

const STORAGE_KEY = 'mspro_user_profile';

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile:', error);
  }
}

export function loadProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const profile = JSON.parse(stored) as UserProfile;
    return profile;
  } catch (error) {
    console.error('Failed to load profile:', error);
    return null;
  }
}

export function updateProfile(updates: Partial<UserProfile>): UserProfile | null {
  const current = loadProfile();
  if (!current) return null;
  
  const updated = { ...current, ...updates };
  saveProfile(updated);
  return updated;
}

export function trackServiceView(slug: string): void {
  const profile = loadProfile();
  if (!profile) return;
  
  if (!profile.viewedServices.includes(slug)) {
    profile.viewedServices.push(slug);
  }
  
  saveProfile(profile);
}

export function incrementVisitCount(): void {
  const profile = loadProfile();
  if (!profile) return;
  
  profile.visitCount += 1;
  profile.lastVisit = Date.now();
  saveProfile(profile);
}

export function setUserRegion(region: string): void {
  const profile = loadProfile();
  if (!profile) return;
  
  profile.region = region;
  saveProfile(profile);
}

export function addInterest(interest: string): void {
  const profile = loadProfile();
  if (!profile) return;
  
  if (!profile.interests.includes(interest)) {
    profile.interests.push(interest);
    saveProfile(profile);
  }
}

export function clearProfile(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export async function syncProfileToServer(profile: UserProfile): Promise<boolean> {
  try {
    const response = await fetch('/api/user-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return response.ok;
  } catch {
    return false;
  }
}
