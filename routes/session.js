import express from 'express';
import {
  createSession,
  getSession,
  saveMessage,
  getMessages,
  endSession,
  incrementExchangeCount,
  saveFeedback,
  getFeedback,
} from '../services/sessionService.js';
import { getOpeningMessage, sendMessage, generateFeedback } from '../services/groq.js';
import { parseFeedback } from '../services/feedbackService.js';

const router = express.Router();

// POST /session/start
router.post('/start', async (req, res, next) => {
  try {
    const { mode, topic, guest_name } = req.body;
    if (!mode || !topic) return res.status(400).json({ error: 'mode and topic are required' });

    const validModes = ['interview', 'debate', 'gd', 'casual'];
    if (!validModes.includes(mode)) {
      return res.status(400).json({ error: `mode must be one of: ${validModes.join(', ')}` });
    }

    // Create session in DB
    const session = await createSession({ mode, topic, guestName: guest_name || 'Guest' });

    // Get AI opening message
    const openingMessage = await getOpeningMessage(mode, topic);

    // Save bot opening message
    await saveMessage({ sessionId: session.id, role: 'assistant', content: openingMessage });

    res.json({
      session_id: session.id,
      opening_message: openingMessage,
      mode: session.mode,
      topic: session.topic,
      started_at: session.started_at,
    });
  } catch (err) {
    next(err);
  }
});

// POST /session/message
router.post('/message', async (req, res, next) => {
  try {
    const { session_id, user_message } = req.body;
    if (!session_id || !user_message) {
      return res.status(400).json({ error: 'session_id and user_message are required' });
    }

    const session = await getSession(session_id);
    if (session.status === 'ended') {
      return res.status(400).json({ error: 'Session has already ended' });
    }

    // Save user message
    await saveMessage({ sessionId: session_id, role: 'user', content: user_message });

    // Load conversation history for context
    const allMessages = await getMessages(session_id);
    const history = allMessages.map((m) => ({ role: m.role, content: m.content }));

    // Get bot reply
    const botReply = await sendMessage(history.slice(0, -1), user_message);

    // Save bot reply & update exchange count
    await saveMessage({ sessionId: session_id, role: 'assistant', content: botReply });
    await incrementExchangeCount(session_id);

    const updatedSession = await getSession(session_id);

    res.json({
      bot_reply: botReply,
      exchange_count: updatedSession.exchange_count,
      session_active: updatedSession.status === 'active',
    });
  } catch (err) {
    next(err);
  }
});

// POST /session/end
router.post('/end', async (req, res, next) => {
  try {
    const { session_id } = req.body;
    if (!session_id) return res.status(400).json({ error: 'session_id is required' });

    const session = await getSession(session_id);
    if (session.status === 'ended') {
      // Return cached feedback if session already ended
      try {
        const cached = await getFeedback(session_id);
        return res.json({ session_id, feedback: JSON.parse(cached.raw_feedback) });
      } catch {
        return res.status(400).json({ error: 'Session already ended and no feedback found' });
      }
    }

    // Get full conversation
    const allMessages = await getMessages(session_id);
    const history = allMessages.map((m) => ({ role: m.role, content: m.content }));

    // Generate feedback via Groq
    const rawFeedback = await generateFeedback(history, session.mode, session.topic);
    const feedback = parseFeedback(rawFeedback);

    // Mark session ended & save feedback
    await endSession(session_id, feedback.fluency_score);
    await saveFeedback({ sessionId: session_id, feedback });

    res.json({ session_id, feedback });
  } catch (err) {
    next(err);
  }
});

// GET /session/:id/feedback
router.get('/:id/feedback', async (req, res, next) => {
  try {
    const fb = await getFeedback(req.params.id);
    res.json({ session_id: req.params.id, feedback: JSON.parse(fb.raw_feedback) });
  } catch (err) {
    next(err);
  }
});

export default router;
