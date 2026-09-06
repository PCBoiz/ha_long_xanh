# Công cụ và phương pháp — 11 nguồn đã đọc

Chủ trang gửi 11 nguồn ngày 07/09/2026. Đọc hết rồi, dưới đây là kết luận từng
cái: **dùng / dùng có giới hạn / bỏ**, kèm lý do.

Nguyên tắc chấm: chỉ tính giá trị **cho dự án này** — một trang bất động sản
một người vận hành, chạy trên một máy chủ 4 GB. Một công cụ tốt cho đội mười
người có thể là gánh nặng ở đây.

---

## ✅ DÙNG NGAY — bốn cái

### C1 · Phương pháp "grilling"
`github.com/mattpocock/skills` → `productivity/grilling`

Hai câu đáng giá nhất:

> *"Hỏi cả biên trong một lượt: đánh số từng câu và đưa sẵn câu trả lời tôi đề
> xuất."*
>
> *"Tìm ra sự thật là việc của tôi, không bao giờ là việc của người dùng."*

Câu thứ hai chính là thứ tôi đã làm suốt đêm nay mà chưa gọi tên: không hỏi
"máy chủ chạy hệ gì" mà tự đọc lời chào SSH; không hỏi "biểu mẫu hỏng ở đâu" mà
tự đọc nhật ký. Câu thứ nhất thì tôi **làm sai** — tôi hỏi từng câu rời rạc qua
nhiều lượt thay vì gom thành một vòng đánh số có sẵn đề xuất.

**Áp dụng:** mọi vòng hỏi từ nay đánh số, kèm câu trả lời tôi đề xuất, và chỉ
hỏi những câu mà **câu trả lời không phụ thuộc câu khác đang treo**.

**Giá:** miễn phí.

### C2 · Chrome DevTools MCP
`github.com/ChromeDevTools/chrome-devtools-mcp`

**Giá trị thực tế cao nhất trong 11 nguồn.** Nó cho tôi điều khiển một trình
duyệt Chrome thật: ghi vết hiệu năng, xem thác nước mạng, đọc lỗi console kèm
vết ngăn xếp đã ánh xạ, chụp màn hình ở đúng kích thước điện thoại.

Vì sao đáng: đêm nay tôi đo trang bằng **mã HTTP**, và mã HTTP đã lừa tôi hai
lần — `/tin-tuc` trả 200 trong khi cơ sở dữ liệu hỏng, `/lien-he` trả 200 trong
khi biểu mẫu chết. Công cụ này nhìn thấy đúng thứ khách nhìn thấy.

```json
{ "mcpServers": { "chrome-devtools": {
    "command": "npx", "args": ["-y", "chrome-devtools-mcp@latest"] } } }
```

**Cần:** Node LTS + Chrome. **Giá:** miễn phí.
**Lưu ý:** nó phơi nội dung trình duyệt ra ngoài — đừng mở tab có dữ liệu khách
trong lúc chạy. Thêm `--no-usage-statistics` để tắt gửi thống kê.

### C3 · Sổ tay SDLC thời AI (Anthropic)
`claude.com/blog/the-ai-native-sdlc-playbook`

Sáu giai đoạn: Plan → Design → Build → Test → Deploy → Maintain, với ba tài
liệu quy ước — `intent.md` (vấn đề muốn giải), `spec.md` (yêu cầu), `plan.md`
(cách làm) — tất cả nằm trong git.

**Lấy gì:** quy ước ba file, và nguyên tắc *"con người vẫn chịu trách nhiệm cho
mọi quyết định cần phán đoán"*. Kho này đã có `AGENTS.md` đóng vai `CLAUDE.md`.

**Bỏ gì:** năm trong sáu giai đoạn có vòng duyệt nhiều lớp dành cho đội đông
người và mã bị quản lý chặt. Một người vận hành mà dựng đủ sáu tầng thì thời
gian đi hết vào thủ tục.

### C4 · Archify
`github.com/tt-a1i/archify` · `npx skills add tt-a1i/archify -g`

Vẽ sơ đồ kiến trúc từ mô tả bằng lời, xuất ra HTML một file tự chứa (kèm PNG /
SVG). Năm kiểu: kiến trúc, luồng công việc, tuần tự, luồng dữ liệu, vòng đời.

**Vì sao hợp ở đây:** chủ trang đã cần một file PDF để gửi cho bên ngoài xem.
Một sơ đồ "khách → Caddy → Next.js → Neon / Google Sheet" nói được trong mười
giây thứ mà ba trang chữ nói không xong. **Giá:** miễn phí, MIT.

---

## ⚠️ DÙNG CÓ GIỚI HẠN — ba cái

### C5 · Uiverse.io
Miễn phí, **giấy phép MIT**, hơn 3.000 thành phần CSS/Tailwind do cộng đồng làm.

