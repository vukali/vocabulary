const tense = (
  word,
  meaning,
  imageHint,
  scene,
  grammarTag,
  learnerHint,
  extras = {}
) => ({
  word,
  meaning,
  imageHint,
  scene,
  grammarTag,
  learnerHint,
  partOfSpeech: "phrase",
  alternativesEn: [],
  alternativesVi: [],
  ...extras,
});

const present = { vi: "Hiện tại đơn", en: "Present Simple" };
const past = { vi: "Quá khứ đơn", en: "Past Simple" };
const future = { vi: "Tương lai đơn", en: "Future Simple" };

export const tenseCards = [
  tense(
    "I work every day.",
    "tôi làm việc mỗi ngày",
    "💼",
    "Bạn mở laptop và làm việc đều đặn mỗi ngày.",
    present,
    "Mốc nhớ hiện tại đơn: every day, usually, often."
  ),
  tense(
    "I worked yesterday.",
    "hôm qua tôi đã làm việc",
    "💼",
    "Bạn nhớ lại công việc của ngày hôm qua.",
    past,
    "Quá khứ đơn thường đi với yesterday, last night, last week."
  ),
  tense(
    "I will work tomorrow.",
    "ngày mai tôi sẽ làm việc",
    "💼",
    "Bạn nhìn lịch ngày mai và biết mình sẽ làm việc.",
    future,
    "Tương lai đơn: will + động từ nguyên mẫu. Dấu hiệu quen thuộc là tomorrow.",
    { alternativesEn: ["I'll work tomorrow."] }
  ),

  tense(
    "I study English every night.",
    "tôi học tiếng Anh mỗi tối",
    "📚",
    "Buổi tối nào bạn cũng mở bài tiếng Anh ra học.",
    present,
    "Cứ thấy every night, every day là nghĩ ngay đến hiện tại đơn."
  ),
  tense(
    "I studied English last night.",
    "tối qua tôi đã học tiếng Anh",
    "📚",
    "Bạn nhớ lại buổi tối qua mình đã học tiếng Anh.",
    past,
    "Động từ có quy tắc thường thêm -ed trong quá khứ đơn."
  ),
  tense(
    "I will study English tonight.",
    "tối nay tôi sẽ học tiếng Anh",
    "📚",
    "Bạn đã lên kế hoạch tối nay ngồi học tiếng Anh.",
    future,
    "Tương lai đơn rất hợp với tonight, tomorrow, next week.",
    { alternativesEn: ["I'll study English tonight."] }
  ),

  tense(
    "I eat breakfast at home.",
    "tôi ăn sáng ở nhà",
    "🍳",
    "Buổi sáng bạn ăn sáng ở nhà như thói quen thường ngày.",
    present,
    "Thói quen lặp lại dùng hiện tại đơn."
  ),
  tense(
    "I ate breakfast at home this morning.",
    "sáng nay tôi đã ăn sáng ở nhà",
    "🍳",
    "Bạn nhớ lại bữa sáng đã xong vào sáng nay.",
    past,
    "Eat là động từ bất quy tắc, quá khứ là ate."
  ),
  tense(
    "I will eat breakfast at home tomorrow.",
    "sáng mai tôi sẽ ăn sáng ở nhà",
    "🍳",
    "Bạn hình dung sáng mai vẫn ăn sáng ở nhà.",
    future,
    "Will + eat giúp bạn nói kế hoạch đơn giản rất nhanh.",
    { alternativesEn: ["I'll eat breakfast at home tomorrow."] }
  ),

  tense(
    "I drink water after lunch.",
    "tôi uống nước sau bữa trưa",
    "💧",
    "Sau bữa trưa bạn luôn uống nước.",
    present,
    "After lunch là lịch cố định, thường đi với hiện tại đơn."
  ),
  tense(
    "I drank water after lunch.",
    "tôi đã uống nước sau bữa trưa",
    "💧",
    "Bạn nhớ lại việc uống nước sau bữa trưa vừa rồi.",
    past,
    "Drink là bất quy tắc, quá khứ là drank."
  ),
  tense(
    "I will drink water later.",
    "lát nữa tôi sẽ uống nước",
    "💧",
    "Bạn khát và dự định lát nữa sẽ uống nước.",
    future,
    "Later là tín hiệu rất quen cho tương lai gần.",
    { alternativesEn: ["I'll drink water later."] }
  ),

  tense(
    "I call my friend every weekend.",
    "tôi gọi cho bạn tôi mỗi cuối tuần",
    "📞",
    "Cuối tuần nào bạn cũng gọi điện cho bạn mình.",
    present,
    "Every weekend = thói quen lặp lại."
  ),
  tense(
    "I called my friend yesterday.",
    "hôm qua tôi đã gọi cho bạn tôi",
    "📞",
    "Bạn nhớ cuộc gọi đã diễn ra hôm qua.",
    past,
    "Call là động từ có quy tắc nên thêm -ed."
  ),
  tense(
    "I will call my friend tonight.",
    "tối nay tôi sẽ gọi cho bạn tôi",
    "📞",
    "Bạn định tối nay sẽ gọi cho bạn mình.",
    future,
    "Muốn hứa hoặc dự định nhanh: will + call.",
    { alternativesEn: ["I'll call my friend tonight."] }
  ),

  tense(
    "I go to the office on Mondays.",
    "tôi đến văn phòng vào thứ hai",
    "🏢",
    "Thứ hai nào bạn cũng đến văn phòng.",
    present,
    "On Mondays nói lịch lặp lại nên dùng hiện tại đơn."
  ),
  tense(
    "I went to the office yesterday.",
    "hôm qua tôi đã đến văn phòng",
    "🏢",
    "Bạn nhớ lại chuyến đi đến văn phòng hôm qua.",
    past,
    "Go là bất quy tắc, quá khứ là went."
  ),
  tense(
    "I will go to the office tomorrow.",
    "ngày mai tôi sẽ đến văn phòng",
    "🏢",
    "Bạn nhìn lịch và biết mai sẽ đến văn phòng.",
    future,
    "Will go là mẫu cực hay dùng cho kế hoạch ngắn.",
    { alternativesEn: ["I'll go to the office tomorrow."] }
  ),

  tense(
    "I practice speaking every morning.",
    "tôi luyện nói mỗi sáng",
    "🗣️",
    "Sáng nào bạn cũng mở miệng luyện nói.",
    present,
    "Every morning là mốc thói quen quen thuộc."
  ),
  tense(
    "I practiced speaking this morning.",
    "sáng nay tôi đã luyện nói",
    "🗣️",
    "Bạn nhớ lại buổi luyện nói sáng nay.",
    past,
    "Practice là động từ có quy tắc, quá khứ là practiced."
  ),
  tense(
    "I will practice speaking tonight.",
    "tối nay tôi sẽ luyện nói",
    "🗣️",
    "Bạn đã chốt tối nay sẽ mở miệng nói tiếng Anh.",
    future,
    "Khi bạn đã quyết định việc sẽ làm, cứ dùng will + động từ.",
    { alternativesEn: ["I'll practice speaking tonight."] }
  ),

  tense(
    "I check the server every morning.",
    "tôi kiểm tra máy chủ mỗi sáng",
    "🖥️",
    "Sáng nào bạn cũng mở dashboard kiểm tra server.",
    present,
    "Công việc lặp theo lịch cố định thường dùng hiện tại đơn."
  ),
  tense(
    "I checked the server this morning.",
    "sáng nay tôi đã kiểm tra máy chủ",
    "🖥️",
    "Bạn nhớ lại lần kiểm tra server sáng nay.",
    past,
    "Check thêm -ed thành checked trong quá khứ."
  ),
  tense(
    "I will check the server later.",
    "lát nữa tôi sẽ kiểm tra máy chủ",
    "🖥️",
    "Bạn ghi nhớ lát nữa sẽ quay lại kiểm tra server.",
    future,
    "Later hoặc soon thường kéo bạn sang tương lai đơn.",
    { alternativesEn: ["I'll check the server later."] }
  ),

  tense(
    "I finish my task before lunch.",
    "tôi hoàn thành công việc trước bữa trưa",
    "✅",
    "Bạn thường cố xong việc trước giờ trưa.",
    present,
    "Lịch lặp lại hoặc thói quen làm việc dùng hiện tại đơn."
  ),
  tense(
    "I finished my task yesterday.",
    "hôm qua tôi đã hoàn thành công việc",
    "✅",
    "Bạn nhớ lại việc đã hoàn thành hôm qua.",
    past,
    "Finish là động từ có quy tắc nên thêm -ed."
  ),
  tense(
    "I will finish my task tonight.",
    "tối nay tôi sẽ hoàn thành công việc",
    "✅",
    "Bạn đặt mục tiêu tối nay xong việc.",
    future,
    "Future simple rất hợp để tự nhắc kế hoạch: will finish.",
    { alternativesEn: ["I'll finish my task tonight."] }
  ),

  tense(
    "I meet my team every Monday.",
    "tôi gặp đội của mình mỗi thứ hai",
    "👥",
    "Mỗi thứ hai bạn đều họp hoặc gặp team.",
    present,
    "Every Monday là tín hiệu của hiện tại đơn."
  ),
  tense(
    "I met my team yesterday.",
    "hôm qua tôi đã gặp đội của mình",
    "👥",
    "Bạn nhớ lại buổi gặp team hôm qua.",
    past,
    "Meet là động từ bất quy tắc, quá khứ là met."
  ),
  tense(
    "I will meet my team tomorrow.",
    "ngày mai tôi sẽ gặp đội của mình",
    "👥",
    "Bạn có lịch gặp team vào ngày mai.",
    future,
    "Tomorrow + will meet là mẫu giao tiếp rất thông dụng.",
    { alternativesEn: ["I'll meet my team tomorrow."] }
  ),
];
