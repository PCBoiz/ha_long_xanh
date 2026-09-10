import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Be_Vietnam_Pro, Newsreader } from "next/font/google";
import { duAn } from "@/data/project";
import { CHO_LAP_CHI_MUC, DIA_CHI_GOC } from "@/lib/site";
import { DuLieuCoCauTruc } from "@/components/site/du-lieu-co-cau-truc";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { LienHeNoi } from "@/components/site/lien-he-noi";
import { TheoDoiBam } from "@/components/site/theo-doi-bam";
import "./globals.css";

// Cặp chữ.
//
// Bản tham chiếu (Lumen Artspace) dùng IvyPresto Display + Neue Montreal — cả
// hai đều là font thương mại nên không dùng được.
//
// Trước đây dùng Cormorant Garamond và ĐÓ LÀ MỘT LỰA CHỌN SAI cho nền tối.
// Dựng bản mẫu sáu họ serif trên đúng nền `--color-ink` với đúng câu tiêu đề
// tiếng Việt (`scripts/thu-phong-chu.mjs`) cho thấy: ở cùng một cỡ px, Cormorant
// có chiều cao chữ thường nhỏ hơn hẳn và nét dọc mảnh tới mức dấu huyền trên
// "ỳ" chỉ còn là một sợi tóc — nền tối nuốt mất.
//
//   · Newsreader — serif tương phản VỪA, thân chữ dày hơn Cormorant ở mọi
//     weight, chiều cao chữ thường lớn nên hạ cỡ px xuống mà vẫn đọc to hơn;
//     chữ nghiêng vẫn đủ thanh lịch cho phần nhấn. Có bộ ký tự `vietnamese`.
//   · Be Vietnam Pro — thiết kế RIÊNG cho tiếng Việt, dấu đặt cân và rõ ở cỡ
//     nhỏ; đây là điểm mà phần lớn font sans phương Tây làm hỏng.
//
// LƯU Ý cho lần đổi font sau: Instrument Serif, Bodoni Moda và Zilla Slab đều
// KHÔNG có bộ ký tự `vietnamese`. Dùng vào là toàn bộ chữ có dấu rơi về font
// thay thế của hệ điều hành — hỏng ngay nhưng rất dễ không nhận ra.

