// TODO: Реализовать модуль после подключения Supabase и API.

import type { Lead, Partner } from '@shared/types';

export async function createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<Lead> {
  throw new Error('Not implemented - requires Supabase connection');
}

export async function getLeads(): Promise<Lead[]> {
  return [];
}

export async function updateLeadStatus(leadId: string, status: Lead['status']): Promise<void> {
  throw new Error('Not implemented - requires Supabase connection');
}

export async function getPartners(): Promise<Partner[]> {
  return [];
}
