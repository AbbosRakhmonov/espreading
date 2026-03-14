/**
 * Build model context from AIConversation + AIMessage: task description, optional summary, last 8-12 messages.
 * Never send full history to the API.
 */
const AIMessage = require("../models/AIMessage");
const { buildStudentTaskSystemPrompt } = require("./aiPrompts");
const { getReadingMeta } = require("./readingCatalog");

const LAST_N = 12;

/**
 * Load last N messages for a conversation, sorted by createdAt ascending.
 * @param {string} conversationId
 * @param {number} n
 * @returns {Promise<Array<{ role: string, content: string }>>}
 */
async function loadLastMessages(conversationId, n = LAST_N) {
  const messages = await AIMessage.find({ conversationId })
    .sort({ createdAt: 1 })
    .limit(n + 50)
    .lean();
  const lastN = messages.slice(-n);
  return lastN.map((m) => ({ role: m.role, content: m.content }));
}

/**
 * Build messages array for OpenAI: system prompt + (optional summary) + last N messages.
 * For a new thread (no conversationId or no AIMessages), use only the current user message from the request.
 * @param {Object} options
 * @param {string} options.readingId
 * @param {string} options.mode
 * @param {string} [options.conversationId]
 * @param {string} [options.summarySoFar]
 * @param {Array<{ role: string, content: string }>} [options.currentTurnUserMessage] - the new user message for this request
 */
async function buildModelContext(options) {
  const { readingId, mode, conversationId, summarySoFar, currentTurnUserMessage } = options;
  const readingContext = getReadingMeta(readingId);
  const systemContent = buildStudentTaskSystemPrompt(readingId, mode, readingContext);
  if (summarySoFar && summarySoFar.trim()) {
    systemContent += `\n\nPrevious conversation summary:\n${summarySoFar.trim()}`;
  }

  let messagesForApi = [];
  if (conversationId) {
    const lastMessages = await loadLastMessages(conversationId, LAST_N);
    if (lastMessages.length > 0) {
      messagesForApi = lastMessages.map((m) => ({ role: m.role, content: m.content }));
    }
  }
  // Append the current user message (from request body) so the model has the latest turn
  if (currentTurnUserMessage && currentTurnUserMessage.content) {
    messagesForApi.push({ role: "user", content: currentTurnUserMessage.content });
  }

  return { systemContent, messagesForApi };
}

module.exports = { buildModelContext, loadLastMessages, LAST_N };
