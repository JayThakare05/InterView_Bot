import { useEffect, useRef } from 'react';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceButton({ isRecording, onTranscript, onToggle, disabled }) {
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      onToggle(false);
    };

    recognition.onerror = () => onToggle(false);
    recognition.onend = () => onToggle(false);

    recognitionRef.current = recognition;
  }, []);

  const handleClick = () => {
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      onToggle(false);
    } else {
      recognitionRef.current?.start();
      onToggle(true);
    }
  };

  if (!SpeechRecognition) return null;

  return (
    <button
      id="voice-input-btn"
      onClick={handleClick}
      disabled={disabled}
      title={isRecording ? 'Stop recording' : 'Start voice input'}
      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40 ${
        isRecording
          ? 'mic-recording'
          : 'bg-violet-600/20 border border-violet-500/30 hover:bg-violet-600/30'
      }`}
    >
      {isRecording ? (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <rect x="5" y="5" width="10" height="10" rx="1" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-violet-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a3 3 0 00-3 3v5a3 3 0 006 0V5a3 3 0 00-3-3z" />
          <path
            fillRule="evenodd"
            d="M4.5 9a.5.5 0 011 0 4.5 4.5 0 009 0 .5.5 0 011 0 5.5 5.5 0 01-5 5.478V16h2a.5.5 0 010 1h-5a.5.5 0 010-1h2v-1.522A5.5 5.5 0 014.5 9z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
