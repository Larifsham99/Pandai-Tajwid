import { describe, it, expect } from "vitest";
import { SEED_QUESTIONS, CHAPTERS, PAPERS, GENERATED_QUESTIONS } from "../src/data";
import { levelFor, LEVELS, leaderboard } from "../src/lib/gamification";
import { grade, srsUpdate, dueReviews } from "../src/lib/actions";
import { emptyDB } from "../src/lib/store";
import { norm, DAY } from "../src/lib/util";

const KHILAF = /khilaf|ikhtilaf|pendapat|sebahagian ulama|dua wajah|diutamakan|rujuk guru/i;

describe("integriti kandungan", () => {
  it("ID soalan unik", () => {
    const ids = SEED_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("setiap soalan merujuk bab yang wujud", () => {
    const ch = new Set(CHAPTERS.map((c) => c.id));
    SEED_QUESTIONS.forEach((q) => expect(ch.has(q.chapterId), q.id).toBe(true));
  });
  it("jawapan objektif wujud dalam pilihan & pilihan unik", () => {
    SEED_QUESTIONS.filter((q) => q.type === "mcq").forEach((q) => {
      expect(q.options!.some((o) => o.id === q.answer), q.id).toBe(true);
      const texts = q.options!.map((o) => norm(o.text));
      expect(new Set(texts).size, q.id).toBe(texts.length);
    });
    SEED_QUESTIONS.filter((q) => q.type === "tf").forEach((q) => expect(["B", "S"]).toContain(q.answer));
  });
  it("12 bab dengan seksyen nota", () => {
    expect(CHAPTERS).toHaveLength(12);
    CHAPTERS.forEach((c) => { expect(c.sections.length).toBeGreaterThan(0); expect(c.refs.length).toBeGreaterThan(0); });
  });
  it("10 kertas tauliah", () => { expect(PAPERS).toHaveLength(10); });
});

describe("soalan dijana daripada nota", () => {
  it("bilangan besar & meliputi semua bab", () => {
    expect(GENERATED_QUESTIONS.length).toBeGreaterThan(500);
    CHAPTERS.forEach((c) => expect(GENERATED_QUESTIONS.some((q) => q.chapterId === c.id), c.id).toBe(true));
  });
  it("semua berlabel belum disemak, sumber 'jana', objektif sahaja", () => {
    GENERATED_QUESTIONS.forEach((q) => {
      expect(q.status).toBe("belum_disemak");
      expect(q.source).toBe("jana");
      expect(["mcq", "tf", "match"]).toContain(q.type);
      expect(q.explanation?.why.length, q.id).toBeGreaterThan(3);
    });
  });
  it("tiada perkara khilaf pada soalan atau jawapan", () => {
    GENERATED_QUESTIONS.forEach((q) => {
      const ans = q.type === "mcq" ? q.options!.find((o) => o.id === q.answer)!.text : "";
      expect(KHILAF.test(q.prompt + " " + ans + " " + (q.pairs ?? []).map((p) => p.left + p.right).join(" ")), q.id).toBe(false);
      q.options?.forEach((o) => expect(KHILAF.test(o.text), q.id).toBe(false));
    });
  });
  it("jawapan MCQ betul diambil verbatim daripada nota", () => {
    const corpus = JSON.stringify(CHAPTERS);
    GENERATED_QUESTIONS.filter((q) => q.type === "mcq").forEach((q) => {
      const ans = q.options!.find((o) => o.id === q.answer)!.text;
      expect(corpus.includes(JSON.stringify(ans).slice(1, -1)), `${q.id}: ${ans}`).toBe(true);
    });
  });
  it("deterministik (ID stabil antara binaan)", async () => {
    const { generateQuestions } = await import("../src/data/generated");
    expect(generateQuestions(CHAPTERS).map((q) => q.id + q.answer)).toEqual(GENERATED_QUESTIONS.map((q) => q.id + q.answer));
  });
});

describe("pemarkahan", () => {
  const mcq = SEED_QUESTIONS.find((q) => q.type === "mcq")!;
  it("mcq betul / salah", () => {
    expect(grade(mcq, mcq.answer as string).correct).toBe(true);
    expect(grade(mcq, "zz").correct).toBe(false);
  });
  it("padanan separa", () => {
    const m = SEED_QUESTIONS.find((q) => q.type === "match")!;
    const all = Object.fromEntries(m.pairs!.map((p) => [p.left, p.right]));
    expect(grade(m, all).score).toBe(1);
    expect(grade(m, { [m.pairs![0].left]: m.pairs![0].right }).score).toBeCloseTo(1 / m.pairs!.length);
  });
});

describe("murajaah automatik", () => {
  it("soalan salah masuk barisan, soalan betul tidak", () => {
    const d = emptyDB(); const now = Date.now();
    srsUpdate(d, "u", "q1", false, now);
    srsUpdate(d, "u", "q2", true, now);
    expect(d.review.map((r) => r.questionId)).toEqual(["q1"]);
    expect(dueReviews(d, "u", now + 11 * 60_000)).toHaveLength(1);
    srsUpdate(d, "u", "q1", true, now);
    expect(dueReviews(d, "u", now + 11 * 60_000)).toHaveLength(0);
    expect(dueReviews(d, "u", now + DAY + 1)).toHaveLength(1);
  });
});

describe("tahap & scoreboard", () => {
  it("tahap awal & tertinggi", () => {
    expect(levelFor(0, 0).level.id).toBe(LEVELS[0].id);
    expect(levelFor(99999, 12).level.id).toBe("penguasaan");
    expect(levelFor(99999, 0).level.id).toBe(LEVELS[0].id);
  });
  it("kedudukan mengikut XP", () => {
    const d = emptyDB();
    d.profiles = [{ id: "a", name: "A", avatar: "🙂", createdAt: 0 }, { id: "b", name: "B", avatar: "🙂", createdAt: 0 }];
    d.xp = [{ id: "1", userId: "a", amount: 10, reason: "", ts: Date.now() }, { id: "2", userId: "b", amount: 50, reason: "", ts: Date.now() }];
    expect(leaderboard(d, "keseluruhan").map((r) => r.id)).toEqual(["b", "a"]);
  });
});

describe("banyak profil", () => {
  it("boleh cipta, tukar dan padam banyak profil tanpa mencampur rekod", async () => {
    const st = await import("../src/lib/store");
    const { recordAnswer } = await import("../src/lib/actions");
    st.resetAll();
    const ids = Array.from({ length: 12 }, (_, i) => st.createProfile(`Pelajar ${i + 1}`, "🙂"));
    expect(st.getDB().profiles).toHaveLength(12);
    expect(st.getDB().activeProfileId).toBe(ids[11]);
    const q = SEED_QUESTIONS.find((x) => x.type === "mcq")!;
    st.switchProfile(ids[3]);
    recordAnswer(ids[3], q, { correct: false, score: 0 }, "x", "rawak");
    expect(st.getDB().attempts.filter((a) => a.userId === ids[3])).toHaveLength(1);
    expect(st.getDB().attempts.filter((a) => a.userId === ids[4])).toHaveLength(0);
    expect(st.getDB().review.filter((r) => r.userId === ids[3])).toHaveLength(1);
    st.deleteProfile(ids[3]);
    expect(st.getDB().profiles).toHaveLength(11);
    expect(st.getDB().attempts.some((a) => a.userId === ids[3])).toBe(false);
  });
});

describe("kod pengaktifan", () => {
  it("normalisasi format kod", async () => {
    const { normalizeCode, formatCode } = await import("../src/lib/activation");
    expect(normalizeCode("pt-7k3m q9xa-2hdf")).toBe("7K3MQ9XA2HDF");
    expect(normalizeCode("7K3M-Q9XA-2HDF")).toBe("7K3MQ9XA2HDF");
    expect(normalizeCode("PT-0000-1111-OOOO")).toBe(""); // aksara mengelirukan tidak digunakan
    expect(normalizeCode("abc")).toBe("");
    expect(formatCode("7K3MQ9XA2HDF")).toBe("PT-7K3M-Q9XA-2HDF");
  });
  it("hanya kod yang hashnya disenaraikan diterima", async () => {
    const { verifyAgainst, hashCode } = await import("../src/lib/activation");
    const set = new Set([await hashCode("7K3MQ9XA2HDF")]);
    expect(await verifyAgainst("pt-7k3m-q9xa-2hdf", set)).toBe("7K3MQ9XA2HDF");
    expect(await verifyAgainst("PT-7K3M-Q9XA-2HDG", set)).toBeNull();
  });
  it("hash sama dengan penjana kod (node:crypto)", async () => {
    const { createHash } = await import("node:crypto");
    const { hashCode } = await import("../src/lib/activation");
    expect(await hashCode("ABCDEFGH2345")).toBe(createHash("sha256").update("pandai-tajwid|v1|ABCDEFGH2345").digest("hex").slice(0, 24));
  });
  it("tanpa kod: aplikasi belum aktif; kod salah ditolak", async () => {
    const { initActivation, isActive, activate } = await import("../src/lib/activation");
    await initActivation();
    expect(isActive()).toBe(false);
    expect(await activate("PT-AAAA-BBBB-CCCC")).toMatch(/tidak sah/);
    expect(isActive()).toBe(false);
  });
  it("tiada kod sebenar dalam repo — hanya hash 24 aksara hex", async () => {
    const hashes = (await import("../src/data/activation-hashes.json")).default as string[];
    hashes.forEach((h) => expect(h).toMatch(/^[0-9a-f]{24}$/));
  });
});
