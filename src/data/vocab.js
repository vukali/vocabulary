import allVocab from './allvocab.json';
import advancedVocab from './advancedVocab.json';
import communicationVocab from './communicationVocab.json';
import itVocab from './itVocab.json';

export const vocabData = {
  all: allVocab.words,
  advanced: advancedVocab.words,
  communication: communicationVocab.words,
  it: itVocab.words
};

export const categories = [
  { label: "All", key: "all" },
  { label: "Advanced", key: "advanced" },
  { label: "Communication", key: "communication" },
  { label: "IT", key: "it" }
]; 