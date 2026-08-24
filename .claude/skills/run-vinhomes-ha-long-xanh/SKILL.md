---
name: run-vinhomes-ha-long-xanh
description: Build, chạy, chụp ảnh và kiểm tra trang landing Vinhomes Global Gate Hạ Long. Dùng khi cần run/start/build/test/screenshot site này, hoặc kiểm tra chuyển động (màn mở đầu, thị sai, mảng bị ghim, thư viện cuộn ngang) có còn hoạt động không.
---

# Chạy và điều khiển trang Vinhomes Global Gate Hạ Long

Trang landing một dự án bất động sản. **Next.js 16.3 (App Router, Turbopack) +
React 19 + TypeScript strict + Tailwind 4 + GSAP/ScrollTrigger + Lenis.**

Gần như toàn bộ giá trị của trang nằm ở **chuyển động**, mà chuyển động thì
không thể kiểm bằng cách đọc HTML. Nên đường chính để agent làm việc với trang
này là **`driver.mjs`** — nó mở Chrome thật, cuộn trang, chụp ảnh từng chặng, và
đo đúng những thứ đã từng hỏng ở dự án này.

Mọi đường dẫn dưới đây tính từ thư mục gốc dự án (`D:\vinhomes_ha_long_xanh`).

## Chuẩn bị

Cần Node 20+ (đã chạy trên v24.15.0) và **Chrome cài sẵn trên máy** — driver
dùng luôn Chrome đó qua `channel: "chrome"` nên không phải tải thêm trình duyệt.

```bash
npm install
```

Ảnh dự án không nằm trong kho mã (ảnh gốc trên Google Drive của chủ đầu tư nặng
tới ~100MB một tấm). Tải và nén về cỡ web:

```bash
npm run assets
```

Script bỏ qua ảnh đã có, nên chạy lại rất rẻ. Kết quả: `public/images/*.webp`
(~9MB) và `src/data/images.generated.ts`.

## Build

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run lint` chạy với `--max-warnings 0`. Từ Next.js 16, **`next build` KHÔNG
còn tự chạy linter** — phải gọi riêng.

## Chạy — đường của agent

Mở máy chủ ở một cửa sổ, rồi chạy driver ở cửa sổ khác:

```bash
npx next start -p 3210
```

```bash
node .claude/skills/run-vinhomes-ha-long-xanh/driver.mjs
```

Kết quả in ra như sau (đây là lần chạy thật):

```
──────── KẾT QUẢ ────────
  giảm chuyển động     : tắt
  màn mở đầu kết thúc  : có
  mảng bị ghim         : 2
  tràn ngang           : không
  ảnh chưa tải         : 0/14
  lỗi trên console     : 0
