export const categoris = [
  {
    id: 1,
    title: "Detail Comprehension",
    subtitle: "To'liq o'qib tushunish...",
    materials: 0,
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
    materials: 0,
  },
  {
    id: 4,
    title: "Synthesis",
    subtitle: "Turli ma'lumotlarni birlashtirib, yangi xulosalar chiqarish...",
    materials: 0,
  },
  {
    id: 5,
    title: "Vocabulary",
    subtitle: "Kelgan so'zlar bilan tanishish...",
    materials: 0,
  },
];
export const generateCategories = (data) => {
  return data.map((item, index) => ({
    ...categoris[index],
    materials: item,
  }));
};
