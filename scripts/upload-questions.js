const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Try to load env variables from .env.local or .env
function loadEnv() {
  const envPaths = [
    path.join(__dirname, '..', '.env.local'),
    path.join(__dirname, '..', '.env')
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.trim().startsWith('"') && value.trim().endsWith('"')) {
            value = value.trim().slice(1, -1);
          } else if (value.trim().startsWith("'") && value.trim().endsWith("'")) {
            value = value.trim().slice(1, -1);
          }
          process.env[key] = value.trim();
        }
      });
      break;
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Supabase credentials not found in env variables.');
  console.log('Silakan buat file .env.local di folder root dengan isi:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function upload() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('❌ Error: Harap berikan nama file JSON yang akan diunggah.');
    console.log('Contoh: node scripts/upload-questions.js daily_questions_2026-07-06.json');
    process.exit(1);
  }

  const jsonFileName = args[0];
  const filePath = path.isAbsolute(jsonFileName) ? jsonFileName : path.join(__dirname, '..', jsonFileName);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File tidak ditemukan di ${filePath}`);
    process.exit(1);
  }

  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(rawData);

    console.log(`📤 Mengunggah ${questions.length} soal ke Supabase table "questions"...`);
    
    // Clear the existing questions for that date in Supabase first to avoid duplicates
    const uniqueDates = [...new Set(questions.map(q => q.dateStr))];
    for (const dateStr of uniqueDates) {
      console.log(`🧹 Membersihkan soal lama untuk tanggal ${dateStr} di Supabase...`);
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('dateStr', dateStr);
      if (deleteError) {
        console.warn(`⚠️ Warning saat menghapus data tanggal ${dateStr}:`, deleteError.message);
      }
    }

    // Strip id property from questions to let database auto-increment correctly
    const cleanedQuestions = questions.map(q => {
      const { id, ...rest } = q;
      return rest;
    });

    // Upload questions in chunks to prevent payload size issues
    const chunkSize = 20;
    for (let i = 0; i < cleanedQuestions.length; i += chunkSize) {
      const chunk = cleanedQuestions.slice(i, i + chunkSize);
      const { error } = await supabase.from('questions').insert(chunk);
      if (error) {
        throw new Error(error.message);
      }
      console.log(`✅ Berhasil mengunggah soal #${i+1} sampai #${Math.min(i + chunkSize, cleanedQuestions.length)}`);
    }

    console.log('\n✨ PENGUNGGAHAN BERHASIL! Soal sudah sinkron ke awan Supabase.');
  } catch (err) {
    console.error('❌ Gagal mengunggah soal ke Supabase:', err.message);
    process.exit(1);
  }
}

upload();
