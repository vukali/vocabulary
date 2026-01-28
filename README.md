# Vocabulary App (React + Vite)

Ứng dụng học từ vựng (flashcard + quiz) có **SRS (spaced repetition)**, thống kê, lịch sử học, và chạy được bằng **Docker Compose**.

## Yêu cầu môi trường

- **Git**: để clone/push code
- **Node.js**:
  - Khuyến nghị **Node 20.19+** hoặc **Node 22.12+** (Vite 7 yêu cầu)  
  - Nếu bạn chỉ chạy bằng Docker thì **không cần cài Node trên máy**
- **Docker Desktop** (khuyến nghị): để chạy app bằng Docker Compose
  - Trên Windows: bật WSL2 integration (nếu bạn chạy docker trong WSL)

## Cấu trúc repo

- `vocab-app/`: source code React/Vite
  - `Dockerfile`, `docker-compose.yml`: chạy production bằng Docker
  - `src/`: code UI + logic (bao gồm `src/utils/srs.ts`)

## Chạy local (dev)

> Dành cho bạn muốn dev nhanh, hot reload.

```bash
cd vocab-app
npm install
npm run dev
```

Mặc định chạy ở `http://localhost:5173`.

## Build local (production bundle)

```bash
cd vocab-app
npm install
npm run build
```

## Chạy bằng Docker Compose (khuyến nghị để deploy/test production)

> App sẽ được build bằng Node (trong Docker) và serve bằng nginx trong container.

```bash
cd vocab-app
docker-compose build
docker-compose up -d
```

Mở app tại:
- `http://localhost:8080`

Stop:

```bash
docker-compose down
```

## Troubleshooting

### 1) Màn hình trắng / không load UI

- Thử **Ctrl+F5** (hard refresh) hoặc mở **Incognito** để tránh cache.
- Kiểm tra log container:

```bash
docker logs vocab-app-vocab-app-1 --tail 200
```

### 2) Lỗi Node khi chạy local (Vite yêu cầu Node mới)

Nếu bạn chạy local và gặp thông báo kiểu: “Vite requires Node.js 20.19+ …”
- Cập nhật Node lên **20.19+** hoặc **22.12+**
- Hoặc chạy bằng Docker Compose để khỏi phụ thuộc Node máy.

### 3) Docker daemon không chạy

- Mở **Docker Desktop** và chờ status “Running”
- Trên WSL2: bật “Use WSL 2 based engine” và integration cho distro bạn dùng.

## Push project lên GitHub (repo `vukali/vocabulary`)

Repo đích: [`https://github.com/vukali/vocabulary.git`](https://github.com/vukali/vocabulary.git)

Chạy ở thư mục repo root (nơi có folder `vocab-app/`):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/vukali/vocabulary.git
git push -u origin main
```

### Nếu bị hỏi đăng nhập / lỗi auth khi push

- GitHub không dùng password thường cho Git nữa → dùng **Personal Access Token (PAT)** làm password
- Hoặc dùng GitHub CLI:

```bash
gh auth login
git push -u origin main
```

## Ghi chú SRS

Tiến độ học được lưu ở `localStorage` theo category (key dạng `vocabSrs:<category>`).
