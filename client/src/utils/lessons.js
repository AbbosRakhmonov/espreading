import LessonFirstReading from "../pages/Lessons/First/Readings/First";
import LessonFirstSequencing from "../pages/Lessons/First/Readings/Sequencing";

export const lessons = [
  {
    id: 1,
    title: "Lesson 1",
    subtitle: "Grief And Stress",
    categories: [
      {
        id: 1,
        title: "Detail Comprehension",
        subtitle: "To'liq o'qib tushunish...",
        materials: 1,
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
        id: 2,
        title: "Main Idea Identification",
        subtitle: "Asosiy G'oyani Aniqlash...",
        materials: 0,
      },
      {
        id: 3,
        title: "Sequencing",
        subtitle: "G'oyalar ketma-ketligini Aniqlash...",
        materials: 1,
        readings: [
          {
            id: 1,
            title: "Conversation – Bargaining Stage",
            questions: 7,
            reading: LessonFirstSequencing,
          },
        ],
      },
      {
        id: 4,
        title: "Synthesis",
        subtitle:
          "Turli ma'lumotlarni birlashtirib, yangi xulosalar chiqarish...",
        materials: 0,
      },
      {
        id: 5,
        title: "Vocabulary",
        subtitle: "Kelgan so'zlar bilan tanishish...",
        materials: 0,
      },
    ],
  },
];
