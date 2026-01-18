import { supabase } from '../client/src/lib/supabase';
import { storage } from './storage';
import type { Lead, Calculation } from '@shared/schema';

export async function syncLeadsToSupabase(): Promise<void> {
  try {
    const leads = await storage.getAllLeads();

    if (leads.length === 0) {
      console.log('No leads to sync');
      return;
    }

    const { error } = await supabase
      .from('leads')
      .upsert(leads, { onConflict: 'id' });

    if (error) {
      console.error('Failed to sync leads to Supabase:', error);
      throw error;
    }

    console.log(`✅ Synced ${leads.length} leads to Supabase`);
  } catch (error) {
    console.error('Supabase sync error:', error);
    throw error;
  }
}

export async function syncCalculationsToSupabase(): Promise<void> {
  try {
    const calculations = await storage.getAllCalculations();

    if (calculations.length === 0) {
      console.log('No calculations to sync');
      return;
    }

    const { error } = await supabase
      .from('calculations')
      .upsert(calculations, { onConflict: 'id' });

    if (error) {
      console.error('Failed to sync calculations to Supabase:', error);
      throw error;
    }

    console.log(`✅ Synced ${calculations.length} calculations to Supabase`);
  } catch (error) {
    console.error('Supabase sync error:', error);
    throw error;
  }
}

export async function syncFromSupabase(): Promise<void> {
  try {
    console.log('Starting sync from Supabase...');

    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*');

    if (leadsError) {
      console.error('Failed to fetch leads from Supabase:', leadsError);
    } else if (leads && leads.length > 0) {
      for (const lead of leads as Lead[]) {
        const { id, createdAt, ...insertData } = lead;
        await storage.createLead({
          ...insertData,
          message: insertData.message ?? undefined,
          source: insertData.source ?? undefined,
          email: insertData.email ?? "", // Handle null email if schema allows it or default
        });
      }
      console.log(`✅ Synced ${leads.length} leads from Supabase`);
    }

    const { data: calculations, error: calcError } = await supabase
      .from('calculations')
      .select('*');

    if (calcError) {
      console.error('Failed to fetch calculations from Supabase:', calcError);
    } else if (calculations && calculations.length > 0) {
      for (const calc of calculations as any[]) {
        const { id, createdAt, ...insertData } = calc;
        await storage.createCalculation({
          ...insertData,
          estimatedCost: insertData.estimatedCost || undefined
        });
      }
      console.log(`✅ Synced ${calculations.length} calculations from Supabase`);
    }

    console.log('✅ Sync from Supabase completed');
  } catch (error) {
    console.error('Supabase sync error:', error);
    throw error;
  }
}

export async function bidirectionalSync(): Promise<void> {
  console.log('Starting bidirectional sync...');
  await syncLeadsToSupabase();
  await syncCalculationsToSupabase();
  await syncFromSupabase();
  console.log('✅ Bidirectional sync completed');
}
