// =============================================================================
// seed.js  —  Populate the database with realistic fake student data
// Usage:   node seed.js
// =============================================================================
"use strict";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const MONGO_URI = "mongodb://localhost:27017/espreading"; // ← paste your MongoDB connection string here
const XLSX_PATH = "C:/Users/Dragon/Downloads/uzbek_clean_names_1000.xlsx";
const XLSX_LIB = "C:/nvm4w/nodejs/node_modules/xlsx";

// ── Dependencies ──────────────────────────────────────────────────────────────
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const xlsx = require(XLSX_LIB);

// ── Models ────────────────────────────────────────────────────────────────────
const User = require("./models/User");
const Reading = require("./models/Reading");
const ReadingStrategy = require("./models/ReadingStrategy");
const AIConversation = require("./models/AIConversation");
const AIMessage = require("./models/AIMessage");

// ── Static data ───────────────────────────────────────────────────────────────
const UNIVERSITIES = [
  "Navoiy Davlat Universiteti",
  "Qarshi Davlat Universiteti",
  "Guliston Davlat Universiteti",
];

const READINGS_META = [
  {
    id: "1",
    lesson: 1,
    lessonTitle: "Lesson 1",
    category: 1,
    categoryTitle: "Detail Comprehension",
    readingTitle: "The Five Stages of Grief",
    maxScore: 5,
  },
  {
    id: "2",
    lesson: 1,
    lessonTitle: "Lesson 1",
    category: 3,
    categoryTitle: "Sequencing",
    readingTitle: "Conversation – Bargaining Stage",
    maxScore: 7,
  },
  {
    id: "3",
    lesson: 2,
    lessonTitle: "Lesson 2",
    category: 1,
    categoryTitle: "Detail Comprehension",
    readingTitle: "5 types of difficult coworkers",
    maxScore: 10,
  },
  {
    id: "4",
    lesson: 3,
    lessonTitle: "Lesson 3",
    category: 1,
    categoryTitle: "Detail Comprehension",
    readingTitle: "Behaviour Analysis in Health, Sport and Fitness",
    maxScore: 10,
  },
  {
    id: "5",
    lesson: 4,
    lessonTitle: "Lesson 4",
    category: 1,
    categoryTitle: "Detail Comprehension",
    readingTitle: "Decrease Stress, Improve Your Energy",
    maxScore: 10,
  },
  {
    id: "6",
    lesson: 5,
    lessonTitle: "Lesson 5",
    category: 1,
    categoryTitle: "Detail Comprehension",
    readingTitle: "Depression in Children",
    maxScore: 14,
  },
  {
    id: "7",
    lesson: 6,
    lessonTitle: "Lesson 6",
    category: 1,
    categoryTitle: "Detail Comprehension",
    readingTitle: "Childhood Stress: How Parents Can Help",
    maxScore: 15,
  },
];

const GLOB_QUESTIONS = [1, 3, 4, 6, 8, 12, 15, 17, 20, 21, 23, 24, 27];
const PROB_QUESTIONS = [7, 9, 11, 14, 16, 19, 25, 28];
const SUP_QUESTIONS = [2, 5, 10, 13, 18, 22, 26, 29, 30];

// =============================================================================
// Utility helpers
// =============================================================================
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rnd(0, arr.length - 1)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const flipCoin = (p) => Math.random() < p;

// =============================================================================
// Answer generation per reading
// =============================================================================

// ── Reading 1: match 5 people → grief stage (1–5) ────────────────────────────
const R1_CORRECT = {
  emma: "1",
  carlos: "2",
  fatima: "3",
  liam: "4",
  sofia: "5",
};

function genReading1(accuracy) {
  const STAGES = ["1", "2", "3", "4", "5"];
  const ans = { ...R1_CORRECT };
  let score = 5;
  for (const key of Object.keys(ans)) {
    if (!flipCoin(accuracy)) {
      ans[key] = pick(STAGES.filter((v) => v !== R1_CORRECT[key]));
      score--;
    }
  }
  return { answers: ans, score: Math.max(0, score) };
}

