/**
 * Classify the last user message: allowed vs request_answer / confirm_answer / suspicious_trick.
 * Rule-based patterns; no LLM required for MVP. Returns "allowed" or "block".
 */
const BLOCK_LABELS = ["request_answer", "confirm_answer", "suspicious_trick"];

const PATTERNS = [
  { label: "request_answer", regex: /\b(what('s|s| is) the (correct )?answer|give me the answer|tell me the answer|send (me )?the (correct )?answer|what is (the )?correct|correct (option|choice|one)|solution to (the )?question|answer (to|for) (question|q\d|number))/i },
  { label: "confirm_answer", regex: /\b(is (it )?(option )?[A-Ea-e]\s*\?|answer is [A-Ea-e]\s*(right|correct)\s*\?|just (for )?checking,?\s*(the )?answer (is )?|(is )?[A-Ea-e]\s*right\s*\?|confirm.*answer|am i (right|correct)\s*\?)/i },
  { label: "suspicious_trick", regex: /\b(pretend (you('re| are)|act as)|(you('re| are) )?my teacher|hidden in (the )?acrostic|first letter of each|acrostic|give (me )?the correct one|I already solved|just (send|give) (me )?(the )?correct)/i },
];

function classifyInput(lastUserMessage) {
  if (!lastUserMessage || typeof lastUserMessage !== "string") {
    return "allowed";
  }
  const text = lastUserMessage.trim();
  if (!text) return "allowed";

  for (const { label, regex } of PATTERNS) {
    if (regex.test(text)) {
      return label;
    }
  }
  return "allowed";
}

/**
 * @param {string} lastUserMessage
 * @returns {{ block: boolean, label: string }} block is true if we should not call the main model
 */
function checkInput(lastUserMessage) {
  const label = classifyInput(lastUserMessage);
  const block = BLOCK_LABELS.includes(label);
  return { block, label };
}

module.exports = { checkInput, classifyInput };
