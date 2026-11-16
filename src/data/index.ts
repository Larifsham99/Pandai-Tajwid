import { chaptersA } from "./notes1";
import { chaptersB } from "./notes2";
import { chaptersC } from "./notes3";
import { practiceQuestions } from "./practice";
import { TAULIAH_QUESTIONS, PAPERS } from "./tauliah";
import { generateQuestions } from "./generated";
import type { Chapter } from "../types";

export const CHAPTERS: Chapter[] = [...chaptersA, ...chaptersB, ...chaptersC];
export const chapterById = (id: string) => CHAPTERS.find((c) => c.id === id);
/** Soalan objektif dijana daripada nota (status: belum disemak). */
export const GENERATED_QUESTIONS = generateQuestions(CHAPTERS);
export const SEED_QUESTIONS = [...practiceQuestions, ...GENERATED_QUESTIONS, ...TAULIAH_QUESTIONS];
export { PAPERS };
