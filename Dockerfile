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

RUN npm run build

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

USER nextjs
EXPOSE 3000

# Docker tự hỏi trang còn sống không. Không có bước này, tiến trình treo mà
# chưa chết sẽ không bao giờ được khởi động lại — trang "đang chạy" nhưng
# không trả lời ai cả.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
