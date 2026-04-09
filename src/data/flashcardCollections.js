const card = (
  word,
  meaning,
  phonetic,
  partOfSpeech,
  imageHint,
  scene,
  extras = {}
) => ({
  word,
  meaning,
  phonetic,
  partOfSpeech,
  imageHint,
  scene,
  alternativesEn: [],
  alternativesVi: [],
  learnerHint: "",
  ...extras,
});

export const communicationCards = [
  card("hello", "xin chào", "/həˈləʊ/", "interjection", "👋", "Bạn đang vẫy tay chào một người bạn.", {
    alternativesEn: ["hi", "hey"],
    alternativesVi: ["chào bạn"],
    learnerHint: "Hello lịch sự và an toàn. Hi thân hơn.",
  }),
  card("please", "làm ơn", "/pliːz/", "interjection", "🙏", "Bạn đang nhờ ai đó giúp mình.", {
    alternativesVi: ["xin vui lòng"],
  }),
  card("sorry", "xin lỗi", "/ˈsɒr.i/", "interjection", "🙇", "Bạn làm phiền ai đó và cúi nhẹ đầu xin lỗi.", {
    alternativesEn: ["i am sorry", "my apologies"],
    alternativesVi: ["thành thật xin lỗi", "xin lỗi nhé"],
    learnerHint: "Sai nhẹ thì dùng sorry. Trang trọng hơn là my apologies.",
  }),
  card("thanks", "cảm ơn", "/θæŋks/", "interjection", "💛", "Bạn mỉm cười sau khi được giúp đỡ.", {
    alternativesEn: ["thank you"],
    alternativesVi: ["cảm ơn bạn", "cám ơn"],
  }),
  card("repeat", "lặp lại", "/rɪˈpiːt/", "verb", "🔁", "Người đối diện đang nói lại thêm một lần nữa.", {
    alternativesVi: ["nhắc lại"],
  }),
  card("answer", "trả lời", "/ˈɑːn.sər/", "verb", "💬", "Bạn mở miệng đáp lại một câu hỏi.", {
    alternativesVi: ["đáp lại"],
  }),
  card("question", "câu hỏi", "/ˈkwes.tʃən/", "noun", "❓", "Một dấu hỏi lớn bật sáng trong đầu.", {
    alternativesVi: ["câu hỏi thắc mắc"],
  }),
  card("explain", "giải thích", "/ɪkˈspleɪn/", "verb", "🧠", "Bạn đang vẽ ví dụ để người khác hiểu hơn.", {
    alternativesVi: ["nói rõ"],
  }),
  card("message", "tin nhắn", "/ˈmes.ɪdʒ/", "noun", "📩", "Điện thoại vừa hiện lên một tin mới."),
  card("schedule", "lịch", "/ˈskedʒ.uːl/", "noun", "🗓️", "Cuốn lịch mở ra với nhiều mốc giờ.", {
    alternativesVi: ["lịch trình"],
  }),
  card("available", "rảnh", "/əˈveɪ.lə.bəl/", "adjective", "🟢", "Một khung giờ trên lịch đang còn trống.", {
    alternativesVi: ["có thời gian"],
  }),
  card("busy", "bận", "/ˈbɪz.i/", "adjective", "🔴", "Lịch làm việc kín mít cả ngày."),
  card("meeting", "cuộc họp", "/ˈmiː.tɪŋ/", "noun", "👥", "Hai người đang ngồi trao đổi công việc.", {
    alternativesVi: ["buổi họp"],
  }),
  card("colleague", "đồng nghiệp", "/ˈkɒl.iːɡ/", "noun", "🤝", "Bạn bắt tay một người cùng công ty."),
  card("agree", "đồng ý", "/əˈɡriː/", "verb", "👍", "Bạn gật đầu vì thấy đúng.", {
    alternativesVi: ["tán thành"],
  }),
  card("disagree", "không đồng ý", "/ˌdɪs.əˈɡriː/", "verb", "👎", "Bạn lắc đầu nhẹ vì chưa cùng quan điểm.", {
    alternativesVi: ["phản đối"],
  }),
  card("borrow", "mượn", "/ˈbɒr.əʊ/", "verb", "📚", "Bạn xin mượn tạm một món đồ.", {
    alternativesVi: ["mượn tạm"],
  }),
  card("return", "trả lại", "/rɪˈtɜːn/", "verb", "↩️", "Bạn đưa lại món đã mượn.", {
    alternativesVi: ["hoàn trả"],
  }),
  card("promise", "hứa", "/ˈprɒm.ɪs/", "verb", "🤞", "Bạn móc ngoéo tay để hứa.", {
    alternativesVi: ["cam kết"],
  }),
  card("improve", "cải thiện", "/ɪmˈpruːv/", "verb", "📈", "Đường biểu đồ đang đi lên rõ rệt.", {
    alternativesVi: ["tiến bộ hơn"],
  }),
];