// ── Reading 2: drag-and-drop sequencing positions 0–6 → values 1–7 ───────────
const R2_CORRECT = { 0: 2, 1: 3, 2: 5, 3: 6, 4: 7, 5: 1, 6: 4 };

function genReading2(accuracy) {
  const POS = [1, 2, 3, 4, 5, 6, 7];
  const ans = { ...R2_CORRECT };
  let score = 7;
  for (let i = 0; i < 7; i++) {
    if (!flipCoin(accuracy)) {
      ans[i] = pick(POS.filter((v) => v !== R2_CORRECT[i]));
      score--;
    }
  }
  return { answers: ans, score: Math.max(0, score) };
}

// ── Reading 3: T/F ×5 + fill-in ×5 ──────────────────────────────────────────
const R3_CORRECT = {
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
const R3_FILL_WRONG = [
  "SLOTH",
  "HOTSHOT",
  "SPOTLIGHT HOG",
  "GOSSIP",
  "CALM",
  "BELLYACHER",
  "NEGATIVITY",
];

function genReading3(accuracy) {
  const ans = {};
  let score = 0;
  for (let i = 1; i <= 5; i++) {
    const k = `q1-${i}`;
    if (flipCoin(accuracy)) {
      ans[k] = R3_CORRECT[k];
      score++;
    } else {
      ans[k] = !R3_CORRECT[k];
    }
  }
  for (let i = 1; i <= 5; i++) {
    const k = `q2-${i}`;
    if (flipCoin(accuracy)) {
      ans[k] = R3_CORRECT[k];
      score++;
    } else {
      ans[k] = pick(R3_FILL_WRONG.filter((v) => v !== R3_CORRECT[k]));
    }
  }
  return { answers: ans, score };
}

// ── Reading 4: vocab match (1–5) + T/F strings ───────────────────────────────
const R4_CORRECT = {
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
const NUM5 = ["1", "2", "3", "4", "5"];

function genReading4(accuracy) {
  const ans = {};
  let score = 0;
  for (let i = 1; i <= 5; i++) {
    const k = `q1-${i}`;
    if (flipCoin(accuracy)) {
      ans[k] = R4_CORRECT[k];
      score++;
    } else {
      ans[k] = pick(NUM5.filter((v) => v !== R4_CORRECT[k]));
    }
  }
  for (let i = 1; i <= 5; i++) {
    const k = `q2-${i}`;
    if (flipCoin(accuracy)) {
      ans[k] = R4_CORRECT[k];
      score++;
    } else {
      ans[k] = R4_CORRECT[k] === "true" ? "false" : "true";
    }
  }
  return { answers: ans, score };
}

// ── Reading 5: T/F strings + strategy match (1–5) ────────────────────────────
const R5_CORRECT = {
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

function genReading5(accuracy) {
  const ans = {};
  let score = 0;
  for (let i = 1; i <= 5; i++) {
    const k = `q1-${i}`;
    if (flipCoin(accuracy)) {
      ans[k] = R5_CORRECT[k];
      score++;
    } else {
      ans[k] = R5_CORRECT[k] === "true" ? "false" : "true";
    }
  }
  for (let i = 1; i <= 5; i++) {
    const k = `q2-${i}`;
    if (flipCoin(accuracy)) {
      ans[k] = R5_CORRECT[k];
      score++;
    } else {
      ans[k] = pick(NUM5.filter((v) => v !== R5_CORRECT[k]));
    }
  }
  return { answers: ans, score };
}

// ── Reading 6: vocab (1–5) + T/F strings + fill-in ×4 ────────────────────────
const R6_CORRECT = {
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
const R6_FILL_WRONG = [
  "PHYSICAL SYMPTOMS",
  "MEDICATION",
  "FAMILY CONFLICT",
  "SOCIAL SKILLS",
  "EMOTIONAL SYMPTOMS",
  "COGNITIVE-BEHAVIORAL THERAPY",
  "PARENTAL DIVORCE",
  "HEALTHY HABITS",
];

function genReading6(accuracy) {
  const ans = {};
  let score = 0;
  for (let i = 1; i <= 5; i++) {
    const k = `q1-${i}`;
    if (flipCoin(accuracy)) {
      ans[k] = R6_CORRECT[k];
      score++;
    } else {
      ans[k] = pick(NUM5.filter((v) => v !== R6_CORRECT[k]));
    }
  }
  for (let i = 1; i <= 5; i++) {
    const k = `q2-${i}`;
    if (flipCoin(accuracy)) {
      ans[k] = R6_CORRECT[k];
      score++;
    } else {
      ans[k] = R6_CORRECT[k] === "true" ? "false" : "true";
    }
  }
  for (let i = 1; i <= 4; i++) {
    const k = `q3-${i}`;
    if (flipCoin(accuracy)) {
      ans[k] = R6_CORRECT[k];
      score++;
    } else {
      ans[k] = pick(R6_FILL_WRONG.filter((v) => v !== R6_CORRECT[k]));
    }
  }
  return { answers: ans, score };
}

// ── Reading 7: T/F strings ×10 + heading match (A–E) ×5 ─────────────────────
const R7_CORRECT = {
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
const HEADINGS = ["A", "B", "C", "D", "E"];

function genReading7(accuracy) {
  const ans = {};
  let score = 0;
  for (let i = 1; i <= 10; i++) {
    const k = `q1-${i}`;
    if (flipCoin(accuracy)) {
      ans[k] = R7_CORRECT[k];
      score++;
    } else {
      ans[k] = R7_CORRECT[k] === "true" ? "false" : "true";
    }
  }
  for (let i = 1; i <= 5; i++) {
    const k = `q2-${i}`;
    if (flipCoin(accuracy)) {
      ans[k] = R7_CORRECT[k];
      score++;
    } else {
      ans[k] = pick(HEADINGS.filter((v) => v !== R7_CORRECT[k]));
    }
  }
  return { answers: ans, score };
}

const GEN_FNS = {
  1: genReading1,
  2: genReading2,
  3: genReading3,
  4: genReading4,
  5: genReading5,
  6: genReading6,
  7: genReading7,
};
function generateAnswers(readingId, accuracy) {
  const fn = GEN_FNS[Number(readingId)];
  return fn ? fn(accuracy) : { answers: {}, score: 0 };
}

// =============================================================================
// Questionnaire generation
// =============================================================================

function calcQuestionnaireScores(answersObj) {
  const get = (q) => answersObj[q.toString()] || 0;
  const globScore = GLOB_QUESTIONS.reduce((s, q) => s + get(q), 0);
  const probScore = PROB_QUESTIONS.reduce((s, q) => s + get(q), 0);
  const supScore = SUP_QUESTIONS.reduce((s, q) => s + get(q), 0);
  const globAverage = globScore / GLOB_QUESTIONS.length;
  const probAverage = probScore / PROB_QUESTIONS.length;
  const supAverage = supScore / SUP_QUESTIONS.length;
  const overallAverage = (globScore + probScore + supScore) / 30;
  const level = (avg) => (avg >= 3.5 ? "High" : avg >= 2.5 ? "Medium" : "Low");
  return {
    globScore,
    globAverage,
    probScore,
    probAverage,
    supScore,
    supAverage,
    overallAverage,
    globLevel: level(globAverage),
    probLevel: level(probAverage),
    supLevel: level(supAverage),
  };
}

// profile: 'high' (mostly 4–5), 'medium' (2–5), 'low' (1–3)
function buildQuestionnaire(userId, type, profile) {
  const answersObj = {};
  const answersMap = new Map();
  for (let i = 1; i <= 30; i++) {
    const val =
      profile === "high"
        ? rnd(3, 5)
        : profile === "low"
          ? rnd(1, 3)
          : rnd(2, 5);
    answersObj[String(i)] = val;
    answersMap.set(String(i), val);
  }
  const scores = calcQuestionnaireScores(answersObj);
  return { user: userId, type, answers: answersMap, ...scores };
}

// =============================================================================
// AI conversation templates (realistic exchanges per reading)
// =============================================================================

const AI_TEMPLATES = {
  1: [
    {
      user: "What does 'denial' mean in the context of grief?",
      assistant:
        "Denial is the first stage of grief, where a person refuses to accept the reality of a loss. It acts as a temporary defense mechanism that helps buffer the initial shock — for example, someone might keep expecting a deceased loved one to walk through the door, or insist that a diagnosis must be wrong.",
    },
    {
      user: "Can you give me a hint for question 2?",
      assistant:
        "Think about Carlos's situation — he's expressing strong frustration and directing blame at others. Which grief stage is characterized by frustration, irritability, and strong outward emotions?",
    },
    {
      user: "What is the difference between depression and acceptance in grief?",
      assistant:
        "Depression (stage 4) involves deep sadness, withdrawal, and feelings of hopelessness — a natural response to the magnitude of the loss. Acceptance (stage 5) doesn't mean you're 'okay' with the loss, but rather that you've acknowledged reality and begun to find a way forward. In acceptance, people start reinvesting emotional energy into life again.",
    },
    {
      user: "Why does Sofia represent acceptance?",
      assistant:
        "Sofia represents acceptance because her response shows that she has come to terms with her loss and is beginning to move forward with her life. She is no longer fighting the reality of the situation. Remember, acceptance doesn't mean happiness — it means acknowledging the loss and choosing to continue living.",
    },
  ],
  2: [
    {
      user: "I don't understand the sequencing task. How does it work?",
      assistant:
        "In this task you need to drag and drop the dialogue lines into the correct order to reconstruct the conversation. Read all lines first, then look for logical connectors like 'But...', 'What if...', and 'I see' — as well as the natural emotional flow of the conversation to determine the right sequence.",
    },
    {
      user: "What does 'bargaining' mean exactly?",
      assistant:
        "Bargaining is the third stage of grief. It involves making deals — often with God, fate, or oneself — in hopes of reversing or avoiding the loss. Common signs include 'what if' and 'if only' thoughts, like 'What if I had noticed sooner?' or 'If only I try a different treatment.' It's a way of trying to regain control in a helpless situation.",
    },
    {
      user: "What comes after bargaining in the conversation?",
      assistant:
        "After the client expresses their bargaining thoughts, the psychologist typically responds with empathy and gently guides them toward acknowledging the difficult reality. Look for a line where the psychologist validates the client's feelings while also nudging them forward — that's the natural next step in the dialogue.",
    },
  ],
  3: [
    {
      user: "What is a 'spotlight hog' exactly?",
      assistant:
        "A spotlight hog is a coworker who constantly tries to take center stage — claiming credit for team successes, interrupting others, or dominating conversations and meetings. They can make colleagues feel invisible and undervalued.",
    },
    {
      user: "Can you help me understand question about the 'bellyacher'?",
      assistant:
        "A bellyacher is someone who constantly complains — about workload, management, or any aspect of the job — without taking constructive action. The key strategy for dealing with them is to stay calm and avoid getting drawn into the negativity cycle. Try redirecting conversations toward solutions.",
    },
    {
      user: "What's the difference between a 'sloth' and a 'hotshot'?",
      assistant:
        "A sloth avoids doing their fair share of work, leaving others to pick up the slack. A hotshot is overconfident and dismissive of others' ideas — they think they know best and may undermine teamwork. Both are challenging but in opposite ways: the sloth by underperforming, the hotshot by overestimating themselves.",
    },
    {
      user: "What word goes in the blank about the person who takes all the attention?",
      assistant:
        "Think about which type of difficult coworker is defined by constantly seeking attention and recognition. The term has two words and relates to someone who always wants to be in the spotlight on stage. Look back at the section describing coworkers who claim credit for others' work.",
    },
  ],
  4: [
    {
      user: "What does 'positive reinforcement' mean in behaviour analysis?",
      assistant:
        "Positive reinforcement is a strategy where a desirable behavior is followed by a rewarding consequence, making it more likely to be repeated. For example, praising an athlete immediately after a good performance, or rewarding yourself with a rest day after a tough workout — both are positive reinforcement.",
    },
    {
      user: "Can you explain 'behaviour substitution'?",
      assistant:
        "Behaviour substitution means replacing an unwanted behaviour with a healthier alternative that meets the same underlying need. For instance, if stress triggers smoking, someone might substitute that with a short walk or breathing exercise. The key is finding a replacement that satisfies the same trigger but is incompatible with the harmful behavior.",
    },
    {
      user: "What is the difference between intrinsic and extrinsic motivation?",
      assistant:
        "Intrinsic motivation comes from within — you engage in an activity because it is inherently enjoyable or satisfying (e.g., exercising because you love how it makes you feel). Extrinsic motivation comes from external rewards or pressures (e.g., exercising to win a prize or avoid criticism). The text suggests intrinsic motivation tends to be more sustainable long-term.",
    },
  ],
  5: [
    {
      user: "What does 'prioritize sleep' actually mean for stress management?",
      assistant:
        "Prioritizing sleep means treating it as a non-negotiable health activity rather than something you sacrifice for work or entertainment. This includes maintaining a consistent sleep schedule, creating a calming bedtime routine, and aiming for 7–9 hours per night. Quality sleep helps your brain process stress hormones and restore emotional balance.",
    },
    {
      user: "I'm confused about one of the true/false questions — can you give me a hint?",
      assistant:
        "Read the statement carefully and compare it to what the text says about that specific strategy. The text is quite precise about the benefits of each approach — if the statement adds a claim or exaggerates the benefit, it is likely false. Re-read the relevant paragraph before answering.",
    },
    {
      user: "How does exercise reduce stress?",
      assistant:
        "Exercise triggers the release of endorphins — your brain's natural mood elevators — which create a positive feeling. It also reduces levels of adrenaline and cortisol (stress hormones), improves sleep quality, and builds a sense of accomplishment. Even a 20-minute walk can significantly reduce anxiety and tension.",
    },
    {
      user: "What strategy matches benefit number 3?",
      assistant:
        "Think about which strategy is most directly linked to restoring your body's energy reserves and improving mental clarity during the day. The benefit described is about giving your mind and body time to repair. Which of the five strategies involves stepping away from activity to allow recovery?",
    },
  ],
  6: [
    {
      user: "What does 'persistent' mean in the context of childhood depression?",
      assistant:
        "In the context of childhood depression, 'persistent' means that the sadness or low mood lasts for an extended period — typically more than two weeks — and is not a passing response to a specific event. This persistence is a key feature that distinguishes clinical depression from normal emotional fluctuations in children.",
    },
    {
      user: "What is cognitive-behavioral therapy?",
      assistant:
        "Cognitive-behavioral therapy (CBT) is a structured, evidence-based form of psychotherapy that helps people identify and change negative thought patterns. In children with depression, CBT teaches them to recognize distorted thinking like 'I'm worthless' or 'nothing will get better,' challenge those thoughts, and replace them with more balanced perspectives.",
    },
    {
      user: "Can you give me a hint for the fill-in-the-blank questions?",
      assistant:
        "For the fill-in questions, focus on key terms from the text. Think about: (1) what category do feelings like sadness and crying fall under? (2) what specific therapy is named as an effective treatment? (3) what life event is listed as a common trigger? (4) what lifestyle approach is recommended as a protective factor?",
    },
    {
      user: "What does 'withdrawal' mean?",
      assistant:
        "In the context of depression in children, 'withdrawal' refers to the tendency to pull away from social interactions, activities, and relationships that the child previously enjoyed. A child experiencing withdrawal might stop spending time with friends, lose interest in hobbies, or become unusually quiet and isolated.",
    },
  ],
  7: [
    {
      user: "What does paragraph B talk about?",
      assistant:
        "Paragraph B focuses on the impact of chronic stress on children's development — specifically how prolonged stress affects their physical health, emotional regulation, and academic performance. It explains why early intervention is important before stress becomes a long-term pattern.",
    },
    {
      user: "I'm struggling with the true/false questions — can you give a hint?",
      assistant:
        "For each statement, go back to the specific paragraph in the text that addresses that topic. Check whether the statement accurately reflects what the text says, exaggerates it, or contradicts it. Paying close attention to absolute words like 'always', 'never', or 'all' can help — the text is often more nuanced.",
    },
    {
      user: "What is the main message of this reading?",
      assistant:
        "The main message is that parents play a critical role in helping children manage stress. Key strategies include open communication, maintaining predictable routines, modeling healthy coping behaviors, and recognizing warning signs that indicate professional help may be needed. The text emphasizes that with the right support, children can develop resilience.",
    },
    {
      user: "Which heading matches paragraph D?",
      assistant:
        "Paragraph D focuses on practical strategies that parents can teach their children to actively cope with stressful situations. Think about which heading describes teaching or equipping children with tools to handle stress — rather than just providing emotional support or discussing the causes of stress.",
    },
  ],
};

// =============================================================================
// User distribution helpers
// =============================================================================

function pickAccuracy() {
  const r = Math.random();
  if (r < 0.2) return rnd(0, 50) / 100; // 20% low scorers
  if (r < 0.65) return rnd(50, 80) / 100; // 45% medium scorers
  return rnd(80, 100) / 100; // 35% high scorers
}

function pickReadingCount() {
  // More students at lower progress (realistic drop-off per lesson)
  const r = Math.random();
  if (r < 0.08) return 1;
  if (r < 0.2) return 2;
  if (r < 0.38) return 3;
  if (r < 0.55) return 4;
  if (r < 0.7) return 5;
  if (r < 0.85) return 6;
  return 7;
}

function pickProfile() {
  const r = Math.random();
  if (r < 0.2) return "low";
  if (r < 0.65) return "medium";
  return "high";
}

function toEmail(firstName, lastName, suffix = "") {
  const clean = (s) =>
    s
      .toLowerCase()
      .replace(/[''`]/g, "")
      .replace(/[^a-z0-9]/g, ".");
  return `${clean(firstName)}.${clean(lastName)}${suffix}@student.uz`;
}

// =============================================================================
// Main seed function
// =============================================================================

async function seed() {
  if (!MONGO_URI) {
    console.error(
      "❌  MONGO_URI is empty. Fill it in at the top of seed.js and re-run.",
    );
    process.exit(1);
  }

  console.log("⏳  Connecting to MongoDB…");
  await mongoose.connect(MONGO_URI);
  console.log("✅  Connected\n");

  // ── Load names ──────────────────────────────────────────────────────────────
  const wb = xlsx.readFile(XLSX_PATH);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(ws, { header: 1 }).slice(1); // skip header row
  console.log(`📋  Loaded ${rows.length} names from xlsx`);

  // ── Pre-hash password (insertMany bypasses the pre-save hook) ───────────────
  console.log("🔐  Hashing password…");
  const passwordHash = await bcrypt.hash("Student123!", 10);

  // ── Build user documents with unique emails ──────────────────────────────────
  const emailSeen = {};
  const userDocs = rows.map(([firstName, lastName]) => {
    const base = toEmail(firstName, lastName);
    emailSeen[base] = (emailSeen[base] || 0) + 1;
    const email =
      emailSeen[base] > 1
        ? toEmail(firstName, lastName, emailSeen[base])
        : base;
    return {
      fullName: `${firstName} ${lastName}`,
      email,
      password: passwordHash,
      role: "student",
      university: UNIVERSITIES[rnd(0, 2)],
    };
  });

  // ── Insert users (ordered:false so duplicates don't abort the batch) ─────────
  console.log("👤  Inserting users…");
  try {
    await User.insertMany(userDocs, { ordered: false });
  } catch (e) {
    if (e.code !== 11000 && !e.message?.includes("E11000")) throw e;
    // some duplicates — that's fine, continue
  }

  const allUsers = await User.find({ role: "student" }).select("_id").lean();
  console.log(`✅  Total students in DB: ${allUsers.length}\n`);

  // ── Seed related data for each user ─────────────────────────────────────────
  let totalReadings = 0,
    totalQuestionnaires = 0,
    totalConvs = 0,
    totalMsgs = 0;

  for (let i = 0; i < allUsers.length; i++) {
    const userId = allUsers[i]._id;
    const accuracy = pickAccuracy();
    const numReadings = pickReadingCount();
    const profile = pickProfile();

    // Sequential readings 1..N (students go in order)
    const completedReadings = READINGS_META.slice(0, numReadings);

    // ── Readings ──────────────────────────────────────────────────────────────
    // Spread completedAt dates over the past 60 days, sequential per reading
    const courseStartOffset = rnd(5, 60); // days ago the student started
    const readingDocs = completedReadings.map((meta, idx) => {
      const { answers, score } = generateAnswers(meta.id, accuracy);
      const daysAgo = Math.max(1, courseStartOffset - idx * rnd(1, 4));
      return {
        user: userId,
        reading: meta.id,
        lesson: meta.lesson,
        lessonTitle: meta.lessonTitle,
        category: meta.category,
        categoryTitle: meta.categoryTitle,
        readingTitle: meta.readingTitle,
        time: rnd(90 + meta.id * 20, 300 + meta.id * 50),
        answers,
        score,
        completed: true,
        completedAt: new Date(Date.now() - daysAgo * 86400000),
      };
    });

    try {
      await Reading.insertMany(readingDocs, { ordered: false });
      totalReadings += readingDocs.length;
    } catch (e) {
      /* skip duplicates */
    }

    // ── Pre-questionnaire (85% of users) ──────────────────────────────────────
    if (flipCoin(0.85)) {
      try {
        await ReadingStrategy.create(
          buildQuestionnaire(userId, "pre", profile),
        );
        totalQuestionnaires++;
      } catch (e) {
        /* skip duplicate */
      }
    }

    // ── Post-questionnaire (65% of users who completed all 7 readings) ─────────
    if (numReadings === 7 && flipCoin(0.65)) {
      // Learning effect: post profile is one step higher than pre
      const postProfile = profile === "low" ? "medium" : "high";
      try {
        await ReadingStrategy.create(
          buildQuestionnaire(userId, "post", postProfile),
        );
        totalQuestionnaires++;
      } catch (e) {
        /* skip duplicate */
      }
    }

    // ── AI conversations (35% of users) ───────────────────────────────────────
    if (flipCoin(0.35) && completedReadings.length > 0) {
      const numConvs = rnd(1, Math.min(3, completedReadings.length));
      const readingsForConvs = shuffle(completedReadings).slice(0, numConvs);

      for (const meta of readingsForConvs) {
        const templates = AI_TEMPLATES[meta.id];
        if (!templates || templates.length === 0) continue;

        const startedAt = new Date(Date.now() - rnd(1, 30) * 86400000);
        const lastMessageAt = new Date(
          startedAt.getTime() + rnd(3, 20) * 60000,
        );

        try {
          const conv = await AIConversation.create({
            user: userId,
            readingId: meta.id,
            status: flipCoin(0.3) ? "active" : "closed",
            mode: pick(["vocab", "hint", "explain_task"]),
            startedAt,
            lastMessageAt,
            routing: "normal",
            analyticsTags: [],
          });
          totalConvs++;

          const numPairs = rnd(1, Math.min(templates.length, 3));
          const pairs = shuffle(templates).slice(0, numPairs);
          const msgDocs = [];
          let msgTime = startedAt.getTime();

          for (const t of pairs) {
            msgTime += rnd(15, 90) * 1000;
            msgDocs.push({
              conversationId: conv._id,
              role: "user",
              content: t.user,
              createdAt: new Date(msgTime),
            });
            msgTime += rnd(2, 8) * 1000;
            msgDocs.push({
              conversationId: conv._id,
              role: "assistant",
              content: t.assistant,
              createdAt: new Date(msgTime),
              tokens: rnd(80, 280),
              latencyMs: rnd(700, 3200),
            });
          }

          await AIMessage.insertMany(msgDocs, { ordered: false });
          totalMsgs += msgDocs.length;
        } catch (e) {
          /* skip */
        }
      }
    }

    if ((i + 1) % 100 === 0) {
      console.log(`  … processed ${i + 1} / ${allUsers.length} users`);
    }
  }

  console.log("\n🎉  Seed complete!");
  console.log(`   Students:        ${allUsers.length}`);
  console.log(`   Readings:        ${totalReadings}`);
  console.log(`   Questionnaires:  ${totalQuestionnaires}`);
  console.log(`   AI Convs:        ${totalConvs}`);
  console.log(`   AI Messages:     ${totalMsgs}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  console.error(err.stack);
  process.exit(1);
});
