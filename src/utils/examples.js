const upperFirst = (value = "") =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

const wrapMeaning = (meaning = "") => meaning.replace(/\s+/g, " ").trim();

export const buildSentenceExpansion = (card, locale = "vi") => {
  const showTranslations = locale === "vi";

  if (!card || !card.word) return [];

  if (Array.isArray(card.examples) && card.examples.length > 0) {
    const safeExamples = card.examples.filter((item) => item && item.en);
    return showTranslations
      ? safeExamples
      : safeExamples.map((item) => ({ en: item.en }));
  }

  if (card.partOfSpeech === "phrase") return [];

  const word = card.word;
  const meaning = wrapMeaning(card.meaning || "");
  const nounExamples = [
    {
      en: `This ${word} is important.`,
      vi: `Cái ${meaning} này quan trọng.`,
    },
    {
      en: `I need the ${word} right now.`,
      vi: `Tôi cần ${meaning} ngay bây giờ.`,
    },
    {
      en: `My ${word} is here.`,
      vi: `${upperFirst(meaning)} của tôi ở đây.`,
    },
  ];

  const verbExamples = [
    {
      en: `I ${word} every day.`,
      vi: `Tôi ${meaning} mỗi ngày.`,
    },
    {
      en: `We can ${word} now.`,
      vi: `Giờ mình có thể ${meaning}.`,
    },
    {
      en: `Please ${word} it again.`,
      vi: `Làm ơn ${meaning} lại lần nữa.`,
    },
  ];

  const adjectiveExamples = [
    {
      en: `It feels very ${word}.`,
      vi: `Nó cảm thấy rất ${meaning}.`,
    },
    {
      en: `This looks ${word}.`,
      vi: `Cái này trông ${meaning}.`,
    },
    {
      en: `Today is a ${word} day.`,
      vi: `Hôm nay là một ngày ${meaning}.`,
    },
  ];

  const interjectionExamples = [
    {
      en: `${upperFirst(word)}!`,
      vi: `${upperFirst(meaning)}!`,
    },
    {
      en: `${upperFirst(word)}, can you help me?`,
      vi: `${upperFirst(meaning)}, bạn giúp tôi được không?`,
    },
    {
      en: `I said "${word}" first.`,
      vi: `Tôi nói "${meaning}" trước tiên.`,
    },
  ];

  if (card.partOfSpeech === "adjective" || card.partOfSpeech === "adverb") {
    return showTranslations
      ? adjectiveExamples
      : adjectiveExamples.map((item) => ({ en: item.en }));
  }
  if (card.partOfSpeech === "interjection") {
    return showTranslations
      ? interjectionExamples
      : interjectionExamples.map((item) => ({ en: item.en }));
  }

  const examples =
    card.partOfSpeech === "verb" ? verbExamples : nounExamples;

  return showTranslations ? examples : examples.map((item) => ({ en: item.en }));
};
