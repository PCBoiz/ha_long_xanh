import { diemKetNoi, duAn, toaDoDuAn } from "@/data/project";
import { khoangCachKm, lamTronKm, phuongVi } from "@/lib/dia-ly";

/**
 * Sơ đồ kết nối: dự án ở tâm, các điểm quan trọng đặt đúng hướng và đúng xa gần.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * BẢN TRƯỚC LÀ MỘT HÌNH VẼ KHÔNG NÓI GÌ, VÀ ĐÁNG GHI LẠI VÌ SAO
 *
 * Nó đặt cả sáu điểm trên CÙNG một vòng tròn, ở những góc chọn tay cho cân
 * hình. Mà mắt người đọc hình tròn theo đúng một cách: cùng bán kính nghĩa là
 * cùng khoảng cách. Nên hình cũ nói rằng Móng Cái xa bằng trung tâm Hạ Long —
 * lệch bảy lần. Nó không phải sơ đồ, nó là đồ trang trí đội lốt sơ đồ, và
 * người xem cảm được điều đó ngay cả khi không chỉ ra được sai ở đâu.
 *
 * BẢN NÀY để hình học mang thông tin, cả hai chiều:
 *
 *   · GÓC là phương vị la bàn thật, tính từ toạ độ. Đông ở bên phải.
 *   · BÁN KÍNH tăng theo khoảng cách thật, thang căn bậc hai.
 *   · VÒNG TRÒN thành cái thước: 20 km, 50 km, 100 km, có ghi số.
 *
 * Nhờ vậy hình tự nói ra điều mạnh nhất về vị trí này, điều bản cũ giấu mất:
 * dự án nằm gần như CHÍNH GIỮA trục đông–tây, cách trung tâm Hạ Long 19 km về
 * phía đông và cách Hải Phòng 20 km về phía tây, với ba điểm gần nhất chụm
 * trong vòng 20 km. Đó là cả luận điểm về vị trí, hiện ra thành hình mà không
 * cần một câu quảng cáo nào.
 *
 * VÌ SAO THANG CĂN BẬC HAI. Xa nhất chia gần nhất là 7,4 lần; vẽ thang thẳng
 * thì ba điểm gần dồn thành một cục sát tâm và đè lên chữ ở giữa. Căn bậc hai
 * kéo tỉ lệ ấy xuống 2,7 lần — vẫn đọc ra "gần hơn hẳn" mà còn chỗ thở. Thang
 * có bóp lại nhưng KHÔNG đảo thứ tự, và các vòng thước đều ghi số nên người
 * đọc luôn kiểm lại được bằng con số thật.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Bán kính nhỏ nhất và lớn nhất trên hình, theo đơn vị viewBox. */
const BAN_KINH_TRONG = 25;
const BAN_KINH_NGOAI = 45;

/** Các vòng thước có ghi số, đơn vị ki-lô-mét. */
const VONG_THUOC = [20, 50, 100] as const;

/**
 * Vùng trống chừa quanh tâm cho tên dự án — các tia bắt đầu từ mép vùng này.
 *
 * HÌNH BẦU DỤC, KHÔNG PHẢI HÌNH TRÒN, và lệch xuống dưới. Vì khối chữ ở tâm
 * cũng vậy: nó rộng hơn cao, và nằm dưới cái chấm. Chừa một vành tròn thì tia
 * đi về hướng tây nam (sân bay Cát Bi ở 230°) vẫn khởi hành từ ngay giữa chữ
 * "Global" — đúng lỗi mà việc chừa khoảng trống sinh ra để tránh.
 */
const O_TAM = { x: 50, y: 53.5, rx: 21, ry: 12 } as const;

/**
 * Bán kính khởi hành của tia theo hướng `goc`: chỗ tia cắt mép vùng trống.
 *
 * Giải phương trình bậc hai giữa tia xuất phát từ tâm hình và đường bầu dục.
 * Tính thay vì ước lượng, để đổi cỡ chữ ở tâm chỉ cần sửa `O_TAM` — không phải
 * dò lại từng góc bằng mắt.
 */
function batDauTia(rad: number): number {
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const lech = 50 - O_TAM.y; // tâm hình so với tâm ô, theo trục y
  const a = (dx / O_TAM.rx) ** 2 + (dy / O_TAM.ry) ** 2;
  const b = (2 * lech * dy) / O_TAM.ry ** 2;
  const c = lech ** 2 / O_TAM.ry ** 2 - 1;
  const delta = b * b - 4 * a * c;
  if (delta <= 0) return 0;
  return Math.max(0, (-b + Math.sqrt(delta)) / (2 * a));
}

