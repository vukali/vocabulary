// src/components/WordCard.tsx
import React, { useState, useCallback, JSX } from "react";
import { WordData, Definition, Meaning } from "../services/dictionaryApi";
import styles from "../styles/WordCard.module.scss";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export interface WordCardProps {
  wordData: WordData;
  onAddToFavorites?: (word: string) => void;
  onRemoveFromFavorites?: (word: string) => void;
  onPlayAudio?: (audioUrl: string) => void;
  isFavorite?: boolean;
  showOrigin?: boolean;
  maxDefinitions?: number;
}

const WordCard: React.FC<WordCardProps> = ({
  wordData,
  onAddToFavorites,
  onRemoveFromFavorites,
  onPlayAudio,
  isFavorite = false,
  showOrigin = true,
  maxDefinitions = 3,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [expandedMeanings, setExpandedMeanings] = useState<Set<number>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const playAudio = useCallback(async (): Promise<void> => {
    if (!wordData.audio) return;

    setIsPlaying(true);

    try {
      if (onPlayAudio) {
        onPlayAudio(wordData.audio);
      } else {
        const audio = new Audio(wordData.audio);
        await audio.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setTimeout(() => setIsPlaying(false), 1000);
    }
  }, [wordData.audio, onPlayAudio]);

  const handleFavoriteToggle = useCallback((): void => {
    if (isFavorite) {
      onRemoveFromFavorites?.(wordData.word);
    } else {
      onAddToFavorites?.(wordData.word);
    }
  }, [isFavorite, wordData.word, onAddToFavorites, onRemoveFromFavorites]);

  const toggleMeaningExpansion = useCallback((index: number): void => {
    setExpandedMeanings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredMeanings = wordData.meanings.filter((meaning) =>
    meaning.definitions.some(
      (def) =>
        def.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (def.example &&
          def.example.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const renderDefinition = (
    definition: Definition,
    defIndex: number
  ): JSX.Element => (
    <div key={defIndex} className={styles.definitionItem}>
      <p className={styles.definitionText}>
        <span className={styles.definitionNumber}>{defIndex + 1}.</span>
        {definition.definition}
      </p>

      {definition.example && (
        <p className={styles.exampleText}>
          <em>Ví dụ: "{definition.example}"</em>
        </p>
      )}

      {definition.synonyms && definition.synonyms.length > 0 && (
        <div className={styles.synonyms}>
          <strong>Từ đồng nghĩa: </strong>
          <span>{definition.synonyms.slice(0, 5).join(", ")}</span>
        </div>
      )}

      {definition.antonyms && definition.antonyms.length > 0 && (
        <div className={styles.antonyms}>
          <strong>Từ trái nghĩa: </strong>
          <span>{definition.antonyms.slice(0, 3).join(", ")}</span>
        </div>
      )}
    </div>
  );

  const renderMeaning = (
    meaning: Meaning,
    meaningIndex: number
  ): JSX.Element => {
    const isExpanded = expandedMeanings.has(meaningIndex);
    const definitionsToShow = isExpanded
      ? meaning.definitions
      : meaning.definitions.slice(0, maxDefinitions);
    const hasMore = meaning.definitions.length > maxDefinitions;

    return (
      <div key={meaningIndex} className={styles.meaningSection}>
        <h3 className={styles.partOfSpeech}>{meaning.partOfSpeech}</h3>

        <div className={styles.definitionsList}>
          {definitionsToShow.map((definition, defIndex) =>
            renderDefinition(definition, defIndex)
          )}

          {hasMore && (
            <button
              className={styles.expandButton}
              onClick={() => toggleMeaningExpansion(meaningIndex)}
              type="button"
            >
              {isExpanded
                ? `Ẩn bớt (${
                    meaning.definitions.length - maxDefinitions
                  } định nghĩa)`
                : `Xem thêm ${
                    meaning.definitions.length - maxDefinitions
                  } định nghĩa khác`}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wordCard}>
      <div className={styles.wordHeader}>
        <div className={styles.wordTitle}>
          <h2 className={styles.wordText}>{wordData.word}</h2>
          {wordData.phonetic && (
            <span className={styles.phonetic}>/{wordData.phonetic}/</span>
          )}
        </div>

        <div className={styles.wordActions}>
          {wordData.audio && (
            <button
              className={`${styles.audioBtn} ${
                isPlaying ? styles.playing : ""
              }`}
              onClick={playAudio}
              disabled={isPlaying}
              title="Phát âm"
              type="button"
            >
              {isPlaying ? "🔄" : "🔊"}
            </button>
          )}

          <button
            className={`${styles.favoriteBtn} ${
              isFavorite ? styles.favorited : ""
            }`}
            onClick={handleFavoriteToggle}
            title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
            type="button"
          >
            {isFavorite ? "⭐" : "☆"}
          </button>
        </div>
      </div>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Tìm kiếm định nghĩa..."
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#555" },
            "&:hover fieldset": { borderColor: "#888" },
            "&.Mui-focused fieldset": { borderColor: "#43e97b" },
          },
          "& .MuiInputBase-input": { color: "#fff" },
          "& .MuiInputLabel-root": { color: "#aaa" },
        }}
      />

      <div className={styles.meaningsContainer}>
        {filteredMeanings.map((meaning, meaningIndex) =>
          renderMeaning(meaning, meaningIndex)
        )}
      </div>

      {showOrigin && wordData.origin && (
        <div className={styles.originSection}>
          <h4>Nguồn gốc:</h4>
          <p className={styles.originText}>{wordData.origin}</p>
        </div>
      )}

      <div className={styles.wordStats}>
        <span className={styles.statItem}>
          📚 {wordData.meanings.length} loại từ
        </span>
        <span className={styles.statItem}>
          📝{" "}
          {wordData.meanings.reduce(
            (total, meaning) => total + meaning.definitions.length,
            0
          )}{" "}
          định nghĩa
        </span>
      </div>
    </div>
  );
};

export default WordCard;
