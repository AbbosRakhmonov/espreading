import { lazy } from "react";

const LessonFirstReading = lazy(() =>
  import("../pages/Lessons/First/Readings/First")
);
const LessonFirstSequencing = lazy(() =>
  import("../pages/Lessons/First/Readings/Sequencing")
);
const LessonSecondComprehensionFirst = lazy(() =>
  import("../pages/Lessons/Second/Comprehension/First")
);
const LessonThirdComprehensionFirst = lazy(() =>
  import("../pages/Lessons/Third/Comprehension/First")
);
const LessonFourthComprehensionFirst = lazy(() =>
  import("../pages/Lessons/Fourth/Comprehension/First")
);
const LessonFifthComprehensionFirst = lazy(() =>
  import("../pages/Lessons/Fifth/Comprehension/First")
);
const LessonSixthComprehensionFirst = lazy(() =>
  import("../pages/Lessons/Sixth/Comprehension/First")
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
    categories: generateReadings([
      {
        id: 1,
        readings: [
          {
            id: 3,
            title: "5 types of difficult coworkers ",
            questions: 10,
            reading: LessonSecondComprehensionFirst,
          },
        ],
      },
    ]),
    image: "/lessons/l2.webp",
  },
  {
    id: 3,
    title: "Lesson 3",
    subtitle: "Behaviour Analysis in Health, Sport and Fitness",
    categories: generateReadings([
      {
        id: 1,
        readings: [
          {
            id: 4,
            title: "Behaviour Analysis in Health, Sport and Fitness",
            questions: 10,
            reading: LessonThirdComprehensionFirst,
          },
        ],
      },
    ]),
    image: "/lessons/l3.webp",
  },
  {
    id: 4,
    title: "Lesson 4",
    subtitle: "Decrease Stress, Improve Your Energy",
    categories: generateReadings([
      {
        id: 1,
        readings: [
          {
            id: 5,
            title: "Decrease Stress, Improve Your Energy",
            questions: 10,
            reading: LessonFourthComprehensionFirst,
          },
        ],
      },
    ]),
    image:
      "https://plus.unsplash.com/premium_vector-1715828581487-55726017c80d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    title: "Lesson 5",
    subtitle: "Depression in Children",
    categories: generateReadings([
      {
        id: 1,
        readings: [
          {
            id: 6,
            title: "Depression in Children",
            questions: 14,
            reading: LessonFifthComprehensionFirst,
          },
        ],
      },
    ]),
    image:
      "https://plus.unsplash.com/premium_vector-1727765434993-3f09ee6daa9c?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    title: "Lesson 6",
    subtitle: "Childhood Stress: How Parents Can Help",
    categories: generateReadings([
      {
        id: 1,
        readings: [
          {
            id: 7,
            title: "Childhood Stress: How Parents Can Help",
            questions: 10,
            reading: LessonSixthComprehensionFirst,
          },
        ],
      },
    ]),
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
  {
    id: 8,
    title: "Lesson 8",
    subtitle:
      "The Science Behind Stress: Understanding Its Effects on Mind and Body",
    categories: generateReadings([]),
    image:
      "https://images.unsplash.com/photo-1721734081214-1be31adce713?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 9,
    title: "Lesson 9",
    subtitle: "The Role of Physical Activity in Stress Reduction",
    categories: generateReadings([]),
    image:
      "https://plus.unsplash.com/premium_photo-1731439886498-d09d6472dfb3?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 10,
    title: "Lesson 10",
    subtitle: "The Impact of Nutrition on Stress Levels",
    categories: generateReadings([]),
    image:
      "https://images.unsplash.com/photo-1534653169071-4f036d137aca?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 11,
    title: "Lesson 11",
    subtitle: "Work-Related Stress: Strategies for a Healthy Work-Life Balance",
    categories: generateReadings([]),
    image:
      "https://images.unsplash.com/photo-1633506407861-bdb8abbb10f4?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 12,
    title: "Lesson 12",
    subtitle: "Long-Term Effects of Chronic Stress and How to Prevent Them",
    categories: generateReadings([]),
    image:
      "https://alisbh.com/wp-content/uploads/2025/01/666047dbe11956dc9a4dba3a_juj.jpg",
  },
];
