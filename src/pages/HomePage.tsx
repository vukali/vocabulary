
import React, { useState, useCallback, useEffect } from 'react';
import { useVocabulary } from '../hooks/useVocabulary';
import useFavorites from '../hooks/useFavorites';
import useSearchHistory from '../hooks/useSearchHistory';
import WordCard from '../components/WordCard';
import styles from '../styles/HomePage.module.scss';

interface SearchFormData {
  searchTerm: string;
}

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  const { 
    loading, 
    error, 
    wordData, 
    searchWord, 
    getRandomWord, 
    resetWordData,
    clearError 
  } = useVocabulary();

  const {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  } = useFavorites();

  const {
    addToHistory,
    getRecentSearches,
    clearHistory
  } = useSearchHistory();

  const recentSearches = getRecentSearches(5);

  // Handle form submission
  const handleSearch = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      return;
    }

    setIsSearching(true);
    const word = searchTerm.trim();
    
    try {
      await searchWord(word);
      addToHistory();
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, searchWord, addToHistory]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  // Handle random word
  const handleRandomWord = useCallback(async (): Promise<void> => {
    try {
      await getRandomWord();
    } catch (error) {
      console.error('Random word error:', error);
    }
  }, [getRandomWord]);

  // Handle add to favorites
  const handleAddToFavorites = useCallback((word: string): void => {
    addToFavorites(word);
    // You could show a toast notification here
    console.log(`"${word}" đã được thêm vào yêu thích!`);
  }, [addToFavorites]);

  // Handle remove from favorites
  const handleRemoveFromFavorites = useCallback((): void => {
    removeFromFavorites();
    console.log(`"Từ đã được xóa khỏi yêu thích!"`);
  }, [removeFromFavorites]);

  // Handle clear search
  const handleClearSearch = useCallback((): void => {
    setSearchTerm('');
    resetWordData();
  }, [resetWordData]);

  // Handle recent search click
  const handleRecentSearchClick = useCallback((word: string): void => {
    setSearchTerm(word);
    searchWord(word);
  }, [searchWord]);

  // Handle favorite click
  const handleFavoriteClick = useCallback((word: string): void => {
    setSearchTerm(word);
    searchWord(word);
  }, [searchWord]);

  // Handle key press for quick actions
  const handleKeyPress = useCallback((e: React.KeyboardEvent): void => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      document.getElementById('search-input')?.focus();
    }
  }, []);

  // Add keyboard shortcut listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress as any);
    return () => {
      document.removeEventListener('keydown', handleKeyPress as any);
    };
  }, [handleKeyPress]);

  return (
    <div className={styles.homepage}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1>Từ Điển Tiếng Anh</h1>
          <p>Tìm hiểu và học các từ vựng tiếng Anh mới mỗi ngày</p>
        </header>

        <div className={styles.searchSection}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInputGroup}>
              <input
                id="search-input"
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Nhập từ tiếng Anh cần tra... (Ctrl+K)"
                className={styles.searchInput}
                disabled={loading}
                autoComplete="off"
              />
                            <button
                              type="submit"
                              className={styles.searchButton}
                              disabled={loading}
                            >
                              Tìm kiếm
                            </button>
                          </div>
                        </form>
                      </div>
              
                      {/* Optionally, render error, loading, wordData, favorites, recentSearches, etc. here */}
              
                    </div>
                  </div>
                );
              };
              
              export default HomePage;