export const itCards = [
  card("bug", "lỗi", "/bʌɡ/", "noun", "🐞", "Một con bọ nhỏ đang nằm trong dòng code.", {
    alternativesVi: ["lỗi phần mềm"],
  }),
  card("deploy", "triển khai", "/dɪˈplɔɪ/", "verb", "🚀", "Bạn đang đẩy app lên môi trường thật.", {
    alternativesVi: ["đưa lên chạy"],
  }),
  card("branch", "nhánh mã nguồn", "/brɑːntʃ/", "noun", "🌿", "Cây code tách ra thành một nhánh mới."),
  card("commit", "bản ghi commit", "/kəˈmɪt/", "noun", "✅", "Bạn vừa lưu lại một thay đổi nhỏ."),
  card("merge", "gộp mã", "/mɜːdʒ/", "verb", "🔀", "Hai nhánh code nhập lại làm một."),
  card("backend", "phần máy chủ", "/ˈbæk.end/", "noun", "🛠️", "Phần sau của app đang xử lý dữ liệu."),
  card("frontend", "phần giao diện", "/ˈfrʌnt.end/", "noun", "🖥️", "Phần người dùng nhìn thấy trên màn hình."),
  card("endpoint", "điểm gọi API", "/ˈend.pɔɪnt/", "noun", "📡", "Mũi tên request đang chạm vào API."),
  card("database", "cơ sở dữ liệu", "/ˈdeɪ.tə.beɪs/", "noun", "🗃️", "Nhiều ngăn dữ liệu xếp thẳng hàng."),
  card("query", "truy vấn", "/ˈkwɪə.ri/", "noun", "🔎", "Bạn đang tìm đúng một dòng dữ liệu."),
  card("cache", "bộ nhớ đệm", "/kæʃ/", "noun", "⚡", "Dữ liệu cũ được giữ lại để tải nhanh hơn."),
  card("auth", "xác thực", "/ɔːθ/", "noun", "🔐", "Cánh cửa chỉ mở khi người dùng đăng nhập."),
  card("token", "mã xác thực", "/ˈtəʊ.kən/", "noun", "🪪", "Một tấm thẻ ra vào đang nằm trong tay."),
  card("server", "máy chủ", "/ˈsɜː.vər/", "noun", "🖧", "Một hộp máy đen đang phục vụ ứng dụng."),
  card("client", "máy người dùng", "/ˈklaɪ.ənt/", "noun", "💻", "Laptop của người dùng đang gọi dữ liệu."),
  card("package", "gói thư viện", "/ˈpæk.ɪdʒ/", "noun", "📦", "Một hộp code được cài thêm vào dự án."),
  card("framework", "khung làm việc", "/ˈfreɪm.wɜːk/", "noun", "🏗️", "Khung sắt giúp dựng app nhanh hơn."),
  card("component", "thành phần giao diện", "/kəmˈpəʊ.nənt/", "noun", "🧩", "Một mảnh ghép nhỏ của UI."),
  card("library", "thư viện", "/ˈlaɪ.brər.i/", "noun", "📚", "Kệ sách chứa sẵn nhiều công cụ code."),
  card("repository", "kho mã nguồn", "/rɪˈpɒz.ɪ.tər.i/", "noun", "🗂️", "Nơi git giữ toàn bộ dự án."),
];