✓ đạt
```

Ảnh chụp và `bao-cao.json` nằm ở
`.claude/skills/run-vinhomes-ha-long-xanh/anh-chup/`. **Hãy mở ảnh ra nhìn** —
driver chỉ đo được cái đo được, nó không biết trang có xấu hay không.

Bốn chỉ số trong bảng đều là lỗi ĐÃ THẬT SỰ xảy ra, không phải kiểm tra cho có:

| Chỉ số | Ý nghĩa khi sai |
|---|---|
| `giảm chuyển động: BẬT` | Máy đang chạy tắt hết hoạt ảnh. **Trang không hỏng.** |
| `màn mở đầu kết thúc: KHÔNG` | Lớp phủ kẹt lại che trang; JS lỗi ở `preloader.tsx` |
| `mảng bị ghim: 0` | ScrollTrigger đo sai — xem Gotchas #2. **Chỉ tính là lỗi ở trang chủ**; các trang khác không có mảng nào cần ghim. |
| `tràn ngang: CÓ` | Có thanh cuộn ngang ở đáy trang |

Driver trả mã lỗi khác 0 khi ba điều kiện cuối sai, nên gắn vào máy dựng được.

Tham số:

```bash
node .claude/skills/run-vinhomes-ha-long-xanh/driver.mjs --duong-dan=/du-an
node .claude/skills/run-vinhomes-ha-long-xanh/driver.mjs --hien-cua-so
node .claude/skills/run-vinhomes-ha-long-xanh/driver.mjs --giam-chuyen-dong
node .claude/skills/run-vinhomes-ha-long-xanh/driver.mjs --buoc=12
```

`--giam-chuyen-dong` giả lập máy đã tắt hoạt ảnh — dùng để kiểm tra trang vẫn
đọc được trọn vẹn khi không có chuyển động nào.

## Chạy — đường của người

```bash
npm run dev
```

Mở http://localhost:3000. Đường này để chỉnh giao diện bằng mắt; nó không kiểm
được gì tự động.

## Gotchas

**1. `prefers-reduced-motion` tắt SẠCH mọi chuyển động — và trông y hệt lỗi.**
Đây là cái bẫy đắt nhất của dự án này. Windows: Cài đặt › Trợ năng › Hiệu ứng
hình ảnh › Hiệu ứng hoạt ảnh. Tắt nó đi thì màn mở đầu biến mất, không mảng nào
ghim, marquee đứng im, thị sai không chạy — và mọi thứ vẫn build xanh. Cả nhóm
đã mất một vòng làm lại vì tưởng code hỏng. **Driver luôn ép
`reducedMotion: "no-preference"`** để ảnh chụp phản ánh đúng thiết kế.

**2. ScrollTrigger đo trang TRƯỚC khi ảnh lazy-load xong.** `next/image` lazy
mọi ảnh trừ ảnh có `priority`. ScrollTrigger tính vị trí các mốc ngay lúc khởi
tạo, khi trang còn ngắn hơn thực tế rất nhiều; ảnh tải dần làm trang dài ra
nhưng mốc vẫn giữ số đo cũ → **mảng không ghim, chuyển động rơi sai chỗ, phần tử
tràn ngang**. Chữa bằng `ResizeObserver` theo dõi `document.body` rồi gọi
`ScrollTrigger.refresh()` (xem `src/components/ui/smooth-scroll.tsx`). Đừng gỡ.

**3. Lenis giữ quyền cuộn — `window.scrollTo` vô tác dụng.** Nó sẽ kéo vị trí về
lại ngay ở khung hình kế tiếp. Muốn cuộn bằng code thì hoặc phát sự kiện con lăn
thật (`page.mouse.wheel` như driver làm), hoặc lấy thể hiện Lenis qua
`src/lib/motion/lenis-store.ts` rồi gọi `lenis.scrollTo`.

**4. `sessionStorage` sống sót qua Ctrl+Shift+R.** Nó chỉ mất khi ĐÓNG HẲN tab.
Màn mở đầu từng bị khoá bằng cơ chế này và hậu quả là không ai — kể cả người
đang làm trang — còn thấy nó nữa từ lần vào thứ hai. Hiện `CHAY_MOI_LAN = true`
trong `src/components/ui/preloader.tsx`; đổi về `false` trước khi phát hành.

**5. Trên Windows, `next start` giữ file trong `.next` và làm hỏng lần build kế.**
Luôn dừng máy chủ trước khi build:

```powershell
$c = Get-NetTCPConnection -LocalPort 3210 -State Listen -ErrorAction SilentlyContinue
if ($c) { $c.OwningProcess | Sort-Object -Unique | ForEach-Object { Stop-Process -Id $_ -Force } }
```

**6. Hiệu ứng chữ trồi lên phải có đệm âm, nếu không mất dấu tiếng Việt.**
`.split-word` dùng `overflow: hidden` làm ô cắt; không có
`padding-bottom: 0.16em; margin-bottom: -0.16em` thì nét thòng của g, y, p và
**dấu nặng** bị xén cụt. Lỗi này chỉ lộ ra với tiếng Việt.

**7. Chữ nghiêng trong tiêu đề phải cắt theo cặp dấu sao TRƯỚC, rồi mới cắt từ.**
`SplitReveal` nhận `"Thành phố *kỳ quan*"`. Cắt theo khoảng trắng trước thì
`*kỳ` và `quan*` mỗi mảnh chỉ còn một dấu sao, không mảnh nào được nhận là
nghiêng, và phần nhấn **biến mất lặng lẽ** — không lỗi, không cảnh báo.

**8. Font phải khai báo bộ ký tự `vietnamese`.** `Cormorant_Garamond` và
`Be_Vietnam_Pro` đều có, nhưng `subsets: ["latin"]` thôi thì chữ có dấu rơi về
font thay thế. Kiểm bằng cách tìm `U+1EA0-1EF9` trong file CSS build ra.

**9. Ảnh dự án lấy từ Google Drive công khai bằng hai địa chỉ này:**
`https://drive.google.com/embeddedfolderview?id=<ID>#list` trả HTML tĩnh liệt kê
thư mục (trang Drive thường là JS nên không đọc được), và
`https://drive.usercontent.google.com/download?id=<ID>&export=download` tải file.
Vài file trả về trang cảnh báo quét virus thay vì ảnh — `sharp` sẽ báo
`Input file contains unsupported image format`; bỏ qua file đó.

