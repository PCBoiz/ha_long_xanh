"use client";

import { useEffect, useRef } from "react";

/**
 * Nền trang trí: các lớp núi đá vôi vịnh Hạ Long vẽ bằng nét mảnh.
 *
 * Bản tham chiếu dùng nét vẽ mây kiểu cổ để lấp khoảng đen sau tiêu đề. Ở đây
 * chủ thể là vịnh Hạ Long nên hình phải là núi đá vôi — mượn nguyên mây của họ
 * thì thành trang trí vay mượn, không nói được gì về nơi này.
 *
 * Vẽ bằng canvas thay vì SVG viết tay: hình núi là hàng nghìn điểm sinh theo
 * công thức, viết tay đường path cho từng đỉnh vừa dài vừa không sửa được.
 *
 * Hoàn toàn tĩnh — không có khung hình động nào chạy sau khi vẽ xong.
 */

/** Bộ sinh số giả ngẫu nhiên có hạt giống, để mỗi lần vẽ ra đúng dãy núi ấy. */
function boSinhSo(hatGiong: number): () => number {
  let trangThai = hatGiong >>> 0;
  return () => {
    trangThai = (trangThai + 0x6d2b79f5) >>> 0;
    let x = Math.imul(trangThai ^ (trangThai >>> 15), 1 | trangThai);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

interface Dinh {
  tam: number;
  rong: number;
  cao: number;
}

/**
 * Chiều cao dãy núi tại vị trí x, bằng tổng đóng góp của mọi đỉnh.
 *
 * Dùng luỹ thừa bậc 4 ở mẫu số thay cho đường cong Gauss: núi đá vôi có sườn
 * dựng đứng và đỉnh hơi bằng, còn Gauss cho ra gò đất tròn xoe.
 */
function chieuCao(x: number, cacDinh: Dinh[]): number {
  let tong = 0;
  for (const dinh of cacDinh) {
    const d = (x - dinh.tam) / dinh.rong;
    tong += dinh.cao / (1 + d * d * d * d);
  }
  return tong;
}

export function KarstBackdrop({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const but = canvas.getContext("2d");
    if (!but) return;

    let hen: ReturnType<typeof setTimeout>;

    const ve = () => {
      const khung = canvas.parentElement;
      if (!khung) return;
      const rong = khung.clientWidth;
      const cao = khung.clientHeight;
      if (rong === 0 || cao === 0) return;

      // Vẽ ở độ phân giải thật của màn hình để nét không bị răng cưa, nhưng
      // chặn trên ở 2 vì trên màn 3x thì tốn gấp rưỡi mà mắt không thấy khác.
      const tiLe = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rong * tiLe);
      canvas.height = Math.floor(cao * tiLe);
      canvas.style.width = `${rong}px`;
      canvas.style.height = `${cao}px`;
      but.setTransform(tiLe, 0, 0, tiLe, 0, 0);
      but.clearRect(0, 0, rong, cao);

      const SO_LOP = 4;
      const SO_NET = 7;

      for (let lop = 0; lop < SO_LOP; lop += 1) {
        const ngau = boSinhSo(9137 + lop * 733);
        // Lớp càng xa càng nhiều đỉnh nhỏ và càng mờ — tạo chiều sâu như sương
        // phủ trên vịnh.
        const soDinh = 4 + lop * 2;
        const cacDinh: Dinh[] = Array.from({ length: soDinh }, () => ({
          tam: ngau() * rong * 1.2 - rong * 0.1,
          rong: rong * (0.05 + ngau() * 0.09),
          cao: cao * (0.16 + ngau() * 0.3) * (1 - lop * 0.13),
        }));

        const dayLop = cao * (0.62 + lop * 0.13);
        const doDam = 0.055 + lop * 0.022;

        for (let net = 0; net < SO_NET; net += 1) {
          // Mỗi nét là một đường đồng mức thu nhỏ dần vào trong, cho cảm giác
          // núi được khắc bằng bút chì chứ không phải bóng đổ đặc.
          const coLai = 1 - net * 0.085;
          but.beginPath();
          but.moveTo(-10, dayLop);
          for (let x = -10; x <= rong + 10; x += 3) {
            but.lineTo(x, dayLop - chieuCao(x, cacDinh) * coLai);
          }
          but.strokeStyle = `rgba(234, 235, 230, ${(doDam * (1 - net / SO_NET)).toFixed(4)})`;
          but.lineWidth = 1;
          but.stroke();
        }
      }
    };

    ve();

    // Đổi bề ngang thì dãy núi phải vẽ lại; hoãn một nhịp để không vẽ hàng chục
    // lần trong lúc người dùng đang kéo mép cửa sổ.
    const doiKichThuoc = () => {
      clearTimeout(hen);
      hen = setTimeout(ve, 180);
    };
    window.addEventListener("resize", doiKichThuoc);
    return () => {
      clearTimeout(hen);
      window.removeEventListener("resize", doiKichThuoc);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
