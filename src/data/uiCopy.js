export const uiCopy = {
  vi: {
    appTitle: "Vocab Sprint",
    focusSubtitle:
      "Học tiếng Anh như một vòng lặp build -> test -> fix -> ship, thay vì học vẹt.",
    sessionTitle: "Phiên học hiện tại",
    progress: "Tiến độ",
    learningSetup: "Nhịp học",
    concept: "Concept app",
    category: "Bộ học",
    direction: "Hướng nhớ",
    today: "Hôm nay",
    due: "Cần ôn",
    mastered: "Đã chắc",
    learned: "Đã học",
    accuracy: "Độ đúng",
    speed: "Tốc độ",
    roadmapTitle: "Tiến độ hiện tại",
    recentTitle: "Thẻ gần đây",
    noHistory:
      "Chưa có dữ liệu. Hoàn thành vài thẻ đầu để app bắt đầu hiểu nhịp học của bạn.",
    profileTitle: "Cá nhân hóa nhịp học",
    save: "Áp dụng",
    later: "Để sau",
    close: "Đóng",
    dailyMinutes: "Mỗi ngày bạn học được bao nhiêu phút?",
    biggestPain: "Điểm nghẽn lớn nhất của bạn là gì?",
    memoryStyle: "Bạn nhớ nhanh nhất bằng cách nào?",
    preferredTrack: "Bộ từ vựng ưu tiên",
    answerVi: "Nhập nghĩa tiếng Việt",
    answerEn: "Nhập lại từ / câu tiếng Anh",
    correctToast: "Đúng rồi. Khóa đáp án và sang thẻ tiếp theo.",
    wrongToast: "Chưa đúng. Thẻ này sẽ quay lại sớm hơn.",
    profileSaved: "Đã cập nhật nhịp học phù hợp với bạn.",
    historyCorrect: "Đúng",
    historyWrong: "Sai",
    noDeck: "Không có thẻ nào trong bộ học này.",
    navLearning: "Module học",
    navTools: "Công cụ",
    navRecent: "Vừa học",
    coachLoopTitle: "Vòng lặp học",
    coachLoop: ["Input ngắn", "Rebuild", "Ship output", "Fix bug"],
    conceptTitle: "Prompt concept tạo app",
    conceptIntro:
      "App này được thiết kế cho người học cần phản hồi tức thì, thích cảm giác có kết quả rõ ràng như lúc code chạy được hoặc fail ngay.",
    conceptTabs: {
      why: {
        label: "Vì sao hợp",
        items: [
          "Bạn hợp với kiểu học có feedback loop mạnh: làm xong là thấy kết quả ngay.",
          "Não dễ hứng khi có cảm giác săn kết quả, giống lúc fix bug hoặc deploy xong.",
          "Tiếng Anh ở đây không bị dạy như môn học khô, mà được đóng gói như các ticket nhỏ để ship mỗi ngày.",
        ],
      },
      loop: {
        label: "Loop 20 phút",
        items: [
          "Input 5 phút: xem một mẫu câu, một ticket, hoặc một nhóm thẻ rất ngắn.",
          "Rebuild 7 phút: đổi chủ ngữ, đổi thời gian, đổi ngữ cảnh sang việc thật của bạn.",
          "Ship 5 phút: gõ, nói, hoặc chốt ra một output hoàn chỉnh.",
          "Fix bug 3 phút: nhìn lỗi, đáp án đúng, cách nói khác và mẹo nhớ.",
        ],
      },
      tickets: {
        label: "Ticket mẫu",
        items: [
          "Báo tiến độ bằng 5 câu.",
          "Mô tả lỗi server hoặc incident bằng tiếng Anh.",
          "Nhờ teammate hỗ trợ một việc cụ thể.",
          "Giải thích nguyên nhân sự cố và cách khắc phục.",
          "Tự nói 45 giây về việc hôm nay bạn đã làm.",
        ],
      },
      metrics: {
        label: "Thước đo",
        items: [
          "Chỉ track 4 thứ: số phút học, số câu output, số lần nói, và 1 câu dùng được trong công việc thật.",
          "Không đo kiểu học bao nhiêu từ đơn lẻ. Đo theo thứ bạn đã ship được.",
          "Mục tiêu 14 ngày đầu không phải giỏi ngay, mà là không còn ngán tiếng Anh nữa.",
        ],
      },
    },
    focusHints: {
      vocabularyEnToVi:
        "Nhìn từ tiếng Anh, kéo ngay nghĩa tiếng Việt ra khỏi đầu trước khi xem đáp án.",
      vocabularyViToEn:
        "Nhìn nghĩa tiếng Việt, gọi lại đúng từ tiếng Anh và ưu tiên phát âm thành tiếng.",
      phrasesEnToVi:
        "Học cả cụm như một đơn vị dùng được ngay, đừng dịch từng chữ rời nhau.",
      phrasesViToEn:
        "Nhớ trọn câu tiếng Anh như một ticket hoàn chỉnh, không ghép vá từng từ.",
      tenses:
        "Chốt mốc thời gian trước: every day = hiện tại, yesterday = quá khứ, tomorrow = tương lai.",
      shadowing:
        "Nghe, nhại lại 2 lần, rồi mới gõ để khóa trí nhớ bằng tai + miệng + tay.",
      speaking:
        "Nhìn nghĩa tiếng Việt, nói ra tiếng Anh trước, rồi mới gõ lại cho thật chắc.",
    },
    roadmap: [
      "1. Từ vựng: nạp từ đơn bằng hình gợi nhớ, phiên âm và từ loại.",
      "2. Cụm câu: luyện câu sống còn và câu công việc theo kiểu ticket.",
      "3. Ba thì nền tảng: lặp hiện tại, quá khứ, tương lai trên cùng một hành động.",
      "4. Nghe - nhại: nghe, lặp lại, rồi gõ để khóa trí nhớ.",
      "5. Phản xạ nói: nhìn nghĩa, nói ra, rồi mới kiểm tra.",
    ],
    profileOptions: {
      dailyMinutes: {
        "5": "5 phút",
        "10": "10 phút",
        "20": "20 phút",
      },
      focusPain: {
        bored: "Nhanh chán",
        forget: "Học xong quên",
        typing: "Ngại gõ nhiều",
      },
      memoryStyle: {
        type: "Tự gõ trước",
        listen: "Nghe rồi nhại",
        sprint: "Nhiều đợt ngắn",
      },
    },
  },
  en: {
    appTitle: "Vocab Sprint",
    focusSubtitle:
      "Learn English like a build -> test -> fix -> ship loop instead of dry memorization.",
    sessionTitle: "Current session",
    progress: "Progress",
    learningSetup: "Learning setup",
    concept: "App concept",
    category: "Deck",
    direction: "Recall direction",
    today: "Today",
    due: "Due",
    mastered: "Mastered",
    learned: "Learned",
    accuracy: "Accuracy",
    speed: "Speed",
    roadmapTitle: "Current progress",
    recentTitle: "Recent cards",
    noHistory:
      "No data yet. Finish a few cards so the app can learn your rhythm.",
    profileTitle: "Personalize your learning rhythm",
    save: "Apply",
    later: "Later",
    close: "Close",
    dailyMinutes: "How many minutes can you study daily?",
    biggestPain: "What is your biggest learning bottleneck?",
    memoryStyle: "How do you remember fastest?",
    preferredTrack: "Preferred vocabulary deck",
    answerVi: "Type the Vietnamese meaning",
    answerEn: "Type the English word / sentence",
    correctToast: "Correct. Lock it in and move to the next card.",
    wrongToast: "Not yet. This card will come back sooner.",
    profileSaved: "Your learning rhythm has been updated.",
    historyCorrect: "Correct",
    historyWrong: "Wrong",
    noDeck: "There are no cards in this deck.",
    navLearning: "Learning modules",
    navTools: "Tools",
    navRecent: "Recently studied",
    coachLoopTitle: "Learning loop",
    coachLoop: ["Short input", "Rebuild", "Ship output", "Fix bug"],
    conceptTitle: "App concept prompt",
    conceptIntro:
      "This app is designed for learners who need instant feedback and stronger momentum, similar to seeing code run or fail right away.",
    conceptTabs: {
      why: {
        label: "Why it fits",
        items: [
          "You respond better to strong feedback loops than slow passive memorization.",
          "Your brain wants visible outcomes, like debugging, shipping, and verifying results.",
          "English here is treated like a stack of small tickets you can ship every day.",
        ],
      },
      loop: {
        label: "20-minute loop",
        items: [
          "Input 5 min: one short sample, one ticket, or one small deck.",
          "Rebuild 7 min: change subject, tense, or context into your real work.",
          "Ship 5 min: type, speak, or finish one concrete output.",
          "Fix bug 3 min: review mistakes, the correct answer, alternatives, and memory cues.",
        ],
      },
      tickets: {
        label: "Sample tickets",
        items: [
          "Give a progress update in 5 sentences.",
          "Describe a server issue or incident in English.",
          "Ask a teammate for help on a specific task.",
          "Explain a root cause and the fix.",
          "Speak for 45 seconds about what you did today.",
        ],
      },
      metrics: {
        label: "Metrics",
        items: [
          "Track only 4 things: minutes studied, output sentences, speaking reps, and one sentence used in real work.",
          "Do not optimize for isolated word counts. Optimize for shipped output.",
          "The first 14 days are about killing resistance, not becoming fluent overnight.",
        ],
      },
    },
    focusHints: {
      vocabularyEnToVi:
        "See the English word and pull the Vietnamese meaning from memory before revealing it.",
      vocabularyViToEn:
        "See the Vietnamese meaning, recall the English word, and say it out loud first.",
      phrasesEnToVi:
        "Learn the full phrase as a usable unit, not as isolated translated words.",
      phrasesViToEn:
        "Recall the whole English sentence as one ticket, not piece by piece.",
      tenses:
        "Lock the time marker first: every day = present, yesterday = past, tomorrow = future.",
      shadowing:
        "Listen, repeat twice, then type to lock memory through ear + mouth + hand.",
      speaking:
        "See the Vietnamese meaning, speak the English first, then type it.",
    },
    roadmap: [
      "1. Vocabulary: learn words with image cues, phonetics, and parts of speech.",
      "2. Phrases: train survival and work phrases as small tickets.",
      "3. Three core tenses: repeat present, past, and future on the same action.",
      "4. Shadowing: listen, repeat, then type.",
      "5. Speaking: see the meaning, speak first, then verify.",
    ],
    profileOptions: {
      dailyMinutes: {
        "5": "5 min",
        "10": "10 min",
        "20": "20 min",
      },
      focusPain: {
        bored: "I get bored fast",
        forget: "I forget quickly",
        typing: "I dislike typing a lot",
      },
      memoryStyle: {
        type: "Type first",
        listen: "Listen and repeat",
        sprint: "Short sprints",
      },
    },
  },
};

