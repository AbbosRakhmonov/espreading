/**
 * Detect suspicious phrasing in user input (second layer after input classifier).
 * If any high-risk pattern matches, block the request.
 */
const HIGH_RISK_PHRASES = [
  "the answer",
  "correct option",
  "correct choice",
  "which one is right",
  "tell me which",
  "solution:",
  "solution is",
  "hidden",
  "acrostic",
  "first letter of each",
  "give me the correct",
  "send the correct",
  "what is the answer to question",
  "answer to q",
  "option b right",
  "option a right",
  "is it b?",
  "is it a?",
  "is it c?",
  "is it d?",
  "is it e?",
];

function checkSuspiciousPhrasing(lastUserMessage) {
  if (!lastUserMessage || typeof lastUserMessage !== "string") {
    return { block: false };
  }
  const normalized = lastUserMessage.trim().toLowerCase();
  if (!normalized) return { block: false };

  for (const phrase of HIGH_RISK_PHRASES) {
    if (normalized.includes(phrase.toLowerCase())) {
      return { block: true, matched: phrase };
    }
  }
  return { block: false };
}

module.exports = { checkSuspiciousPhrasing, HIGH_RISK_PHRASES };
