import type { MetadataRoute } from "next";
import { dongSanPham, phanKhu } from "@/data/project";
import { docBaiViet } from "@/lib/tin-tuc";
import { DIA_CHI_GOC } from "@/lib/site";

/**
 * Sitemap sinh thẳng từ dữ liệu dự án, nên thêm một phân khu hay một bài viết
 * là sitemap tự dài ra — không có chuyện quên cập nhật.
 *
 * `priority` đặt theo giá trị thương mại thật: trang chủ và trang phân khu là
 * nơi khách vào tìm, tài liệu và tin tức là nội dung phụ trợ.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const capNhat = new Date();
  // Đọc bài THẬT (kể cả bài do Antigravity đẩy sang) chứ không phải mảng tĩnh:
  // bài tự động đăng mà không vào sitemap thì coi như không được lập chỉ mục.
  const baiViet = await docBaiViet();

  /*
   * TRANG THƯƠNG MẠI để 0.9 ngang nhau, KHÔNG xếp hạng nội bộ giữa chúng.
   *
   * Mỗi trang dưới đây trả lời trực tiếp một câu người mua gõ vào ô tìm kiếm —
   * "giá bao nhiêu", "chính sách gì", "giá thực trả là gì", "chưa có voucher
   * thì sao", "có nên mua không", "pháp lý thế nào", "xây tới đâu rồi". Chúng
   * là CỬA VÀO, không phải trang phụ trợ của trang chủ.
   */
  const coDinh = [
    { url: "/", priority: 1 },
    { url: "/gia-global-gate-ha-long", priority: 0.9 },
    { url: "/quy-can-global-gate-ha-long", priority: 0.9 },
    { url: "/chinh-sach-global-gate-ha-long", priority: 0.9 },
    { url: "/gia-thuc-tra-global-gate-ha-long", priority: 0.9 },
    { url: "/voucher-vinhomes", priority: 0.9 },
    { url: "/gia-tri-tai-san-global-gate-ha-long", priority: 0.9 },
    { url: "/phap-ly-global-gate-ha-long", priority: 0.9 },
    { url: "/tien-do-global-gate-ha-long", priority: 0.9 },
    { url: "/dau-tu", priority: 0.9 },
    { url: "/quy-hoach", priority: 0.9 },
    { url: "/du-an", priority: 0.9 },
    { url: "/vi-tri-global-gate-ha-long", priority: 0.8 },
    { url: "/tien-ich", priority: 0.8 },
    { url: "/lien-he", priority: 0.7 },
    { url: "/tai-lieu", priority: 0.6 },
    { url: "/tin-tuc", priority: 0.6 },
  ];

  return [
    ...coDinh.map((muc) => ({
      url: `${DIA_CHI_GOC}${muc.url}`,
      lastModified: capNhat,
      changeFrequency: "monthly" as const,
      priority: muc.priority,
    })),
    ...phanKhu.map((khu) => ({
      url: `${DIA_CHI_GOC}/phan-khu/${khu.ma}`,
      lastModified: capNhat,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...dongSanPham.map((dong) => ({
      url: `${DIA_CHI_GOC}/san-pham/${dong.ma}`,
      lastModified: capNhat,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...baiViet.map((bai) => ({
      url: `${DIA_CHI_GOC}/tin-tuc/${bai.slug}`,
      lastModified: new Date(bai.ngayDang),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
