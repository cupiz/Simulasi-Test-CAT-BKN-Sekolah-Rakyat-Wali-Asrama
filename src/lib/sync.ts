import { db } from './db';
import { supabase, isCloudEnabled } from './supabase';

export async function syncQuestions() {
  if (!isCloudEnabled) return 0;
  try {
    console.log('Syncing questions from Supabase...');
    const { data: cloudQuestions, error } = await supabase
      .from('questions')
      .select('*');
    
    if (!error && cloudQuestions && cloudQuestions.length > 0) {
      await db.questions.bulkPut(cloudQuestions);
      console.log(`Successfully synced ${cloudQuestions.length} questions from Supabase.`);
      return cloudQuestions.length;
    } else if (error) {
      console.warn('Failed to sync questions from Supabase:', error.message);
    }
  } catch (syncErr) {
    console.error('Supabase questions sync error:', syncErr);
  }
  return 0;
}
