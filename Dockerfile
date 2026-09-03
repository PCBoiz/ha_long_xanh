# Đóng gói trang thành một hộp chạy được trên bất kỳ máy chủ Linux nào.
#
# BA CHẶNG, và ba chặng là có lý do: ảnh cuối CHỈ chứa thứ để chạy, không chứa
# mã nguồn, không chứa công cụ build, không chứa `node_modules` đầy đủ. Gộp làm
# một chặng thì ảnh phình từ ~180MB lên hơn 1,5GB và mang theo cả bộ mã nguồn
# lên máy chủ — vừa chậm vừa lộ nhiều hơn mức cần.

# ─────────────────────────── 1. Cài thư viện ────────────────────────────────
FROM node:22-alpine AS thuvien
WORKDIR /app

# Chỉ chép hai file khai báo trước. Docker lưu đệm theo từng bước, nên chừng nào
# hai file này chưa đổi thì bước `npm ci` (chậm nhất) được dùng lại — sửa mã
# giao diện không phải cài lại thư viện.
COPY package.json package-lock.json ./
RUN npm ci

# ─────────────────────────── 2. Dựng bản chạy ───────────────────────────────
FROM node:22-alpine AS dung
WORKDIR /app
COPY --from=thuvien /app/node_modules ./node_modules
COPY . .

# Biến `NEXT_PUBLIC_*` được NHÚNG THẲNG vào mã chạy trên trình duyệt lúc build,
# không phải đọc lúc chạy. Nên chúng phải có mặt ở ĐÂY; truyền lúc `docker run`
# thì không có tác dụng gì.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_CHO_LAP_CHI_MUC
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_CHO_LAP_CHI_MUC=$NEXT_PUBLIC_CHO_LAP_CHI_MUC
ENV NEXT_TELEMETRY_DISABLED=1

# DỪNG NGAY NẾU THIẾU ĐỊA CHỈ TRANG, thay vì dựng ra một bản hỏng câm.
#
# Không truyền `--build-arg NEXT_PUBLIC_SITE_URL` thì dòng `ENV` ở trên đặt nó
# thành CHUỖI RỖNG — và chuỗi rỗng vẫn tính là "đã đặt". Next.js không ghi đè
# biến đã có mặt khi nạp `.env`, nên chuỗi rỗng THẮNG, kể cả khi `.env` điền
# đúng.
#
# Hậu quả nếu để trôi: `diaChiGoc()` trong `src/lib/site.ts` rơi xuống nhánh
# cuối và trả `http://localhost:3000`. Địa chỉ đó bị nướng cứng vào canonical,
# vào sitemap, vào thẻ chia sẻ và vào toàn bộ dữ liệu có cấu trúc. Luật gom tên
# miền trong `next.config.ts` cũng tự tắt, vì nó thoát sớm khi biến rỗng.
#
# Và trang vẫn CHẠY BÌNH THƯỜNG. Mở bằng trình duyệt không thấy gì sai — chỉ có
# Google đi thu thập một trang tự khai mình sống trên máy của người khác.
#
# `docker compose build` luôn truyền hai biến này (xem `docker-compose.yml`).
# Dòng dưới đây bắt trường hợp ai đó gõ tay `docker build`.
RUN test -n "$NEXT_PUBLIC_SITE_URL" || ( \
      echo "" >&2; \
      echo "✗ THIẾU NEXT_PUBLIC_SITE_URL lúc dựng ảnh." >&2; \
      echo "  Biến này bị nướng cứng vào mã chạy trên trình duyệt, nên nó phải" >&2; \
      echo "  có mặt Ở ĐÂY — truyền lúc chạy là quá muộn." >&2; \
      echo "" >&2; \
      echo "  Dựng bằng:  docker compose build" >&2; \
      echo "  (compose tự đọc .env rồi truyền vào; đừng gọi docker build tay)" >&2; \
      echo "" >&2; \
      exit 1 )

RUN npm run build

# ⚠️ KHÔNG BAO GIỜ chép `.env` vào chặng 3.
#
# Đây từng là một lỗ rò thật, và nó rò theo đường không ai ngờ: Next.js KHÔNG
# chỉ ĐỌC `.env` lúc dựng — nó CHÉP LUÔN file đó vào `.next/standalone/`
# (`writeStandaloneDirectory` trong `next/dist/build/index.js`). Mà dòng 48 bên
# dưới chép nguyên thư mục `standalone` vào ảnh chạy thật.
#
# Nghĩa là chuỗi kết nối cơ sở dữ liệu và địa chỉ nhận thông tin khách nằm
# trong ẢNH CUỐI CÙNG — thứ được `docker save`, được đẩy lên kho ảnh, được chép
# sang máy khác. Không phải lớp trung gian, mà là bản giao đi.
#
# Thứ chặn việc đó là file `.dockerignore` (loại `.env` khỏi thư mục dựng).
# XOÁ FILE ĐÓ LÀ MỞ LẠI LỖ RÒ NÀY. Kiểm sau mỗi lần dựng:
#     docker compose exec web sh -c 'ls -l /app/.env'   → phải báo No such file

# ─────────────────────────── 3. Ảnh chạy thật ───────────────────────────────
FROM node:22-alpine AS chay
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# KHÔNG chạy bằng quyền root. Nếu có lỗ hổng nào cho phép chạy lệnh, chạy bằng
# root nghĩa là toàn quyền trên cả hộp chứa.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# `output: "standalone"` trong next.config.ts gom sẵn đúng những gì cần chạy.
COPY --from=dung --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=dung --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=dung --chown=nextjs:nodejs /app/public ./public

# Thư mục dữ liệu rơi-về, tạo sẵn và giao quyền cho `nextjs` NGAY TẠI ĐÂY.
#
# ⚠️ DÒNG NÀY TRÔNG THỪA. KHÔNG PHẢI. Đọc trước khi gỡ.
#
# `docker-compose.yml` gắn một ổ đĩa có tên vào đúng `/app/.data` để dữ liệu
# sống sót qua mỗi lần triển khai. Docker chỉ chép quyền sở hữu từ ẢNH sang ổ
# đĩa ở LẦN TẠO ĐẦU TIÊN, và chỉ khi đường dẫn đó đã tồn tại sẵn trong ảnh.
#
# Không có dòng này thì lúc gắn, thư mục chưa tồn tại — Docker tự tạo và giao
# cho `root`. Ứng dụng chạy bằng `nextjs` không ghi được, `appendFile` ném
# EACCES, và cổng nhận bài trả 500 cho MỌI bài gửi tới, trong khi trang vẫn
# chạy đúng ở mọi mặt khác. Tức là đổi một kiểu mất dữ liệu lấy một kiểu khác.
RUN mkdir -p /app/.data && chown nextjs:nodejs /app/.data

USER nextjs
EXPOSE 3000

# Docker tự hỏi trang còn sống không. Không có bước này, tiến trình treo mà
# chưa chết sẽ không bao giờ được khởi động lại — trang "đang chạy" nhưng
# không trả lời ai cả.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
