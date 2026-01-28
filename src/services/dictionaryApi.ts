// src/services/dictionaryApi.ts

// Types for API responses
export interface Phonetic {
    text?: string;
    audio?: string;
  }
  
  export interface Definition {
    definition: string;
    example?: string;
    synonyms?: string[];
    antonyms?: string[];
  }
  
  export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
  }
  
  export interface DictionaryAPIResponse {
    word: string;
    phonetic?: string;
    phonetics?: Phonetic[];
    origin?: string;
    meanings: Meaning[];
  }
  
  export interface WordData {
    word: string;
    phonetic: string;
    audio: string;
    meanings: Meaning[];
    origin: string;
  }
  
  export interface WordsAPIDefinition {
    definition: string;
    partOfSpeech: string;
    synonyms?: string[];
    antonyms?: string[];
    examples?: string[];
  }
  
  export interface WordsAPIResponse {
    word: string;
    pronunciation?: {
      all?: string;
    };
    frequency?: number;
    syllables?: {
      count?: number;
    };
    results?: WordsAPIDefinition[];
  }
  
  export interface APIError {
    message: string;
    status?: number;
  }
  
  class DictionaryAPI {
    private static readonly BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';
    private static readonly WORDS_API_URL = 'https://wordsapiv1.p.rapidapi.com/words';
    private static readonly WORDS_API_KEY = process.env.REACT_APP_WORDS_API_KEY || '';
  
    // Lấy định nghĩa từ Dictionary API (miễn phí)
    static async getWordDefinition(word: string): Promise<WordData> {
      try {
        const response = await fetch(`${this.BASE_URL}/${word.toLowerCase()}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Không tìm thấy từ này trong từ điển');
          }
          throw new Error(`Lỗi API: ${response.status}`);
        }
        
        const data: DictionaryAPIResponse[] = await response.json();
        return this.formatDictionaryResponse(data);
      } catch (error) {
        console.error('Error fetching word definition:', error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Không thể kết nối đến từ điển');
      }
    }
  
    // Lấy thông tin chi tiết từ WordsAPI
    static async getWordDetails(word: string): Promise<WordData> {
      try {
        if (!this.WORDS_API_KEY) {
          // Fallback to free API if no API key
          return await this.getWordDefinition(word);
        }
  
        const response = await fetch(`${this.WORDS_API_URL}/${word.toLowerCase()}`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': this.WORDS_API_KEY,
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
          }
        });
  
        if (!response.ok) {
          throw new Error(`WordsAPI error: ${response.status}`);
        }
  
        const data: WordsAPIResponse = await response.json();
        return this.formatWordsAPIResponse(data);
      } catch (error) {
        console.error('Error fetching word details from WordsAPI:', error);
        // Fallback to free API
        return await this.getWordDefinition(word);
      }
    }
  
    // Format response từ Dictionary API
    private static formatDictionaryResponse(data: DictionaryAPIResponse[]): WordData {
      const wordData = data[0];
      
      return {
        word: wordData.word,
        phonetic: wordData.phonetic || wordData.phonetics?.[0]?.text || '',
        audio: wordData.phonetics?.find(p => p.audio)?.audio || '',
        meanings: wordData.meanings.map(meaning => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions: meaning.definitions.map(def => ({
            definition: def.definition,
            example: def.example || '',
            synonyms: def.synonyms || [],
            antonyms: def.antonyms || []
          }))
        })),
        origin: wordData.origin || ''
      };
    }
  
    // Format response từ WordsAPI
    private static formatWordsAPIResponse(data: WordsAPIResponse): WordData {
      const definitions = data.results || [];
      
      // Group definitions by part of speech
      const meaningMap = new Map<string, Definition[]>();
      
      definitions.forEach(result => {
        const partOfSpeech = result.partOfSpeech || 'unknown';
        if (!meaningMap.has(partOfSpeech)) {
          meaningMap.set(partOfSpeech, []);
        }
        
        meaningMap.get(partOfSpeech)!.push({
          definition: result.definition,
          example: result.examples?.[0] || '',
          synonyms: result.synonyms || [],
          antonyms: result.antonyms || []
        });
      });
  
      const meanings: Meaning[] = Array.from(meaningMap.entries()).map(([partOfSpeech, definitions]) => ({
        partOfSpeech,
        definitions
      }));
  
      return {
        word: data.word,
        phonetic: data.pronunciation?.all || '',
        audio: '', // WordsAPI doesn't provide audio
        meanings,
        origin: ''
      };
    }
  
    // Lấy từ đồng nghĩa
    static async getSynonyms(word: string): Promise<string[]> {
      try {
        if (!this.WORDS_API_KEY) {
          return [];
        }
  
        const response = await fetch(`${this.WORDS_API_URL}/${word.toLowerCase()}/synonyms`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': this.WORDS_API_KEY,
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
          }
        });
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
  
        const data: { synonyms: string[] } = await response.json();
        return data.synonyms || [];
      } catch (error) {
        console.error('Error fetching synonyms:', error);
        return [];
      }
    }
  
    // Lấy từ trái nghĩa
    static async getAntonyms(word: string): Promise<string[]> {
      try {
        if (!this.WORDS_API_KEY) {
          return [];
        }
  
        const response = await fetch(`${this.WORDS_API_URL}/${word.toLowerCase()}/antonyms`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': this.WORDS_API_KEY,
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
          }
        });
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
  
        const data: { antonyms: string[] } = await response.json();
        return data.antonyms || [];
      } catch (error) {
        console.error('Error fetching antonyms:', error);
        return [];
      }
    }
  
    // Tìm từ ngẫu nhiên
    static async getRandomWord(): Promise<string> {
      try {
        if (!this.WORDS_API_KEY) {
          return this.getFallbackRandomWord();
        }
  
        const response = await fetch(`${this.WORDS_API_URL}?random=true`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': this.WORDS_API_KEY,
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
          }
        });
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
  
        const data: { word: string } = await response.json();
        return data.word;
      } catch (error) {
        console.error('Error fetching random word:', error);
        return this.getFallbackRandomWord();
      }
    }
  
    // Fallback random words
    private static getFallbackRandomWord(): string {
      const fallbackWords = [
        'apple', 'beautiful', 'challenge', 'discover', 'elephant',
        'fantastic', 'gorgeous', 'happiness', 'incredible', 'journey',
        'knowledge', 'lovely', 'magnificent', 'nature', 'opportunity',
        'peaceful', 'quality', 'remarkable', 'spectacular', 'treasure',
        'understanding', 'victory', 'wonderful', 'extraordinary', 'zenith'
      ];
      return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
    }
  
    // Kiểm tra kết nối API
    static async checkAPIConnection(): Promise<boolean> {
      try {
        await this.getWordDefinition('test');
        return true;
      } catch {
        return false;
      }
    }
  }
  
  export default DictionaryAPI;