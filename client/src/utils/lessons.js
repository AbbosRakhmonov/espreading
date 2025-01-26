import { lazy } from "react";

const LessonFirstReading = lazy(() =>
  import("../pages/Lessons/First/Readings/First")
);
const LessonFirstSequencing = lazy(() =>
  import("../pages/Lessons/First/Readings/Sequencing")
);

const defaultCategories = [
  {
    id: 1,
    title: "Detail Comprehension",
    subtitle: "To'liq o'qib tushunish...",
    materials: 0,
    readings: [],
  },
  {
    id: 2,
    title: "Main Idea Identification",
    subtitle: "Asosiy G'oyani Aniqlash...",
    materials: 0,
    readings: [],
  },
  {
    id: 3,
    title: "Sequencing",
    subtitle: "G'oyalar ketma-ketligini Aniqlash...",
    materials: 0,
    readings: [],
  },
  {
    id: 4,
    title: "Synthesis",
    subtitle: "Turli ma'lumotlarni birlashtirib, yangi xulosalar chiqarish...",
    materials: 0,
    readings: [],
  },
  {
    id: 5,
    title: "Vocabulary",
    subtitle: "Kelgan so'zlar bilan tanishish...",
    materials: 0,
    readings: [],
  },
];

const generateReadings = (categories) => {
  return defaultCategories.map((category) => {
    const categoryData = categories.find((c) => c.id === category.id);
    if (categoryData) {
      return {
        ...category,
        ...categoryData,
        materials: categoryData.readings.length,
      };
    }
    return category;
  });
};

export const lessons = [
  {
    id: 1,
    title: "Lesson 1",
    subtitle: "Stages of Grief",
    categories: generateReadings([
      {
        id: 1,
        readings: [
          {
            id: 1,
            title: "The Five Stages of Grief",
            questions: 5,
            reading: LessonFirstReading,
          },
        ],
      },
      {
        id: 3,
        readings: [
          {
            id: 2,
            title: "Conversation – Bargaining Stage",
            questions: 7,
            reading: LessonFirstSequencing,
          },
        ],
      },
    ]),
    image: "/lessons/l1.webp",
  },
  {
    id: 2,
    title: "Lesson 2",
    subtitle: "How to Deal with Difficult Coworkers",
    categories: generateReadings([]),
    image: "/lessons/l2.webp",
  },
  {
    id: 3,
    title: "Lesson 3",
    subtitle: "Behaviour Analysis in Health, Sport and Fitness",
    categories: generateReadings([]),
    image: "/lessons/l3.webp",
  },
  {
    id: 4,
    title: "Lesson 4",
    subtitle: "Decrease Stress, Improve Your Energy",
    categories: generateReadings([]),
    image:
      "https://plus.unsplash.com/premium_vector-1715828581487-55726017c80d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    title: "Lesson 5",
    subtitle: "Depression in Children",
    categories: generateReadings([]),
    image:
      "https://plus.unsplash.com/premium_vector-1727765434993-3f09ee6daa9c?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    title: "Lesson 6",
    subtitle: "Childhood Stress: How Parents Can Help",
    categories: generateReadings([]),
    image:
      "https://plus.unsplash.com/premium_vector-1737365840329-deff9d1e62d6?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    title: "Lesson 7",
    subtitle: "Stress Management: Techniques to Deal with Stress",
    categories: generateReadings([]),
    image:
      "https://plus.unsplash.com/premium_vector-1729536712506-15f2801bede6?q=80&w=2650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