export const devopsCards = [
  card("container", "container", "/kənˈteɪ.nər/", "noun", "📦", "Ứng dụng nằm gọn trong một chiếc hộp.", {
    alternativesVi: ["vùng chứa ứng dụng"],
  }),
  card("docker", "Docker", "/ˈdɒk.ər/", "noun", "🐳", "Con cá voi đang kéo container đi."),
  card("kubernetes", "Kubernetes", "/ˌkuː.bəˈneɪ.tiːz/", "noun", "☸️", "Nhiều container được điều phối cùng lúc."),
  card("cluster", "cụm máy", "/ˈklʌs.tər/", "noun", "🧱", "Nhiều node ghép lại thành một cụm."),
  card("pod", "pod", "/pɒd/", "noun", "🥚", "Một nhóm container ở trong cùng một vỏ."),
  card("node", "nút máy chủ", "/nəʊd/", "noun", "🖥️", "Một máy trong cụm đang gánh việc."),
  card("pipeline", "pipeline", "/ˈpaɪp.laɪn/", "noun", "🛤️", "Code đi qua từng trạm kiểm tra."),
  card("monitor", "giám sát", "/ˈmɒn.ɪ.tər/", "verb", "📈", "Bạn nhìn dashboard theo dõi hệ thống."),
  card("alert", "cảnh báo", "/əˈlɜːt/", "noun", "🚨", "Còi báo động vang lên khi lỗi xảy ra."),
  card("log", "nhật ký", "/lɒɡ/", "noun", "📜", "Từng dòng sự kiện được ghi lại."),
  card("backup", "sao lưu", "/ˈbæk.ʌp/", "verb", "💾", "Bạn cất dữ liệu vào một bản sao."),
  card("restore", "phục hồi", "/rɪˈstɔːr/", "verb", "♻️", "Dữ liệu cũ được kéo trở lại hệ thống."),
  card("uptime", "thời gian hoạt động", "/ˈʌp.taɪm/", "noun", "🟢", "Server đang sống liên tục không nghỉ."),
  card("latency", "độ trễ", "/ˈleɪ.tən.si/", "noun", "🐢", "Tín hiệu đi chậm hơn bình thường."),
  card("firewall", "tường lửa", "/ˈfaɪə.wɔːl/", "noun", "🔥", "Bức tường lửa chặn luồng truy cập lạ."),
  card("secret", "biến bí mật", "/ˈsiː.krət/", "noun", "🕵️", "Chuỗi key đang được cất kín."),
  card("environment", "môi trường", "/ɪnˈvaɪ.rən.mənt/", "noun", "🌍", "App đang chạy ở một môi trường riêng."),
  card("incident", "sự cố", "/ˈɪn.sɪ.dənt/", "noun", "🧯", "Cả team đang xử lý một đám cháy sản xuất."),
  card("terminal", "cửa sổ lệnh", "/ˈtɜː.mɪ.nəl/", "noun", "⌨️", "Con trỏ đang chờ lệnh tiếp theo."),
  card("load balancer", "cân bằng tải", "/ˌləʊd ˈbæl.ən.sər/", "noun", "⚖️", "Luồng truy cập được chia đều ra nhiều máy."),
];

const devopsExtraCards = [
  card("rollback", "khôi phục bản cũ", "/ˈrəʊl.bæk/", "verb", "↩️", "Bạn kéo hệ thống về bản ổn định trước đó.", {
    alternativesVi: ["roll back", "lùi bản triển khai"],
  }),
  card("dashboard", "bảng theo dõi", "/ˈdæʃ.bɔːd/", "noun", "📊", "Mọi chỉ số đang hiện tập trung trên một màn hình."),
  card("root cause", "nguyên nhân gốc", "/ˌruːt ˈkɔːz/", "noun", "🌱", "Bạn đào đến gốc của vấn đề, không chỉ phần ngọn.", {
    alternativesVi: ["căn nguyên"],
  }),
  card("outage", "mất dịch vụ", "/ˈaʊ.tɪdʒ/", "noun", "⚫", "Dịch vụ ngừng phản hồi trên diện rộng."),
  card("scaling", "mở rộng tải", "/ˈskeɪ.lɪŋ/", "noun", "📶", "Bạn thêm tài nguyên để hệ thống gánh được nhiều hơn."),
  card("replica", "bản sao chạy song song", "/ˈrep.lɪ.kə/", "noun", "🧬", "Nhiều bản sao giống nhau chia nhau xử lý tải."),
  card("namespace", "không gian tên", "/ˈneɪm.speɪs/", "noun", "🗂️", "Bạn tách tài nguyên thành từng vùng có tên riêng."),
  card("ingress", "điểm vào", "/ˈɪn.ɡres/", "noun", "🚪", "Lưu lượng đi vào cụm qua một cửa chính."),
  card("throughput", "lưu lượng xử lý", "/ˈθruː.pʊt/", "noun", "🌊", "Hệ thống đang đẩy qua rất nhiều request."),
  card("timeout", "quá thời gian chờ", "/ˈtaɪm.aʊt/", "noun", "⏱️", "Request chờ quá lâu nên tự dừng lại."),
];

export const devopsSystemCards = [...itCards, ...devopsCards, ...devopsExtraCards];

