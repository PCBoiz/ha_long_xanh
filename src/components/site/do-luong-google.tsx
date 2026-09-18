import Script from "next/script";

/**
 * Google Analytics 4 — CHỈ tải khi có `NEXT_PUBLIC_GA_ID`.
 *
 * Vì sao có (18/09/2026): sau 1–2 tuần lên mạng chủ trang hỏi "sao chưa tiến
 * triển", nhưng trang không có bất kỳ số lượt truy cập nào để nhìn — chỉ có bộ
 * đếm chuyển đổi tự dựng (`lib/do-luong.ts`) và log máy chủ. Không đo được lượt
 * vào thì mọi bàn luận về lưu lượng đều là đoán.
 *
 * Fail-closed: chưa đặt biến thì không tải một byte nào của Google, không đổi
 * gì trên trang. Biến là `NEXT_PUBLIC_*` nên phải có LÚC DỰNG (Dockerfile ARG +
 * compose build args), không phải chỉ lúc chạy — `scripts/kiem-bien-moi-truong`
 * canh chỗ này.
 *
 * `afterInteractive`: tải sau khi trang đã tương tác được, không chen vào LCP.
 * `send_page_view: true` mặc định; SPA của Next đổi trang bằng History API và
 * GA4 tự bắt (Enhanced measurement), không cần gọi tay.
 */
export function DoLuongGoogle() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`} strategy="afterInteractive" />
      <Script id="ga4-khoi-tao" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
