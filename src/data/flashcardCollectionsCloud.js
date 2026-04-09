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

export const cloudPlatformCards = [
  card("cloud", "điện toán đám mây", "/klaʊd/", "noun", "☁️", "Bạn chuyển hạ tầng lên tài nguyên chạy qua internet.", {
    frequency: "high",
    alternativesVi: ["cloud computing"],
  }),
  card("on-premises", "tại chỗ", "/ˌɒn ˈprem.ɪ.sɪz/", "adjective", "🏢", "Máy chủ vẫn đặt trong phòng máy của công ty thay vì lên cloud.", {
    alternativesVi: ["on-prem", "hạ tầng tại chỗ"],
  }),
  card("region", "vùng", "/ˈriː.dʒən/", "noun", "🌍", "Bạn chọn khu vực địa lý gần người dùng để giảm độ trễ.", {
    frequency: "high",
    learnerHint: "AWS, GCP, Azure đều chia hạ tầng theo region.",
  }),
  card("availability zone", "vùng sẵn sàng", "/əˌveɪ.ləˈbɪl.ə.ti zəʊn/", "noun", "🏙️", "Một region có nhiều zone tách biệt để tăng độ chịu lỗi.", {
    alternativesEn: ["AZ"],
    alternativesVi: ["AZ"],
  }),
  card("virtual private cloud", "mạng riêng ảo", "/ˌvɜː.tʃu.əl ˈpraɪ.vət klaʊd/", "noun", "🕸️", "Bạn tạo một mạng riêng để đặt máy, subnet và rule bảo mật.", {
    alternativesEn: ["VPC"],
    alternativesVi: ["VPC"],
    frequency: "high",
  }),
  card("subnet", "mạng con", "/ˈsʌb.net/", "noun", "🧩", "Bạn chia VPC thành nhiều vùng nhỏ public và private.", {
    frequency: "high",
  }),
  card("route table", "bảng định tuyến", "/ruːt ˈteɪ.bəl/", "noun", "🧭", "Lưu lượng đi đâu sẽ được quyết định bằng các rule trong bảng này."),
  card("internet gateway", "cổng internet", "/ˈɪn.tə.net ˈɡeɪt.weɪ/", "noun", "🚪", "Bạn gắn cổng này để subnet public đi ra internet.", {
    alternativesEn: ["IGW"],
  }),
  card("NAT gateway", "cổng NAT", "/næt ˈɡeɪt.weɪ/", "noun", "🔀", "Máy trong private subnet ra internet mà không mở cửa vào trực tiếp.", {
    frequency: "medium",
  }),
  card("security group", "nhóm bảo mật", "/sɪˈkjʊə.rə.ti ɡruːp/", "noun", "🛡️", "Bạn mở đúng port cần thiết cho máy hoặc load balancer.", {
    frequency: "high",
    learnerHint: "Security group giống firewall ở mức instance hoặc interface.",
  }),
  card("network ACL", "danh sách kiểm soát mạng", "/ˈnet.wɜːk eɪ.siːˈel/", "noun", "🚧", "Rule ở mức subnet dùng để cho hoặc chặn traffic.", {
    alternativesEn: ["NACL"],
  }),
  card("IAM", "quản lý định danh và quyền", "/aɪ æm/", "noun", "🪪", "Bạn cấp quyền truy cập cloud cho user, role và service.", {
    alternativesEn: ["identity and access management"],
    frequency: "high",
  }),
  card("role", "vai trò quyền hạn", "/rəʊl/", "noun", "🎭", "Service hoặc user sẽ assume role để lấy quyền tạm thời.", {
    frequency: "high",
  }),
  card("policy", "chính sách quyền", "/ˈpɒl.ə.si/", "noun", "📜", "Bạn viết allow hoặc deny cho hành động trên tài nguyên.", {
    frequency: "high",
  }),
  card("least privilege", "quyền tối thiểu cần thiết", "/liːst ˈprɪv.əl.ɪdʒ/", "noun", "🔐", "Chỉ cấp đúng quyền đủ dùng chứ không mở quá tay.", {
    frequency: "high",
  }),
  card("EC2 instance", "máy ảo EC2", "/iː siː tuː ˈɪn.stəns/", "noun", "🖥️", "Bạn khởi tạo một máy ảo để chạy ứng dụng trên AWS.", {
    frequency: "high",
  }),
  card("AMI", "ảnh máy ảo", "/ˌeɪ.emˈaɪ/", "noun", "📀", "Template dùng để tạo EC2 có sẵn OS và cấu hình cơ bản.", {
    alternativesEn: ["Amazon Machine Image"],
  }),
  card("EBS volume", "ổ đĩa EBS", "/iː biː es ˈvɒl.juːm/", "noun", "💽", "Ổ block storage gắn vào EC2 để lưu dữ liệu.", {
    frequency: "high",
  }),
  card("snapshot", "ảnh chụp dữ liệu", "/ˈsnæp.ʃɒt/", "noun", "📸", "Bạn chụp trạng thái ổ đĩa để backup hoặc khôi phục.", {
    frequency: "high",
  }),
  card("S3 bucket", "bucket S3", "/es θriː ˈbʌk.ɪt/", "noun", "🪣", "Nơi lưu object như file, log, backup trên AWS.", {
    frequency: "high",
  }),
  card("object storage", "lưu trữ đối tượng", "/ˈɒb.dʒekt ˈstɔː.rɪdʒ/", "noun", "🗂️", "Kiểu lưu trữ theo object như S3, Cloud Storage hay Blob.", {
    learnerHint: "S3 của AWS, Cloud Storage của GCP, Blob Storage của Azure đều là object storage.",
  }),
  card("lifecycle policy", "chính sách vòng đời", "/ˈlaɪf.saɪ.kəl ˈpɒl.ə.si/", "noun", "♻️", "File cũ sẽ tự chuyển tầng lưu trữ hoặc tự xóa theo rule."),
  card("relational database", "cơ sở dữ liệu quan hệ", "/rɪˈleɪ.ʃən.əl ˈdeɪ.tə.beɪs/", "noun", "🗄️", "Bạn dùng bảng, cột và quan hệ để lưu dữ liệu nghiệp vụ.", {
    alternativesEn: ["RDBMS"],
  }),
  card("serverless", "không cần quản máy chủ", "/ˈsɜː.və.ləs/", "adjective", "⚡", "Bạn chỉ lo code và event, nhà cung cấp lo phần máy chạy.", {
    frequency: "high",
  }),
  card("Lambda", "AWS Lambda", "/ˈlæm.də/", "noun", "λ", "Một hàm chạy theo event mà không cần dựng server riêng.", {
    frequency: "high",
  }),
  card("auto scaling", "tự động co giãn", "/ˈɔː.təʊ ˈskeɪ.lɪŋ/", "noun", "📈", "Tài nguyên tự tăng giảm theo tải thực tế.", {
    frequency: "high",
  }),
  card("load balancer", "bộ cân bằng tải", "/ləʊd ˈbæl.ən.sər/", "noun", "⚖️", "Request được chia đều sang nhiều máy phía sau.", {
    frequency: "high",
  }),
  card("CloudWatch", "CloudWatch", "/klaʊd wɒtʃ/", "noun", "📊", "Dịch vụ metrics, logs và alarms của AWS.", {
    learnerHint: "Nhắc CloudWatch là nghĩ ngay metrics + logs + alarm.",
  }),
  card("CloudTrail", "CloudTrail", "/klaʊd treɪl/", "noun", "🕵️", "Dịch vụ ghi lại API calls và hoạt động tài khoản AWS.", {
    learnerHint: "CloudTrail nghiêng về audit và ai đã làm gì.",
  }),
  card("Route 53", "Route 53", "/ruːt ˈfɪf.ti θriː/", "noun", "🌐", "Dịch vụ DNS để trỏ domain về hạ tầng AWS."),
  card("content delivery network", "mạng phân phối nội dung", "/ˈkɒn.tent dɪˈlɪv.ər.i ˈnet.wɜːk/", "noun", "🚚", "Nội dung tĩnh được cache gần người dùng hơn.", {
    alternativesEn: ["CDN"],
  }),
  card("Google Kubernetes Engine", "Google Kubernetes Engine", "/ˈɡuː.ɡəl ˌkuː.bəˈneɪ.tiːz ˈen.dʒɪn/", "noun", "☸️", "Dịch vụ Kubernetes managed của Google Cloud.", {
    alternativesEn: ["GKE"],
  }),
  card("Elastic Kubernetes Service", "Elastic Kubernetes Service", "/ɪˈlæs.tɪk ˌkuː.bəˈneɪ.tiːz ˈsɜː.vɪs/", "noun", "☸️", "Dịch vụ Kubernetes managed của AWS.", {
    alternativesEn: ["EKS"],
  }),
  card("Azure Kubernetes Service", "Azure Kubernetes Service", "/ˈæʒ.ər ˌkuː.bəˈneɪ.tiːz ˈsɜː.vɪs/", "noun", "☸️", "Dịch vụ Kubernetes managed của Azure.", {
    alternativesEn: ["AKS"],
  }),
  card("resource group", "nhóm tài nguyên", "/rɪˈzɔːs ɡruːp/", "noun", "📦", "Azure gom tài nguyên liên quan vào cùng một group để quản lý."),
  card("project", "project cloud", "/ˈprɒdʒ.ekt/", "noun", "🧱", "GCP dùng project để gom billing, IAM và tài nguyên.", {
    learnerHint: "GCP hay nói project, Azure hay nói resource group.",
  }),
  card("service account", "tài khoản dịch vụ", "/ˈsɜː.vɪs əˈkaʊnt/", "noun", "🤖", "Ứng dụng dùng identity máy thay vì user thật để gọi tài nguyên.", {
    frequency: "high",
  }),
];

