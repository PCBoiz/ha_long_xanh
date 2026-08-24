"use client";

import { useState } from "react";
import Link from "next/link";
import { ProjectImage } from "@/components/ui/project-image";
import { phanKhu } from "@/data/project";

/**
 * Sơ đồ quy hoạch bấm chọn được — điểm níu chân chính của trang chủ.
 *
 * Nền là bản vẽ tổng mặt bằng CHÍNH THỨC của chủ đầu tư, đã cắt bỏ tiêu đề và
 * hai cột chú giải. Chín điểm bấm nằm đúng vị trí chín phân khu; toạ độ ghi
 * bằng PHẦN TRĂM trong `data/project.ts` nên ảnh co giãn cỡ nào điểm cũng bám
 * đúng chỗ, và chỉnh lại chỉ là sửa hai con số.
 *
 * Có hai đường vào cùng một nội dung: bấm điểm trên bản đồ, hoặc bấm tên trong
 * danh sách bên dưới. Danh sách không phải để cho đẹp — trên điện thoại các
 * điểm nằm sát nhau rất khó trúng, và người dùng bàn phím thì cần một trình tự
 * rõ ràng để đi qua.
 */
export function SoDoPhanKhu() {
  const [maDangChon, setMaDangChon] = useState<string | null>(null);
  const dangChon = phanKhu.find((khu) => khu.ma === maDangChon) ?? null;

  return (
    <div>
      <div className="relative overflow-hidden bg-ink-soft">
        <ProjectImage
          name="tmb-ban-do"
          sizes="100vw"
          className="w-full object-cover"
        />

        {/* Làm tối bản đồ khi đã chọn, để bảng thông tin nổi lên trên. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-ink transition-opacity duration-500 ${
            dangChon ? "opacity-55" : "opacity-0"
          }`}
        />

        {phanKhu.map((khu) => {
          const duocChon = khu.ma === maDangChon;
          return (
            <button
              key={khu.ma}
              type="button"
              onClick={() => setMaDangChon(duocChon ? null : khu.ma)}
              aria-pressed={duocChon}
              style={{ left: `${khu.x}%`, top: `${khu.y}%` }}
              // `size-11` = 44px, ngưỡng tối thiểu cho một điểm bấm bằng ngón
              // tay. Đo bản cũ (`p-3` quanh một chấm 14px) ra 38×38px — trượt
              // ngưỡng, mà chín cái này lại nằm sát nhau trên bản đồ nên bấm
              // nhầm sang khu bên cạnh là chuyện thường.
              className="group absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
            >
              <span className="relative grid place-items-center">
                {/* Vòng lan toả mời bấm. Tắt khi người dùng chọn giảm chuyển
                    động, và tắt luôn ở điểm đang chọn cho đỡ rối. */}
                {!duocChon ? (
                  <span
                    aria-hidden="true"
                    className="absolute size-4 animate-ping rounded-full bg-jade/50 motion-reduce:animate-none"
                  />
                ) : null}
                <span
                  className={`relative size-3.5 rounded-full border transition-all duration-300 ${
                    duocChon
                      ? "scale-125 border-paper bg-paper"
                      : "border-paper/70 bg-jade group-hover:scale-125 group-hover:bg-paper"
                  }`}
                />
              </span>

              {/* Tên hiện khi rê chuột hoặc khi đang chọn — hiện sẵn cả chín cái
                  thì bản đồ thành một mớ chữ chồng nhau.

                  Cỡ chữ nâng từ 0,65rem lên 0,75rem: đo được 10,4px ở khổ
                  320px, tức là cỡ chữ nhỏ nhất trên cả trang, lại IN HOA và
                  giãn chữ rộng — dạng khó đọc nhất với tiếng Việt có dấu.

                  Nâng được vì trên điện thoại KHÔNG CÓ rê chuột: mỗi lúc chỉ
                  nhãn của phân khu đang chọn hiện ra, nên lo ngại chồng chữ ở
                  dòng trên không áp dụng. Giãn chữ hạ một nấc để bù lại phần
                  bề ngang tăng thêm. */}
              <span
                className={`pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap bg-ink/85 px-2.5 py-1 text-[0.75rem] uppercase tracking-wide transition-opacity duration-300 ${
                  duocChon
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
              >
                {khu.ten}
              </span>
            </button>
          );
        })}

        {/* Bảng thông tin: đè lên bản đồ ở màn rộng, xuống dưới ở màn hẹp. */}
        {dangChon ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden p-6 md:block md:p-10">
            <div className="pointer-events-auto max-w-md border border-ink-line bg-ink/92 p-8 backdrop-blur-md">
              <BangThongTin
                khu={dangChon}
                dong={() => setMaDangChon(null)}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Bảng thông tin bản màn hẹp. */}
      {dangChon ? (
        <div className="border border-ink-line bg-ink-soft p-7 md:hidden">
          <BangThongTin khu={dangChon} dong={() => setMaDangChon(null)} />
        </div>
      ) : null}

      {/* Danh sách tên — đường vào thứ hai, và là chỉ dẫn cho người chưa hiểu
          rằng bản đồ bấm được. */}
      <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-3">
        {phanKhu.map((khu) => {
          const duocChon = khu.ma === maDangChon;
          return (
            <li key={khu.ma}>
              <button
                type="button"
                onClick={() => setMaDangChon(duocChon ? null : khu.ma)}
                aria-pressed={duocChon}
                className={`inline-flex min-h-11 items-center border px-4 text-label uppercase transition-colors ${
                  duocChon
                    ? "border-paper bg-paper text-ink"
                    : "border-ink-line text-paper/65 hover:border-paper/50 hover:text-paper"
                }`}
              >
                {khu.ten}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function BangThongTin({
  khu,
  dong,
}: {
  khu: (typeof phanKhu)[number];
  dong: () => void;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-label uppercase text-jade">{khu.tenTiengAnh}</p>
          <h3 className="mt-2 font-display text-h2 font-normal">{khu.ten}</h3>
        </div>
        <button
          type="button"
          onClick={dong}
          aria-label="Đóng thông tin phân khu"
          className="inline-flex min-h-11 shrink-0 items-center text-label uppercase text-paper/50 transition-colors hover:text-paper"
        >
          Đóng
        </button>
      </div>

      <ul className="mt-6 space-y-3">
        {khu.diemNhan.map((diem) => (
          <li key={diem} className="flex gap-3 text-sm leading-relaxed text-paper/80">
            <span aria-hidden="true" className="mt-2 size-1 shrink-0 bg-jade" />
            <span>{diem}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/quy-can-global-gate-ha-long"
        className="mt-7 inline-block border border-paper/25 px-6 py-3 text-label uppercase transition-colors hover:bg-paper hover:text-ink"
      >
        Xem sản phẩm
      </Link>
    </div>
  );
}
