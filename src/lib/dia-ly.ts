/**
 * Tính khoảng cách và hướng giữa hai điểm trên mặt đất.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO TÍNH CHỨ KHÔNG CHÉP SỐ VÀO DỮ LIỆU
 *
 * Khoảng cách chép tay là thứ không ai kiểm được và không ai nhớ sửa. Tính từ
 * toạ độ thì con số luôn khớp với chính toạ độ đang khai — muốn cãi thì mở bản
 * đồ ra đối chiếu, và đó chính là điều một trang tử tế nên mời người đọc làm.
 *
 * ⚠️ ĐÂY LÀ ĐƯỜNG CHIM BAY, KHÔNG PHẢI QUÃNG ĐƯỜNG CHẠY XE.
 *
 * Hai con số này khác nhau rất xa quanh Quảng Yên, vì đường phải vòng theo cửa
 * sông và theo các nút lên xuống cao tốc. Mọi chỗ hiển thị đều PHẢI ghi rõ là
 * đường chim bay; để trống chữ đó là để người mua tự hiểu thành thời gian chạy
 * xe, và họ sẽ dùng đúng con số đó để quyết định.
 *
 * Cũng vì vậy KHÔNG suy ra thời gian di chuyển từ đây. Thời gian chỉ được đăng
 * khi có số đo thật trên tuyến thật.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ToaDo {
  /** Vĩ độ, độ thập phân. Bắc là dương. */
  vi: number;
  /** Kinh độ, độ thập phân. Đông là dương. */
  kinh: number;
}

const BAN_KINH_TRAI_DAT_KM = 6371;

const rad = (do_: number) => (do_ * Math.PI) / 180;

/**
 * Khoảng cách đường chim bay giữa hai điểm, tính bằng ki-lô-mét.
 *
 * Dùng công thức haversine. Ở cỡ vài trăm ki-lô-mét, sai số so với mô hình cầu
 * dẹt chuẩn dưới 0,5% — nhỏ hơn nhiều so với sai số của chính việc chọn "tâm"
 * cho một khu đô thị rộng mấy nghìn hecta, nên không cần công thức nặng hơn.
 */
export function khoangCachKm(a: ToaDo, b: ToaDo): number {
  const dVi = rad(b.vi - a.vi);
  const dKinh = rad(b.kinh - a.kinh);
  const h =
    Math.sin(dVi / 2) ** 2 +
    Math.cos(rad(a.vi)) * Math.cos(rad(b.vi)) * Math.sin(dKinh / 2) ** 2;
  return 2 * BAN_KINH_TRAI_DAT_KM * Math.asin(Math.sqrt(h));
}

/**
 * Phương vị từ `a` tới `b`, tính bằng độ theo chiều kim đồng hồ từ hướng bắc.
 *
 * 0° là bắc, 90° là đông, 180° là nam, 270° là tây — đúng quy ước la bàn, để
 * sơ đồ đặt điểm ĐÚNG hướng thật ngoài đời chứ không phải hướng vẽ cho đẹp.
 */
export function phuongVi(a: ToaDo, b: ToaDo): number {
  const dKinh = rad(b.kinh - a.kinh);
  const y = Math.sin(dKinh) * Math.cos(rad(b.vi));
  const x =
    Math.cos(rad(a.vi)) * Math.sin(rad(b.vi)) -
    Math.sin(rad(a.vi)) * Math.cos(rad(b.vi)) * Math.cos(dKinh);
  return (((Math.atan2(y, x) * 180) / Math.PI) + 360) % 360;
}

/**
 * Làm tròn khoảng cách theo cách người ta thật sự nói.
 *
 * Dưới 100 km làm tròn tới ki-lô-mét; từ 100 km trở lên làm tròn tới 5 km. Ghi
 * "132,7 km" cho một quãng đường hơn trăm cây số là giả vờ chính xác: bản thân
 * điểm đầu là một khu đô thị rộng vài ki-lô-mét, nên chữ số lẻ đó vô nghĩa.
 */
export function lamTronKm(km: number): number {
  return km < 100 ? Math.round(km) : Math.round(km / 5) * 5;
}
