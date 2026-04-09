import {
  communicationCards,
  devopsSystemCards,
  homeCards,
  restaurantCards,
  workplaceCards,
} from "./flashcardCollections";
import {
  feelingsCards,
  healthCards,
  shoppingCards,
  travelCards,
} from "./flashcardCollectionsExtra";
import {
  cloudPlatformCards,
  linuxLogsCards,
} from "./flashcardCollectionsCloud";
import { phraseCards, workPhraseCards } from "./phraseDeck";
import {
  meetingPhraseCards,
  travelPhraseCards,
} from "./phraseDeckSituations";
import { tenseCards } from "./tenseDeck";

export const vocabData = {
  communication: communicationCards,
  devops: devopsSystemCards,
  workplace: workplaceCards,
  home: homeCards,
  restaurant: restaurantCards,
  travel: travelCards,
  shopping: shoppingCards,
  health: healthCards,
  feelings: feelingsCards,
  cloudplatform: cloudPlatformCards,
  linuxlogs: linuxLogsCards,
  importedvocab: [],
  phrases: phraseCards,
  workphrases: workPhraseCards,
  travelphrases: travelPhraseCards,
  meetingphrases: meetingPhraseCards,
  importedphrases: [],
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
      vi: "Những từ sống còn để chào hỏi, hỏi lại, nhờ giúp đỡ và nói chuyện thường ngày.",
      en: "High-frequency words for greeting, asking again, getting help, and daily conversation.",
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
      vi: "Đã gộp IT vào cùng một bộ để học đúng ngữ cảnh server, deploy, incident và system.",
      en: "IT and operations are merged into one deck for servers, deploys, incidents, and systems.",
    },
  },
  {
    key: "cloudplatform",
    section: "vocabulary",
    emoji: "☁️",
    label: {
      vi: "Cloud / Platform",
      en: "Cloud / Platform",
    },
    description: {
      vi: "Từ vựng trọng tâm để đọc đề Cloud Practitioner, SAA, DevOps Engineer và hiểu hạ tầng AWS, GCP, Azure.",
      en: "Core vocabulary for Cloud Practitioner, SAA, DevOps Engineer, and cloud platform fundamentals across AWS, GCP, and Azure.",
    },
  },
  {
    key: "linuxlogs",
    section: "vocabulary",
    emoji: "🧾",
    label: {
      vi: "Linux / Logs",
      en: "Linux / Logs",
    },
    description: {
      vi: "Từ vựng chuyên sâu về terminal, process, quyền, journal, lỗi hệ thống, log và cách đọc tín hiệu sự cố.",
      en: "Deep Linux and observability vocabulary for terminals, processes, permissions, journals, logs, and production failures.",
    },
  },
  {
    key: "workplace",
    section: "vocabulary",
    emoji: "🧑‍💻",
    label: {
      vi: "Công việc hằng ngày",
      en: "Workday essentials",
    },
    description: {
      vi: "Từ vựng để báo tiến độ, bàn giao việc, xin phê duyệt và phối hợp trong team.",
      en: "Vocabulary for updates, handoffs, approvals, and daily teamwork.",
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
      vi: "Đồ vật trong nhà, rất dễ học bằng hình dung và lặp lại nhanh.",
      en: "Household objects that are easy to anchor with visual memory.",
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
      vi: "Từ để gọi món, hỏi giá, thanh toán và nói chuyện khi đi ăn.",
      en: "Useful words for ordering, paying, and speaking at restaurants.",
    },
  },
  {
    key: "travel",
    section: "vocabulary",
    emoji: "🧭",
    label: {
      vi: "Du lịch & di chuyển",
      en: "Travel & transport",
    },
    description: {
      vi: "Từ vựng sống còn khi đi sân bay, khách sạn, hỏi đường và di chuyển trong thành phố.",
      en: "Survival vocabulary for airports, hotels, directions, and getting around.",
    },
  },
  {
    key: "shopping",
    section: "vocabulary",
    emoji: "🛍️",
    label: {
      vi: "Mua sắm & thanh toán",
      en: "Shopping & payments",
    },
    description: {
      vi: "Từ để hỏi giá, thử đồ, thanh toán, đổi hàng và xử lý tình huống trong cửa hàng.",
      en: "Useful words for prices, trying items, paying, returns, and store conversations.",
    },
  },
  {
    key: "health",
    section: "vocabulary",
    emoji: "🩺",
    label: {
      vi: "Sức khỏe cơ bản",
      en: "Basic health",
    },
    description: {
      vi: "Những từ cần biết khi mệt, đi khám, mua thuốc, mô tả triệu chứng và xin giúp đỡ.",
      en: "Core vocabulary for symptoms, clinics, medicine, and basic health situations.",
    },
  },
  {
    key: "feelings",
    section: "vocabulary",
    emoji: "🧠",
    label: {
      vi: "Cảm xúc & trạng thái",
      en: "Feelings & states",
    },
    description: {
      vi: "Từ giúp bạn nói được mình đang vui, lo, căng thẳng, tự tin hay bán tín bán nghi.",
      en: "Words to express emotions, energy, confidence, and mental state more naturally.",
    },
  },
  {
    key: "importedvocab",
    section: "vocabulary",
    emoji: "📥",
    label: {
      vi: "Từ vựng import",
      en: "Imported vocab",
    },
    description: {
      vi: "Deck dành cho dữ liệu tự import từ JSON hoặc CSV mà không cần sửa code.",
      en: "A deck for vocabulary imported from JSON or CSV without touching the code.",
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
      vi: "Bộ câu chắt lọc để mở miệng được ngay trong đời sống hằng ngày.",
      en: "A filtered survival phrase deck for immediate daily speaking.",
    },
  },
  {
    key: "workphrases",
    section: "phrases",
    emoji: "🎫",
    label: {
      vi: "Ticket công việc",
      en: "Work tickets",
    },
    description: {
      vi: "Câu ngắn kiểu DevOps / System để báo lỗi, update tình trạng và xử lý incident.",
      en: "Short work-ready phrases for DevOps / System updates, incidents, and coordination.",
    },
  },
  {
    key: "travelphrases",
    section: "phrases",
    emoji: "🧳",
    label: {
      vi: "Du lịch / đi đường",
      en: "Travel phrases",
    },
    description: {
      vi: "Câu dùng được ngay khi hỏi đường, đi sân bay, ở khách sạn, gọi xe và xoay xở khi đi xa.",
      en: "Ready-to-use lines for airports, hotels, taxis, directions, and travel situations.",
    },
  },
  {
    key: "meetingphrases",
    section: "phrases",
    emoji: "👥",
    label: {
      vi: "Họp & phối hợp",
      en: "Meetings & coordination",
    },
    description: {
      vi: "Câu ngắn để update, chốt risk, chia task, xin review và sync với team cho tự nhiên hơn.",
      en: "Compact phrases for updates, risks, ownership, reviews, and smoother teamwork.",
    },
  },
  {
    key: "importedphrases",
    section: "phrases",
    emoji: "📤",
    label: {
      vi: "Câu import",
      en: "Imported phrases",
    },
    description: {
      vi: "Deck dành cho các câu hoặc flashcard tự import từ file JSON hoặc CSV.",
      en: "A deck for imported phrases or flashcards from JSON or CSV files.",
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
      vi: "Lặp cùng một hành động qua hiện tại, quá khứ và tương lai để nhớ sâu và nói nhanh hơn.",
      en: "Repeat the same action in present, past, and future to build fast recall.",
    },
  },
];
