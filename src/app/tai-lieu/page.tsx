import type { Metadata } from "next";
import Link from "next/link";
import { SplitReveal } from "@/components/ui/split-reveal";
import { ClipReveal } from "@/components/motion/scroll-effects";
import { duAn, lienKet, taiLieu, duongDanDrive } from "@/data/project";

export const metadata: Metadata = {
  alternates: { canonical: "/tai-lieu" },
  title: "Tài liệu dự án",
  description: `Tổng mặt bằng, mặt bằng căn, tiêu chuẩn bàn giao và hồ sơ pháp lý ${duAn.ten}.`,
};

export default function TrangTaiLieu() {
  return (
    <section className="px-6 pb-nhip pt-44 md:px-10">
      <div className="mx-auto max-w-[92rem]">
        <h1 className="max-w-3xl font-display text-h1 font-normal">
          <SplitReveal text="Hồ sơ dự án *đầy đủ*" />
        </h1>
        <ClipReveal delay={120}>
          <p className="mt-8 max-w-xl text-lead text-paper-dim">
            Toàn bộ tài liệu do chủ đầu tư phát hành, mở trực tiếp trên Google
            Drive. Không cần đăng ký để xem.
          </p>
        </ClipReveal>

        <div className="mt-16 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {taiLieu.map((muc, i) => (
            <ClipReveal key={muc.ten} delay={(i % 3) * 90}>
              <a
                href={duongDanDrive(muc)}
                target="_blank"
                rel="noreferrer"
                data-do="tai-lieu"
                data-do-chi-tiet={muc.ten}
                className="group flex h-full flex-col border-t border-ink-line pt-7 transition-colors hover:border-jade"
              >
                <h2 className="font-display text-h3 font-normal transition-colors group-hover:text-jade">
                  {muc.ten}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-paper-dim">
                  {muc.moTa}
                </p>
                <span className="mt-6 text-label uppercase text-jade">
                  Mở tài liệu ↗
                </span>
              </a>
            </ClipReveal>
          ))}
        </div>

        {/*
          Miễn trừ đặt ngay tại trang tài liệu chứ không chỉ ở chân trang: đây là
          nơi người mua đọc số liệu kỹ nhất, nên cũng là nơi cần nói rõ nhất rằng
          bản chốt là hợp đồng chứ không phải file trên Drive.
        */}
        <div className="mt-24 border-t border-ink-line pt-10">
          <p className="max-w-3xl text-sm leading-relaxed text-paper/45">
            Tài liệu trên Drive được chủ đầu tư cập nhật theo từng thời điểm. Khi
            có sai lệch, hồ sơ pháp lý và hợp đồng mua bán tại thời điểm giao
            dịch là căn cứ cuối cùng.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={lienKet.hoSoPhapLy}
              target="_blank"
              rel="noreferrer"
              className="nut nut-phu"
            >
              Cổng thông tin chủ đầu tư
            </a>
            <Link
              href="/lien-he"
              className="nut nut-chinh"
            >
              Nhận tư vấn
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
