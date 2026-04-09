export interface SpeechRecognitionAlternativeLike {
  transcript?: string;
}

export interface SpeechRecognitionResultLike
  extends ArrayLike<SpeechRecognitionAlternativeLike> {}

export interface SpeechRecognitionEventLike {
  results?: ArrayLike<SpeechRecognitionResultLike>;
}

export interface BrowserSpeechRecognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export interface BrowserSpeechRecognitionConstructor {
  new (): BrowserSpeechRecognition;
}

export interface BrowserSpeechWindow extends Window {
  SpeechRecognition?: BrowserSpeechRecognitionConstructor;
  webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
}

export const getSpeechRecognitionCtor = (
  browserWindow?: Window
): BrowserSpeechRecognitionConstructor | undefined => {
  if (!browserWindow) return undefined;

  const speechWindow = browserWindow as BrowserSpeechWindow;
  return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
};

export const extractTranscript = (event: SpeechRecognitionEventLike) =>
  Array.from(event.results || [])
    .map((item) => item[0]?.transcript || "")
    .join(" ")
    .trim();