**Dùng được:** tham khảo chi tiết nhỏ — trạng thái nút khi bấm, hiệu ứng chờ,
ô đánh dấu.

**Bẫy:** mỗi thành phần mang sẵn phong cách riêng của người làm ra nó
(neumorphism, glassmorphism, viền phát sáng). Dán thẳng vào là trang có hai
giọng thị giác đánh nhau. **Quy tắc: chép ý tưởng, viết lại bằng biến màu của
trang (`--color-jade`, `--color-ink`…), không chép nguyên khối CSS.**

### C6 · agency-agents
`github.com/msitarzewski/agency-agents` — 230+ tác tử chia 21 ngành.

Con số 230 là điểm yếu chứ không phải điểm mạnh: cài hết vào một dự án bất động
sản một người là tạo ra một danh mục không ai đọc. Ba cái đáng lấy riêng:
**Accessibility Auditor**, **SEO Specialist**, **Evidence Collector**.

### C7 · ui-ux-pro-max-skill
Bộ sinh hệ thống thiết kế: 79 phong cách, 192 bảng màu, 74 cặp phông, 119 chỉ
dẫn UX.

**Không hợp phần chính:** nó *sinh ra* một hệ thống thiết kế mới. Trang này đã
có sẵn một hệ thống, đã được một bản kiểm định bên ngoài khen, và chỉ đạo của
chủ trang là **"nới trong tinh thần cũ"** chứ không phải làm lại.

**Hợp phần phụ:** 119 chỉ dẫn UX và phần chống mẫu dùng làm danh sách rà được.

---

## ❌ BỎ — bốn cái, và lý do

### C8 · HorizonX — 24,99 → 99,99 USD/tháng
Thư viện UI kit và mẫu Figma trả tiền. Mua mẫu dựng sẵn để đắp lên một trang đã
có bản sắc riêng là đi ngược đúng thứ làm nên giá trị của nó. Bản kiểm định bên
ngoài khen phần nhận diện hiện tại — tiền này mua về thứ làm nó nhạt đi.

### C9 · shaders.com
Thư viện WebGPU. Đẹp thật, nhưng ba lý do đứng riêng cũng đủ để bỏ:

1. Chỉ đạo là **không phá Hero, không đổi tone**. Nền shader là đổi tone.
2. WebGPU chưa chạy đều trên điện thoại tầm trung — đúng thiết bị của phần lớn
   người mua nhà ở Việt Nam. Trang nặng thêm mà một nửa khách không thấy gì.
3. Nền động lấp lánh là **đúng dấu hiệu nhận biết của trang do AI dựng**. Trang
   này bán niềm tin, không bán hiệu ứng.

### C10 · contentcore.xyz — 9,99 USD/tháng
Đọc kỹ thì đây là công cụ **soạn rồi xuất nội dung ra ảnh/video** — không phải
SEO, không phải GEO, không phải CMS.

Chỗ nghẽn của dự án không nằm ở soạn nội dung (Antigravity đã sinh được) mà ở
**kiểm chất lượng và đưa lên trang**. Công cụ này không chạm vào chỗ nghẽn đó.

### C11 · system-design-primer
Tài liệu kinh điển, nhưng nó dạy kiến trúc phân tán cho quy mô hàng triệu người
dùng. Ở đây: **một** máy chủ, **một** ứng dụng, cơ sở dữ liệu có sẵn dịch vụ lo.

Khoảng 5% có ích ngay — bộ đệm, gom kết nối, đánh chỉ mục, CDN — và 5% đó đã
nằm trong `01-HA-TANG.md` dưới dạng việc cụ thể. Đọc hết cuốn lúc này là học
cách giải bài toán mình chưa có.

**Đọc lại khi:** trang vượt ~50.000 lượt xem/tháng, hoặc một máy chủ không đủ.

---

## Bốn thứ tôi bổ sung, chủ trang chưa gửi

| | Cái gì | Vì sao | Giá |
|---|---|---|---|
| C12 | **Giám sát ngoài** (UptimeRobot / Better Stack) | Trang chết lúc 2h sáng thì hiện không ai biết. Đây là lỗ hổng lớn nhất còn lại | miễn phí |
| C13 | **fail2ban** | Cổng SSH đang mở ra internet, hiện không có gì chặn máy dò mật khẩu | miễn phí |
| C14 | **Chốt chặn `"use server"`** | Cùng một cái bẫy đã sập **ba lần** trong kho này. Lần thứ ba làm chết biểu mẫu trên máy chủ thật. Một script kiểm 10 dòng chặn được lần thứ tư | tự viết |
| C15 | **Băm tri giác cho ảnh** | Băm file chỉ bắt được trùng tuyệt đối. Vấn đề thật là *giống nhau*, phải đo bằng cấu trúc sáng tối. `sharp` đã có sẵn trong kho, không cần cài gì | tự viết |
