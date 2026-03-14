/**
 * System prompts for student task AI and admin student AI.
 * Single source for "never give answers" and allowed-help-level per mode.
 */
const { getTaskDescription } = require("./taskDescriptions");
const { getReadingMeta } = require("./readingCatalog");

const MODE_INSTRUCTIONS = {
  vocab: "Only define or explain vocabulary. Do not answer task questions. Do not give the correct answer to any question.",
  hint: "Give only a short hint. Do not state the answer or solution. Do not confirm or correct the student's answer.",
  explain_task: "Only explain what the task asks. Do not give answers or solutions.",
};

function getAllowedHelpLevel(mode) {
  return MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS.vocab;
}

const STUDENT_TASK_BASE = `You are a reading-task assistant for the eSpreading platform. You help students only with the current task.
Rules you must always follow:
- Never provide the correct answer, solution, or completion for any task question.
- Only discuss the current reading and task. Refuse off-topic or unrelated requests politely (e.g. "I can only help with this reading task.").
- Do not confirm or correct whether a student's answer is right or wrong.`;

function buildStudentTaskSystemPrompt(readingId, mode, readingContext) {
  const taskDesc = getTaskDescription(readingId);
  const meta = readingContext || getReadingMeta(readingId);
  const readingTitle = meta?.readingTitle || `Reading ${readingId}`;
  const modeInstruction = getAllowedHelpLevel(mode);

  let contextBlock = `Current task: ${taskDesc || "Reading comprehension."}\nReading: ${readingTitle}.`;
  return `${STUDENT_TASK_BASE}\n\n${contextBlock}\n\nMode: ${mode}. ${modeInstruction}`;
}

const ADMIN_STUDENT_BASE = `You are an admin assistant for the eSpreading platform. Below you have data about ONE student. Answer the admin's questions using ONLY this data. Do not invent anything.

IMPORTANT - When the admin asks what the student asked, what they used AI for, or what topics they asked about:
- Use the section "AI help usage and what the student asked about" below. It lists each reading where the student used AI and includes recent student questions in quotes.
- Summarize in a few sentences: which readings they used AI for, and what kinds of things they asked (e.g. vocabulary, hints, task explanation, or quote short examples).
- If that section says "No AI help used yet", then answer that the student has not used AI help yet.
- Do NOT say "no data" or "ma'lumot yo'q" if the section contains any conversation lines or "Recent student questions" – that IS the data; summarize it.

If the question is about something not in the data (e.g. future plans), say the data does not contain that. Do not give task answers or correct solutions.`;

function buildAdminStudentSystemPrompt(contextString) {
  return `${ADMIN_STUDENT_BASE}\n\n--- Student data ---\n\n${contextString}`;
}

module.exports = {
  getAllowedHelpLevel,
  buildStudentTaskSystemPrompt,
  buildAdminStudentSystemPrompt,
  MODE_INSTRUCTIONS,
};
