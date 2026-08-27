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
if [[ -z "${lead_hook// }" ]]; then
  vang "⚠ CHƯA ĐẶT LEAD_WEBHOOK_URL."
  vang "  Khách điền biểu mẫu vẫn thấy màn hình cảm ơn, nhưng thông tin của họ"
  vang "  chỉ nằm trong file tạm BÊN TRONG hộp chứa và sẽ MẤT ở lần triển khai"
  vang "  kế tiếp. Đừng chạy quảng cáo khi ô này còn trống."
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
  git pull --ff-only
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