export const stageCopy = {
  vocabulary: {
    label: {
      vi: "Từ vựng",
      en: "Vocabulary",
    },
    helper: {
      vi: "Từ đơn có hình gợi nhớ, phiên âm, từ loại và đồng nghĩa gần.",
      en: "Single words with image cues, phonetics, part of speech, and close synonyms.",
    },
  },
  phrases: {
    label: {
      vi: "Cụm câu",
      en: "Phrases",
    },
    helper: {
      vi: "Những câu ngắn dùng được ngay trong đời sống và công việc.",
      en: "Short phrases you can use immediately in daily life and work.",
    },
  },
  tenses: {
    label: {
      vi: "3 thì nền tảng",
      en: "3 core tenses",
    },
    helper: {
      vi: "Lặp cùng một hành động qua hiện tại, quá khứ và tương lai để nhớ sâu.",
      en: "Repeat the same action in present, past, and future to make it stick.",
    },
  },
  shadowing: {
    label: {
      vi: "Nghe - nhại",
      en: "Shadowing",
    },
    helper: {
      vi: "Nghe câu mẫu, nhại lại rõ ràng, rồi gõ để khóa phản xạ nghe - miệng.",
      en: "Listen to a model line, shadow it clearly, then type it to lock the pattern.",
    },
  },
  speaking: {
    label: {
      vi: "Phản xạ nói",
      en: "Speaking",
    },
    helper: {
      vi: "Nhìn nghĩa tiếng Việt, bật miệng nói ra tiếng Anh trước khi kiểm tra.",
      en: "See the Vietnamese meaning and say the English out loud before checking.",
    },
  },
};

export const posLabels = {
  noun: { vi: "Danh từ", en: "Noun" },
  verb: { vi: "Động từ", en: "Verb" },
  adjective: { vi: "Tính từ", en: "Adjective" },
  adverb: { vi: "Trạng từ", en: "Adverb" },
  interjection: { vi: "Thán từ", en: "Interjection" },
  phrase: { vi: "Cụm câu", en: "Phrase" },
};
