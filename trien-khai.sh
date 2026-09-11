#!/usr/bin/env bash
#
# Cập nhật trang lên bản mới nhất. Chạy TRÊN MÁY CHỦ:
#
#     ./trien-khai.sh
#
# Script này cố ý DỪNG LẠI khi gặp bất thường thay vì cố chạy tiếp. Với một
# trang bán hàng, dừng ở bản cũ đang chạy tốt luôn tốt hơn là lên một bản hỏng.

set -euo pipefail
# -e : gặp lỗi là dừng ngay
# -u : dùng biến chưa đặt là lỗi (bắt được lỗi gõ nhầm tên biến)
# -o pipefail : lỗi giữa chuỗi ống dẫn cũng tính là lỗi

THU_MUC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$THU_MUC"

xanh() { printf '\033[0;32m%s\033[0m\n' "$1"; }
vang() { printf '\033[0;33m%s\033[0m\n' "$1"; }
do_()  { printf '\033[0;31m%s\033[0m\n' "$1" >&2; }

# Hâm nóng bộ đệm ảnh.
#
# VÌ SAO CẦN: Next chỉ tạo bản ảnh đã tối ưu khi có yêu cầu đầu tiên, rồi mới
# đệm lại. Đo được ~0,65 giây mỗi cỡ ảnh. Nếu không làm gì, người trả cái giá
# đó chính là KHÁCH ĐẦU TIÊN mở trang sau mỗi lần triển khai.
#
# Bước này duyệt qua các trang chính ngay sau khi bật, để máy chủ dựng xong ảnh
# trước khi có khách. Chạy trong nền và KHÔNG được làm hỏng việc triển khai nếu
# lỗi — trang đã chạy rồi, đây chỉ là tối ưu thêm.
ham_nong_anh() {
  xanh "→ Hâm nóng bộ đệm ảnh (chạy nền, không phải chờ)…"
  (
    # Duong dan phai la ten MOI. Ten cu van tra 200 nho chuyen huong 301, nen
    # dung nham khong bao loi gi - chi la bo dem anh cua hai trang do khong bao
    # gio duoc ham nong, va khach dau tien phai cho may chu ma hoa anh.
    for duong in / /quy-hoach /tien-ich /du-an /tin-tuc \
                 /gia-global-gate-ha-long /quy-can-global-gate-ha-long \
                 /vi-tri-global-gate-ha-long /tien-do-global-gate-ha-long \
                 /phan-khu/paradise-bay /san-pham/biet-thu-bien; do
      # Tải HTML rồi BÓC RA các đường dẫn `/_next/image?...` bên trong.
      #
      # Gọi thẳng trang HTML là KHÔNG đủ: `curl` chỉ lấy đúng file HTML, nó
      # không đọc thẻ <img> rồi đi tải ảnh như trình duyệt. Phải tự lấy danh
      # sách ảnh rồi gọi từng cái thì máy chủ mới thật sự mã hoá.
      curl -s --max-time 60 "https://${TEN_MIEN}${duong}" 2>/dev/null \
        | grep -oE '/_next/image\?url=[^"&]*&(amp;)?w=[0-9]+&(amp;)?q=[0-9]+' \
        | sed 's/&amp;/\&/g' \
        | sort -u \
        | while read -r anh; do
            # Header `Accept` quyết định định dạng máy chủ sinh ra — thiếu nó
            # thì máy chủ trả ảnh gốc và bộ đệm WebP vẫn nguội.
            curl -s -o /dev/null --max-time 30 \
              -H "Accept: image/webp,*/*" \
              "https://${TEN_MIEN}${anh}" || true
          done
    done
  ) >/dev/null 2>&1 &
}