**10. `data-preloaded` trên `<html>` là cờ chốt chặn hiệu ứng chữ.** CSS giữ chữ
nằm im tới khi màn mở đầu xong. Nếu JS lỗi trước khi gắn cờ, **toàn bộ tiêu đề
trên trang sẽ vô hình**. Có `<noscript>` gỡ chặn trong `layout.tsx`.

## Troubleshooting

| Triệu chứng | Nguyên nhân & cách chữa |
|---|---|
| `Error: listen EADDRINUSE: :::3210` | Máy chủ cũ chưa chết. Dùng đoạn PowerShell ở Gotcha #5. |
| Driver báo `mảng bị ghim: 0` | ScrollTrigger đo sai (Gotcha #2), hoặc máy đang bật giảm chuyển động (Gotcha #1) — dòng đầu bảng kết quả cho biết cái nào. |
| Ảnh chụp ra tĩnh hoàn toàn | Kiểm dòng `giảm chuyển động` trong bảng kết quả trước khi sửa code. |
| `Module '"@/data/project"' has no exported member 'X'` | `src/data/project.ts` là nguồn duy nhất cho mọi nội dung; đổi tên field ở đó là các trang gãy theo. Chạy `npm run typecheck` sẽ chỉ đúng chỗ. |
| `npm run assets` báo `unsupported image format` | Google Drive trả trang cảnh báo thay vì ảnh (Gotcha #9). File đó bị bỏ qua, các file khác vẫn chạy. |
| Lỗi lint `react-hooks/set-state-in-effect` | Next 16 bật rule này. Đừng gọi `setState` thẳng trong thân effect — bọc vào `requestAnimationFrame` hoặc `setTimeout`, hoặc xoá hẳn nếu CSS đã lo (xem `use-in-view.ts`). |

## Bản đồ mã nguồn

| Đường dẫn | Vai trò |
|---|---|
| `src/data/project.ts` | **Toàn bộ nội dung dự án.** Sửa ở đây, không sửa trong trang. |
| `src/data/news.ts` | Kiểu `BaiViet` — hợp đồng dữ liệu để Antigravity đẩy bài vào sau này |
| `src/lib/motion/gsap.ts` | Đăng ký plugin + hàm `giamChuyenDong()` |
| `src/components/ui/smooth-scroll.tsx` | Nối Lenis ↔ GSAP ↔ ScrollTrigger (Gotcha #2, #3) |
| `src/components/motion/` | Thị sai, ảnh nở toàn màn, thư viện cuộn ngang, nghiêng theo chuột, con trỏ |
| `scripts/fetch-assets.mjs` | Tải + nén ảnh từ Drive |
