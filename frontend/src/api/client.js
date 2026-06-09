import axios from 'axios';

const api = axios.create({
  // In dev, Vite proxies /session, /topics, /history → localhost:3001
  // In production, set VITE_API_BASE_URL
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000,
});

export const startSession = ({ mode, topic, guestName }) =>
  api.post('/session/start', { mode, topic, guest_name: guestName }).then((r) => r.data);

export const sendMessage = ({ sessionId, userMessage }) =>
  api.post('/session/message', { session_id: sessionId, user_message: userMessage }).then((r) => r.data);

export const endSession = ({ sessionId }) =>
  api.post('/session/end', { session_id: sessionId }).then((r) => r.data);

export const getTopics = () =>
  api.get('/topics').then((r) => r.data);

export const getHistory = ({ limit = 10, page = 1 } = {}) =>
  api.get('/history', { params: { limit, page } }).then((r) => r.data);

export const getSessionFeedback = (sessionId) =>
  api.get(`/session/${sessionId}/feedback`).then((r) => r.data);

export default api;
