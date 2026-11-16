import type { Question, TauliahPaper } from "../../types";

export type Row = [qNo: number, part: string, chapterId: string, prompt: string, modelAnswer: string, marks?: number, difficulty?: 1 | 2 | 3];

export const INSTR_STD = "Jawab SEMUA soalan daripada Bahagian A dan SATU soalan daripada Bahagian B. Empat soalan mesti dijawab.";
export const NOTE_TRANS = "Teks soalan asal dalam tulisan Jawi; dipaparkan di sini sebagai transliterasi Rumi yang setia kepada teks asal. Ayat al-Quran disalin daripada kertas soalan. Sila rujuk dokumen asal untuk pengesahan.";

export function paper(meta: Omit<TauliahPaper, "questions" | "transcriptionNote"> & { marksStated?: boolean }, rows: Row[]): TauliahPaper {
  const questions: Question[] = rows.map(([qNo, part, chapterId, prompt, modelAnswer, marks, difficulty]) => ({
    id: `T${meta.year}-S${qNo}${part}`,
    source: "tauliah",
    type: "subjective",
    chapterId,
    difficulty: difficulty ?? 2,
    marks: marks ?? 5,
    prompt,
    modelAnswer,
    status: "belum_disemak",
    year: meta.year,
    hijri: meta.hijri,
    section: qNo <= 3 ? "A" : "B",
    qNo,
    part,
  }));
  const { marksStated: _m, ...rest } = meta;
  return { ...rest, questions, transcriptionNote: NOTE_TRANS + (meta.marksStated ? "" : " Markah setiap bahagian (5) ialah ANGGARAN kerana kertas hanya menyatakan 25 markah sesoalan.") };
}
