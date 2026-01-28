export type SrsCard = {
    /** Leitner box level: 0=new */
    level: number;
    /** Unix ms timestamp when card becomes due */
    dueAt: number;
    /** total attempts */
    attempts: number;
    /** correct attempts */
    correct: number;
    /** consecutive correct answers */
    streak: number;
    /** last reviewed timestamp */
    lastReviewedAt: number | null;
};

export type SrsState = Record<string, SrsCard>;

const STORAGE_KEY_PREFIX = "vocabSrs:";

// Simple Leitner intervals in minutes by level (0..6)
const LEVEL_INTERVAL_MINUTES = [0, 10, 60, 24 * 60, 3 * 24 * 60, 7 * 24 * 60, 30 * 24 * 60];

export function makeCardId(category: string, word: string) {
    return `${category}::${word}`.toLowerCase();
}

export function loadSrsState(category: string): SrsState {
    try {
        const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${category}`);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as SrsState;
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
}

export function saveSrsState(category: string, state: SrsState) {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${category}`, JSON.stringify(state));
}

export function ensureCard(state: SrsState, cardId: string): SrsCard {
    const existing = state[cardId];
    if (existing) return existing;
    const card: SrsCard = {
        level: 0,
        dueAt: 0,
        attempts: 0,
        correct: 0,
        streak: 0,
        lastReviewedAt: null,
    };
    state[cardId] = card;
    return card;
}

export function applyReview(state: SrsState, cardId: string, isCorrect: boolean, now = Date.now()) {
    const card = ensureCard(state, cardId);
    card.attempts += 1;
    card.lastReviewedAt = now;

    if (isCorrect) {
        card.correct += 1;
        card.streak += 1;
        card.level = Math.min(card.level + 1, LEVEL_INTERVAL_MINUTES.length - 1);
    } else {
        card.streak = 0;
        // Drop level but not below 1 once learned; keep 0 for new cards
        card.level = Math.max(card.level === 0 ? 0 : card.level - 1, 0);
    }

    const minutes = LEVEL_INTERVAL_MINUTES[card.level] ?? 0;
    card.dueAt = now + minutes * 60 * 1000;
}

export function isDue(card: SrsCard, now = Date.now()) {
    return card.dueAt <= now;
}

export function getNextCardWord<T extends { word: string }>(
    category: string,
    words: T[],
    state: SrsState,
    now = Date.now()
): { chosen: T | null; reason: "due" | "new" | "random" } {
    if (words.length === 0) return { chosen: null, reason: "random" };

    // 1) Due cards first (prioritize lowest level among due)
    const dueCandidates: Array<{ item: T; level: number }> = [];
    for (const item of words) {
        const id = makeCardId(category, item.word);
        const card = state[id];
        if (card && isDue(card, now) && card.attempts > 0) {
            dueCandidates.push({ item, level: card.level });
        }
    }
    if (dueCandidates.length > 0) {
        dueCandidates.sort((a, b) => a.level - b.level);
        return { chosen: dueCandidates[0].item, reason: "due" };
    }

    // 2) New words (never attempted)
    const newWords: T[] = [];
    for (const item of words) {
        const id = makeCardId(category, item.word);
        const card = state[id];
        if (!card || card.attempts === 0) newWords.push(item);
    }
    if (newWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * newWords.length);
        return { chosen: newWords[randomIndex], reason: "new" };
    }

    // 3) Otherwise, pick the earliest dueAt (even if not due yet) to keep progression predictable
    let best: { item: T; dueAt: number } | null = null;
    for (const item of words) {
        const id = makeCardId(category, item.word);
        const card = state[id];
        const dueAt = card?.dueAt ?? 0;
        if (!best || dueAt < best.dueAt) best = { item, dueAt };
    }
    return { chosen: best?.item ?? words[0], reason: "random" };
}

export function getProgressSummary(category: string, words: { word: string }[], state: SrsState) {
    const total = words.length;
    let learned = 0;
    let mastered = 0;
    let due = 0;
    const now = Date.now();

    for (const w of words) {
        const id = makeCardId(category, w.word);
        const c = state[id];
        if (!c) continue;
        if (c.attempts > 0) learned += 1;
        if (c.level >= 4) mastered += 1; // heuristic: level 4+ = mastered-ish
        if (c.attempts > 0 && isDue(c, now)) due += 1;
    }

    return { total, learned, mastered, due };
}

