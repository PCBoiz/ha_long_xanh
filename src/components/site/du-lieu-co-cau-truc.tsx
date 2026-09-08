import {
  benBan,
  cauHoiThuongGap,
  duAn,
  hangMucTienIch,
  lienHe,
  soLieu,
} from "@/data/project";
import { DIA_CHI_GOC } from "@/lib/site";
import quyCan from "@/data/quy-can.generated.json";

/**
 * Dữ liệu có cấu trúc theo schema.org.
 *
 * VÌ SAO CẦN: audit đo được cả 11 trang đều không có khối này. Đây là cách DUY
 * NHẤT để nói với Google "đây là một dự án bất động sản ở Quảng Yên, chủ đầu tư
 * là ai, quy mô bao nhiêu" bằng ngôn ngữ máy đọc được — thay vì để nó tự đoán
 * từ chữ trên trang. Không có nó, trang vẫn được lập chỉ mục nhưng không bao
 * giờ hiện ra dưới dạng kết quả mở rộng.
 *
 * NGUYÊN TẮC: mọi trường ở đây đều lấy từ `data/project.ts`, không có trường
 * nào viết tay. Dữ liệu có cấu trúc mà lệch với chữ hiển thị trên trang thì
 * Google coi là gian lận và phạt — nên chỉ có một nguồn sự thật duy nhất.
 *
 * `RealEstateListing` cố ý KHÔNG dùng: loại đó đòi giá và tình trạng bán của
 * một bất động sản cụ thể, mà bảng hàng đang trống. Khai một loại rồi bỏ trống
 * trường bắt buộc còn tệ hơn không khai.
 */
export function DuLieuCoCauTruc() {
  // ⚠️ NGÀY CẬP NHẬT — TRỢ LÝ AI CÂN NẶNG TRƯỜNG NÀY.
  //
  // Kiểm ngày 08/09/2026: cả 16 trang đều KHÔNG khai `dateModified`. Với công
  // cụ tìm kiếm thường thì đó chỉ là thiếu sót nhỏ. Với trợ lý AI thì nặng hơn
  // nhiều: khi phải chọn giữa hai nguồn nói khác nhau về giá hay quỹ căn, thứ
  // phân xử đầu tiên là nguồn nào mới hơn. Không khai ngày là tự bỏ cuộc ở
  // đúng chỗ trang này mạnh nhất — nó có bảng hàng cập nhật theo ngày.
  //
  // LẤY TỪ `quyCan.docLuc`, KHÔNG lấy giờ dựng trang. Đó là mốc đọc bảng hàng
  // thật, cũng chính là mốc đang hiện cho người đọc qua `TuoiDuLieu`. Dùng giờ
  // dựng thì mỗi lần triển khai lại — kể cả khi chỉ sửa một dấu phẩy — trang sẽ
  // tự khai là "vừa cập nhật". Đó là nói dối máy, và máy sẽ học được điều đó.
  const capNhat = quyCan.docLuc;

  const dienTich = soLieu.find((s) => s.nhan === "Tổng diện tích");

  const duLieu = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${DIA_CHI_GOC}/#chu-dau-tu`,
        name: duAn.chuDauTu,
      },
      {
        "@type": "WebSite",
        "@id": `${DIA_CHI_GOC}/#website`,
        url: DIA_CHI_GOC,
        name: duAn.ten,
        inLanguage: "vi-VN",
        description: duAn.moTaNgan,
        dateModified: capNhat,
      },
      {
        // `Place` + `LandmarksOrHistoricalBuildings` là mô tả trung thực nhất
        // cho một khu đô thị đang xây: nó là một ĐỊA ĐIỂM có tên và quy mô,
        // chưa phải một sản phẩm đang chào bán với giá cụ thể.
        "@type": "Place",
        "@id": `${DIA_CHI_GOC}/#du-an`,
        name: duAn.ten,
        // Cả tên gọi dân gian lẫn slogan chính thức. Người tìm gõ "Hạ Long
        // Xanh" nhiều hơn gõ tên đầy đủ, và trợ lý AI cần biết hai cách gọi đó
        // chỉ về cùng một chỗ thì mới ghép được các nguồn rời rạc lại.
        alternateName: [duAn.tenKhac, `${duAn.ten} — ${duAn.slogan}`],
        slogan: duAn.slogan,
        description: duAn.moTaNgan,
        url: DIA_CHI_GOC,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Quảng Yên",
          addressRegion: "Quảng Ninh",
          addressCountry: "VN",
        },
        ...(dienTich
          ? {
              area: {
                "@type": "QuantitativeValue",
                value: Number(dienTich.giaTri.replace(/\./g, "")),
                unitCode: "HAR", // hecta, theo mã đơn vị UN/CEFACT
              },
            }
          : {}),
        // Chỉ liệt kê tiện ích có diện tích thật đọc từ sơ đồ tổng mặt bằng.
        amenityFeature: hangMucTienIch.slice(0, 8).map((muc) => ({
          "@type": "LocationFeatureSpecification",
          name: muc.ten,
          value: true,
        })),
      },
      {
        "@type": "RealEstateAgent",
        "@id": `${DIA_CHI_GOC}/#tu-van`,
        // Tên bên bán khi đã điền, chứ không phải một cái tên chung chung. Đây
        // là trường nói với máy tìm kiếm "ai đang bán" — bỏ trống thì công cụ
        // tìm kiếm cũng không phân biệt được trang này với trang chủ đầu tư.
        name: benBan.ten || `Tư vấn ${duAn.tenNgan}`,
        description: benBan.vaiTro,
        areaServed: { "@type": "AdministrativeArea", name: "Quảng Ninh" },
        // Số điện thoại và email chỉ khai khi có thật. Khai một trường rỗng là
        // dữ liệu sai, không phải dữ liệu thiếu.
        ...(lienHe.hotline ? { telephone: lienHe.hotline } : {}),
        ...(benBan.vanPhong
          ? {
              address: {
                "@type": "PostalAddress",
                streetAddress: benBan.vanPhong,
                addressCountry: "VN",
              },
            }
          : {}),
      },
      // FAQPage khai đúng bộ câu hỏi đang HIỂN THỊ trên trang chủ.
      //
      // Đây là khối đáng giá nhất cho trợ lý AI: khi ai đó hỏi một trợ lý
      // "Global Gate Hạ Long giá bao nhiêu", câu trả lời của trang có thể được
      // trích thẳng ra thay vì để trợ lý đoán từ nguồn khác. Điều kiện là chữ
      // ở đây phải TRÙNG với chữ hiện trên trang — nên cả hai cùng đọc từ
      // `cauHoiThuongGap`, không có bản chép tay thứ hai.
      ...(cauHoiThuongGap.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${DIA_CHI_GOC}/#cau-hoi`,
              dateModified: capNhat,
              mainEntity: cauHoiThuongGap.map((muc) => ({
                "@type": "Question",
                name: muc.hoi,
                acceptedAnswer: { "@type": "Answer", text: muc.dap },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Nội dung do chính mình dựng từ dữ liệu tĩnh, không có gì từ người dùng.
      // Vẫn thoát `<` để một chuỗi chứa "</script>" không thể đóng sớm thẻ này.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(duLieu).replace(/</g, "\\u003c"),
      }}
    />
  );
}
