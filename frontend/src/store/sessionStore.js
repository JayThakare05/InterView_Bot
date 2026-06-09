import { create } from 'zustand';

export const useSessionStore = create((set, get) => ({
  // Session metadata
  sessionId: null,
  mode: null,
  topic: '',
  guestName: 'Guest',
  exchangeCount: 0,

  // UI state
  isLoading: false,
  isRecording: false,
  sessionActive: false,
  showFeedback: false,

  // Chat data
  messages: [],

  // Feedback data
  feedbackData: null,

  // Actions
  setMode: (mode) => set({ mode }),
  setTopic: (topic) => set({ topic }),
  setGuestName: (name) => set({ guestName: name }),

  startSession: (sessionId, openingMessage, mode, topic) =>
    set({
      sessionId,
      mode,
      topic,
      messages: [{ role: 'assistant', content: openingMessage, id: Date.now() }],
      sessionActive: true,
      showFeedback: false,
      feedbackData: null,
      exchangeCount: 0,
    }),

  addMessage: (role, content) =>
    set((state) => ({
      messages: [...state.messages, { role, content, id: Date.now() + Math.random() }],
    })),

  setExchangeCount: (count) => set({ exchangeCount: count }),
  setIsLoading: (val) => set({ isLoading: val }),
  setIsRecording: (val) => set({ isRecording: val }),

  setFeedback: (data) =>
    set({ feedbackData: data, showFeedback: true, sessionActive: false }),

  resetSession: () =>
    set({
      sessionId: null,
      mode: null,
      topic: '',
      messages: [],
      sessionActive: false,
      showFeedback: false,
      feedbackData: null,
      exchangeCount: 0,
      isLoading: false,
      isRecording: false,
    }),
}));
