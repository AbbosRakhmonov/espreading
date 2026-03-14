// Short, neutral task descriptions for each reading (no answers, no question text).
// Used by AI context only. Keep in sync with readingCatalog keys.

const taskDescriptions = {
  1: "Reading comprehension: The Five Stages of Grief. Students match characters to stages and answer questions about the text.",
  2: "Sequencing: Conversation – Bargaining Stage. Students order dialogue and understand the bargaining stage.",
  3: "Reading comprehension: 5 types of difficult coworkers. Vocabulary and true/false comprehension.",
  4: "Reading comprehension: Behaviour Analysis in Health, Sport and Fitness. Matching terms to definitions and true/false.",
  5: "Reading comprehension: Decrease Stress, Improve Your Energy. Vocabulary and comprehension questions.",
  6: "Reading comprehension: Depression in Children. Vocabulary, true/false, and matching.",
  7: "Reading comprehension: Childhood Stress: How Parents Can Help. True/false and multiple choice.",
};

function getTaskDescription(readingId) {
  const key = Number(readingId);
  return taskDescriptions[key] || null;
}

module.exports = { taskDescriptions, getTaskDescription };
