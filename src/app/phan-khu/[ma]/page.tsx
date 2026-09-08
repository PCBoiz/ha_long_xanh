import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ProjectImage } from "@/components/ui/project-image";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { duAn, phanKhu } from "@/data/project";
import { langGieng } from "@/lib/lang-gieng-phan-khu";
import { BangHangQuanhDay } from "@/components/site/bang-hang-quanh-day";
import { DUONG_DAN } from "@/lib/duong-dan";

// Chín trang phân khu sinh thẳng từ `data/project.ts`. Thêm một phân khu vào
// mảng đó là có ngay một trang mới — không phải đụng vào file này.
//
// Trang KHÔNG gán ảnh phối cảnh riêng cho từng khu: bộ ảnh chủ đầu tư gửi không
// ghi rõ ảnh nào chụp khu nào, gán bừa là nói sai với người mua. Thay vào đó,
// trang chỉ đúng vị trí khu đó trên sơ đồ quy hoạch thật — vừa trung thực, vừa
// trả lời đúng câu hỏi đầu tiên của khách: "nó nằm ở đâu?".

export function generateStaticParams() {
  return phanKhu.map((khu) => ({ ma: khu.ma }));
}

export async function generateMetadata({
  params,
}: PageProps<"/phan-khu/[ma]">): Promise<Metadata> {
  const { ma } = await params;
  const khu = phanKhu.find((muc) => muc.ma === ma);
  if (!khu) return {};
  return {
    alternates: { canonical: `/phan-khu/${ma}` },
    title: `${khu.ten} (${khu.tenTiengAnh})`,
    description: `${khu.ten} — phân khu thuộc ${duAn.ten}. ${khu.diemNhan[0] ?? ""}`,
  };
}

