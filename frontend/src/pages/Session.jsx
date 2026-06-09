import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import * as api from '../api/client';
import ChatWindow from '../components/ChatWindow';
import ModeSelector from '../components/ModeSelector';
import TopicPicker from '../components/TopicPicker';
import VoiceButton from '../components/VoiceButton';
import FeedbackReport from '../components/FeedbackReport';

const STEPS = { MODE: 'mode', TOPIC: 'topic', CHAT: 'chat' };

const END_TRIGGERS = ['end session', 'stop', 'give feedback', 'end the session', 'stop session'];

export default function Session() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.MODE);
  const [inputText, setInputText] = useState('');
  const inputRef = useRef(null);

  const {
    sessionId, mode, topic, messages, isLoading, isRecording,
    sessionActive, showFeedback, feedbackData, exchangeCount,
    setMode, setTopic, startSession: storeStartSession,
    addMessage, setExchangeCount, setIsLoading, setIsRecording,
    setFeedback, resetSession,
  } = useSessionStore();

  // Speak bot message via Web Speech Synthesis
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    utt.rate = 0.95;
    window.speechSynthesis.speak(utt);
  };

  const handleStartSession = async () => {
    if (!mode || !topic) return;
    setIsLoading(true);
    try {
      const data = await api.startSession({ mode, topic, guestName: 'Guest' });
      storeStartSession(data.session_id, data.opening_message, mode, topic);
      speak(data.opening_message);
      setStep(STEPS.CHAT);
    } catch (err) {
      alert('Could not connect to the server. Is the backend running?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    const msg = text.trim();
    if (!msg || isLoading || !sessionActive) return;

    setInputText('');

    // Check for end-session triggers
    const isEnd = END_TRIGGERS.some((t) => msg.toLowerCase().includes(t));

    addMessage('user', msg);
    setIsLoading(true);

    try {
      if (isEnd) {
        const data = await api.endSession({ sessionId });
        setFeedback(data.feedback);
        window.speechSynthesis?.cancel();
      } else {
        const data = await api.sendMessage({ sessionId, userMessage: msg });
        addMessage('assistant', data.bot_reply);
        setExchangeCount(data.exchange_count);
        speak(data.bot_reply);
      }
    } catch (err) {
      addMessage('assistant', "I'm having trouble connecting right now. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleEndSession = async () => {
    if (!sessionId || !sessionActive) return;
    setIsLoading(true);
    try {
      const data = await api.endSession({ sessionId });
      setFeedback(data.feedback);
      window.speechSynthesis?.cancel();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  const handleNewSession = () => {
    window.speechSynthesis?.cancel();
    resetSession();
    setStep(STEPS.MODE);
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: '#0a0f1e' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 glass border-b border-white/5 shrink-0">
        <button
          id="back-home-btn"
          onClick={() => { window.speechSynthesis?.cancel(); navigate('/'); }}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          ← <span className="font-bold text-white">talk_to_me</span>
        </button>

        {sessionActive && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {exchangeCount} exchanges
            </div>
            <button
              id="end-session-btn"
              onClick={handleEndSession}
              disabled={isLoading}
              className="text-xs px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 transition-all"
            >
              End Session
            </button>
          </div>
        )}

        {(step === STEPS.MODE || step === STEPS.TOPIC) && (
          <button
            id="view-history-btn"
            onClick={() => navigate('/history')}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            📋 History
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* ── STEP 1: Mode ── */}
        {step === STEPS.MODE && (
          <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full">
            <div className="mb-6 slide-up">
              <h2 className="text-2xl font-bold text-white mb-1">Choose a Practice Mode</h2>
              <p className="text-gray-400 text-sm">What would you like to practise today?</p>
            </div>
            <ModeSelector selected={mode} onSelect={setMode} />
            {mode && (
              <button
                id="next-to-topic-btn"
                onClick={() => setStep(STEPS.TOPIC)}
                className="btn-primary w-full mt-6 py-3 slide-up"
              >
                Continue →
              </button>
            )}
          </div>
        )}

        {/* ── STEP 2: Topic ── */}
        {step === STEPS.TOPIC && (
          <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full">
            <div className="mb-6 slide-up flex items-center gap-3">
              <button onClick={() => setStep(STEPS.MODE)} className="text-gray-400 hover:text-white">←</button>
              <div>
                <h2 className="text-2xl font-bold text-white">Pick a Topic</h2>
                <p className="text-gray-400 text-sm capitalize">Mode: {mode}</p>
              </div>
            </div>
            <TopicPicker mode={mode} onSelect={setTopic} selected={topic} />
            {topic && (
              <button
                id="start-session-btn"
                onClick={handleStartSession}
                disabled={isLoading}
                className="btn-primary w-full mt-6 py-3 slide-up disabled:opacity-50"
              >
                {isLoading ? '⏳ Starting…' : '🚀 Start Session'}
              </button>
            )}
          </div>
        )}

        {/* ── STEP 3: Chat ── */}
        {step === STEPS.CHAT && !showFeedback && (
          <>
            <div className="px-4 py-2 shrink-0 flex items-center gap-2 border-b border-white/5">
              <span className="text-xs glass px-3 py-1 rounded-full capitalize text-violet-300 border border-violet-500/20">{mode}</span>
              <span className="text-xs text-gray-500">{topic}</span>
              <span className="text-xs text-gray-600 ml-auto">Type "end session" for feedback</span>
            </div>

            <ChatWindow messages={messages} isLoading={isLoading} mode={mode} />

            {/* Input area */}
            <div className="px-4 pb-4 pt-2 shrink-0 glass border-t border-white/5">
              <div className="flex gap-2 max-w-4xl mx-auto">
                <VoiceButton
                  isRecording={isRecording}
                  onTranscript={(t) => handleSendMessage(t)}
                  onToggle={setIsRecording}
                  disabled={isLoading || !sessionActive}
                />
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  className="chat-input flex-1 resize-none text-sm"
                  rows={2}
                  placeholder="Type your reply… or use the mic 🎤"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading || !sessionActive}
                />
                <button
                  id="send-message-btn"
                  onClick={() => handleSendMessage(inputText)}
                  disabled={isLoading || !inputText.trim() || !sessionActive}
                  className="btn-primary px-4 self-end disabled:opacity-40"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Feedback ── */}
        {showFeedback && (
          <FeedbackReport
            feedback={feedbackData}
            mode={mode}
            topic={topic}
            onStartNew={handleNewSession}
          />
        )}
      </div>
    </div>
  );
}
