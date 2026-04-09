import {
  readPersistentJson,
  removePersistentKeys,
  writeStorageEntries,
} from "./storage";

const STORAGE_KEY = "vocabImportedDecks";

const EMPTY_IMPORT = {
  vocabulary: [],
  phrases: [],
  meta: {
    lastImportedAt: null,
    sources: [],
  },
};

const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (!value) return [];
  return String(value)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeSection = (row = {}) => {
  const raw = String(row.section || row.type || row.deck || "").toLowerCase();
  if (raw.includes("phrase") || raw.includes("sentence") || raw.includes("mission")) {
    return "phrases";
  }

  const partOfSpeech = String(row.partOfSpeech || row.pos || "").toLowerCase();
  if (partOfSpeech === "phrase") return "phrases";

  return "vocabulary";
};

const normalizeCard = (row = {}) => {
  const word = String(row.word || row.front || "").trim();
  const meaning = String(row.meaning || row.back || row.translation || "").trim();

  if (!word || !meaning) return null;

  const section = normalizeSection(row);
  const partOfSpeech =
    section === "phrases"
      ? "phrase"
      : String(row.partOfSpeech || row.pos || "noun").trim().toLowerCase();

  const examples = Array.isArray(row.examples)
    ? row.examples
    : toList(row.examples).map((item) => {
        const [en, vi] = item.split("=>").map((part) => part.trim());
        if (!en) return null;
        return { en, vi: vi || "" };
      }).filter(Boolean);

  return {
    section,
    word,
    meaning,
    phonetic: String(row.phonetic || "").trim(),
    partOfSpeech,
    imageHint: String(row.imageHint || row.emoji || "").trim(),
    scene: String(row.scene || row.context || "").trim(),
    alternativesEn: toList(row.alternativesEn),
    alternativesVi: toList(row.alternativesVi),
    learnerHint: String(row.learnerHint || row.hint || "").trim(),
    frequency: String(row.frequency || "").trim().toLowerCase(),
    examples,
    sourceLabel: String(row.sourceLabel || row.deckName || "").trim(),
  };
};

const parseJsonPayload = (text) => {
  const parsed = JSON.parse(text);

  if (Array.isArray(parsed)) {
    return parsed.map(normalizeCard).filter(Boolean);
  }

  const buckets = [];

  ["vocabulary", "phrases", "cards", "items"].forEach((key) => {
    if (Array.isArray(parsed[key])) {
      parsed[key].forEach((item) => {
        const normalized = normalizeCard({
          section: key === "vocabulary" || key === "phrases" ? key : undefined,
          ...item,
        });
        if (normalized) buckets.push(normalized);
      });
    }
  });

  return buckets;
};

const parseCsvRows = (text) => {
  const rows = [];
  let currentField = "";
  let currentRow = [];
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === "\"") {
      if (insideQuotes && nextChar === "\"") {
        currentField += "\"";
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      currentRow.push(currentField);
      if (currentRow.some((item) => item.trim() !== "")) {
        rows.push(currentRow);
      }
      currentField = "";
      currentRow = [];
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((item) => item.trim() !== "")) {
      rows.push(currentRow);
    }
  }

  if (!rows.length) return [];

  const [headerRow, ...bodyRows] = rows;
  const headers = headerRow.map((item) => item.trim());

  return bodyRows
    .map((row) =>
      headers.reduce((accumulator, header, index) => {
        accumulator[header] = row[index] ?? "";
        return accumulator;
      }, {})
    )
    .map(normalizeCard)
    .filter(Boolean);
};

const uniqByWord = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.section}:${item.word}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const loadImportedDecks = () => {
  if (typeof window === "undefined") return EMPTY_IMPORT;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_IMPORT;
    const parsed = JSON.parse(raw);
    return {
      vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary : [],
      phrases: Array.isArray(parsed.phrases) ? parsed.phrases : [],
      meta: {
        lastImportedAt: parsed.meta?.lastImportedAt || null,
        sources: Array.isArray(parsed.meta?.sources) ? parsed.meta.sources : [],
      },
    };
  } catch {
    return EMPTY_IMPORT;
  }
};

export const saveImportedDecks = (payload) => {
  if (typeof window === "undefined") return;
  writeStorageEntries([[STORAGE_KEY, JSON.stringify(payload)]]);
};

export const clearImportedDecks = () => {
  if (typeof window === "undefined") return;
  void removePersistentKeys([STORAGE_KEY]);
};

export const loadImportedDecksPersisted = async () => {
  const parsed = await readPersistentJson(STORAGE_KEY, EMPTY_IMPORT);
  return {
    vocabulary: Array.isArray(parsed?.vocabulary) ? parsed.vocabulary : [],
    phrases: Array.isArray(parsed?.phrases) ? parsed.phrases : [],
    meta: {
      lastImportedAt: parsed?.meta?.lastImportedAt || null,
      sources: Array.isArray(parsed?.meta?.sources) ? parsed.meta.sources : [],
    },
  };
};

export const clearImportedDecksPersisted = async () => {
  await removePersistentKeys([STORAGE_KEY]);
};

export const parseImportText = (text, extension = "json") => {
  const items = extension.toLowerCase().includes("csv")
    ? parseCsvRows(text)
    : parseJsonPayload(text);

  const vocabulary = uniqByWord(items.filter((item) => item.section === "vocabulary"));
  const phrases = uniqByWord(items.filter((item) => item.section === "phrases"));

  return {
    vocabulary,
    phrases,
    total: vocabulary.length + phrases.length,
  };
};

export const mergeImportedDecks = (current, incoming, mode = "append", sourceName = "") => {
  const base =
    mode === "replace"
      ? { vocabulary: [], phrases: [], meta: { lastImportedAt: null, sources: [] } }
      : loadImportedDecks() || current;

  const mergedVocabulary = uniqByWord([
    ...(base.vocabulary || []),
    ...(incoming.vocabulary || []),
  ]);
  const mergedPhrases = uniqByWord([
    ...(base.phrases || []),
    ...(incoming.phrases || []),
  ]);

  return {
    vocabulary: mergedVocabulary,
    phrases: mergedPhrases,
    meta: {
      lastImportedAt: new Date().toISOString(),
      sources: uniqByWord(
        [
          ...((base.meta?.sources || []).map((item) => ({
            section: "meta",
            word: item,
          })) || []),
          ...(sourceName ? [{ section: "meta", word: sourceName }] : []),
        ]
      ).map((item) => item.word),
    },
  };
};
