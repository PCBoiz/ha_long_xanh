import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { duAn } from "@/data/project";

/**
 * Ảnh hiện ra khi ai đó dán link trang này lên Zalo, Facebook hay Messenger.
 *
 * VÌ SAO CẦN: đo được ở audit — cả 11 trang đều KHÔNG có `og:image`, nên dán
 * link ra một ô trắng trơn. Với bất động sản, phần lớn khách đến từ đường dẫn
 * do môi giới gửi qua Zalo; ô trắng đó là điểm mất khách sớm nhất trong cả
 * phễu, sớm hơn cả trang chủ.
 *
 * Dựng bằng ảnh phối cảnh thật + lớp chữ, KHÔNG phải ảnh chụp màn hình trang:
 * ô xem trước của Zalo chỉ cao khoảng 300px, chữ trên trang co lại tới mức
 * không đọc nổi.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${duAn.ten} — ${duAn.slogan}`;

export default async function AnhChiaSe() {
  // Đọc thẳng từ đĩa. `fetch` về chính mình sẽ hỏng lúc dựng trang tĩnh vì
  // khi đó chưa có máy chủ nào đang chạy để mà gọi.
  const [anh, chuThuong, chuDam] = await Promise.all([
    // JPEG, KHÔNG phải WebP.
    //
    // Bộ dựng ảnh bên trong `next/og` (satori) chỉ đọc được PNG, JPEG và SVG.
    // Đưa WebP vào thì build gãy với thông báo "u2 is not iterable" — không hề
    // nhắc gì tới ảnh, nên rất dễ đi tìm nhầm chỗ (tôi đã tưởng là do font).
    //
    // File này sinh sẵn bằng `npm run assets` chứ không chuyển đổi lúc build:
    // chuyển lúc build thì phải phụ thuộc `sharp`, mà `sharp` chỉ là phụ thuộc
    // gián tiếp của Next — nó có thể biến mất sau một lần nâng cấp.
    readFile(path.join(process.cwd(), "src/assets/og-nen.jpg")),
    // PHẢI khai font tường minh và phải là TTF.
    //
    // `ImageResponse` không có font mặc định — thiếu `fonts` là build gãy với
    // thông báo "u2 is not iterable", đọc không ra manh mối gì. Và kể cả nếu có
    // font mặc định thì nó cũng không có dấu tiếng Việt: "Thành phố kỳ quan" sẽ
    // ra một hàng ô vuông.
    //
    // Định dạng bắt buộc là TTF/OTF/WOFF. Các file `.woff2` mà `next/font` tải
    // về KHÔNG dùng được ở đây — nên hai file TTF này được giữ riêng trong
    // `src/assets/fonts`, cố ý nằm ngoài `public` để không ai tải về được.
    readFile(path.join(process.cwd(), "src/assets/fonts/BeVietnamPro-Regular.ttf")),
    readFile(path.join(process.cwd(), "src/assets/fonts/BeVietnamPro-SemiBold.ttf")),
  ]);
  const nen = `data:image/jpeg;base64,${anh.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          backgroundColor: "#04140f",
          fontFamily: "BeVietnamPro",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={nen}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, objectFit: "cover" }}
        />
        {/* KHÔNG có ô phủ tối ở đây — lớp tối đã được NUNG SẴN vào chính file
            `og-nen.jpg` bằng `sharp` trong `npm run assets`.
            Lý do: satori bỏ qua một ô `<div>` rỗng có `inset: 0` mà không khai
            chiều rộng/cao — nó co về 0×0 và biến mất, KHÔNG báo lỗi gì. Đã thử
            cả `background` lẫn `backgroundImage`, cả hai đều không hiện, và chỉ
            phát hiện ra khi mở ảnh kết quả lên nhìn. Nung vào ảnh thì hết phụ
            thuộc vào việc satori hỗ trợ gradient tới đâu. */}

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: "0 64px 56px",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#7fd4b8",
            }}
          >
            {duAn.viTri}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 76,
              lineHeight: 1.05,
              color: "#e6efea",
              maxWidth: 900,
            }}
          >
            {duAn.ten}
          </div>
          {/*
            Slogan đọc từ dữ liệu, KHÔNG chép tay. Trước đây dòng này là chuỗi
            viết thẳng vào mã, nên khi tuyên bố của dự án đổi thì ô xem trước
            trên Zalo và Facebook vẫn còn câu cũ — sai ở đúng chỗ nhiều người
            nhìn thấy nhất mà không ai mở ra kiểm, vì nó chỉ hiện khi có người
            dán link.

            ⚠️ NỘI DUNG PHẢI LÀ MỘT CHUỖI DUY NHẤT. Satori — bộ dựng ảnh này —
            không nhận mảng phần tử con lẫn giá trị boolean, mà một chú thích
            JSX đặt bên trong thẻ chính là một giá trị như vậy. Viết
            `{a} · {b}` kèm chú thích ở trong làm cả bước dựng ảnh hỏng, và
            hỏng ở bước xuất bản chứ không phải lúc chạy — nghĩa là toàn bộ lần
            triển khai thất bại.
          */}
          <div
            style={{
              marginTop: 20,
              fontSize: 30,
              color: "rgba(230,239,234,0.78)",
              maxWidth: 820,
            }}
          >
            {`${duAn.slogan} · ${duAn.tuyenBoPhu}`}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "BeVietnamPro",
          data: chuThuong,
          weight: 400,
          style: "normal",
        },
        {
          name: "BeVietnamPro",
          data: chuDam,
          weight: 600,
          style: "normal",
        },
      ],
    },
  );
}
