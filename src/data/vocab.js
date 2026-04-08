import {
  communicationCards,
  devopsCards,
  homeCards,
  itCards,
  restaurantCards,
} from "./flashcardCollections";
import { phraseCards } from "./phraseDeck";
import { tenseCards } from "./tenseDeck";

export const vocabData = {
  communication: communicationCards,
  it: itCards,
  devops: devopsCards,
  home: homeCards,
  restaurant: restaurantCards,
  phrases: phraseCards,
  tenses: tenseCards,
};

export const categories = [
  {
    key: "communication",
    section: "vocabulary",
    emoji: "💬",
    label: {
      vi: "Giao tiếp hàng ngày",
      en: "Daily communication",
    },
    description: {
      vi: "Những từ sống còn để nói chuyện mỗi ngày.",
      en: "High-frequency words you can use every day.",
    },
  },
  {
    key: "it",
    section: "vocabulary",
    emoji: "💻",
    label: {
      vi: "IT",
      en: "IT",
    },
    description: {
      vi: "Từ vựng cho dev, tài liệu và công việc kỹ thuật.",
      en: "Practical vocabulary for dev work and technical reading.",
    },
  },
  {
    key: "devops",
    section: "vocabulary",
    emoji: "🐳",
    label: {
      vi: "DevOps / System",
      en: "DevOps / System",
    },
    description: {
      vi: "Từ về server, triển khai, giám sát và vận hành.",
      en: "Words for servers, deployment, monitoring, and operations.",
    },
  },
  {
    key: "home",
    section: "vocabulary",
    emoji: "🏠",
    label: {
      vi: "Gia dụng trong nhà",
      en: "Home items",
    },
    description: {
      vi: "Đồ vật trong nhà, rất dễ học bằng hình dung.",
      en: "Everyday household words that are easy to visualize.",
    },
  },
  {
    key: "restaurant",
    section: "vocabulary",
    emoji: "🍜",
    label: {
      vi: "Đi quán ăn",
      en: "Restaurant",
    },
    description: {
      vi: "Từ để gọi món, hỏi giá, thanh toán và ăn uống.",
      en: "Useful words for ordering, paying, and dining out.",
    },
  },
  {
    key: "phrases",
    section: "phrases",
    emoji: "🗣️",
    label: {
      vi: "200 câu giao tiếp",
      en: "200 survival phrases",
    },
    description: {
      vi: "200 câu chắt lọc để mở miệng giao tiếp được ngay.",
      en: "200 carefully selected phrases for immediate speaking.",
    },
  },
  {
    key: "tenses",
    section: "grammar",
    emoji: "⏳",
    label: {
      vi: "3 thì nền tảng",
      en: "3 core tenses",
    },
    description: {
      vi: "Lặp hiện tại, quá khứ và tương lai theo cùng một hành động để thấm sâu.",
      en: "Repeat present, past, and future around the same action to make it stick.",
    },
  },
];
