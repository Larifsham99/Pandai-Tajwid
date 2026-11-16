import { p2014, p2015, p2016 } from "./p2014_2016";
import { p2017, p2018, p2019 } from "./p2017_2019";
import { p2022, p2023, p2024, p2025 } from "./p2022_2025";
import type { TauliahPaper } from "../../types";

/** Kertas soalan tauliah Tajwid Negeri Kedah yang dibekalkan pengguna (2014–2019, 2022–2025). */
export const PAPERS: TauliahPaper[] = [p2025, p2024, p2023, p2022, p2019, p2018, p2017, p2016, p2015, p2014];
export const TAULIAH_QUESTIONS = PAPERS.flatMap((p) => p.questions);
