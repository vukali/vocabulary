import { categories } from "../data/vocab";
import { stageCopy } from "../data/uiCopy";

const LEGACY_CATEGORY_MAP = {
  it: "devops",
};

export const getLocalized = (value, locale) =>
  value?.[locale] ?? value?.vi ?? value ?? "";

export const accuracy = (correct, total) =>
  total ? Math.round((correct / total) * 100) : 0;

export const mapLegacyCategory = (value) => LEGACY_CATEGORY_MAP[value] || value;

export const getAllowedCategories = (stage) => {
  if (stage === "vocabulary") {
    return categories.filter((item) => item.section === "vocabulary");
  }

  if (stage === "tenses") {
    return categories.filter((item) => item.section === "grammar");
  }

  return categories.filter((item) => item.section === "phrases");
};

export const sanitizeCategory = (stage, maybeCategory, preferredTrack) => {
  const mappedCategory = mapLegacyCategory(maybeCategory);
  const fallback =
    stage === "vocabulary"
      ? mapLegacyCategory(preferredTrack)
      : stage === "tenses"
        ? "tenses"
        : "phrases";

  const allowed = getAllowedCategories(stage);
  return allowed.some((item) => item.key === mappedCategory)
    ? mappedCategory
    : fallback;
};

export const pickDirection = (stage) => {
  if (stage === "shadowing") return "en-to-vi";
  if (stage === "tenses") return "vi-to-en";
  if (stage === "speaking") return "vi-to-en";
  return Math.random() < 0.5 ? "en-to-vi" : "vi-to-en";
};

export const buildStageItems = (locale) => {
  const phraseDecks = categories.filter((item) => item.section === "phrases");
  const vocabularyDecks = categories.filter((item) => item.section === "vocabulary");
  const tenseDecks = categories.filter((item) => item.section === "grammar");

  return [
    {
      key: "vocabulary",
      label: getLocalized(stageCopy.vocabulary.label, locale),
      helper: getLocalized(stageCopy.vocabulary.helper, locale),
      subItems: vocabularyDecks.map((item) => ({
        key: item.key,
        label: getLocalized(item.label, locale),
        emoji: item.emoji,
      })),
    },
    {
      key: "phrases",
      label: getLocalized(stageCopy.phrases.label, locale),
      helper: getLocalized(stageCopy.phrases.helper, locale),
      subItems: phraseDecks.map((item) => ({
        key: item.key,
        label: getLocalized(item.label, locale),
        emoji: item.emoji,
      })),
    },
    {
      key: "tenses",
      label: getLocalized(stageCopy.tenses.label, locale),
      helper: getLocalized(stageCopy.tenses.helper, locale),
      subItems: tenseDecks.map((item) => ({
        key: item.key,
        label: getLocalized(item.label, locale),
        emoji: item.emoji,
      })),
    },
    {
      key: "shadowing",
      label: getLocalized(stageCopy.shadowing.label, locale),
      helper: getLocalized(stageCopy.shadowing.helper, locale),
      subItems: phraseDecks.map((item) => ({
        key: item.key,
        label: getLocalized(item.label, locale),
        emoji: item.emoji,
      })),
    },
    {
      key: "speaking",
      label: getLocalized(stageCopy.speaking.label, locale),
      helper: getLocalized(stageCopy.speaking.helper, locale),
      subItems: phraseDecks.map((item) => ({
        key: item.key,
        label: getLocalized(item.label, locale),
        emoji: item.emoji,
      })),
    },
  ];
};

export const getFocusHint = (copy, stage, studyMode) => {
  if (stage === "shadowing") return copy.focusHints.shadowing;
  if (stage === "speaking") return copy.focusHints.speaking;
  if (stage === "tenses") return copy.focusHints.tenses;
  if (stage === "phrases") {
    return studyMode === "en-to-vi"
      ? copy.focusHints.phrasesEnToVi
      : copy.focusHints.phrasesViToEn;
  }

  return studyMode === "en-to-vi"
    ? copy.focusHints.vocabularyEnToVi
    : copy.focusHints.vocabularyViToEn;
};