# Kiểm robots.txt CÓ ĐÚNG như .env nói không.
#
# VÌ SAO CẦN MỘT BƯỚC RIÊNG CHO VIỆC NÀY: giá trị `NEXT_PUBLIC_CHO_LAP_CHI_MUC`
# được nướng vào lúc dựng ảnh Docker. Sửa `.env` rồi chạy `docker compose up -d`
# mà KHÔNG dựng lại thì trang vẫn mang giá trị cũ.
#
# Hỏng ở đây hoàn toàn im lặng — trang chạy bình thường, chỉ là không công cụ
# tìm kiếm nào và không trợ lý AI nào vào được. Không kiểm thì vài tuần sau mới
# phát hiện, mà lúc đó đã mất vài tuần lập chỉ mục.
kiem_lap_chi_muc() {
  local muon_mo="${NEXT_PUBLIC_CHO_LAP_CHI_MUC:-0}"
  local noi_dung
  noi_dung="$(curl -s --max-time 20 "https://${TEN_MIEN}/robots.txt" 2>/dev/null || true)"

  if [[ "$muon_mo" == "1" ]]; then
    if grep -q "Disallow: /" <<<"$noi_dung"; then
      vang "⚠ .env đặt mở chỉ mục nhưng robots.txt VẪN ĐANG CHẶN."
      vang "  Chạy lại với dựng lại ảnh:  docker compose build --no-cache && docker compose up -d"
    elif grep -qi "GPTBot" <<<"$noi_dung"; then
      xanh "✓ robots.txt đang mở, có cả bot trợ lý AI."
    else
      vang "⚠ robots.txt mở nhưng không thấy danh sách bot AI — kiểm lại src/app/robots.ts"
    fi
  else
    xanh "✓ robots.txt đang chặn (đúng với NEXT_PUBLIC_CHO_LAP_CHI_MUC=0)."
  fi
}

# ───────────────────────── 1. Kiểm tra trước khi làm gì ─────────────────────

if [[ ! -f .env ]]; then
  do_ "✗ Không thấy file .env"
  do_ "  Chạy:  cp .env.example .env  rồi mở ra điền giá trị thật."
  exit 1
fi

# Bắt các ô bắt buộc còn trống. Thiếu một ô mà vẫn khởi động thì trang lên
# được nhưng hỏng ngầm — ví dụ thiếu DATABASE_URL thì bài viết ghi vào file
# tạm rồi biến mất ở lần cập nhật sau.
thieu=()
for bien in TEN_MIEN TEN_MIEN_PHU EMAIL_SSL NEXT_PUBLIC_SITE_URL DATABASE_URL INGEST_TOKEN; do
  giaTri="$(grep -E "^${bien}=" .env | head -1 | cut -d= -f2- || true)"
  [[ -z "${giaTri// }" ]] && thieu+=("$bien")
