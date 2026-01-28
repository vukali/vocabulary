// src/hooks/useVocabulary.ts
import { useState, useCallback, useEffect } from 'react';
import DictionaryAPI, { WordData } from '../services/dictionaryApi';

export interface VocabularyState {
  loading: boolean;
  error: string | null;
  wordData: WordData | null;
}

export interface VocabularyActions {
  searchWord: (word: string) => Promise<void>;
  getWordDetails: (word: string) => Promise<void>;
  getRandomWord: () => Promise<void>;
  resetWordData: () => void;
  clearError: () => void;
}

export interface UseVocabularyReturn extends VocabularyState, VocabularyActions {}

export const useVocabulary = (): UseVocabularyReturn => {
  const [state, setState] = useState<VocabularyState>({
    loading: false,
    error: null,
    wordData: null,
  });

  // Helper function to update state
  const updateState = useCallback((updates: Partial<VocabularyState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Tìm kiếm từ
  const searchWord = useCallback(async (word: string): Promise<void> => {
    if (!word.trim()) {
      updateState({ error: 'Vui lòng nhập từ cần tìm' });
      return;
    }

    updateState({ loading: true, error: null });

    try {
      const data = await DictionaryAPI.getWordDefinition(word.trim());
      updateState({ wordData: data, loading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tìm kiếm';
      updateState({ error: errorMessage, wordData: null, loading: false });
    }
  }, [updateState]);

  // Lấy thông tin chi tiết
  const getWordDetails = useCallback(async (word: string): Promise<void> => {
    if (!word.trim()) {
      updateState({ error: 'Vui lòng nhập từ cần tìm' });
      return;
    }

    updateState({ loading: true, error: null });

    try {
      const data = await DictionaryAPI.getWordDetails(word.trim());
      updateState({ wordData: data, loading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy thông tin chi tiết';
      updateState({ error: errorMessage, wordData: null, loading: false });
    }
  }, [updateState]);

  // Lấy từ ngẫu nhiên
  const getRandomWord = useCallback(async (): Promise<void> => {
    updateState({ loading: true, error: null });

    try {
      const randomWord = await DictionaryAPI.getRandomWord();
      const data = await DictionaryAPI.getWordDefinition(randomWord);
      updateState({ wordData: data, loading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy từ ngẫu nhiên';
      updateState({ error: errorMessage, wordData: null, loading: false });
    }
  }, [updateState]);

  // Reset state
  const resetWordData = useCallback((): void => {
    updateState({ wordData: null, error: null, loading: false });
  }, [updateState]);

  // Clear error
  const clearError = useCallback((): void => {
    updateState({ error: null });
  }, [updateState]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      resetWordData();
    };
  }, [resetWordData]);

  return {
    ...state,
    searchWord,
    getWordDetails,
    getRandomWord,
    resetWordData,
    clearError,
  };
};

// Hook để quản lý favorites
export interface UseFavoritesReturn {
  favorites: string[];
  addToFavorites: (word: string) => boolean;
  removeFromFavorites: (word: string) => void;
  isFavorite: (word: string) => boolean;
  clearFavorites: () => void;
}

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('vocab-favorites');
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('vocab-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  const addToFavorites = useCallback((word: string): boolean => {
    const normalizedWord = word.toLowerCase().trim();
    
    if (!normalizedWord) return false;
    
    setFavorites(prev => {
      if (prev.includes(normalizedWord)) {
        return prev; // Already exists
      }
      return [...prev, normalizedWord];
    });
    
    return true;
  }, []);

  const removeFromFavorites = useCallback((word: string): void => {
    const normalizedWord = word.toLowerCase().trim();
    setFavorites(prev => prev.filter(fav => fav !== normalizedWord));
  }, []);

  const isFavorite = useCallback((word: string): boolean => {
    const normalizedWord = word.toLowerCase().trim();
    return favorites.includes(normalizedWord);
  }, [favorites]);

  const clearFavorites = useCallback((): void => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
  };
};

// Hook để quản lý lịch sử tìm kiếm
export interface SearchHistoryItem {
  word: string;
  timestamp: number;
}

export interface UseSearchHistoryReturn {
  history: SearchHistoryItem[];
  addToHistory: (word: string) => void;
  clearHistory: () => void;
  getRecentSearches: (limit?: number) => string[];
}

export const useSearchHistory = (): UseSearchHistoryReturn => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('vocab-search-history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('vocab-search-history', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, [history]);

  const addToHistory = useCallback((word: string): void => {
    const normalizedWord = word.toLowerCase().trim();
    
    if (!normalizedWord) return;

    const newItem: SearchHistoryItem = {
      word: normalizedWord,
      timestamp: Date.now(),
    };

    setHistory(prev => {
      // Remove existing entry if it exists
      const filtered = prev.filter(item => item.word !== normalizedWord);
      // Add new item at the beginning and limit to 50 items
      return [newItem, ...filtered].slice(0, 50);
    });
  }, []);

  const clearHistory = useCallback((): void => {
    setHistory([]);
  }, []);

  const getRecentSearches = useCallback((limit: number = 10): string[] => {
    return history.slice(0, limit).map(item => item.word);
  }, [history]);

  return {
    history,
    addToHistory,
    clearHistory,
    getRecentSearches,
  };
};