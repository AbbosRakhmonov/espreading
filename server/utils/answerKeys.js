// Single source of truth for correct answers per reading.
// Used by: (1) grading in student.js, (2) answer-similarity detector in aiGuardrails.
// Never send this data to OpenAI.

const firstReadingAnswers = {
  emma: "1",
  carlos: "2",
  fatima: "3",
  liam: "4",
  sofia: "5",
};

const secondReadingAnswers = {
  0: 2,
  1: 3,
  2: 5,
  3: 6,
  4: 7,
  5: 1,
  6: 4,
};

const thirdReadingAnswers = {
  "q1-1": false,
  "q1-2": true,
  "q1-3": true,
  "q1-4": false,
  "q1-5": false,
  "q2-1": "SPOTLIGHT HOG",
  "q2-2": "GOSSIP",
  "q2-3": "CALM",
  "q2-4": "BELLYACHER",
  "q2-5": "NEGATIVITY",
};

const fourthReadingAnswers = {
  "q1-1": "1",
  "q1-2": "2",
  "q1-3": "3",
  "q1-4": "4",
  "q1-5": "5",
  "q2-1": "false",
  "q2-2": "true",
  "q2-3": "false",
  "q2-4": "false",
  "q2-5": "true",
};

const fifthReadingAnswers = {
  "q1-1": "true",
  "q1-2": "false",
  "q1-3": "false",
  "q1-4": "true",
  "q1-5": "false",
  "q2-1": "1",
  "q2-2": "2",
  "q2-3": "3",
  "q2-4": "4",
  "q2-5": "5",
};

const sixthReadingAnswers = {
  "q1-1": "1",
  "q1-2": "2",
  "q1-3": "3",
  "q1-4": "4",
  "q1-5": "5",
  "q2-1": "false",
  "q2-2": "true",
  "q2-3": "false",
  "q2-4": "true",
  "q2-5": "false",
  "q3-1": "EMOTIONAL SYMPTOMS",
  "q3-2": "COGNITIVE-BEHAVIORAL THERAPY",
  "q3-3": "PARENTAL DIVORCE",
  "q3-4": "HEALTHY HABITS",
};

const seventhReadingAnswers = {
  "q1-1": "false",
  "q1-2": "true",
  "q1-3": "false",
  "q1-4": "true",
  "q1-5": "false",
  "q1-6": "true",
  "q1-7": "false",
  "q1-8": "true",
  "q1-9": "false",
  "q1-10": "true",
  "q2-1": "B",
  "q2-2": "A",
  "q2-3": "C",
  "q2-4": "D",
  "q2-5": "E",
};

const answerKeysByReading = {
  1: firstReadingAnswers,
  2: secondReadingAnswers,
  3: thirdReadingAnswers,
  4: fourthReadingAnswers,
  5: fifthReadingAnswers,
  6: sixthReadingAnswers,
  7: seventhReadingAnswers,
};

/**
 * Get the answer key map for a reading (for grading).
 * @param {string|number} readingId
 * @returns {Object|null}
 */
function getAnswerKeyForReading(readingId) {
  const key = Number(readingId);
  return answerKeysByReading[key] || null;
}

/**
 * Get a flat list of correct values for a reading (for answer-similarity detector).
 * Values are normalized to strings, lowercase for comparison.
 * @param {string|number} readingId
 * @returns {string[]}
 */
function getCorrectValuesForReading(readingId) {
  const keyMap = getAnswerKeyForReading(readingId);
  if (!keyMap) return [];
  const values = new Set();
  for (const val of Object.values(keyMap)) {
    const s = String(val).trim().toLowerCase();
    if (s) values.add(s);
  }
  return Array.from(values);
}

module.exports = {
  getAnswerKeyForReading,
  getCorrectValuesForReading,
  firstReadingAnswers,
  secondReadingAnswers,
  thirdReadingAnswers,
  fourthReadingAnswers,
  fifthReadingAnswers,
  sixthReadingAnswers,
  seventhReadingAnswers,
  answerKeysByReading,
};