done
if (( ${#thieu[@]} > 0 )); then
  do_ "✗ File .env còn thiếu giá trị: ${thieu[*]}"
  exit 1
fi

# LEAD_WEBHOOK_URL — CẢNH BÁO chứ không CHẶN, và đây là một lựa chọn.
#
# Thiếu nó thì trang vẫn chạy đúng, chỉ là mọi lượt khách đăng ký rơi vào file
# tạm bên trong hộp chứa rồi mất ở lần triển khai kế tiếp. Hỏng im lặng, đúng
# loại nguy hiểm nhất — nhưng CHẶN triển khai vì nó thì sai: có lúc người ta
# chỉ đang dựng bản xem thử, chưa cần nhận lead.
#
# Nên: nói to, nói rõ hậu quả, rồi vẫn cho đi tiếp.
lead_hook="$(grep -E '^LEAD_WEBHOOK_URL=' .env | head -1 | cut -d= -f2- || true)"
lead_hook="${lead_hook%\"}"; lead_hook="${lead_hook#\"}"
lead_token="$(grep -E '^LEAD_WEBHOOK_TOKEN=' .env | head -1 | cut -d= -f2- || true)"
if [[ -z "${lead_hook// }" ]]; then
  vang "⚠ CHƯA ĐẶT LEAD_WEBHOOK_URL."
  vang "  Khách điền biểu mẫu vẫn thấy màn hình cảm ơn, nhưng thông tin của họ"
  vang "  chỉ nằm trong .data/dang-ky.jsonl trên máy chủ — không mất, nhưng không"
  vang "  ai thấy. Đừng chạy quảng cáo khi ô này còn trống."
elif [[ "$lead_hook" != https://* ]]; then
  # Lỗi thật 11/09: thẻ trong Antigravity từng hiện đường dẫn tương đối
  # `/api/v1/lien-he/…`. Dán nguyên thế vào đây thì `fetch` ném lỗi, khách rơi
  # về tệp — vẫn "Đã nhận", bảng vẫn trống.
  vang "⚠ LEAD_WEBHOOK_URL không bắt đầu bằng https:// — website sẽ không gửi được."
  vang "  Chép lại NGUYÊN địa chỉ đầy đủ ở thẻ \"Khách liên hệ → Google Sheets\" trong Antigravity."
elif [[ -z "${lead_token// }" && "$lead_hook" == */api/v1/lien-he/* ]]; then
  vang "⚠ Có LEAD_WEBHOOK_URL trỏ về Antigravity mà CHƯA CÓ LEAD_WEBHOOK_TOKEN."
  vang "  Cổng nhận sẽ từ chối mọi lượt; khách vẫn thấy \"Đã nhận\" nhưng bảng trống."
  vang "  Token chỉ hiện một lần lúc bấm Lập bảng — mất thì bấm lập lại."
fi

# ───────────────────────── 2. Lấy mã mới ────────────────────────────────────

if [[ -d .git ]]; then
  xanh "→ Lấy mã mới nhất…"
  git fetch --quiet origin
  # Cảnh báo nếu có sửa đổi ngay trên máy chủ. `git pull` sẽ đè mất chúng.
  if ! git diff --quiet || ! git diff --cached --quiet; then
    vang "⚠ Có thay đổi chưa lưu ngay trên máy chủ. Đang cất tạm để không mất."
    git stash push -m "trien-khai tự cất $(date -Iseconds)"
  fi
  # ⚠️ SCRIPT NÀY TỰ CẬP NHẬT CHÍNH MÌNH. PHẢI CHẠY LẠI SAU KHI ĐỔI.
  #
  # `bash` không nạp cả file vào bộ nhớ; nó đọc dần theo VỊ TRÍ BYTE trong lúc
  # chạy. `git pull` thay nội dung file ngay giữa chừng thì bash vẫn đọc tiếp
  # từ vị trí cũ — nhưng trong một file đã khác. Nó chạy nhầm dòng, hoặc chạy
  # lại dòng cũ đã bị xoá.
  #
  # Đo ngày 07/09/2026: bản vá cho bước kiểm `use server` được kéo về thành
  # công (17 dòng thêm), nhưng buổi triển khai vẫn chết đúng lỗi mà bản vá đó
  # sửa. Nhìn nhật ký thì thấy `git pull` báo thành công ngay phía trên dòng
  # lỗi — một cảnh tượng không thể giải thích nếu chưa biết bash đọc file kiểu
  # gì.
  #
  # Lỗi này CÓ SẴN từ đầu, chỉ chưa lộ vì chưa lần nào bản kéo về đụng vào
  # chính file này.
  bam_truoc="$(cksum "$0" | cut -d" " -f1,2)"
  git pull --ff-only
  bam_sau="$(cksum "$0" | cut -d" " -f1,2)"
  if [[ "$bam_truoc" != "$bam_sau" ]]; then
    vang "⚠ Bản kéo về có sửa chính script triển khai. Chạy lại bản mới…"
    exec bash "$0" "$@"
  fi
else
  vang "⚠ Thư mục này không phải kho git — bỏ qua bước lấy mã mới."
fi

# ───────────────────────── 3. Kiểm cấu hình Caddy ───────────────────────────
# Làm TRƯỚC khi dựng lại: Caddyfile sai cú pháp thì Caddy không khởi động được
# và trang tắt hẳn. Kiểm mất hai giây, sập trang mất hàng giờ.

xanh "→ Kiểm cú pháp Caddyfile…"
set -a; source .env; set +a
docker run --rm \
  -e TEN_MIEN -e TEN_MIEN_PHU -e EMAIL_SSL \
  -v "$THU_MUC/Caddyfile:/etc/caddy/Caddyfile:ro" \
  caddy:2-alpine caddy validate --config /etc/caddy/Caddyfile

# ───────────────────────── 4. Dựng và bật ───────────────────────────────────

# Chốt chặn `"use server"` — cái bẫy đã sập BA LẦN trong kho này, và lần thứ
# ba làm chết biểu mẫu liên hệ trên máy chủ thật. Nó KHÔNG gãy lúc dựng ảnh,
# nên phải chặn ở đây; để lọt là phát hiện bằng cách mất khách.
xanh "→ Kiểm luật \"use server\"…"
# ⚠️ MÁY CHỦ KHÔNG CÀI NODE — và điều đó là bình thường: mọi thứ chạy trong
# Docker nên host chưa bao giờ cần tới nó.
#
# Gọi `node` thẳng ở đây đã làm gãy nguyên một buổi triển khai ngày 07/09/2026
# với đúng một dòng — `node: command not found` — và `set -e` cho dừng ngay,
# trước cả bước dựng ảnh. Trang không lên được bản mới, mà nguyên nhân thì nằm
# ở một bước kiểm vốn chỉ để phòng xa.
#
# Dùng lại đúng cách đã áp cho Caddyfile ngay bên trên: mượn một hộp chứa dùng
# một lần. Ảnh `node:22-alpine` vốn đã có sẵn trên máy vì Dockerfile dựng bằng
# chính nó, nên không phải tải thêm gì.
if command -v node >/dev/null 2>&1; then
  node scripts/kiem-use-server.mjs
else
  docker run --rm -v "$THU_MUC:/app:ro" -w /app node:22-alpine \
    node scripts/kiem-use-server.mjs
fi

xanh "→ Dựng ảnh mới (vài phút)…"
docker compose build

xanh "→ Chuyển sang bản mới…"
docker compose up -d

# ───────────────────────── 5. Kiểm tra trang còn sống ───────────────────────
# KHÔNG kết thúc bằng "xong" khi chưa thật sự kiểm. Báo thành công rồi để trang
# chết là kiểu hỏng tệ nhất — không ai biết cho tới khi khách gọi điện.

# Kiểm BÍ MẬT CÓ RÒ VÀO ẢNH KHÔNG.
#
# Next.js chép luôn file `.env` vào `.next/standalone/`, và Dockerfile chép cả
# thư mục đó vào ảnh chạy thật. Chặn việc này là nhiệm vụ của `.dockerignore` —
# nhưng một file cấu hình thì im lặng khi bị xoá, nên kiểm bằng mắt máy.
kiem_ro_bi_mat() {
  if docker compose exec -T web sh -c '[ -f /app/.env ]' 2>/dev/null; then
    do_ "⚠ BÍ MẬT ĐANG NẰM TRONG ẢNH: hộp chứa có file /app/.env."
    do_ "  Chuỗi kết nối cơ sở dữ liệu và địa chỉ nhận thông tin khách đi theo"
    do_ "  ảnh này tới bất cứ đâu ảnh được chép tới."
    do_ "  Nguyên nhân gần như chắc chắn: thiếu file .dockerignore (hoặc nó"
    do_ "  không còn dòng .env). Sửa xong dựng lại: docker compose build --no-cache"
  else
    xanh "✓ Ảnh sạch — không có .env bên trong hộp chứa."
  fi
}

# Kiểm ĐƯỜNG TỪ HỘP CHỨA TỚI BẢNG KHÁCH (thêm 12/09).
#
# Sinh ra từ lỗi thật: compose quên chuyển LEAD_WEBHOOK_TOKEN vào hộp chứa,
# khách điền form thấy "Đã nhận" mà bảng trống, và không bước nào của script
# này báo gì. Kiểm `.env` là chưa đủ — thứ cần kiểm là CHÍNH HỘP CHỨA gọi ra
# được: mạng ra ngoài, địa chỉ, token.
#
# Gửi `{"kiemTra":true}`: cổng Antigravity kiểm token rồi trả 200 mà KHÔNG ghi
# dòng nào vào bảng. Chỉ gửi khi đích là cổng Antigravity — đích khác (Apps
# Script, n8n…) không hiểu `kiemTra` và có thể ghi một dòng rác.
#
# Chỉ CẢNH BÁO, không chặn: trang đã chạy, khách rơi về tệp vẫn không mất.
kiem_duong_toi_bang_khach() {
  local kq
  kq="$(docker compose exec -T web node -e '
const u = process.env.LEAD_WEBHOOK_URL || "";
const t = process.env.LEAD_WEBHOOK_TOKEN || "";
if (!u) { console.log("KHONG-DAT"); process.exit(0); }
if (!u.includes("/api/v1/lien-he/")) { console.log("DICH-KHAC"); process.exit(0); }
fetch(u, {
  method: "POST",
  headers: { "Content-Type": "application/json", ...(t ? { Authorization: "Bearer " + t } : {}) },
  body: JSON.stringify({ kiemTra: true }),
  signal: AbortSignal.timeout(15000),
})
  .then(async (r) => {
    const d = await r.json().catch(() => ({}));
    console.log(r.status === 200 && d.kiemTra === true ? "THONG" : "HTTP-" + r.status);
  })
  .catch((e) => console.log("MANG-LOI " + e.message));
' 2>/dev/null || echo "KHONG-CHAY")"

  case "$kq" in
    THONG)
      xanh "✓ Hộp chứa gửi được khách sang bảng (mạng, địa chỉ, token đều đúng)." ;;
    KHONG-DAT|DICH-KHAC)
      ;; # đã cảnh báo ở bước 1, hoặc đích không phải Antigravity — không kiểm
    HTTP-401)
      vang "⚠ Cổng nhận khách TỪ CHỐI TOKEN (HTTP 401)."
      vang "  Dòng LEAD_WEBHOOK_TOKEN trong .env không khớp bảng đang lập — dán lại"
      vang "  đúng token rồi chạy lại ./trien-khai.sh. Khách vẫn được giữ trên máy chủ." ;;
    HTTP-400)
      vang "⚠ Cổng nhận khách trả 400 — Antigravity chưa lên bản có chế độ kiểm tra"
      vang "  (chờ vài phút rồi chạy lại), hoặc website và Antigravity lệch hợp đồng." ;;
    *)
      vang "⚠ Chưa kiểm được đường tới bảng khách: ${kq}"
      vang "  Khách vẫn được giữ trên máy chủ. Xem thêm: docker compose logs --since 30m web | grep dang-ky" ;;
  esac
}

# Kiểm TỪ NGOÀI INTERNET VÀO, không phải từ bên trong hộp chứa.
#
# ⚠️ ĐÂY LÀ PHÉP KIỂM DUY NHẤT CÓ Ý NGHĨA VỚI KHÁCH, và bản trước KHÔNG có nó.
#
# Bản trước hỏi hộp chứa `web` qua `127.0.0.1:3000` rồi in ra
# "✓ Trang đã chạy: https://<tên miền>" — một câu nó chưa từng kiểm. Ba thứ
# nằm GIỮA hộp chứa và khách đều có thể hỏng mà phép kiểm cũ vẫn xanh:
#
#   · Caddy không khởi động được (Caddyfile sai, hoặc TEN_MIEN_PHU rỗng)
#   · Chứng chỉ SSL chưa xin được (DNS chưa trỏ, hoặc cổng 80 bị chặn)
#   · Tên miền trỏ sai máy chủ
#
# Cả ba đều cho ra cùng một kết quả với khách: trang không mở được. Và cả ba
# đều để script cũ kết thúc bằng dấu ✓ xanh.
kiem_tu_ben_ngoai() {
  local ma
  ma="$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 "https://${TEN_MIEN}/" 2>/dev/null || echo "000")"

  if [[ "$ma" == "200" ]]; then
    xanh "✓ Mở được từ internet: https://${TEN_MIEN} (HTTP 200, chứng chỉ hợp lệ)"
    return 0
  fi

  if [[ "$ma" == "000" ]]; then
    do_ "✗ KHÔNG mở được https://${TEN_MIEN} từ bên ngoài."
    do_ "  Hộp chứa thì sống, nên lỗi nằm ở lớp giữa. Kiểm theo thứ tự:"
    do_ "    1. Tên miền đã trỏ đúng máy này chưa:  dig +short ${TEN_MIEN}"
    do_ "       (phải ra đúng địa chỉ IP của máy chủ này)"
    do_ "    2. Caddy còn sống không:               docker compose ps caddy"
    do_ "    3. Caddy xin được chứng chỉ chưa:      docker compose logs --tail=50 caddy"
    do_ "    4. Cổng 80 và 443 đã mở chưa:          sudo ufw status"
    do_ "       (Let's Encrypt BẮT BUỘC cổng 80 để xác minh)"
    return 1
  fi

  do_ "✗ https://${TEN_MIEN} trả về HTTP ${ma}, không phải 200."
  do_ "  Xem nhật ký:  docker compose logs --tail=50 caddy"
  return 1
}

xanh "→ Chờ trang trả lời…"
for lan in $(seq 1 30); do
  if docker compose exec -T web node -e \
      "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" \
      2>/dev/null; then
    xanh "✓ Hộp chứa đã trả lời."
    kiem_ro_bi_mat

    # Chỉ dọn ảnh cũ SAU khi biết bản mới thật sự phục vụ được. Dọn sớm là vứt
    # mất đường lùi ngay lúc cần nó nhất.
    if kiem_tu_ben_ngoai; then
      kiem_duong_toi_bang_khach
      kiem_lap_chi_muc
      ham_nong_anh
      docker image prune -f >/dev/null 2>&1 || true
      exit 0
    fi

    do_ ""
    do_ "  Bản mới ĐANG chạy nhưng khách CHƯA vào được. Ảnh cũ vẫn còn để lùi:"
    do_ "    docker images | grep halongxanh"
    exit 1
  fi
  sleep 2
done

do_ "✗ Trang không trả lời sau 60 giây."
do_ "  Xem nhật ký:  docker compose logs --tail=80 web"
exit 1
