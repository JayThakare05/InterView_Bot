import { supabase } from '../db/supabase.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new session in Supabase
 */
export async function createSession({ mode, topic, guestName = 'Guest' }) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ id: uuidv4(), mode, topic, guest_name: guestName, status: 'active' })
    .select()
    .single();

  if (error) throw new Error(`Failed to create session: ${error.message}`);
  return data;
}

/**
 * Get a session by ID
 */
export async function getSession(sessionId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) throw new Error(`Session not found: ${error.message}`);
  return data;
}

/**
 * Save a message to the messages table
 */
export async function saveMessage({ sessionId, role, content }) {
  const { error } = await supabase
    .from('messages')
    .insert({ id: uuidv4(), session_id: sessionId, role, content });

  if (error) throw new Error(`Failed to save message: ${error.message}`);
}

/**
 * Get all messages for a session (ordered by creation time)
 */
export async function getMessages(sessionId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to get messages: ${error.message}`);
  return data || [];
}

/**
 * Increment exchange count and end session
 */
export async function endSession(sessionId, fluencyScore) {
  const { data, error } = await supabase
    .from('sessions')
    .update({ status: 'ended', ended_at: new Date().toISOString(), fluency_score: fluencyScore })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw new Error(`Failed to end session: ${error.message}`);
  return data;
}

/**
 * Increment the exchange count
 */
export async function incrementExchangeCount(sessionId) {
  const session = await getSession(sessionId);
  const { error } = await supabase
    .from('sessions')
    .update({ exchange_count: (session.exchange_count || 0) + 1 })
    .eq('id', sessionId);

  if (error) throw new Error(`Failed to update exchange count: ${error.message}`);
}

/**
 * Save feedback to the feedback table
 */
export async function saveFeedback({ sessionId, feedback }) {
  const { error } = await supabase.from('feedback').insert({
    id: uuidv4(),
    session_id: sessionId,
    grammar_issues: feedback.grammar || [],
    vocabulary_issues: feedback.vocabulary || [],
    strengths: feedback.strengths || [],
    improvements: feedback.improve_next || [],
    fluency_score: feedback.fluency_score,
    fluency_reason: feedback.fluency_reason,
    encouragement: feedback.encouragement,
    raw_feedback: JSON.stringify(feedback),
  });

  if (error) throw new Error(`Failed to save feedback: ${error.message}`);
}

/**
 * Get feedback for a session
 */
export async function getFeedback(sessionId) {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error) throw new Error(`Feedback not found: ${error.message}`);
  return data;
}

/**
 * Get paginated session history (all sessions, guest mode)
 */
export async function getSessionHistory({ limit = 10, page = 1 }) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('sessions')
    .select('id, guest_name, mode, topic, fluency_score, status, started_at, ended_at, exchange_count', { count: 'exact' })
    .eq('status', 'ended')
    .order('ended_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(`Failed to get history: ${error.message}`);
  return { sessions: data || [], total: count || 0 };
}
