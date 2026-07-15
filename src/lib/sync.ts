import { db } from './db';
import { supabase, isCloudEnabled } from './supabase';

export async function syncQuestions() {
  if (!isCloudEnabled) return 0;
  try {
    console.log('Syncing questions from Supabase...');
    let allCloudQuestions: any[] = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;
    
    while (hasMore) {
      const from = page * pageSize;
      const to = from + pageSize - 1;
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .range(from, to);
        
      if (error) {
        console.warn('Failed to sync page from Supabase:', error.message);
        break;
      }
      
      if (data && data.length > 0) {
        allCloudQuestions = [...allCloudQuestions, ...data];
        if (data.length < pageSize) {
          hasMore = false;
        } else {
          page++;
        }
      } else {
        hasMore = false;
      }
    }
    
    if (allCloudQuestions.length > 0) {
      await db.questions.bulkPut(allCloudQuestions);
      console.log(`Successfully synced ${allCloudQuestions.length} questions from Supabase.`);
      return allCloudQuestions.length;
    }
  } catch (syncErr) {
    console.error('Supabase questions sync error:', syncErr);
  }
  return 0;
}
