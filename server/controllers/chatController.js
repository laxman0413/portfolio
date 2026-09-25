const portfolioData = require('../data/data.json');
const { buildSystemPrompt } = require('../services/chatContext');
const { getFallbackReply } = require('../services/chatFallback');

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = Number(process.env.CHAT_RATE_LIMIT_MAX || 20);
const MAX_MESSAGE_LENGTH = 800;
const MAX_HISTORY_TURNS = 6;
const AI_REQUEST_TIMEOUT_MS = 15000;

const requestLog = new Map();

function isRateLimited(key) {
  const now = Date.now();
  const timestamps = (requestLog.get(key) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(key, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((entry) => entry && (entry.role === 'user' || entry.role === 'assistant') && typeof entry.content === 'string')
    .slice(-MAX_HISTORY_TURNS)
    .map((entry) => ({ role: entry.role, content: entry.content.slice(0, 1000) }));
}

async function callGroq(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.CHAT_MODEL || 'llama-3.3-70b-versatile';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: 400,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`AI provider responded with ${response.status}: ${errorText.slice(0, 200)}`);
    }

    const payload = await response.json();
    const reply = payload?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error('AI provider returned an empty response.');
    }

    return reply;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function chat(request, response) {
  const rateLimitKey = request.ip || 'unknown';

  if (isRateLimited(rateLimitKey)) {
    response.status(429).json({
      success: false,
      message: 'Too many messages sent in a short time. Please wait a few minutes and try again.',
    });
    return;
  }

  const message = typeof request.body?.message === 'string' ? request.body.message.trim() : '';

  if (!message) {
    response.status(400).json({ success: false, message: 'A message is required.' });
    return;
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    response.status(400).json({
      success: false,
      message: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`,
    });
    return;
  }

  const history = sanitizeHistory(request.body?.history);
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    response.json({
      success: true,
      reply: getFallbackReply(message, portfolioData),
      source: 'fallback',
    });
    return;
  }

  try {
    const messages = [
      { role: 'system', content: buildSystemPrompt(portfolioData) },
      ...history,
      { role: 'user', content: message },
    ];

    const reply = await callGroq(messages);
    response.json({ success: true, reply, source: 'ai' });
  } catch (error) {
    console.error('Chat AI call failed, falling back to rule-based reply:', error.message);
    response.json({
      success: true,
      reply: getFallbackReply(message, portfolioData),
      source: 'fallback',
    });
  }
}

module.exports = {
  chat,
};