// CHỈ nạp weight thật sự dùng. Audit đo được font chiếm 261–300KB mỗi trang —
// nhiều hơn cả gói JavaScript. Nguyên nhân: mỗi weight × mỗi kiểu × mỗi bộ ký
// tự là một file riêng, nên khai 4 weight kèm chữ nghiêng cho Newsreader là 16
// file trong khi trang chỉ dùng vài trong số đó.
//
// Rà lại toàn bộ mã: chữ display luôn ở `font-normal` (400), chỉ dùng nghiêng
// cho phần nhấn trong `SplitReveal`. Chữ sans chỉ có 400 (mặc định) và 500
// (`font-medium`, đúng hai chỗ) — không chỗ nào dùng `font-light` hay
// `font-semibold`. Bỏ phần thừa.
const display = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "vietnamese"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  // `metadataBase` là thứ biến mọi đường dẫn tương đối (ảnh chia sẻ, canonical)
  // thành đường dẫn tuyệt đối. Thiếu nó thì Zalo và Facebook nhận được
  // `/opengraph-image` — một đường dẫn chúng không biết ghép vào tên miền nào,
  // nên bỏ qua luôn và ô xem trước lại trắng.
  metadataBase: new URL(DIA_CHI_GOC),
  title: {
    // Slogan chính thức chứ không phải địa danh.
    //
    // Thẻ tiêu đề là dòng chữ hiện trên kết quả tìm kiếm, trên thẻ trình duyệt
    // và trong lịch sử của khách. "Quảng Yên, Quảng Ninh" đã có sẵn trong phần
    // mô tả ngay bên dưới ở kết quả tìm kiếm, nên nhắc lại ở tiêu đề là tiêu
    // mất chỗ đắt nhất của cả trang cho một thông tin trùng.
    // ⚠️ KHUÔN PHẢI MANG TÊN THƯƠNG HIỆU ĐẦY ĐỦ, KHÔNG PHẢI TÊN NGẮN.
    //
    // Đo ngày 10/09/2026 trên 17 trang đang chạy: chỉ 2/17 tiêu đề có chữ
    // "Vinhomes", và **0/17 có "Hạ Long Xanh"** — trong khi tên miền là
    // halongxanh360.vn và chính khối dữ liệu có cấu trúc của trang khai
    // "Hạ Long Xanh" là tên gọi khác của dự án.
    //
    // Đây là hai CỤM TRUY VẤN TÁCH BIỆT: người gõ "hạ long xanh giá bán" ra
    // một nhóm trang, người gõ "vinhomes global gate" ra nhóm khác. Trang đang
    // chỉ phủ một nửa, và nửa bị bỏ chính là nửa trùng tên miền của mình.
    //
    // Tên ngắn "Global Gate Hạ Long" tiết kiệm được 9 ký tự, nhưng 9 ký tự đó
    // là chữ mà người ta thật sự gõ vào ô tìm kiếm.
    // Bỏ khẩu hiệu khỏi tiêu đề trang chủ: kèm vào thì thành 71 ký tự và
    // Google cắt ở khoảng 60. Cắt thì mất đúng phần đuôi, tức là mất khẩu hiệu
    // — nên giữ nó ở đây chỉ tốn chỗ mà vẫn không ai đọc được.
    //
    // Khẩu hiệu vẫn còn nguyên ở H1 của trang, ở `og:title` khi chia sẻ (chỗ đó
    // rộng hơn nhiều), và trong khối dữ liệu có cấu trúc. Chỗ duy nhất nó rời
    // đi là chỗ nó bị cắt.
    default: `${duAn.ten} (${duAn.tenKhac})`,
    template: `%s · ${duAn.ten}`,
  },
  description: duAn.moTaNgan,
  // Canonical: nói cho công cụ tìm kiếm biết đâu là địa chỉ CHÍNH THỨC của
  // trang. Không có nó, cùng một nội dung mở qua `www.` và không `www.`, hay
  // kèm tham số theo dõi chiến dịch, sẽ bị coi là nhiều trang trùng nội dung và
  // chia nhỏ thứ hạng. Từng trang con ghi đè bằng `alternates.canonical` riêng.
  alternates: { canonical: "/" },
  openGraph: {
    title: `${duAn.ten} — ${duAn.slogan}`,
    description: duAn.moTaNgan,
    siteName: duAn.ten,
    locale: "vi_VN",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: CHO_LAP_CHI_MUC
    ? undefined
    : {
        // Chưa phát hành: chặn lập chỉ mục cho tới khi số liệu được xác nhận.
        // Giờ điều khiển bằng `NEXT_PUBLIC_CHO_LAP_CHI_MUC` thay vì sửa mã —
        // để mở chỉ mục không còn là một lần deploy nữa, mà là bật một biến.
        index: false,
        follow: false,
      },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ink text-paper">
        {/* Không có JavaScript thì màn mở đầu sẽ nằm che vĩnh viễn và chữ hero
            không bao giờ trồi lên. Vài dòng này gỡ cả hai, đổi lại trang mất
            hiệu ứng nhưng vẫn đọc được trọn vẹn. */}
        <noscript>
          <style>{`.preloader{display:none}.split-word>span{transform:none}.reveal{opacity:1;transform:none}`}</style>
        </noscript>

        {/* Liên kết bỏ qua — phần tử ĐẦU TIÊN nhận tiêu điểm khi bấm Tab.
            Audit đo được: không trang nào có nó. Với thanh điều hướng cố định
            bảy mục, người dùng bàn phím hoặc trình đọc màn hình phải bấm Tab
            qua cả bảy mục ở MỌI trang mới tới được nội dung. Ẩn cho tới khi
            nhận tiêu điểm, nên người dùng chuột không bao giờ thấy nó. */}
        <a
          href="#noi-dung-chinh"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-full focus:bg-paper focus:px-6 focus:text-label focus:uppercase focus:text-ink"
        >
          Bỏ qua, tới nội dung chính
        </a>

        <DuLieuCoCauTruc />
        {/*
          MÀN MỞ ĐẦU ĐÃ CHUYỂN SANG `app/page.tsx` — nó chỉ thuộc về trang chủ.

          Đặt ở bố cục gốc nghĩa là nó chạy ở MỌI trang. Khách từ Google vào
          thẳng `/quy-can-global-gate-ha-long` phải ngồi xem 2,4 giây phim giới thiệu trước khi
          thấy bảng giá họ đang tìm — đúng thứ khiến người ta bấm quay lại. Với
          một trang mà mục tiêu là bán hàng, đó là đem chi phí đặt vào chỗ
          không sinh ra gì.

          Ở trang chủ thì ngược lại: người vào đó là người đang tìm hiểu dự án,
          và màn mở đầu làm đúng việc của nó.
        */}
        <SmoothScroll />
        {/*
          CON TRỎ TÙY BIẾN ĐÃ GỠ.

          Brief thương mại yêu cầu giảm JS và tối ưu di động. Vòng tròn đuổi
          theo chuột chạy một khung hình mỗi lần chuột nhúc nhích, chỉ để tạo
          một hiệu ứng mà bộ luật thiết kế hallmark gọi đích danh là dấu hiệu
          giao diện máy sinh ("cursor follower dots").

          Nó cũng không phục vụ ai ở đây: trên di động — nơi phần lớn khách bất
          động sản Việt Nam truy cập — nó không bao giờ chạy, và với tệp khách
          40–60 tuổi trên máy bàn thì một con trỏ khác thường là trở ngại chứ
          không phải điểm cộng.
        */}
        {/* Một trình nghe duy nhất cho toàn trang, đếm các cú bấm mang thuộc
            tính `data-do`. Không cookie, không bên thứ ba, không nhận dạng
            người — xem `components/site/theo-doi-bam.tsx`. */}
        <TheoDoiBam />
        <SiteHeader />
        {/* Chuyển trang không tải lại. Đặt tên "trang" để CSS trong globals.css
            bắt được đúng lớp này — chỉ nội dung chuyển cảnh, thanh điều hướng
            và chân trang đứng yên. Trình duyệt chưa hỗ trợ thì chuyển ngay như
            cũ, không có gì hỏng. */}
        <ViewTransition name="trang">
          {/* `tabIndex={-1}` để liên kết bỏ qua thật sự dời được tiêu điểm vào
              đây. Không có nó, trình duyệt cuộn tới nơi nhưng tiêu điểm vẫn kẹt
              ở thanh điều hướng, và lần Tab kế tiếp lại quay về đầu trang. */}
          <main id="noi-dung-chinh" tabIndex={-1} className="flex-1">
            {children}
          </main>
        </ViewTransition>
        <SiteFooter />
        <LienHeNoi />
      </body>
    </html>
  );
}
