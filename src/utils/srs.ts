import { readPersistentJson, writeStorageEntries } from "./storage";

export type SrsCard = {
  level: number;
  dueAt: number;
  attempts: number;
  correct: number;
  incorrect: number;
  streak: number;
  weakScore: number;
  lastResult: "correct" | "wrong" | null;
  lastReviewedAt: number | null;
};

export type SrsState = Record<string, SrsCard>;

const STORAGE_KEY_PREFIX = "vocabSrs:";
const LEVEL_INTERVAL_MINUTES = [0, 10, 60, 24 * 60, 3 * 24 * 60, 7 * 24 * 60, 30 * 24 * 60];

const createCard = (): SrsCard => ({
  level: 0,
  dueAt: 0,
  attempts: 0,
  correct: 0,
  incorrect: 0,
  streak: 0,
  weakScore: 0,
  lastResult: null,
  lastReviewedAt: null,
});

const hydrateCard = (value: Partial<SrsCard> | null | undefined): SrsCard => ({
  ...createCard(),
  ...(value || {}),
});

export function makeCardId(category: string, word: string) {
  return `${category}::${word}`.toLowerCase();
}

export function loadSrsState(category: string): SrsState {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${category}`);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SrsState;

    return Object.entries(parsed || {}).reduce<SrsState>((accumulator, [key, value]) => {
      accumulator[key] = hydrateCard(value);
      return accumulator;
    }, {});
  } catch {
    return {};
  }
}

export function saveSrsState(category: string, state: SrsState) {
  const key = `${STORAGE_KEY_PREFIX}${category}`;
  writeStorageEntries([[key, JSON.stringify(state)]]);
}

export async function loadSrsStatePersisted(category: string): Promise<SrsState> {
  try {
    const raw = await readPersistentJson(`${STORAGE_KEY_PREFIX}${category}`, {});
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;

    return Object.entries((parsed || {}) as SrsState).reduce<SrsState>(
      (accumulator, [key, value]) => {
        accumulator[key] = hydrateCard(value);
        return accumulator;
      },
      {}
    );
  } catch {
    return loadSrsState(category);
  }
}

export function ensureCard(state: SrsState, cardId: string): SrsCard {
  const existing = state[cardId];
  if (existing) {
    const hydrated = hydrateCard(existing);
    state[cardId] = hydrated;
    return hydrated;
  }

  const card = createCard();
  state[cardId] = card;
  return card;
}

export function applyReview(state: SrsState, cardId: string, isCorrect: boolean, now = Date.now()) {
  const card = ensureCard(state, cardId);
  card.attempts += 1;
  card.lastReviewedAt = now;
  card.lastResult = isCorrect ? "correct" : "wrong";

  if (isCorrect) {
    card.correct += 1;
    card.streak += 1;
    card.level = Math.min(card.level + 1, LEVEL_INTERVAL_MINUTES.length - 1);
    card.weakScore = Math.max(0, card.weakScore - (card.streak >= 2 ? 2 : 1));
  } else {
    card.incorrect += 1;
    card.streak = 0;
    card.level = Math.max(card.level === 0 ? 0 : card.level - 1, 0);
    card.weakScore += card.level <= 1 ? 2 : 1;
  }

  const minutes = LEVEL_INTERVAL_MINUTES[card.level] ?? 0;
  card.dueAt = now + minutes * 60 * 1000;
}

export function isDue(card: SrsCard, now = Date.now()) {
  return card.dueAt <= now;
}

export function isWeak(card: SrsCard) {
  return card.attempts >= 2 && (card.incorrect >= 2 || card.weakScore >= 2);
}

export function getWeakCardWords<T extends { word: string; frequencyScore?: number }>(
  category: string,
  words: T[],
  state: SrsState
) {
  return words
    .filter((item) => {
      const card = state[makeCardId(category, item.word)];
      return card ? isWeak(card) : false;
    })
    .sort((left, right) => {
      const leftCard = state[makeCardId(category, left.word)];
      const rightCard = state[makeCardId(category, right.word)];
      const weakDelta = (rightCard?.weakScore || 0) - (leftCard?.weakScore || 0);
      if (weakDelta !== 0) return weakDelta;
      return (right.frequencyScore || 0) - (left.frequencyScore || 0);
    });
}

export function getNextCardWord<T extends { word: string; frequencyScore?: number }>(
  category: string,
  words: T[],
  state: SrsState,
  now = Date.now()
): { chosen: T | null; reason: "due" | "new" | "random" } {
  if (words.length === 0) return { chosen: null, reason: "random" };

  const dueCandidates: Array<{ item: T; level: number; dueAt: number }> = [];
  for (const item of words) {
    const id = makeCardId(category, item.word);
    const card = state[id];
    if (card && isDue(card, now) && card.attempts > 0) {
      dueCandidates.push({ item, level: card.level, dueAt: card.dueAt });
    }
  }

  if (dueCandidates.length > 0) {
    dueCandidates.sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      const frequencyDelta = (b.item.frequencyScore || 0) - (a.item.frequencyScore || 0);
      if (frequencyDelta !== 0) return frequencyDelta;
      return a.dueAt - b.dueAt;
    });

    return { chosen: dueCandidates[0].item, reason: "due" };
  }

  const newWords: T[] = [];
  for (const item of words) {
    const id = makeCardId(category, item.word);
    const card = state[id];
    if (!card || card.attempts === 0) newWords.push(item);
  }

  if (newWords.length > 0) {
    newWords.sort((a, b) => (b.frequencyScore || 0) - (a.frequencyScore || 0));
    const topFrequency = newWords[0]?.frequencyScore || 0;
    const priorityPool = newWords.filter((item) => (item.frequencyScore || 0) === topFrequency);
    const randomIndex = Math.floor(Math.random() * priorityPool.length);
    return { chosen: priorityPool[randomIndex], reason: "new" };
  }

  let best: { item: T; dueAt: number } | null = null;
  for (const item of words) {
    const id = makeCardId(category, item.word);
    const card = state[id];
    const dueAt = card?.dueAt ?? 0;
    if (!best || dueAt < best.dueAt) {
      best = { item, dueAt };
      continue;
    }

    if (best && dueAt === best.dueAt && (item.frequencyScore || 0) > (best.item.frequencyScore || 0)) {
      best = { item, dueAt };
    }
  }

  return { chosen: best?.item ?? words[0], reason: "random" };
}

export function getProgressSummary(
  category: string,
  words: { word: string }[],
  state: SrsState
) {
  const total = words.length;
  let learned = 0;
  let mastered = 0;
  let due = 0;
  let weak = 0;
  const now = Date.now();

  for (const item of words) {
    const card = state[makeCardId(category, item.word)];
    if (!card) continue;
    if (card.attempts > 0) learned += 1;
    if (card.level >= 4) mastered += 1;
    if (card.attempts > 0 && isDue(card, now)) due += 1;
    if (isWeak(card)) weak += 1;
  }

  return { total, learned, mastered, due, weak };
}
