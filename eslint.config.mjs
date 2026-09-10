import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // ⚠️ THƯ MỤC NHÁP. `.gitignore` đã bỏ qua `/.tmp/` nhưng eslint thì không —
    // vì `globalIgnores` ở đây GHI ĐÈ danh sách mặc định chứ không cộng thêm.
    //
    // Hệ quả: cổng `npm run lint` đỏ vì mấy tệp nháp không bao giờ lên trang
    // (đo 10/09: hai cảnh báo, cả hai trong `.tmp/`). Một cổng đỏ vì lý do
    // không liên quan là cổng người ta sẽ TẮT, chứ không phải cổng người ta
    // sửa — đúng bài học đã ghi trong `anh-cam-dung.ts`.
    ".tmp/**",
  ]),
]);

export default eslintConfig;
