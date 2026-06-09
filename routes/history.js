import express from 'express';
import { getSessionHistory, getFeedback } from '../services/sessionService.js';

const router = express.Router();

// GET /session/history
router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const { sessions, total } = await getSessionHistory({ limit, page });
    res.json({ sessions, total, page, limit });
  } catch (err) {
    next(err);
  }
});

export default router;
