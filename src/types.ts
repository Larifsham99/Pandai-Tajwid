// ===== Jenis data teras PANDAI TAJWID =====

/** Status semakan kandungan */
export type ReviewStatus = 'draf' | 'belum_disemak' | 'disemak' | 'diterbitkan';

export interface Reference {
  kitab: string;
  pengarang: string;
  bab?: string;
  halaman?: string; // hanya jika disahkan
  status: 'disahkan' | 'belum_disahkan';
  penyemak?: string;
}

// ----- Nota -----
export interface NoteExample {
  arab: string;
  ref?: string;
  hukum?: string;
  huraian: string;
}

export interface NoteTable {
  caption?: string;
  head: string[];
  rows: string[][];
}

export interface NoteSection {
  id: string;
  title: string;
  takrif?: string;
  takrifArab?: string;
  maksud?: string;
  huraian: string[];
  dhobit?: { arab?: string; teks: string }[];
  pembahagian?: { nama: string; ket: string }[];
  jadual?: NoteTable;
  contoh?: NoteExample[];
  caraBaca?: string;
  kesalahan?: string[];
  perbandingan?: string[];
  pengukuhan?: string[];
  ringkas?: string;
}

export interface Chapter {
  id: string; // b1..b12
  no: number;
  title: string;
  arabTitle: string;
  summary: string;
  icon: string;
  sections: NoteSection[];
  refs: Reference[];
  mindmap: { root: string; branches: { label: string; leaves: string[] }[] };
  flashcards: { front: string; back: string }[];
}

// ----- Soalan -----
export type QType = 'mcq' | 'tf' | 'fill' | 'match' | 'subjective';
/** latihan = soalan latihan sedia ada; jana = dijana automatik daripada nota; tauliah = soalan tauliah lepas */
export type QSource = 'tauliah' | 'latihan' | 'jana';
export type PracticeKind = 'kefahaman' | 'dhobit' | 'kenal_hukum' | 'perbandingan' | 'umum';

export interface QOption {
  id: string;
  text: string;
  why?: string;
}

export interface Explanation {
  why: string;
  concept?: string;
  identify?: string;
  dhobit?: string;
  examples?: string[];
  confusion?: string;
  compare?: string;
  refs?: string[];
}

export interface Question {
  id: string;
  source: QSource;
  type: QType;
  kind?: PracticeKind;
  chapterId: string;
  sectionId?: string; // seksyen nota sumber (soalan dijana)
  topic?: string;
  difficulty: 1 | 2 | 3;
  marks: number;
  prompt: string;
  arabic?: string;
  arabicRef?: string;
  options?: QOption[];
  answer?: string | string[];
  pairs?: { left: string; right: string }[];
  modelAnswer?: string;
  explanation?: Explanation;
  status: ReviewStatus;
  reviewer?: string;
  // khusus tauliah
  year?: number;
  hijri?: string;
  section?: 'A' | 'B';
  qNo?: number;
  part?: string;
  demo?: boolean;
}

export interface TauliahPaper {
  year: number;
  hijri: string;
  date?: string;
  penganjur: string;
  subject: string;
  instruction: string;
  duration: string;
  questions: Question[];
  transcriptionNote: string;
}

// ----- Rekod -----
export interface Profile {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
}

export interface Attempt {
  id: string;
  userId: string;
  questionId: string;
  chapterId: string;
  correct: boolean;
  score: number; // 0..1
  given?: string;
  mode: string;
  ts: number;
  ms?: number;
}

export interface ReviewItem {
  userId: string;
  questionId: string;
  box: number; // Leitner 0..6
  due: number;
  lapses: number;
  lastTs: number;
  saved?: boolean;
}

export interface PracticeRun { id: string; userId: string; title: string; total: number; score: number; ts: number }
export interface XpTx { id: string; userId: string; amount: number; reason: string; ts: number }
export interface UserBadge { userId: string; badgeId: string; ts: number }
export interface NoteProgress { userId: string; chapterId: string; read: string[]; lastSection?: string; ts: number }
export interface Bookmark { id: string; userId: string; chapterId: string; sectionId?: string; label: string; ts: number; fav?: boolean }
export interface Activity { id: string; userId: string; type: string; text: string; ts: number; link?: string }

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  arabicSize: number; // px
  dailyGoal: number;
  includeGenerated: boolean; // sertakan soalan dijana (belum disemak) dalam latih tubi
  sound: boolean; // kesan bunyi
}

export interface DB {
  version: number;
  profiles: Profile[];
  activeProfileId?: string;
  attempts: Attempt[];
  runs: PracticeRun[];
  review: ReviewItem[];
  xp: XpTx[];
  badges: UserBadge[];
  notes: NoteProgress[];
  bookmarks: Bookmark[];
  activity: Activity[];
  settings: Settings;
}
