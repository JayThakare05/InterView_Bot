/**
 * Parse the raw JSON feedback string from Groq into a structured object.
 * Handles markdown code fences and partial JSON gracefully.
 */
export function parseFeedback(raw) {
  try {
    // Strip markdown code fences if present
    let cleaned = raw.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```[a-z]*\n?/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(cleaned);

    // Normalize and fill defaults
    return {
      summary: parsed.summary || {},
      grammar: Array.isArray(parsed.grammar) ? parsed.grammar : [],
      vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary : [],
      fluency_score: typeof parsed.fluency_score === 'number' ? parsed.fluency_score : 5,
      fluency_reason: parsed.fluency_reason || 'Session completed.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improve_next: Array.isArray(parsed.improve_next) ? parsed.improve_next : [],
      encouragement: parsed.encouragement || 'Great effort — keep practising!',
    };
  } catch {
    // Fallback if Groq returned non-JSON text
    return {
      summary: {},
      grammar: [],
      vocabulary: [],
      fluency_score: 5,
      fluency_reason: 'Could not parse detailed score.',
      strengths: ['You completed the session!'],
      improve_next: ['Keep practising regularly.'],
      encouragement: raw.slice(0, 300) || 'Well done for completing the session!',
    };
  }
}
