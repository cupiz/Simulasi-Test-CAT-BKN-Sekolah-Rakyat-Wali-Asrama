import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST(request: Request) {
  let tempPath = '';
  try {
    const { draftQuestion } = await request.json();

    if (!draftQuestion || !draftQuestion.number) {
      return NextResponse.json({ error: 'Draf soal tidak valid' }, { status: 400 });
    }

    const systemInstruction = `Anda adalah sistem pakar pembuat soal Situational Judgment Test (SJT) CAT BKN untuk posisi Wali Asrama Sekolah Rakyat.
Tugas Anda adalah mengembangkan draf soal yang diberikan menjadi kasus yang sangat panjang (100-150 kata), realistis, mendalam, dan menggunakan kata-kata profesional.
Aturan:
1. Soal harus ditulis dalam Bahasa Indonesia yang baik dan profesional.
2. Skenario harus spesifik mengenai kehidupan asrama.
3. Pertahankan bobot skor masing-masing opsi sesuai draf asal.
4. Output harus berupa objek JSON valid tanpa penjelasan tambahan di luar JSON.`;

    const prompt = `Kembangkan draf soal ujian CAT BKN Wali Asrama berikut menjadi kasus yang lebih detail, panjang (100-150 kata), dan realistis:

Kategori: ${draftQuestion.category}
Topik: ${draftQuestion.topic}
Nomor Soal: ${draftQuestion.number}

Kasus Draf:
"${draftQuestion.questionText}"

Pilihan Jawaban Draf:
${draftQuestion.options.map((o: any) => `- [Opsi ${o.key} (Skor ${o.score})]: ${o.text}`).join('\n')}

Silakan kembangkan dan tulis ulang soal tersebut ke dalam format JSON valid berikut (bobot skor masing-masing opsi harus sama persis dengan draf asal):
{
  "dateStr": "${draftQuestion.dateStr}",
  "number": ${draftQuestion.number},
  "category": "${draftQuestion.category}",
  "topic": "${draftQuestion.topic}",
  "questionText": "[SKB CAT BKN Wali Asrama] (Tulis kasus hasil pengembangan Anda di sini, minimal 100 kata)",
  "options": [
    { "key": "A", "text": "(Tulis ulang Pilihan A)", "score": ${draftQuestion.options.find((o: any) => o.key === 'A')?.score || 1} },
    { "key": "B", "text": "(Tulis ulang Pilihan B)", "score": ${draftQuestion.options.find((o: any) => o.key === 'B')?.score || 1} },
    { "key": "C", "text": "(Tulis ulang Pilihan C)", "score": ${draftQuestion.options.find((o: any) => o.key === 'C')?.score || 1} },
    { "key": "D", "text": "(Tulis ulang Pilihan D)", "score": ${draftQuestion.options.find((o: any) => o.key === 'D')?.score || 1} },
    { "key": "E", "text": "(Tulis ulang Pilihan E)", "score": ${draftQuestion.options.find((o: any) => o.key === 'E')?.score || 1} }
  ],
  "correctAnswer": "${draftQuestion.correctAnswer}",
  "explanation": "(Penjelasan mengapa opsi score 5 paling tepat dan yang lain kurang tepat, minimal 60 kata)",
  "competency": "${draftQuestion.competency}",
  "berakhlak": "${draftQuestion.berakhlak}",
  "psychologyBasis": "${draftQuestion.psychologyBasis}",
  "catTips": "${draftQuestion.catTips}"
}`;

    tempPath = path.join(process.cwd(), 'scripts', `temp_prompt_api_${draftQuestion.number}.txt`);
    fs.writeFileSync(tempPath, `${systemInstruction}\n\n${prompt}`, 'utf8');

    // Run agy command
    const cmd = `agy --dangerously-skip-permissions --print "Process the following input:" < "${tempPath}"`;
    const { stdout } = await execPromise(cmd, { maxBuffer: 15 * 1024 * 1024 });

    // Clean up temp file
    try {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    } catch (e) {}

    // Clean JSON response
    let cleaned = stdout.trim();
    const jsonStart = cleaned.indexOf('```json');
    if (jsonStart !== -1) {
      const start = jsonStart + 7;
      const end = cleaned.lastIndexOf('```');
      cleaned = cleaned.substring(start, end);
    } else {
      const codeStart = cleaned.indexOf('```');
      if (codeStart !== -1) {
        const start = codeStart + 3;
        const end = cleaned.lastIndexOf('```');
        cleaned = cleaned.substring(start, end);
      }
    }

    const questionObj = JSON.parse(cleaned.trim());
    return NextResponse.json({ success: true, question: questionObj });
  } catch (err: any) {
    // Attempt clean up of temp file
    try {
      if (tempPath && fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    } catch (e) {}

    console.error('[API Generate Single] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