export default async function TrangPhanKhu({
  params,
}: PageProps<"/phan-khu/[ma]">) {
  const { ma } = await params;
  const khu = phanKhu.find((muc) => muc.ma === ma);
  if (!khu) notFound();

  const thuTu = phanKhu.findIndex((muc) => muc.ma === ma);
  const canBen = langGieng(ma);
  const truoc = phanKhu[(thuTu - 1 + phanKhu.length) % phanKhu.length];
  const sau = phanKhu[(thuTu + 1) % phanKhu.length];

  return (
    <>
      <section className="px-6 pb-16 pt-44 md:px-10">
        <div className="mx-auto max-w-[92rem]">
          {/* Trỏ sang trang quy hoạch thật, không phải cái neo `/#so-do` cũ —
              sơ đồ đã chuyển khỏi trang chủ nên neo đó nay không dẫn tới đâu. */}
          <Link
            href="/quy-hoach"
            className="link-underline inline-flex min-h-11 items-center text-label uppercase text-jade"
          >
            ← Sơ đồ quy hoạch
          </Link>
          <p className="mt-10 text-label uppercase text-paper/40">
            {khu.tenTiengAnh}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-display font-normal">
            <SplitReveal text={khu.ten} stagger={90} />
          </h1>
        </div>
      </section>

      {/* ⚠️ ĐÃ GỠ Ô "CẬN CẢNH KHU NÀY". ĐỪNG ĐƯA LẠI.

          Ô đó hiện `khu-{ma}` — một ảnh cắt ra từ chính tấm `tmb-ban-do`
          nằm ngay bên cạnh nó. Chín phân khu, chín ảnh cắt, và cả chín đều
          ĐÚNG 922×830 pixel: dấu vết của việc cắt máy móc theo khung cố định.

          Hai vấn đề, và vấn đề thứ hai nặng hơn nhiều.

          MỘT — TRÔNG NHƯ NHAU. Cùng nền hồng cam, cùng khinh khí cầu, cùng
          nét vẽ, chỉ lệch khung. Chủ trang phàn nàn "ảnh trùng nhau" nhiều
          lần. Đo bằng máy ba cách — băm tri giác, màu chủ đạo, độ bão hoà —
          cả ba đều báo SẠCH, vì hai vùng khác nhau của một bản vẽ lớn thật sự
          có cấu trúc điểm ảnh khác nhau. Máy so pixel; mắt so tài vật.

          HAI — NÓI SAI. Khung cắt rộng hơn phân khu nó mang tên, nên tấm
          `khu-festa-bay` hiện ba nhãn (Wonder Island, Festa Bay, Elite Sport
          Island), `khu-crystal-island` hiện hai. Người đọc tin mình đang nhìn
          một phân khu, thực ra đang nhìn một góc bản đồ có cả hàng xóm.

          Bản đồ tổng kèm điểm đánh dấu bên dưới nói đúng một điều và nói
          đúng: khu này NẰM Ở ĐÂY. Toạ độ `khu.x/khu.y` đã được dò lại độc lập
          bằng phép so mẫu trượt trên ảnh gốc — cả chín khớp trong vòng 0,6
          điểm phần trăm. */}
      <section className="px-6 md:px-10">
        <div className="mx-auto max-w-[92rem]">
          {/* ĐẶT TÊN CHO THỨ VỐN ĐÃ CÓ.
              Tra SERP ngày 09/09/2026: các trang đang xếp hạng cho phân khu này
              đều mang tiêu đề dạng "Mặt Bằng Phân Khu <tên> — Tiện Ích & Quy
              Hoạch". Trang mình có đúng tấm mặt bằng đó nhưng chưa bao giờ gọi
              tên nó, nên không đáp được cụm người ta gõ thật.
              Đây không phải nhồi từ khoá: tấm ảnh bên dưới ĐÚNG là mặt bằng quy
              hoạch, chỉ là trước nay để trần không tiêu đề. */}
          <h2 className="mb-8 font-display text-h2 font-normal">
            Mặt bằng quy hoạch — {khu.ten} nằm ở đâu
          </h2>
          <ClipReveal delay={120}>
            <div className="relative overflow-hidden bg-ink-soft">
              <ProjectImage
                name="tmb-ban-do"
                alt={`Vị trí ${khu.ten} trong toàn cảnh quy hoạch`}
                sizes="(min-width: 92rem) 92rem, 100vw"
                className="w-full object-cover opacity-70"
              />
              <span
                aria-hidden="true"
                style={{ left: `${khu.x}%`, top: `${khu.y}%` }}
                className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center"
              >
                <span className="absolute size-8 animate-ping rounded-full bg-jade/40 motion-reduce:animate-none" />
                <span className="relative size-4 rounded-full border-2 border-paper bg-jade" />
              </span>
            </div>
          </ClipReveal>
          {canBen.length > 0 ? (
            <p className="mt-5 max-w-[70ch] text-small leading-relaxed text-paper-dim">
              Hai phân khu gần nhất trên sơ đồ:{" "}
              {canBen.map((k, i) => (
                <span key={k.ma}>
                  {i > 0 ? " và " : ""}
                  <Link href={`/phan-khu/${k.ma}`} className="link-underline text-jade">
                    {k.ten}
                  </Link>
                </span>
              ))}
              . Sơ đồ đầy đủ chín phân khu nằm ở trang{" "}
              <Link href={DUONG_DAN.quyHoach} className="link-underline text-jade">
                quy hoạch
              </Link>
              .
            </p>
          ) : null}
        </div>
      </section>

      <section className="px-6 py-nhip md:px-10">
        <div className="mx-auto grid max-w-[92rem] gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <h2 className="text-label uppercase text-jade">Điểm nhấn</h2>
          </div>
          <ul className="md:col-span-8 md:col-start-5">
            {khu.diemNhan.map((diem, i) => (
              <ClipReveal key={diem} delay={i * 90}>
                <li className="flex gap-6 border-b border-ink-line py-7">
                  <span className="tabular text-label text-jade">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-h3 font-normal">{diem}</span>
                </li>
              </ClipReveal>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-20 max-w-[92rem]">
          <div className="flex flex-wrap items-center gap-4 border-t border-ink-line pt-10">
            <Link
              href="/lien-he"
              className="nut nut-chinh"
            >
              Nhận bảng giá khu này
            </Link>
            <Link
              href="/quy-can-global-gate-ha-long"
              className="nut nut-phu"
            >
              Xem dòng sản phẩm
            </Link>
          </div>
        </div>
      </section>

      <BangHangQuanhDay />

      {/* Điều hướng vòng tròn giữa chín khu — không có ngõ cụt. */}
      <section className="border-t border-ink-line px-6 py-16 md:px-10">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-6">
          <Link href={`/phan-khu/${truoc.ma}`} className="group max-w-[45%]">
            <span className="text-label uppercase text-paper/40">Khu trước</span>
            <span className="mt-2 block font-display text-h3 font-normal transition-colors group-hover:text-jade">
              ← {truoc.ten}
            </span>
          </Link>
          <Link
            href={`/phan-khu/${sau.ma}`}
            className="group max-w-[45%] text-right"
          >
            <span className="text-label uppercase text-paper/40">Khu tiếp</span>
            <span className="mt-2 block font-display text-h3 font-normal transition-colors group-hover:text-jade">
              {sau.ten} →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
