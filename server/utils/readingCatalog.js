// Single source of truth (server-side) for mapping reading IDs to human-friendly names.
// Keep in sync with `client/src/utils/lessons.js`.

// Category titles are defined in `client/src/utils/generateCategories.js`
const categoryTitles = {
  1: "Detail Comprehension",
  2: "Main Idea Identification",
  3: "Sequencing",
  4: "Synthesis",
  5: "Vocabulary",
};

// Only readings that currently exist in the app (IDs 1..7).
// If you add new readings in `client/src/utils/lessons.js`, add them here too.
const readingCatalog = {
  1: {
    readingId: 1,
    readingTitle: "The Five Stages of Grief",
    lessonId: 1,
    lessonTitle: "Lesson 1",
    categoryId: 1,
    categoryTitle: categoryTitles[1],
  },
  2: {
    readingId: 2,
    readingTitle: "Conversation – Bargaining Stage",
    lessonId: 1,
    lessonTitle: "Lesson 1",
    categoryId: 3,
    categoryTitle: categoryTitles[3],
  },
  3: {
    readingId: 3,
    readingTitle: "5 types of difficult coworkers ",
    lessonId: 2,
    lessonTitle: "Lesson 2",
    categoryId: 1,
    categoryTitle: categoryTitles[1],
  },
  4: {
    readingId: 4,
    readingTitle: "Behaviour Analysis in Health, Sport and Fitness",
    lessonId: 3,
    lessonTitle: "Lesson 3",
    categoryId: 1,
    categoryTitle: categoryTitles[1],
  },
  5: {
    readingId: 5,
    readingTitle: "Decrease Stress, Improve Your Energy",
    lessonId: 4,
    lessonTitle: "Lesson 4",
    categoryId: 1,
    categoryTitle: categoryTitles[1],
  },
  6: {
    readingId: 6,
    readingTitle: "Depression in Children",
    lessonId: 5,
    lessonTitle: "Lesson 5",
    categoryId: 1,
    categoryTitle: categoryTitles[1],
  },
  7: {
    readingId: 7,
    readingTitle: "Childhood Stress: How Parents Can Help",
    lessonId: 6,
    lessonTitle: "Lesson 6",
    categoryId: 1,
    categoryTitle: categoryTitles[1],
  },
};

function getReadingMeta(readingId) {
  const key = Number(readingId);
  return readingCatalog[key] || null;
}

module.exports = { getReadingMeta, readingCatalog, categoryTitles };

