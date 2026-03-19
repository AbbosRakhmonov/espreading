/**
 * Admin "ask about student" AI: build context from User, Reading, AIConversation, AIMessage; call OpenAI.
 * No persistence of admin chat.
 */
const OpenAI = require("openai");
const User = require("../models/User");
const Reading = require("../models/Reading");
const AIConversation = require("../models/AIConversation");
const AIMessage = require("../models/AIMessage");
const ReadingStrategy = require("../models/ReadingStrategy");
const Setting = require("../models/Setting");
const { getReadingMeta } = require("../utils/readingCatalog");
const { buildAdminStudentSystemPrompt } = require("../utils/aiPrompts");

async function buildStudentContextString(studentId) {
  const student = await User.findById(studentId)
    .select("fullName email university createdAt")
    .lean();
  if (!student) return null;

  const readings = await Reading.find({ user: studentId })
    .sort({ completedAt: -1 })
    .lean();
  const completed = readings.filter((r) => r.completed);
  const readingSummary =
    completed
      .map((r) => {
        const meta = getReadingMeta(r.reading);
        const title = meta?.readingTitle || `Reading ${r.reading}`;
        return `${title}: score ${r.score ?? 0}, time ${r.time ?? 0}s`;
      })
      .join("; ") || "None completed.";

  // AI help usage + short summary of what the student asked
  const conversations = await AIConversation.find({ user: studentId })
    .sort({ lastMessageAt: -1 })
    .lean();
  const aiSummaryParts = [];
  for (const conv of conversations) {
    const messages = await AIMessage.find({ conversationId: conv._id })
      .sort({ createdAt: 1 })
      .lean();
    const totalCount = messages.length;
    const userMessages = messages.filter((m) => m.role === "user");
    const userCount = userMessages.length;
    // Take a few of the most recent student questions as examples
    const recentExamples = userMessages
      .slice(-5)
      .map((m) => {
        const text = (m.content || "").trim();
        return text.length > 120 ? `${text.slice(0, 117)}...` : text;
      })
      .filter((t) => t.length > 0);
    const meta = getReadingMeta(conv.readingId);
    const title = meta?.readingTitle || `Reading ${conv.readingId}`;
    const examplesBlock = recentExamples.length
      ? ` Recent student questions: ${recentExamples.map((t) => `"${t}"`).join(" | ")}.`
      : "";
    aiSummaryParts.push(
      `${title}: ${totalCount} messages (${userCount} from student), mode ${conv.mode || "n/a"}.${examplesBlock}`,
    );
  }
  const aiSummary = aiSummaryParts.length
    ? aiSummaryParts.join("\n")
    : "No AI help used yet.";

  let questionnaireInfo = "Questionnaire: not submitted.";
  const pre = await ReadingStrategy.findOne({
    user: studentId,
    type: "pre",
  }).lean();
  const post = await ReadingStrategy.findOne({
    user: studentId,
    type: "post",
  }).lean();
  if (pre) questionnaireInfo = "Pre-questionnaire: submitted.";
  if (post) questionnaireInfo += " Post-questionnaire: submitted.";

  return `Student: ${student.fullName}, email ${student.email}, university ${student.university}, joined ${student.createdAt}.
Completed readings:
${readingSummary}

AI help usage and what the student asked about:
${aiSummary}

${questionnaireInfo}`;
}

/**
 * @param {string} studentId
 * @param {Array<{ role: string, content: string }>} messages
 * @returns {Promise<{ message?: { role: string, content: string }, error?: string }>}
 */
async function adminAskAboutStudent(studentId, messages) {
  const contextString = await buildStudentContextString(studentId);
  if (!contextString) return { error: "Student not found" };

  const settingDoc = await Setting.findOne({ key: "ai_enabled" }).lean();
  const enabled = settingDoc ? settingDoc.value === true : true;
  if (!enabled) return { error: "AI help is temporarily disabled." };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { error: "AI service not configured" };

  const systemContent = buildAdminStudentSystemPrompt(contextString);
  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.4-mini",
      messages: [{ role: "system", content: systemContent }, ...messages],
      max_tokens: 2000,
      temperature: 1,
    });
    const content = completion.choices[0]?.message?.content?.trim() || "";
    return { message: { role: "assistant", content } };
  } catch (err) {
    return { error: err.message || "OpenAI request failed" };
  }
}

module.exports = { adminAskAboutStudent, buildStudentContextString };