export function SoDoKetNoi() {
  const doDuoc = diemKetNoi.map((diem) => ({
    ...diem,
    km: khoangCachKm(toaDoDuAn, diem.toaDo),
    goc: phuongVi(toaDoDuAn, diem.toaDo),
  }));

  const xaNhat = Math.max(...doDuoc.map((d) => d.km));
  const ganNhat = Math.min(...doDuoc.map((d) => d.km));

  /**
   * Đổi ki-lô-mét thành bán kính trên hình.
   *
   * Neo hai đầu vào điểm gần nhất và xa nhất THẬT, nên thêm hay bớt một điểm
   * thì cả hình tự giãn lại cho vừa — không có con số nào phải chỉnh tay.
   */
  const banKinh = (km: number): number => {
    const t =
      xaNhat === ganNhat
        ? 0
        : (Math.sqrt(km) - Math.sqrt(ganNhat)) /
          (Math.sqrt(xaNhat) - Math.sqrt(ganNhat));
    return BAN_KINH_TRONG + t * (BAN_KINH_NGOAI - BAN_KINH_TRONG);
  };

  const diem = doDuoc.map((d) => {
    // Phương vị tính từ hướng bắc theo chiều kim đồng hồ, còn trục y của SVG
    // hướng xuống. Trừ 90° là khớp được hai hệ với nhau.
    const rad = ((d.goc - 90) * Math.PI) / 180;
    const r = banKinh(d.km);
    return {
      ...d,
      x: 50 + r * Math.cos(rad),
      y: 50 + r * Math.sin(rad),
      dong: d.goc < 180,
    };
  });

  // Đã đo được quãng đường chạy xe của điểm nào chưa.
  const coSoDuong = diemKetNoi.some((d) => d.khoangCach ?? d.thoiGian);

  return (
    <div>
      {/* ───────────────────────────── SƠ ĐỒ ─────────────────────────────
          CHỈ hiện từ khổ lg trở lên, và đây là quyết định chứ không phải bỏ
          sót. Sáu nhãn chữ toả quanh một vòng tròn cần chỗ cho CẢ vòng tròn
          LẪN hai dải chữ hai bên; ép xuống hẹp hơn thì chữ chồng lên nhau và
          người đọc nhận được ÍT thông tin hơn hẳn so với đọc bảng. Trên di
          động và máy tính bảng, bảng ngay bên dưới mang đúng những con số đó.

          Đo được ở đúng 768px trước khi sửa: nhãn phía tây (Hà Nội ở phương vị
          276°) thò ra ngoài mép trái 43px và kéo cả trang cuộn ngang 26px. Vì
          vậy vòng tròn CHỈ chiếm phần giữa, còn hai bên chừa sẵn chỗ cho chữ —
          `max-w-[34rem]` bên trong một khung rộng gấp rưỡi. */}
      <div className="mx-auto hidden max-w-5xl lg:block">
        <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {/* Vòng thước vẽ TRƯỚC các tia, để tia nằm đè lên chứ không bị vòng
              cắt ngang trông như nét đứt quãng. */}
          {VONG_THUOC.map((km) => (
            <circle
              key={km}
              cx="50"
              cy="50"
              r={banKinh(km)}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.12"
              className="text-paper/15"
            />
          ))}

          {/* Tia KHÔNG xuất phát từ đúng tâm mà từ mép vùng trống `O_TAM`.
              Vẽ từ tâm thì tia gần hướng đông (trung tâm Hạ Long ở 80°, gần
              như đông chính) đâm ngang qua tên dự án — chữ và nét đứt chồng
              lên nhau đúng chỗ quan trọng nhất của hình. Chừa khoảng trống vừa
              gỡ được va chạm, vừa làm cái tên nổi lên như một cái lõi thay vì
              bị các tia xâu qua. */}
          {diem.map((d) => {
            const rad = ((d.goc - 90) * Math.PI) / 180;
            const r0 = batDauTia(rad);
            return (
              <line
                key={d.ten}
                x1={50 + r0 * Math.cos(rad)}
                y1={50 + r0 * Math.sin(rad)}
                x2={d.x}
                y2={d.y}
                stroke="currentColor"
                strokeWidth="0.22"
                strokeDasharray="1 1.6"
                className="text-jade/40"
              />
            );
          })}

          {/* Số trên thước, đặt trên trục thẳng đứng phía DƯỚI tâm.
              Không có điểm nào nằm ở hướng nam: sáu phương vị trải từ 59° tới
              80° và từ 230° tới 276°, nên cả cung từ nam sang tây nam trống
              hoàn toàn. Phía bắc thì ngược lại — nhãn Móng Cái ở 59° chờm vào.
              Nền chữ nhật nhỏ phía sau để chữ không lẫn vào nét vòng. */}
          {VONG_THUOC.map((km) => (
            <g key={`nhan-${km}`}>
              <rect
                x="45.2"
                y={50 + banKinh(km) - 1.7}
                width="9.6"
                height="3.4"
                className="fill-ink"
              />
              <text
                x="50"
                y={50 + banKinh(km) + 0.7}
                textAnchor="middle"
                className="fill-paper/45 text-[2.2px]"
              >
                {km} km
              </text>
            </g>
          ))}
        </svg>

        {/* Tâm — chính dự án.
            Chấm đặt ĐÚNG tâm, chữ nằm ngay dưới. Trước đây cả cụm chấm-và-chữ
            được căn giữa theo tâm, nên bản thân cái chấm bị đẩy lên cao hơn
            tâm thật — mà chấm ấy chính là gốc đo của mọi con số trên hình. */}
        <span className="absolute left-1/2 top-1/2 block size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-jade" />
        <div className="absolute left-1/2 top-1/2 mt-5 w-48 -translate-x-1/2 text-center">
          <p className="font-display text-h3 font-normal leading-tight">
            {duAn.tenNgan}
          </p>
          <p className="mt-1 text-xs text-paper-dim">{duAn.viTri}</p>
        </div>

        {/* Nhãn từng điểm.
            Đặt LỆCH HẲN sang một bên của chấm chứ không căn giữa bên dưới nó.
            Căn giữa thì hai điểm gần nhau về góc — Cát Bi 230° và Hải Phòng
            248° — đè lên nhau; đẩy chữ ra phía ngoài theo đúng chiều tia thì
            chúng tách ra, và mắt cũng đọc theo đúng chiều toả của sơ đồ. */}
        {diem.map((d) => (
          <div
            key={d.ten}
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
            className="absolute -translate-y-1/2"
          >
            <span className="absolute left-0 top-1/2 block size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper/70" />
            <div
              className={
                d.dong
                  ? "w-40 pl-4 text-left"
                  : "w-40 -translate-x-full pr-4 text-right"
              }
            >
              <p className="text-sm leading-tight">{d.ten}</p>
              <p className="tabular mt-0.5 text-xs text-jade">
                ≈ {lamTronKm(d.km)} km
              </p>
            </div>
          </div>
          ))}
        </div>
      </div>

      {/* Chú giải. Một hình có thước mà không nói thước đo cái gì thì vẫn là
          hình để đoán. */}
      <p className="mx-auto mt-6 hidden max-w-[62ch] text-center text-xs leading-relaxed text-paper-dim lg:block">
        Vòng tròn là thước khoảng cách, tính từ tâm khu theo đường chim bay.
        Hướng đặt theo phương vị la bàn thật — đông ở bên phải.
      </p>

      {/* ───────────────────────────── BẢNG ─────────────────────────────
          Sơ đồ để thấy tương quan, bảng để đọc số. Dưới khổ lg bảng là thứ
          DUY NHẤT, nên nó phải đứng một mình được. */}
      <dl className="mt-10 border-t border-ink-line lg:mt-16">
        {diem.map((d) => (
          <div
            key={d.ten}
            className="grid gap-x-8 gap-y-1 border-b border-ink-line py-5 sm:grid-cols-[1fr_auto] sm:items-baseline"
          >
            <dt>
              <span className="font-display text-h3 font-normal">{d.ten}</span>
              <span className="mt-1 block text-sm text-paper-dim">{d.moTa}</span>
            </dt>
            <dd className="flex flex-wrap items-baseline gap-x-5 sm:justify-end">
              <span className="tabular text-lead text-jade">
                ≈ {lamTronKm(d.km)} km
              </span>
              {/* Quãng đường chạy xe chỉ hiện khi thật sự có số đo. */}
              {d.khoangCach ? (
                <span className="tabular text-sm text-paper-dim">
                  {d.khoangCach} đường bộ
                </span>
              ) : null}
              {d.thoiGian ? (
                <span className="tabular text-sm text-paper-dim">
                  {d.thoiGian}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>

      {/* Nói THẲNG con số này là gì và chưa là gì.
          Đây là chỗ dễ hiểu nhầm nhất trên cả trang: thấy "19 km" là nghĩ ngay
          ra "chạy hai mươi phút". Đường quanh Quảng Yên phải vòng theo cửa sông
          và theo nút lên xuống cao tốc, nên hai con số lệch nhau rất xa. */}
      <p className="mt-6 max-w-[70ch] text-small leading-relaxed text-paper-dim">
        Các con số trên là{" "}
        <strong className="text-paper">khoảng cách đường chim bay</strong> tính
        từ tâm khu — để hình dung xa gần, không phải quãng đường chạy xe.
        {!coSoDuong ? (
          <>
            {" "}
            Quãng đường thực tế và thời gian di chuyển chưa được đưa lên đây, vì
            hai số đó lệch nhau đáng kể tuỳ tuyến và giờ đi, mà tuyến quanh
            Quảng Yên còn đang đổi theo tiến độ hạ tầng. Tư vấn viên gửi được lộ
            trình cụ thể từ nơi bạn xuất phát.
          </>
        ) : null}
      </p>
    </div>
  );
}
