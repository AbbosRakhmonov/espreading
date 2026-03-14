/**
 * Check if the assistant reply contains a task answer or solution.
 * Heuristic-based for MVP: detect patterns that suggest the model gave the answer.
 */
const LEAK_PATTERNS = [
  /\bthe answer is\s*[:=]?\s*[A-Ea-e1-5]\b/i,
  /\bcorrect (option|choice|answer) is\s*[:=]?\s*[A-Ea-e1-5\"']/i,
  /\bsolution\s*[:=]\s*/i,
  /\b(option|choice) [A-E]\s+is (correct|right)/i,
  /\b(answer|it)'s\s+[A-Ea-e1-5]\b/i,
  /\b(so |thus )?(the )?answer (is|would be)\s+[A-Ea-e1-5\"']/i,
  /\b(you should (choose|select)|choose|select)\s+[A-Ea-e1-5]\b/i,
];

function validateOutput(assistantReply) {
  if (!assistantReply || typeof assistantReply !== "string") {
    return { valid: true };
  }
  const text = assistantReply.trim();
  for (const pattern of LEAK_PATTERNS) {
    if (pattern.test(text)) {
      return { valid: false, reason: "pattern_match" };
    }
  }
  return { valid: true };
}

module.exports = { validateOutput };
