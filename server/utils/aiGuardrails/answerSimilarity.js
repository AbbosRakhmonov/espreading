/**
 * Detect if the assistant reply contains text that matches known correct answers for the reading.
 * Uses getCorrectValuesForReading(readingId); avoids false positives (e.g. "true" in a sentence).
 */
const { getCorrectValuesForReading } = require("../answerKeys");

/**
 * Extract candidate answer-like segments from reply (short phrases, single words, digits).
 * Avoid treating long explanatory sentences as "the answer".
 */
function extractCandidates(reply) {
  const normalized = reply.trim().toLowerCase();
  const candidates = [];
  // Whole reply as one (for short one-word leaks)
  if (normalized.length <= 50) {
    candidates.push(normalized);
  }
  // Split on punctuation and newlines; take segments that look like answers (short)
  const segments = normalized.split(/[\s.,;:!?()\[\]{}'\"]+/).filter(Boolean);
  for (const seg of segments) {
    if (seg.length <= 30) candidates.push(seg);
  }
  // Also check for quoted strings (e.g. "SPOTLIGHT HOG")
  const quoted = reply.match(/"([^"]+)"/g);
  if (quoted) {
    for (const q of quoted) {
      candidates.push(q.replace(/"/g, "").trim().toLowerCase());
    }
  }
  return [...new Set(candidates)];
}

function checkAnswerSimilarity(assistantReply, readingId) {
  const correctValues = getCorrectValuesForReading(readingId);
  if (!correctValues.length) return { leak: false };

  const candidates = extractCandidates(assistantReply);
  const correctSet = new Set(correctValues);

  for (const c of candidates) {
    if (correctSet.has(c)) {
      return { leak: true, matched: c };
    }
    // Allow "true" / "false" only when they appear in a longer explanatory sentence (avoid "the answer is true" as sole content)
    if (c === "true" || c === "false") {
      const asOnlySentence = new RegExp(`^\\s*${c}\\s*[.!?]?\\s*$`, "i").test(assistantReply.trim());
      if (asOnlySentence) return { leak: true, matched: c };
    }
  }
  return { leak: false };
}

module.exports = { checkAnswerSimilarity, extractCandidates };
