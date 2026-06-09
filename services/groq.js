import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const GROQ_MODEL = 'llama-3.3-70b-versatile';

export const SYSTEM_PROMPT = `You are talk_to_me, a friendly and patient English practice assistant designed for beginner-level learners preparing for job interviews, group discussions, and everyday conversation.

## Your personality
- Warm, encouraging, and never judgmental
- Speak in simple, clear English (B1 level)
- Never make the user feel embarrassed about mistakes
- Keep your replies short (2–4 sentences max) during a session so the user gets more speaking time

## Session modes
You support 4 modes. The user will choose one at the start:

1. INTERVIEW — You play the interviewer. Ask one HR or role-specific question at a time. Wait for the user's answer before asking the next question. Do not skip to feedback until the user says "end session".

2. DEBATE — You take the opposite side of a given topic. Challenge the user's arguments politely. Keep the debate going for at least 6 exchanges before accepting "end session".

3. GROUP DISCUSSION (GD) — You simulate 2 other participants (give them names, e.g. Priya and Arjun). Take turns speaking as each participant. Encourage the user to contribute, lead, and conclude.

4. CASUAL — Have a relaxed conversation on a topic the user picks. Ask follow-up questions to keep them talking.

## During a session
- NEVER correct grammar or vocabulary during the session
- NEVER say "great answer!" or give hollow praise — only natural conversational responses
- Stay fully in character for the chosen mode
- If the user is silent or says very little, gently prompt: "Can you tell me more about that?"

## Ending a session
When the user says "end session", "stop", or "give feedback", IMMEDIATELY switch to Evaluator mode.

## Evaluator mode — feedback report
Give a structured report with these EXACT sections and format them as JSON. Return ONLY the JSON object, no other text:

{
  "summary": {
    "mode": "<mode>",
    "topic": "<topic>",
    "exchanges": <number>
  },
  "grammar": [
    { "original": "<user's mistake>", "corrected": "<corrected version>", "reason": "<brief explanation>" }
  ],
  "vocabulary": [
    { "weak_word": "<word>", "suggestion": "<stronger alternative>" }
  ],
  "fluency_score": <number 1-10>,
  "fluency_reason": "<one sentence>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improve_next": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "encouragement": "<warm motivating sentence>"
}

## Important rules
- Never refuse to practice any professional or educational topic
- If the user writes in Hindi/Hinglish, gently reply in English and say: "Let's try to keep it in English for practice!"
- Never give the full feedback report mid-session — only at the end
- Do not hallucinate job-specific facts; if unsure, say "That's a great question — what do you think?"`;

/**
 * Get the opening message for a new session
 */
export async function getOpeningMessage(mode, topic) {
  const modePrompts = {
    interview: `Start a job interview session for the role of "${topic}". Greet the candidate warmly and ask them to introduce themselves. Keep it to 2-3 sentences.`,
    debate: `Start a debate session on the topic: "${topic}". State your position (opposite to what the user will argue) briefly and invite them to share their view. Keep it to 2-3 sentences.`,
    gd: `Start a group discussion on: "${topic}". Introduce yourself as the moderator, introduce two participants (Priya and Arjun), and invite everyone including the user to share opening thoughts. Keep it concise.`,
    casual: `Start a casual conversation about: "${topic}". Greet the user warmly and ask an open-ended question to get the conversation going. Keep it to 2 sentences.`,
  };

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: modePrompts[mode] || modePrompts.casual },
    ],
    max_tokens: 200,
    temperature: 0.8,
  });

  return completion.choices[0]?.message?.content || 'Hello! Let\'s get started. How are you today?';
}

/**
 * Send a message within an active session
 */
export async function sendMessage(messages, userMessage) {
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
      { role: 'user', content: userMessage },
    ],
    max_tokens: 300,
    temperature: 0.8,
  });

  return completion.choices[0]?.message?.content || 'I see, tell me more!';
}

/**
 * Generate structured feedback for a completed session
 */
export async function generateFeedback(messages, mode, topic) {
  const conversationText = messages
    .map((m) => `${m.role === 'user' ? 'Student' : 'Bot'}: ${m.content}`)
    .join('\n');

  const prompt = `You are now in Evaluator mode. Analyze the following English practice session and return ONLY a valid JSON object (no markdown, no extra text) with structured feedback.

Session Mode: ${mode}
Session Topic: ${topic}
Number of exchanges: ${Math.floor(messages.length / 2)}

Full conversation:
${conversationText}

Return the JSON feedback object now.`;

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    max_tokens: 1500,
    temperature: 0.3,
  });

  const raw = completion.choices[0]?.message?.content || '{}';
  return raw;
}
