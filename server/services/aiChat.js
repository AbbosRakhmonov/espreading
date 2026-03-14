/**
 * Student task AI chat: guardrails, context build, OpenAI call, persist AIMessage + AIConversation.
 */
const OpenAI = require("openai");
const Setting = require("../models/Setting");
const AIConversation = require("../models/AIConversation");
const AIMessage = require("../models/AIMessage");
const { buildModelContext } = require("../utils/aiContextBuilder");
const { checkInput } = require("../utils/aiGuardrails/inputClassifier");
const { checkSuspiciousPhrasing } = require("../utils/aiGuardrails/suspiciousPhrasing");
const { validateOutput } = require("../utils/aiGuardrails/outputValidator");
const { checkAnswerSimilarity } = require("../utils/aiGuardrails/answerSimilarity");

const REFUSAL_MESSAGE = "I can only give hints and explanations, not answers. Try asking for a vocabulary definition or a hint.";

function getLastUserMessage(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return null;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i];
  }
  return null;
}

/**
 * @param {Object} options
 * @param {string} options.userId
 * @param {string} options.readingId
 * @param {string} options.mode
 * @param {Array<{ role: string, content: string }>} options.messages
 * @returns {Promise<{ message?: { role: string, content: string }, blocked?: boolean, refusalMessage?: string, error?: string }>}
 */
async function processStudentChat(options) {
  const { userId, readingId, mode, messages } = options;
  const lastUser = getLastUserMessage(messages);
  if (!lastUser || !lastUser.content) {
    return { error: "No user message" };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { error: "AI service not configured" };
  }

  const settingDoc = await Setting.findOne({ key: "ai_enabled" }).lean();
  const enabled = settingDoc ? settingDoc.value === true : true;
  if (!enabled) {
    return { blocked: true, refusalMessage: "AI help is temporarily disabled." };
  }

  const { block: inputBlock } = checkInput(lastUser.content);
  if (inputBlock) {
    return { blocked: true, refusalMessage: REFUSAL_MESSAGE };
  }

  const { block: suspiciousBlock } = checkSuspiciousPhrasing(lastUser.content);
  if (suspiciousBlock) {
    return { blocked: true, refusalMessage: REFUSAL_MESSAGE };
  }

  let conversation = await AIConversation.findOne({ user: userId, readingId }).lean();
  if (!conversation) {
    const created = await AIConversation.create({
      user: userId,
      readingId,
      mode,
      meta: {},
    });
    conversation = created.toObject();
  }

  const { systemContent, messagesForApi } = await buildModelContext({
    readingId,
    mode,
    conversationId: conversation._id,
    summarySoFar: conversation.summarySoFar || null,
    currentTurnUserMessage: lastUser,
  });

  if (messagesForApi.length === 0) {
    return { error: "No messages for context" };
  }

  const openai = new OpenAI({ apiKey });
  let assistantContent;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        ...messagesForApi,
      ],
      max_tokens: 500,
      temperature: 0.4,
    });
    assistantContent = completion.choices[0]?.message?.content?.trim() || "";
  } catch (err) {
    return { error: err.message || "OpenAI request failed" };
  }

  const { valid } = validateOutput(assistantContent);
  if (!valid) {
    return { blocked: true, refusalMessage: REFUSAL_MESSAGE };
  }

  const { leak } = checkAnswerSimilarity(assistantContent, readingId);
  if (leak) {
    return { blocked: true, refusalMessage: REFUSAL_MESSAGE };
  }

  await AIMessage.create([
    { conversationId: conversation._id, role: "user", content: lastUser.content },
    { conversationId: conversation._id, role: "assistant", content: assistantContent },
  ]);

  await AIConversation.updateOne(
    { _id: conversation._id },
    {
      $set: {
        lastMessageAt: new Date(),
        mode,
      },
    }
  );

  return { message: { role: "assistant", content: assistantContent } };
}

module.exports = { processStudentChat, REFUSAL_MESSAGE };