export const linuxLogsCards = [
  card("shell", "trình thông dịch lệnh", "/ʃel/", "noun", "🐚", "Bạn gõ lệnh và shell nhận rồi thực thi chúng.", {
    frequency: "high",
  }),
  card("bash", "bash", "/bæʃ/", "noun", "⌨️", "Shell rất phổ biến trên Linux server.", {
    alternativesEn: ["Bourne Again Shell"],
  }),
  card("SSH", "kết nối SSH", "/es es eɪtʃ/", "noun", "🔑", "Bạn đăng nhập từ xa vào server qua terminal.", {
    alternativesEn: ["secure shell"],
    frequency: "high",
  }),
  card("sudo", "chạy lệnh với quyền cao", "/ˈsuː.duː/", "verb", "🛡️", "Bạn mượn quyền admin tạm thời để chạy một lệnh.", {
    frequency: "high",
  }),
  card("root user", "người dùng root", "/ruːt ˈjuː.zər/", "noun", "👑", "Tài khoản có quyền cao nhất trong hệ Linux.", {
    frequency: "high",
  }),
  card("permission denied", "bị từ chối quyền", "/pəˈmɪʃ.ən dɪˈnaɪd/", "phrase", "⛔", "Lệnh không chạy được vì user không có quyền phù hợp.", {
    frequency: "high",
  }),
  card("package manager", "trình quản lý gói", "/ˈpæk.ɪdʒ ˈmæn.ɪ.dʒər/", "noun", "📦", "Bạn cài hoặc cập nhật phần mềm bằng apt, yum hay dnf."),
  card("systemd", "systemd", "/ˈsɪs.təm.diː/", "noun", "⚙️", "Hệ thống init quản lý service và tiến trình nền trên Linux."),
  card("daemon", "tiến trình nền", "/ˈdiː.mən/", "noun", "👻", "Một service chạy âm thầm phía sau mà không cần giao diện.", {
    frequency: "high",
  }),
  card("service unit", "đơn vị dịch vụ", "/ˈsɜː.vɪs ˈjuː.nɪt/", "noun", "🧾", "File cấu hình để systemd biết cách chạy một service."),
  card("process", "tiến trình", "/ˈprəʊ.ses/", "noun", "🔄", "Một chương trình đang thực thi trong hệ điều hành.", {
    frequency: "high",
  }),
  card("PID", "mã tiến trình", "/piː aɪ diː/", "noun", "🏷️", "Mỗi process có một số ID riêng để theo dõi hoặc kill."),
  card("signal", "tín hiệu điều khiển tiến trình", "/ˈsɪɡ.nəl/", "noun", "📡", "Bạn gửi SIGTERM hay SIGKILL để dừng process."),
  card("cron job", "tác vụ chạy theo lịch", "/krɒn dʒɒb/", "noun", "⏰", "Lệnh hoặc script tự chạy vào khung giờ cố định."),
  card("journalctl", "journalctl", "/ˌdʒɜː.nəl siː tiː el/", "noun", "📜", "Lệnh đọc log từ systemd journal.", {
    frequency: "medium",
  }),
  card("grep", "lọc chuỗi bằng grep", "/ɡrep/", "verb", "🔎", "Bạn tìm nhanh dòng log có lỗi hoặc pattern cần soi.", {
    frequency: "high",
  }),
  card("tail", "xem cuối file", "/teɪl/", "verb", "📄", "Bạn tail log để theo dõi dòng mới đổ ra liên tục."),
  card("stderr", "luồng lỗi chuẩn", "/ˌes tiː diː ˈer/", "noun", "🚨", "Ứng dụng ghi lỗi sang luồng stderr.", {
    alternativesEn: ["standard error"],
  }),
  card("stdout", "luồng xuất chuẩn", "/ˌes tiː diː ˈaʊt/", "noun", "🧾", "Ứng dụng in output bình thường sang stdout.", {
    alternativesEn: ["standard output"],
  }),
  card("exit code", "mã thoát", "/ˈek.sɪt kəʊd/", "noun", "🚪", "Lệnh kết thúc với 0 hoặc mã lỗi khác để báo trạng thái.", {
    frequency: "high",
  }),
  card("stack trace", "vết ngăn xếp lỗi", "/stæk treɪs/", "noun", "🧵", "Danh sách call stack giúp bạn truy ra lỗi xảy ra ở đâu.", {
    frequency: "high",
  }),
  card("OOM killer", "trình diệt do hết bộ nhớ", "/uː oʊ em ˈkɪl.ər/", "noun", "💥", "Kernel giết process vì máy cạn RAM.", {
    alternativesEn: ["out-of-memory killer"],
  }),
  card("memory leak", "rò rỉ bộ nhớ", "/ˈmem.ər.i liːk/", "noun", "🫗", "Ứng dụng giữ RAM mãi không nhả khiến máy ngày càng nặng."),
  card("disk usage", "mức dùng ổ đĩa", "/dɪsk ˈjuː.sɪdʒ/", "noun", "💿", "Bạn kiểm tra dung lượng đĩa đang đầy bao nhiêu."),
  card("inode", "inode", "/ˈaɪ.nəʊd/", "noun", "🧮", "Ổ đĩa còn chỗ nhưng vẫn đầy vì hết inode cho file nhỏ."),
  card("mount point", "điểm gắn ổ", "/maʊnt pɔɪnt/", "noun", "🗂️", "Thư mục nơi filesystem được gắn vào để truy cập."),
  card("file descriptor", "mô tả tệp", "/faɪl dɪˈskrɪp.tər/", "noun", "🪢", "Tiến trình mở quá nhiều socket hoặc file sẽ đụng giới hạn này."),
  card("timeout", "quá thời gian chờ", "/ˈtaɪm.aʊt/", "noun", "⏱️", "Request hoặc lệnh không phản hồi kịp nên bị cắt.", {
    frequency: "high",
  }),
  card("connection refused", "kết nối bị từ chối", "/kəˈnek.ʃən rɪˈfjuːzd/", "phrase", "🚫", "Port đích không mở hoặc service chưa lắng nghe."),
  card("throttling", "giới hạn tốc độ", "/ˈθrɒt.lɪŋ/", "noun", "🐢", "Hệ thống bị bóp tốc độ do vượt quota hoặc rate limit."),
  card("backoff", "lùi nhịp thử lại", "/ˈbæk.ɒf/", "noun", "↩️", "Ứng dụng chờ lâu dần giữa các lần retry để tránh dồn tải."),
  card("crash loop", "vòng lặp crash", "/kræʃ luːp/", "noun", "🔁", "Container cứ khởi động rồi chết lặp đi lặp lại.", {
    alternativesEn: ["CrashLoopBackOff"],
    learnerHint: "Trên Kubernetes rất hay gặp cụm CrashLoopBackOff.",
  }),
  card("unhealthy", "không khỏe", "/ʌnˈhel.θi/", "adjective", "🩺", "Probe báo service không đạt điều kiện sẵn sàng."),
  card("5xx error", "lỗi 5xx phía máy chủ", "/faɪv eks eks ˈer.ər/", "noun", "📉", "Lỗi phía server như 500, 502, 503 hay 504."),
  card("4xx error", "lỗi 4xx phía client", "/fɔːr eks eks ˈer.ər/", "noun", "📭", "Client gọi sai request, sai quyền hoặc sai đường dẫn."),
  card("retry", "thử lại", "/riːˈtraɪ/", "verb", "🔁", "Hệ thống thử gửi request lại sau khi thất bại tạm thời.", {
    frequency: "high",
  }),
];
