import type { Config } from "drizzle-kit";

/**
 * Cấu hình sinh và áp migration.
 *
 * `DATABASE_URL` KHÔNG bao giờ nằm trong file này — nó là bí mật, còn file này
 * nằm trong mã nguồn. Đọc từ biến môi trường lúc chạy.
 */
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
