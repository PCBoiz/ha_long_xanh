#!/usr/bin/env bash
#
# Canh trang và sao lưu cấu hình. Chạy tự động mỗi 5 phút qua cron.
#
# Cài đặt (chạy MỘT LẦN trên máy chủ):
#   chmod +x canh-trang.sh
#   (crontab -l 2>/dev/null; echo "*/5 * * * * /opt/halongxanh/canh-trang.sh") | crontab -
#
# VÌ SAO CẦN: `restart: unless-stopped` của Docker dựng lại hộp chứa khi nó
# CHẾT. Nhưng có kiểu hỏng tệ hơn — tiến trình còn sống mà không trả lời ai
# nữa. Docker thấy hộp chứa vẫn "đang chạy" nên không làm gì, và trang chết
# im lặng cho tới khi có người gọi điện báo.

set -uo pipefail   # KHÔNG dùng -e: script canh gác mà tự thoát giữa chừng thì
                   # còn tệ hơn không có.

THU_MUC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$THU_MUC"
NHAT_KY="$THU_MUC/.canh-trang.log"

ghi() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$NHAT_KY"
  # Giữ 500 dòng gần nhất — chính file này cũng phải tự cắt, nếu không nó lại
  # thành thứ làm đầy ổ cứng.
  tail -n 500 "$NHAT_KY" > "$NHAT_KY.tmp" 2>/dev/null && mv "$NHAT_KY.tmp" "$NHAT_KY"
}

# ───────────────────── 1. Trang có trả lời không ────────────────────────────
[[ -f .env ]] && set -a && source .env && set +a
DIA_CHI="https://${TEN_MIEN:-localhost}"

ma=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "$DIA_CHI/" 2>/dev/null || echo "000")

if [[ "$ma" == "200" ]]; then
  # Chỉ ghi khi vừa hồi phục, để nhật ký không đầy dòng "vẫn ổn".
  if [[ -f "$THU_MUC/.dang-hong" ]]; then
    ghi "HỒI PHỤC — trang trả lời lại bình thường (HTTP $ma)"
    rm -f "$THU_MUC/.dang-hong"
  fi
else
  ghi "HỎNG — trang trả về HTTP $ma"

  if [[ ! -f "$THU_MUC/.dang-hong" ]]; then
    touch "$THU_MUC/.dang-hong"
    ghi "Thử khởi động lại lần đầu…"
    docker compose restart web >> "$NHAT_KY" 2>&1

    sleep 25
    ma2=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "$DIA_CHI/" 2>/dev/null || echo "000")
    if [[ "$ma2" == "200" ]]; then
      ghi "Khởi động lại xong, trang chạy lại (HTTP $ma2)"
      rm -f "$THU_MUC/.dang-hong"
    else
      ghi "VẪN HỎNG sau khi khởi động lại (HTTP $ma2). Cần người xem."
      # Ghi 40 dòng nhật ký cuối của hộp chứa để còn truy được nguyên nhân,
      # kể cả khi hộp chứa bị dựng lại sau đó và nhật ký cũ mất.
      docker compose logs --tail=40 web >> "$NHAT_KY" 2>&1
    fi
  fi
  # Đã báo hỏng rồi thì KHÔNG khởi động lại liên tục mỗi 5 phút — vòng lặp đó
  # che mất nguyên nhân thật và làm nhật ký không đọc nổi.
fi

# ───────────────────── 2. Sao lưu file cấu hình ─────────────────────────────
# Bài viết đã nằm ở Neon và Neon tự sao lưu. Nhưng file `.env` thì CHỈ CÓ trên
# máy chủ này.
#
# ⚠️ GIỚI HẠN PHẢI BIẾT: bản sao lưu này nằm TRÊN CHÍNH MÁY CHỦ nó đang bảo vệ.
# Nó cứu được trường hợp "hôm qua sửa .env sai, muốn quay lại". Nó KHÔNG cứu
# được trường hợp "máy chủ mất" — vì lúc đó bản sao lưu mất cùng.
#
# Bản sao lưu THẬT phải nằm ngoài máy này: chép nội dung .env vào một trình
# quản lý mật khẩu. Xem mục "Diễn tập khôi phục" trong TRIEN-KHAI.md.
KHO_LUU="$THU_MUC/.sao-luu"
mkdir -p "$KHO_LUU"
if [[ -f .env ]]; then
  ban_moi="$KHO_LUU/env-$(date +%Y%m%d).bak"
  if [[ ! -f "$ban_moi" ]]; then
    cp .env "$ban_moi"
    chmod 600 "$ban_moi"
    # Giữ 14 bản gần nhất.
    ls -1t "$KHO_LUU"/env-*.bak 2>/dev/null | tail -n +15 | xargs -r rm -f
  fi
