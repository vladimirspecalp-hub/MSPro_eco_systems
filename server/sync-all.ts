import { storage } from './storage';
import { supabase } from '../client/src/lib/supabase';

export async function syncAllData() {
  try {
    console.log('Starting full data synchronization...');

    const leads = await storage.getAllLeads();
    console.log(`Found ${leads.length} leads to sync`);

    if (leads.length > 0 && supabase) {
      const { error: leadsError } = await supabase
        .from('leads')
        .upsert(leads, { onConflict: 'id' });

      if (leadsError) {
        console.error('Failed to sync leads:', leadsError);
      } else {
        console.log('✅ Leads synced successfully');
      }
    }

    const calculations = await storage.getAllCalculations();
    console.log(`Found ${calculations.length} calculations to sync`);

    if (calculations.length > 0 && supabase) {
      const { error: calcError } = await supabase
        .from('calculations')
        .upsert(calculations, { onConflict: 'id' });

      if (calcError) {
        console.error('Failed to sync calculations:', calcError);
      } else {
        console.log('✅ Calculations synced successfully');
      }
    }

    console.log('✅ Full synchronization completed');
    return { success: true };
  } catch (error) {
    console.error('Synchronization failed:', error);
    return { success: false, error };
  }
}

if (require.main === module) {
  syncAllData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