export const workplaceCards = [
  card("task", "nhiệm vụ", "/tɑːsk/", "noun", "🧩", "Một ticket nhỏ đang chờ bạn xử lý."),
  card("deadline", "hạn chót", "/ˈded.laɪn/", "noun", "⏰", "Lịch đang đánh dấu một mốc phải xong."),
  card("update", "cập nhật", "/ʌpˈdeɪt/", "noun", "🔄", "Bạn nhắn tình hình mới nhất cho team."),
  card("blocker", "điểm bị chặn", "/ˈblɒk.ər/", "noun", "🧱", "Có thứ gì đó đang chặn bạn đi tiếp."),
  card("priority", "ưu tiên", "/praɪˈɒr.ə.ti/", "noun", "🎯", "Một việc được đẩy lên đầu danh sách."),
  card("review", "xem lại", "/rɪˈvjuː/", "verb", "🔍", "Bạn đang đọc lại để kiểm tra cho kỹ."),
  card("approve", "phê duyệt", "/əˈpruːv/", "verb", "🟢", "Một dấu tick xanh cho phép việc tiếp tục."),
  card("ticket", "phiếu việc", "/ˈtɪk.ɪt/", "noun", "🎫", "Một đầu việc được ghi rõ trong hệ thống."),
  card("summary", "tóm tắt", "/ˈsʌm.ər.i/", "noun", "📝", "Bạn chốt lại ý chính trong vài dòng ngắn."),
  card("teammate", "đồng đội", "/ˈtiːm.meɪt/", "noun", "🤝", "Một người đang phối hợp cùng bạn."),
  card("customer", "khách hàng", "/ˈkʌs.tə.mər/", "noun", "🧑‍💼", "Người đang dùng dịch vụ của bạn."),
  card("progress", "tiến độ", "/ˈprəʊ.ɡres/", "noun", "📈", "Thanh trạng thái đang tiến dần lên."),
  card("handover", "bàn giao", "/ˈhændˌəʊ.vər/", "noun", "🤲", "Bạn chuyển việc lại cho ca hoặc người khác."),
  card("note", "ghi chú", "/nəʊt/", "noun", "📒", "Một dòng ngắn để nhớ điều quan trọng."),
  card("urgent", "khẩn cấp", "/ˈɜː.dʒənt/", "adjective", "🚑", "Việc này cần được xử lý ngay."),
  card("support", "hỗ trợ", "/səˈpɔːt/", "noun", "🛟", "Bạn hoặc đồng đội đang ra tay giúp đỡ."),
  card("follow-up", "theo dõi tiếp", "/ˈfɒl.əʊ ʌp/", "noun", "📍", "Một việc cần quay lại kiểm tra thêm."),
  card("requirement", "yêu cầu", "/rɪˈkwaɪə.mənt/", "noun", "📋", "Danh sách điều bắt buộc phải có."),
  card("handoff", "chuyển ca", "/ˈhænd.ɒf/", "noun", "🔁", "Bạn chuyển thông tin lại cho người kế tiếp."),
  card("agenda", "nội dung họp", "/əˈdʒen.də/", "noun", "🗒️", "Các mục cần nói trong cuộc họp đã được chốt."),
];

export const homeCards = [
  card("kitchen", "nhà bếp", "/ˈkɪtʃ.ən/", "noun", "🍳", "Nơi có chảo, bếp và mùi thức ăn."),
  card("bedroom", "phòng ngủ", "/ˈbed.ruːm/", "noun", "🛏️", "Chiếc giường đang chờ bạn nghỉ."),
  card("bathroom", "phòng tắm", "/ˈbɑːθ.ruːm/", "noun", "🛁", "Có vòi nước, gương và bồn rửa.", {
    alternativesEn: ["restroom", "toilet"],
    alternativesVi: ["nhà vệ sinh"],
    learnerHint: "Bathroom là cách trung tính. Khi hỏi đường cũng có thể nghe restroom.",
  }),
  card("sofa", "ghế sofa", "/ˈsəʊ.fə/", "noun", "🛋️", "Một chiếc sofa mềm ở phòng khách."),
  card("chair", "ghế", "/tʃeər/", "noun", "🪑", "Một chiếc ghế gỗ đang để trống."),
  card("table", "bàn", "/ˈteɪ.bəl/", "noun", "📏", "Chiếc bàn đứng giữa căn phòng."),
  card("blanket", "chăn", "/ˈblæŋ.kɪt/", "noun", "🧣", "Bạn quấn mình trong chiếc chăn ấm."),
  card("pillow", "gối", "/ˈpɪl.əʊ/", "noun", "🛌", "Đầu bạn đang tựa lên chiếc gối mềm."),
  card("fridge", "tủ lạnh", "/frɪdʒ/", "noun", "🧊", "Tủ lạnh mở ra và hơi lạnh phả ra."),
  card("stove", "bếp", "/stəʊv/", "noun", "🔥", "Ngọn lửa đang bật dưới nồi."),
  card("sink", "bồn rửa", "/sɪŋk/", "noun", "🚰", "Nước đang chảy xuống bồn."),
  card("soap", "xà phòng", "/səʊp/", "noun", "🧼", "Bọt xà phòng nổi lên đầy tay."),
  card("towel", "khăn", "/ˈtaʊ.əl/", "noun", "🧻", "Khăn đang treo gần phòng tắm."),
  card("laundry", "đồ giặt", "/ˈlɔːn.dri/", "noun", "🧺", "Giỏ quần áo đang đầy đồ bẩn."),
  card("vacuum", "máy hút bụi", "/ˈvæk.juːm/", "noun", "🧹", "Máy hút bụi đang chạy trên sàn."),
  card("trash", "rác", "/træʃ/", "noun", "🗑️", "Thùng rác đang mở nắp."),
  card("remote", "điều khiển", "/rɪˈməʊt/", "noun", "📺", "Bạn đang cầm remote TV."),
  card("lamp", "đèn bàn", "/læmp/", "noun", "💡", "Một góc phòng vừa bật sáng."),
  card("shelf", "kệ", "/ʃelf/", "noun", "🪜", "Sách và hộp đồ để trên kệ."),
  card("broom", "chổi", "/bruːm/", "noun", "🧹", "Bạn đang quét sàn nhà."),
];

