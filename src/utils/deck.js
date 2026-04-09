const FREQUENCY_ORDER = {
  high: 3,
  medium: 2,
  low: 1,
};

export const normalizeFrequency = (value, index = 0, total = 1) => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "high" || normalized === "core" || normalized === "essential") {
      return "high";
    }
    if (normalized === "medium" || normalized === "common") {
      return "medium";
    }
    if (normalized === "low" || normalized === "useful") {
      return "low";
    }
  }

  const highCutoff = Math.max(3, Math.ceil(total * 0.25));
  const mediumCutoff = Math.max(highCutoff + 3, Math.ceil(total * 0.7));

  if (index < highCutoff) return "high";
  if (index < mediumCutoff) return "medium";
  return "low";
};

export const getFrequencyScore = (value) => FREQUENCY_ORDER[value] || 1;

export const getFrequencyMeta = (value, locale = "vi") => {
  if (value === "high") {
    return {
      color: "red",
      label: locale === "vi" ? "Dùng nhiều" : "High frequency",
    };
  }

  if (value === "medium") {
    return {
      color: "gold",
      label: locale === "vi" ? "Dùng thường" : "Common",
    };
  }

  return {
    color: "default",
    label: locale === "vi" ? "Bổ trợ" : "Useful",
  };
};

export const annotateDeck = (items = []) =>
  items.map((item, index) => {
    const frequency = normalizeFrequency(item.frequency, index, items.length);
    return {
      ...item,
      frequency,
      frequencyScore: getFrequencyScore(frequency),
    };
  });

export const filterDeckByWords = (items = [], targetWords = []) => {
  if (!targetWords.length) return items;

  const lookup = new Set(targetWords.map((item) => String(item).toLowerCase()));
  return items.filter((item) => lookup.has(String(item.word).toLowerCase()));
};
