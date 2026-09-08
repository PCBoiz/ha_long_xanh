#!/usr/bin/env bash
#
# Dựng máy chủ LẦN ĐẦU. Chạy đúng một lần, ngay sau khi thuê VPS xong.
#
#   curl -fsSL https://raw.githubusercontent.com/<bạn>/<kho>/main/dung-may-chu.sh | bash
# hoặc chép file này lên máy chủ rồi:
#   bash dung-may-chu.sh
#
# Làm bốn việc mà nếu để tự nhớ thì sẽ quên: cài Docker, bật tường lửa, bật cập
# nhật bảo mật tự động, và tạo chỗ cho mã nguồn.
#
# CỐ Ý KHÔNG tự tải mã nguồn về: bước đó cần thông tin đăng nhập kho mã của bạn.

set -euo pipefail

xanh() { printf '\033[0;32m%s\033[0m\n' "$1"; }
vang() { printf '\033[0;33m%s\033[0m\n' "$1"; }
do_()  { printf '\033[0;31m%s\033[0m\n' "$1" >&2; }

if [[ $EUID -ne 0 ]] && ! sudo -n true 2>/dev/null; then
  do_ "Cần quyền quản trị. Chạy lại bằng: sudo bash $0"
  exit 1
fi

SUDO=""
[[ $EUID -ne 0 ]] && SUDO="sudo"

# ───────────────────────────── 1. Docker ────────────────────────────────────
if command -v docker >/dev/null 2>&1; then
  xanh "✓ Docker đã có sẵn ($(docker --version))"
else
  xanh "→ Cài Docker…"
  curl -fsSL https://get.docker.com | $SUDO sh
  $SUDO systemctl enable --now docker
fi

# Cho tài khoản hiện tại chạy docker không cần sudo. Phải đăng xuất rồi vào lại
# mới có hiệu lực — script sẽ nhắc ở cuối.
if [[ $EUID -ne 0 ]]; then
  $SUDO usermod -aG docker "$USER" || true
fi

# ─────────────────────────── 2. Tường lửa ───────────────────────────────────
# Chỉ mở ba cổng. Mọi cổng khác đóng — kể cả cổng 3000 của trang, vì chỉ Caddy
# bên trong máy mới cần nói chuyện với nó.
xanh "→ Bật tường lửa (chỉ mở SSH, 80, 443)…"
$SUDO apt-get update -qq
$SUDO apt-get install -y -qq ufw >/dev/null

# ⚠️ MỞ SSH TRƯỚC KHI BẬT. Bật tường lửa mà chưa cho SSH qua là tự khoá mình ra
# khỏi máy chủ, và cách duy nhất vào lại là console cứu hộ của nhà cung cấp.
$SUDO ufw allow OpenSSH
$SUDO ufw allow 80/tcp
$SUDO ufw allow 443/tcp
$SUDO ufw --force enable
$SUDO ufw status numbered | sed 's/^/    /'

# ──────────────────── 3. Cập nhật bảo mật tự động ───────────────────────────
# Máy chủ tự quản không có ai vá lỗi hộ. Bật cái này để các bản vá bảo mật của
# Ubuntu tự cài, không cần bạn nhớ.
xanh "→ Bật cập nhật bảo mật tự động…"
$SUDO apt-get install -y -qq unattended-upgrades >/dev/null
$SUDO tee /etc/apt/apt.conf.d/20auto-upgrades >/dev/null <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF

# ──────────────────────────── 4. Bộ nhớ đệm ─────────────────────────────────
#
# ⚠️ THIẾU BƯỚC NÀY LÀ LẦN DỰNG ĐẦU TIÊN CHẾT GIỮA CHỪNG.
#
# Máy chủ chạy `next build` ngay trên nó mỗi lần cập nhật — bước đó ăn hết RAM
# rồi mới xong. Trên máy 2GB không có swap, nhân hệ điều hành giết tiến trình
# dựng, và thông báo để lại chẳng nói gì về nguyên nhân: `docker compose build`
# chỉ báo "exit code 137" hoặc treo im.
#
# Swap không làm máy nhanh hơn. Nó chỉ đổi "chết" lấy "chậm" — và với một việc
# chạy vài phút mỗi lần cập nhật thì đó là đổi đúng chiều.
if [[ -n "$(swapon --show 2>/dev/null)" ]]; then
  xanh "✓ Đã có bộ nhớ đệm (swap)"
else
  xanh "→ Tạo 4GB bộ nhớ đệm…"
  if $SUDO fallocate -l 4G /swapfile 2>/dev/null || $SUDO dd if=/dev/zero of=/swapfile bs=1M count=4096 status=none; then
    $SUDO chmod 600 /swapfile
    $SUDO mkswap /swapfile >/dev/null
    $SUDO swapon /swapfile
    # Ghi vào fstab để máy khởi động lại vẫn còn. Không có dòng này thì swap
    # biến mất sau lần mất điện đầu tiên, và lần cập nhật kế tiếp sẽ chết —
    # cách xa nguyên nhân đủ lâu để không ai nối được hai việc với nhau.
    grep -q '^/swapfile' /etc/fstab || \
      echo '/swapfile none swap sw 0 0' | $SUDO tee -a /etc/fstab >/dev/null
    xanh "✓ Đã bật swap:"
    free -h | sed 's/^/    /'
  else
    vang "⚠ Không tạo được swap. Máy dưới 4GB RAM sẽ dễ chết khi dựng ảnh."
  fi
fi

# ─────────────────────── 5. Chỗ đặt mã nguồn ────────────────────────────────
THU_MUC=/opt/halongxanh
$SUDO mkdir -p "$THU_MUC"
[[ $EUID -ne 0 ]] && $SUDO chown -R "$USER:$USER" "$THU_MUC"
xanh "✓ Đã tạo $THU_MUC"

# ───────────────────────────── xong ─────────────────────────────────────────
cat <<EOF

$(xanh "✓ Máy chủ đã sẵn sàng.")

Ba việc tiếp theo:

  1. Đăng xuất rồi đăng nhập lại (để dùng docker không cần sudo)
  2. Đưa mã nguồn vào $THU_MUC — CHỈ BẰNG GIT:
       cd $THU_MUC
       git clone git@github.com:<tài-khoản>/<kho>.git .

     ⚠️ ĐỪNG DÙNG scp. Windows kết thúc mỗi dòng bằng hai ký tự, Linux dùng
        một. Chép thẳng từ Windows sang thì dòng đầu của mỗi script thành
        "#!/usr/bin/env bash\r", và Linux đi tìm một chương trình tên là
        "bash\r" — không có, nên báo "bad interpreter: No such file or
        directory". Nội dung file nhìn hoàn toàn bình thường, nên lỗi này rất
        khó đoán.

        Kho mã đã khai .gitattributes để git tự chuẩn hoá, nên đi đường git
        clone thì không bao giờ gặp. Đó là lý do bỏ hẳn scp khỏi hướng dẫn này.

  3. cd $THU_MUC && cp .env.example .env && nano .env
     rồi:  ./trien-khai.sh

EOF
