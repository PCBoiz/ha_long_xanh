# Hạ Long Xanh 360

Trang tư vấn Vinhomes Global Gate Hạ Long. Next.js 16 · React 19 · Tailwind v4 ·
Drizzle + Neon Postgres.

## Bắt đầu từ đâu

| Muốn làm gì | Đọc file nào |
|---|---|
| **Đưa trang lên thật** | **[BAT-DAU-TAI-DAY.md](BAT-DAU-TAI-DAY.md)** ← bắt đầu ở đây |
| Nhận thông tin khách đăng ký vào Google Sheet | [NHAN-DANG-KY.md](NHAN-DANG-KY.md) |
| Điền số liệu dự án (giá, quỹ căn, tiến độ) | [DIEN-DU-LIEU.md](DIEN-DU-LIEU.md) |
| So sánh nhà cung cấp máy chủ | [NGHIEN-CUU-MAY-CHU.md](NGHIEN-CUU-MAY-CHU.md) |

Bốn file `TRIEN-KHAI.md`, `LEN-VPS.md`, `DANH-SACH-TRIEN-KHAI.md` và
`DEPLOY-VERCEL.md` viết trước khi chốt hướng triển khai và mâu thuẫn nhau. Chúng
còn trong kho để tra cứu chi tiết, **không phải để làm theo** — mỗi file đã có
bảng báo ở đầu.

## Chạy ở máy

```bash
npm install
cp .env.example .env      # rồi mở ra điền
npm run dev               # http://localhost:3000
```

Chưa điền `DATABASE_URL` thì trang vẫn chạy: phần bài viết đọc từ
`.data/bai-viet.jsonl` để xem được giao diện mà không phải dựng cơ sở dữ liệu
trước.

## Các lệnh

| Lệnh | Làm gì |
|---|---|
| `npm run dev` | Chạy ở máy |
| `npm run build` | Dựng bản chạy thật |
| `npm run lint` | Soát mã (không cho phép cảnh báo nào) |
| `npm run typecheck` | Kiểm kiểu TypeScript |
| `npm run db:generate` | Sinh migration sau khi sửa `src/db/schema.ts` |
| `npm run db:migrate` | Áp migration lên cơ sở dữ liệu |
| `npm run audit` | Đo trang bằng trình duyệt thật |
| `npm run assets` | Tải và nén ảnh |

## Hai hàng rào cần biết trước khi sửa mã

**Bài do Antigravity đẩy sang KHÔNG lên thẳng trang.** Chúng vào hàng chờ tại
`/duyet-bai` và chỉ hiện sau khi có người bấm duyệt. Trước hàng chờ còn một cổng
chặn tự động (`src/lib/cong-chan.ts`) từ chối nội dung chạm luật cấm — mã
voucher, cam kết lợi nhuận, danh xưng "nhất", số điện thoại lạ.

**Không được bịa số.** Giá, quỹ căn, chính sách, pháp lý, tiến độ, khoảng cách —
mọi con số trên trang đều phải đối chiếu hồ sơ gốc và ghi rõ căn cứ. Xem
`AGENTS.md`.