export const restaurantCards = [
  card("menu", "thực đơn", "/ˈmen.juː/", "noun", "📋", "Bạn đang mở menu để chọn món."),
  card("bill", "hóa đơn", "/bɪl/", "noun", "🧾", "Tờ giấy tính tiền vừa được mang ra."),
  card("reservation", "đặt bàn", "/ˌrez.əˈveɪ.ʃən/", "noun", "📞", "Bạn vừa gọi điện để giữ bàn tối nay."),
  card("order", "gọi món", "/ˈɔː.dər/", "verb", "🛎️", "Bạn chỉ tay vào món muốn ăn."),
  card("waiter", "phục vụ nam", "/ˈweɪ.tər/", "noun", "🤵", "Người phục vụ đang cầm khay thức ăn."),
  card("table", "bàn ăn", "/ˈteɪ.bəl/", "noun", "🍽️", "Một bàn ăn đã được dọn sẵn."),
  card("dish", "món ăn", "/dɪʃ/", "noun", "🍲", "Một món nóng hổi đặt trên bàn."),
  card("drink", "đồ uống", "/drɪŋk/", "noun", "🥤", "Ly nước có ống hút bên cạnh."),
  card("water", "nước", "/ˈwɔː.tər/", "noun", "💧", "Ly nước lọc mát lạnh đang ở trước mặt."),
  card("spicy", "cay", "/ˈspaɪ.si/", "adjective", "🌶️", "Món ăn có nhiều ớt đỏ."),
  card("delicious", "ngon", "/dɪˈlɪʃ.əs/", "adjective", "😋", "Bạn vừa ăn và gật gù rất ngon.", {
    alternativesVi: ["rất ngon"],
  }),
  card("hungry", "đói", "/ˈhʌŋ.ɡri/", "adjective", "🍽️", "Bụng đang réo lên trước bữa ăn."),
  card("full", "no", "/fʊl/", "adjective", "🙂", "Bạn đặt tay lên bụng sau khi ăn xong.", {
    alternativesVi: ["ăn no rồi"],
  }),
  card("dessert", "tráng miệng", "/dɪˈzɜːt/", "noun", "🍰", "Miếng bánh ngọt sau món chính."),
  card("tip", "tiền boa", "/tɪp/", "noun", "💵", "Bạn để lại ít tiền cảm ơn phục vụ.", {
    alternativesVi: ["tiền bo"],
  }),
  card("receipt", "biên lai", "/rɪˈsiːt/", "noun", "🧾", "Nhân viên in ra một mẩu giấy nhỏ."),
  card("fork", "nĩa", "/fɔːk/", "noun", "🍴", "Chiếc nĩa nằm cạnh chiếc đĩa."),
  card("spoon", "thìa", "/spuːn/", "noun", "🥄", "Thìa đang múc một ngụm súp nóng.", {
    alternativesVi: ["muỗng"],
  }),
  card("knife", "dao", "/naɪf/", "noun", "🔪", "Con dao đặt cạnh khăn ăn."),
  card("takeaway", "mang về", "/ˈteɪk.ə.weɪ/", "noun", "🥡", "Hộp thức ăn được đóng để mang đi.", {
    alternativesEn: ["takeout"],
    alternativesVi: ["mua mang về"],
    learnerHint: "Anh - Anh hay nói takeaway, Anh - Mỹ hay nói takeout.",
  }),
];