fi

# ────────────── 3. Cảnh báo thông tin khách đang rơi vào file tạm ───────────
# Chưa đặt LEAD_WEBHOOK_URL thì mỗi lượt khách đăng ký tư vấn bị ghi xuống
# `.data/dang-ky.jsonl` — và ghi BÊN TRONG hộp chứa Docker. Đó là số điện thoại
# thật của khách hàng thật, không sao lưu ở đâu, và mất sạch ở lần triển khai
# kế tiếp khi hộp chứa được dựng lại.
#
# Đây là kiểu mất mát tệ nhất: hệ thống chạy đúng, khách điền form thành công,
# không có thông báo lỗi nào — mà không ai gọi lại cho họ.
#
# ⚠️ PHÉP KIỂM NÀY TỪNG SAI VÀ KHÔNG BAO GIỜ KÊU.
#
# Bản trước tìm file ở `$THU_MUC/.data/dang-ky.jsonl` — tức là trên máy chủ
# chủ nhà. Nhưng ứng dụng chạy TRONG hộp chứa, và hộp chứa không gắn thư mục
# đó ra ngoài, nên đường dẫn ấy không bao giờ tồn tại. Điều kiện luôn sai, cảnh
# báo không bao giờ phát, và người vận hành yên tâm rằng mọi thứ đang ổn.
#
# Bản này kiểm ĐÚNG ĐIỀU KIỆN GỐC — biến môi trường có được đặt hay không —
# rồi mới đếm file bên trong hộp chứa.
if [[ -f "$THU_MUC/.env" ]] && ! grep -qE '^LEAD_WEBHOOK_URL=.+' "$THU_MUC/.env"; then
  ghi "CẢNH BÁO — chưa đặt LEAD_WEBHOOK_URL. Mọi lượt khách đăng ký tư vấn đang ghi vào file tạm BÊN TRONG hộp chứa và sẽ MẤT SẠCH ở lần triển khai kế tiếp. Đặt biến này trong $THU_MUC/.env rồi chạy lại trien-khai.sh."

  # Đếm xem đã mất bao nhiêu, hỏi thẳng hộp chứa. Không đếm được thì bỏ qua —
  # bản thân cảnh báo ở trên đã đủ để hành động.
  so_khach=$(docker compose -f "$THU_MUC/docker-compose.yml" exec -T web     sh -c 'wc -l < /app/.data/dang-ky.jsonl 2>/dev/null || echo 0' 2>/dev/null | tr -d '[:space:]')
  if [[ "$so_khach" =~ ^[0-9]+$ ]] && (( so_khach > 0 )); then
    ghi "CẢNH BÁO — đang có $so_khach lượt đăng ký nằm trong hộp chứa. Tải về NGAY trước khi triển khai lại: docker compose exec web cat /app/.data/dang-ky.jsonl > dang-ky-cuu-duoc.jsonl"
  fi
fi

# ───────────────────── 4. Cảnh báo ổ cứng sắp đầy ───────────────────────────
# Ổ đầy là kiểu hỏng khó đoán nhất: Docker không kéo được ảnh mới, Caddy không
# ghi được chứng chỉ, cơ sở dữ liệu không ghi được. Cảnh báo sớm ở mức 85%.
day=$(df --output=pcent "$THU_MUC" 2>/dev/null | tail -1 | tr -dc '0-9')
if [[ -n "$day" && "$day" -ge 85 ]]; then
  ghi "CẢNH BÁO — ổ cứng đã dùng ${day}%. Dọn bằng: docker system prune -af"
fi
