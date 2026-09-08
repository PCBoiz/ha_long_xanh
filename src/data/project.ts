import { projectImages, type ProjectImageName } from "./images.generated";
import type { ToaDo } from "@/lib/dia-ly";

/**
 * Ảnh riêng của một phân khu — chính sơ đồ quy hoạch cắt quanh khu đó.
 *
 * Bộ ảnh phối cảnh chủ đầu tư gửi KHÔNG ghi ảnh nào chụp khu nào, nên gán bừa
 * là nói sai với người mua. Bản cắt thì luôn đúng: đó thật sự là khu đó, chỉ là
 * nhìn từ bản vẽ. Ảnh do `npm run assets` sinh ra; chưa chạy thì trả null và
 * trang tự bỏ qua khối ảnh.
 */
export function anhPhanKhu(ma: string): ProjectImageName | null {
  const ten = `khu-${ma}`;
  return ten in projectImages ? (ten as ProjectImageName) : null;
}

// ============================================================================
// DỮ LIỆU DỰ ÁN — SỬA Ở ĐÂY, KHÔNG CẦN ĐỘNG VÀO CODE
// ============================================================================
//
// NGUỒN: phần lớn đọc trực tiếp từ sơ đồ tổng mặt bằng chính thức của chủ đầu
// tư (`public/images/tmb-tong-tien-ich.webp`) — tên phân khu, câu định vị và
// các cụm tiện ích lớn đều lấy nguyên văn trên bản vẽ đó.
//
// ⚠️  CẦN XÁC NHẬN: mọi mục có `canXacNhan: true` chưa được đối chiếu hồ sơ
//     gốc. Diện tích từng dòng sản phẩm suy ra từ TÊN FILE trong thư mục
//     "7. LAYOUT" của chủ đầu tư, chưa phải bảng hàng chính thức. Sai số liệu
//     bất động sản là rủi ro pháp lý — phải kiểm trước khi phát hành.

export interface SoLieu {
  nhan: string;
  giaTri: string;
  donVi?: string;
  canXacNhan?: boolean;
  /**
   * Con số này lấy ở đâu ra. HIỆN RA TRÊN TRANG, không phải chú thích cho lập
   * trình viên.
   *
   * Hai lý do, và lý do thứ hai bất ngờ hơn lý do thứ nhất:
   *
   *  1. TRUNG THỰC. Một con số bất động sản không có nguồn là một lời khẳng
   *     định trần trụi. Ghi nguồn ra thì người đọc tự đánh giá được mức tin, và
   *     người bán không phải chịu trách nhiệm cho thứ mình chỉ đang chuyển tiếp.
   *
   *  2. ĐƯỢC TRỢ LÝ AI TRÍCH DẪN NHIỀU HƠN. Nghiên cứu về tối ưu cho công cụ
   *     sinh (GEO) đo được: số liệu có ghi nguồn rõ ràng tăng khả năng được dẫn
   *     lại 25,9%, dẫn nguồn tường minh tăng 24,9%. Mô hình ngôn ngữ tránh nhắc
   *     lại những khẳng định không truy được về đâu — cùng một cơ chế mà người
   *     đọc cẩn thận dùng.
   */
  nguon?: string;
}

export interface DongSanPham {
  ma: string;
  ten: string;
  moTa: string;
  anh: ProjectImageName;
  /** Khoảng diện tích, ví dụ "60 – 144". Để trống nếu chưa có số chắc chắn. */
  dienTich?: string;
  /** Số tầng, ví dụ "3 – 4". */
  soTang?: string;
  /** Khoảng giá. CỐ Ý ĐỂ TRỐNG — chỉ điền khi có bảng giá chính thức. */
  khoangGia?: string;
  /** Bản vẽ mặt bằng các mẫu thuộc dòng này. */
  matBang?: ProjectImageName[];
  canXacNhan?: boolean;
}

/** Một phân khu trên sơ đồ quy hoạch. */
export interface PhanKhu {
  ma: string;
  ten: string;
  tenTiengAnh: string;
  /**
   * Vị trí điểm bấm, tính bằng PHẦN TRĂM chiều rộng/chiều cao của ảnh
   * `tmb-ban-do`. Dùng phần trăm nên ảnh co giãn thế nào điểm vẫn nằm đúng chỗ.
   *
   * ⚠️ Toạ độ ước lượng bằng mắt từ bản vẽ. Lệch thì sửa hai số này là xong,
   *    không phải đụng tới code.
   */
  x: number;
  y: number;
  diemNhan: string[];
}

export const duAn = {
  ten: "Vinhomes Global Gate Hạ Long",
  tenNgan: "Global Gate Hạ Long",
  tenKhac: "Hạ Long Xanh",
  viTri: "Quảng Yên, Quảng Ninh",
  chuDauTu: "Liên danh Tập đoàn Vingroup – Công ty CP Vinhomes",
  tinhTrang: "Đang xây dựng — khởi công 2025",
  phapLy: "Sở hữu lâu dài",

  /**
   * Slogan CHÍNH THỨC của dự án.
   *
   * Đi kèm tên ở thẻ tiêu đề trình duyệt, ảnh chia sẻ mạng xã hội và dữ liệu có
   * cấu trúc. Một chỗ khai, mọi nơi đọc theo — nên đổi slogan không phải đi lùng
   * trong mã.
   */
  slogan: "Nơi kỳ quan trở thành nhà",

  // Vế lớn ở mảng mở đầu là SLOGAN, vế nhỏ là câu định vị đọc nguyên văn trên
  // sơ đồ tổng mặt bằng ("...kết nối toàn cầu bên vịnh di sản quốc tế").
  //
  // Thứ tự này là chủ ý: "Thành phố kỳ quan" mô tả DỰ ÁN, "Nơi kỳ quan trở
  // thành nhà" mô tả điều xảy ra với NGƯỜI MUA. Với một màn hình đầu tiên chỉ
  // có vài giây, câu nói về người đọc thắng câu nói về sản phẩm.
  //
  // Dấu sao bọc cụm cần in nghiêng (xem `SplitReveal`).
  tuyenBoChinh: "Nơi *kỳ quan* trở thành nhà",
  /**
   * ⚠️ ĐÂY LÀ CÂU BÁN HÀNG, KHÔNG PHẢI CÂU MÔ TẢ DỰ ÁN.
   *
   * Bản cũ — "kết nối toàn cầu bên vịnh di sản quốc tế" — mô tả DỰ ÁN, và mô
   * tả bằng đúng những chữ mà mọi trang bán Global Gate khác cũng dùng. Nó
   * không nói được điều gì riêng của trang này, và không nói với người đọc
   * rằng họ nên làm gì.
   *
   * Bản này nói thẳng lập trường: mua để Ở trước đã, rồi mới tới chuyện giữ
   * giá trị. Đó đúng là tệp khách trọng tâm — người mua để ở nhưng vẫn quan
   * tâm căn mình chọn có giữ được giá không.
   */
  tuyenBoPhu: "Mua để sống. Chọn để giữ giá trị.",
  moTaNgan:
    "Đô thị biển quy mô lớn bên vịnh Hạ Long, nơi hạ tầng, tiện ích và thiên nhiên được quy hoạch đồng bộ ngay từ đầu.",
} as const;

export const soLieu: SoLieu[] = [
  {
    nhan: "Tổng diện tích",
    giaTri: "6.206",
    donVi: "ha",
    canXacNhan: true,
    nguon: "Sơ đồ tổng mặt bằng chủ đầu tư · chưa đối chiếu hồ sơ gốc",
  },
  {
    nhan: "Quy mô dân cư",
    giaTri: "380.000",
    donVi: "cư dân",
    canXacNhan: true,
    nguon: "Sơ đồ tổng mặt bằng chủ đầu tư · chưa đối chiếu hồ sơ gốc",
  },
  {
    nhan: "Phân khu",
    giaTri: "9",
    donVi: "vịnh & đảo",
    nguon: "Đếm trên sơ đồ quy hoạch tổng mặt bằng",
  },
  {
    nhan: "Hình thức sở hữu",
    giaTri: "Lâu dài",
    nguon: "Hồ sơ pháp lý chủ đầu tư phát hành",
  },
];

/**
 * Chín phân khu trên sơ đồ quy hoạch, theo đúng thứ tự từ tây sang đông.
 * `diemNhan` chép từ các cụm chú giải lớn nằm cạnh từng phân khu trên bản vẽ.
 */
export const phanKhu: PhanKhu[] = [
  {
    ma: "paradise-bay",
    ten: "Vịnh Thiên Đường",
    tenTiengAnh: "Paradise Bay",
    x: 28.1,
    y: 70.7,
    diemNhan: [
      "Công viên rừng Globe Hạ Long 662ha",
      "TTTM Vincom Megamall, TOD ga Depot & Outlet 73ha",
      "Quần thể 12 sân golf 950ha",
    ],
  },
  {
    ma: "wonder-island",
    ten: "Đảo Kỳ Quan",
    tenTiengAnh: "Wonder Island",
    x: 37.1,
    y: 18.7,
    diemNhan: [
      "Công viên VinWonders 81ha",
      "Toà tháp văn phòng Wonder Tower 45 tầng",
      "Sòng bạc hoàng gia Casino Royal Bay",
    ],
  },
  {
    ma: "festa-bay",
    ten: "Vịnh Lễ Hội",
    tenTiengAnh: "Festa Bay",
    x: 47.5,
    y: 18.7,
    diemNhan: [
      "Điểm đến văn hoá & sự kiện 16,4ha",
      "Làng hải sản Việt Seafood 10ha",
      "Hệ thống khách sạn và resort thương hiệu quốc tế",
    ],
  },
  {
    ma: "elite-sport-island",
    ten: "Đảo Tinh Hoa Thể Thao",
    tenTiengAnh: "Elite Sport Island",
    x: 61.3,
    y: 12.5,
    diemNhan: [
      "Học viện golf PGA đẳng cấp quốc tế 5,8ha",
      "Công viên thể thao quốc tế Global Sportia Park 9,4ha",
      "Quần thể 12 sân golf 950ha",
    ],
  },
  {
    ma: "crystal-island",
    ten: "Đảo Pha Lê",
    tenTiengAnh: "Crystal Island",
    x: 58.3,
    y: 54.6,
    diemNhan: [
      "Hệ thống biển Lagoon 680ha — 100% nước biển tự nhiên",
    ],
  },
  {
    ma: "new-horizon-island",
    ten: "Đảo New Horizon",
    tenTiengAnh: "New Horizon Island",
    x: 70.6,
    y: 54.6,
    diemNhan: [
      "Đảo đô thị hưu trí & dưỡng lão cao cấp Vin New Horizon 138ha",
    ],
  },
  {
    ma: "elite-green-island",
    ten: "Đảo Thượng Lưu Xanh",
    tenTiengAnh: "Elite Green Island",
    x: 78.4,
    y: 18.6,
    diemNhan: [
      "Công viên cầu cá rừng ngập mặn 800ha",
      "Làng văn hoá & ẩm thực Việt Nam Heritage Village 18,5ha",
    ],
  },
  {
    ma: "green-energy-bay",
    ten: "Vịnh Năng Lượng Xanh",
    tenTiengAnh: "Green Energy Bay",
    x: 89.3,
    y: 24.8,
    diemNhan: ["Phân khu căn hộ cao tầng hướng vịnh"],
  },
  {
    ma: "diamond-island",
    ten: "Đảo Kim Cương",
    tenTiengAnh: "Diamond Island",
    x: 83.1,
    y: 48.6,
    diemNhan: ["Phân khu thấp tầng ven sông"],
  },
];

/**
 * Các dòng sản phẩm.
 *
 * Diện tích lấy từ TÊN FILE trong thư mục "7. LAYOUT" của chủ đầu tư
 * (60m2-CH09.LK01A, 96m2-CH59.LK02A, 144m2-CH17.LK02B, 162m2-CH09.SLI01,
 * 183.1m2-CH32.SLD01, 1029.4m2-BTB.CH73.DL03, 1052.8m2-BTB.CH40.DL02).
 * Đây là diện tích của các mẫu CÓ TRONG BỘ LAYOUT, chưa chắc phủ hết bảng hàng.
 *
 * `khoangGia` và `soTang` cố ý ĐỂ TRỐNG. Thẻ sản phẩm tự ẩn dòng nào chưa có
 * số — thà thiếu còn hơn hiện một con số bịa.
 */
export const dongSanPham: DongSanPham[] = [
  {
    ma: "lien-ke",
    ten: "Nhà liền kề",
    moTa: "Dãy phố thương mại và nhà ở liền kề, phù hợp vừa ở vừa kinh doanh.",
    anh: "san-pham-lien-ke",
    dienTich: "60 – 144",
    // Chỉ ba mẫu trong bộ layout ở dạng ảnh; các mẫu còn lại là PDF nên trang
    // dẫn sang thư mục Drive thay vì hiển thị.
    matBang: ["mat-bang-lien-ke-60", "mat-bang-lien-ke-96"],
    canXacNhan: true,
  },
  {
    ma: "song-lap",
    ten: "Biệt thự song lập",
    moTa: "Hai căn chung một khối, giữ được sân vườn riêng ở ba mặt.",
    anh: "san-pham-song-lap",
    dienTich: "162 – 183",
    matBang: ["mat-bang-song-lap-162"],
    canXacNhan: true,
  },
  {
    ma: "don-lap",
    ten: "Biệt thự đơn lập",
    moTa: "Đứng độc lập trên lô đất riêng, bốn mặt thoáng.",
    anh: "san-pham-don-lap",
    canXacNhan: true,
  },
  {
    ma: "biet-thu-bien",
    ten: "Biệt thự biển",
    moTa: "Dòng sản phẩm giới hạn, tầm nhìn trực diện ra vịnh.",
    anh: "san-pham-biet-thu-bien",
    dienTich: "1.029 – 1.053",
    canXacNhan: true,
  },
  {
    ma: "can-ho",
    ten: "Căn hộ cao tầng",
    moTa: "Toà căn hộ trong quần thể, hướng vịnh và công viên trung tâm.",
    anh: "cao-tang-01",
    canXacNhan: true,
  },
];

/** Khối niềm tin ngắn đặt ở trang chủ. */
export const diemTinCay = [
  // ⚠️ ĐÁNH DẤU CẦN ĐỐI CHIẾU — claim này đang nói CHO CẢ NĂM DÒNG SẢN PHẨM.
  //
  // "Sở hữu lâu dài" đúng với nhà thấp tầng gắn liền với đất. Nhưng dự án này
  // còn có căn hộ cao tầng, và hình thức sở hữu của căn hộ không mặc nhiên
  // giống nhà đất. Câu ở đây không phân biệt dòng nào, nên nó đang khẳng định
  // rộng hơn mức hồ sơ có thể chứng minh.
  //
  // KHÔNG XOÁ VÀ CŨNG KHÔNG SỬA THÀNH CÂU KHÁC khi chưa có hồ sơ trong tay —
  // sửa mò một câu pháp lý còn tệ hơn để nguyên. Việc phải làm là mở hồ sơ
  // pháp lý của TỪNG dòng sản phẩm, đối chiếu, rồi hoặc bỏ cờ này đi, hoặc
  // tách câu theo từng dòng.
  { nhan: "Pháp lý", giaTri: "Sở hữu lâu dài", canXacNhan: true },
  { nhan: "Tiến độ", giaTri: "Đã khởi công 2025" },
  { nhan: "Chủ đầu tư", giaTri: "Vingroup – Vinhomes" },
  { nhan: "Bảo lãnh", giaTri: "Ngân hàng Techcombank", canXacNhan: true },
];

// ⚠️ tour360 ĐỂ TRỐNG có chủ đích.
//
// Link Kuula cũ (kuula.co/share/collection/7MgVq) hiện trả về "This content is
// private or does not exist" — nút bấm vào đó sẽ dẫn khách tới trang lỗi. Ngoài
// ra tour đó là tài sản của bên khác và có số điện thoại của họ in trong đó, ta
// không xoá được.
//
// Mọi nút "Tour 360°" trên trang TỰ ẨN chừng nào ô này còn trống. Điền link
// mới (tour tự dựng, hoặc bản chia sẻ công khai không gắn số của bên khác) là
// nút hiện lại.
export const lienKet: { tour360: string; hoSoPhapLy: string } = {
  tour360: "",
  hoSoPhapLy:
    "https://market.vinhomes.vn/blog/tai-lieu/vinhomes-global-gate-ha-long",
};

export interface DiemKetNoi {
  ten: string;
  moTa: string;
  /** Toạ độ thật, để sơ đồ tự tính hướng và khoảng cách. */
  toaDo: ToaDo;
  /**
   * Quãng đường CHẠY XE, ví dụ "42 km". Khác hẳn đường chim bay mà sơ đồ tự
   * tính — chỉ điền khi có số đo thật trên tuyến thật.
   */
  khoangCach?: string;
  /** Thời gian chạy xe, ví dụ "45 phút". Cùng một điều kiện như trên. */
  thoiGian?: string;
}

/**
 * Toạ độ tâm khu, dùng làm gốc đo cho mọi khoảng cách trên trang.
 *
 * ⚠️ LÀ TÂM GẦN ĐÚNG, KHÔNG PHẢI MỘT ĐỊA CHỈ. Khu quy hoạch trải trên mấy nghìn
 * hecta nên "tâm" chỉ là một điểm quy ước; đi từ mép này sang mép kia đã chênh
 * nhau vài ki-lô-mét. Vì vậy mọi con số sinh ra từ đây đều hiển thị kèm dấu ≈
 * và đều làm tròn — xem `lib/dia-ly.ts`.
 */
export const toaDoDuAn: ToaDo = { vi: 20.925, kinh: 106.86 };

/**
 * Các điểm kết nối quanh dự án.
 *
 * TÊN và TOẠ ĐỘ là sự thật địa lý, tra được trên bất kỳ bản đồ nào. Từ hai thứ
 * đó, sơ đồ tự tính hướng la bàn và khoảng cách đường chim bay, nên hình vẽ
 * không thể lệch khỏi dữ liệu.
 *
 * `khoangCach` và `thoiGian` — tức quãng đường và thời gian CHẠY XE — vẫn cố ý
 * để trống. Đó là thứ khách dùng để quyết định mua, nói sai vài chục phút là
 * mất niềm tin, mà tuyến đường quanh Quảng Yên còn đang đổi theo tiến độ hạ
 * tầng. Điền vào là bảng tự hiện thêm cột, không phải sửa mã.
 */
export const diemKetNoi: DiemKetNoi[] = [
  {
    ten: "Trung tâm Hạ Long",
    moTa: "Bãi Cháy, Hòn Gai",
    toaDo: { vi: 20.954, kinh: 107.043 },
  },
  {
    ten: "Sân bay Cát Bi",
    moTa: "Cảng hàng không quốc tế",
    toaDo: { vi: 20.819, kinh: 106.725 },
  },
  {
    ten: "TP Hải Phòng",
    moTa: "Trung tâm công nghiệp – cảng biển",
    toaDo: { vi: 20.859, kinh: 106.683 },
  },
  {
    ten: "Sân bay Vân Đồn",
    moTa: "Cảng hàng không quốc tế",
    toaDo: { vi: 21.1178, kinh: 107.4142 },
  },
  {
    ten: "Hà Nội",
    moTa: "Qua cao tốc Hà Nội – Hải Phòng – Hạ Long",
    toaDo: { vi: 21.0285, kinh: 105.852 },
  },
  {
    ten: "Cửa khẩu Móng Cái",
    moTa: "Biên giới Việt – Trung",
    toaDo: { vi: 21.535, kinh: 107.967 },
  },
];

export interface HangMucTienIch {
  ten: string;
  /** Diện tích, đơn vị hecta. */
  dienTich: number;
  /**
   * Một đặc điểm KIỂM CHỨNG ĐƯỢC của hạng mục, nếu có.
   *
   * ⚠️ KHÔNG dùng cho danh xưng so sánh. Xem ghi chú ở `hangMucTienIch`.
   */
  danhXung?: string;
}

/**
 * Các hạng mục tiện ích lớn của dự án, kèm diện tích.
 *
 * NGUỒN: đọc nguyên văn từ sơ đồ tổng mặt bằng chính thức
 * (`public/images/tmb-tong-tien-ich.webp`) — phần chữ lớn, dễ đọc, không phải
 * chú giải nhỏ.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ĐÃ BỎ TOÀN BỘ DANH XƯNG SO SÁNH, và đây là quyết định của chủ trang.
 *
 * Trước đây trang có chép lại "lớn nhất Việt Nam", "lớn nhất thế giới", "top
 * đầu thế giới", "hàng đầu châu Á" — có ghi rõ là lời chủ đầu tư, có gắn nhãn
 * nguồn đàng hoàng. Về mặt pháp lý thì sạch. Nhưng về mặt người đọc thì không:
 * năm cụm "nhất" xếp cạnh nhau trong một màn hình đọc ra thành giọng quảng cáo,
 * và giọng đó chính là thứ khiến người mua đề phòng cả những chỗ trang nói
 * thật. Một trang tự nhận là kênh thông tin độc lập thì không đi mượn giọng
 * của bên bán.
 *
 * Diện tích thì GIỮ, vì diện tích là con số — người đọc tự so được. 950 hecta
 * sân golf nói mạnh hơn chữ "lớn nhất", và không ai cãi được nó.
 *
 * ⚠️ ĐỪNG THÊM LẠI. Trường `danhXung` còn đó cho những đặc điểm kiểm chứng
 * được, ví dụ "100% nước biển tự nhiên" — một câu có thể đối chiếu bằng hồ sơ
 * kỹ thuật. "Lớn nhất" thì không đối chiếu được bằng gì cả.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ Diện tích cần đối chiếu hồ sơ gốc trước khi phát hành.
 */
export const hangMucTienIch: HangMucTienIch[] = [
  { ten: "Quần thể 12 sân golf", dienTich: 950 },
  { ten: "Công viên cầu cá rừng ngập mặn", dienTich: 800 },
  {
    ten: "Hệ thống biển Lagoon",
    dienTich: 680,
    danhXung: "100% nước biển tự nhiên",
  },
  { ten: "Công viên rừng Globe Hạ Long", dienTich: 662 },
  { ten: "Đảo đô thị hưu trí Vin New Horizon", dienTich: 138 },
  { ten: "Công viên VinWonders", dienTich: 81 },
  { ten: "TTTM Vincom Megamall & TOD ga Depot", dienTich: 73 },
  { ten: "Làng văn hoá & ẩm thực Heritage Village", dienTich: 18.5 },
  { ten: "Điểm đến văn hoá & sự kiện", dienTich: 16.4 },
  { ten: "Làng hải sản Việt Seafood", dienTich: 10 },
  { ten: "Công viên thể thao Global Sportia Park", dienTich: 9.4 },
  { ten: "Học viện golf PGA", dienTich: 5.8 },
];

export interface DongSoSanh {
  tieuChi: string;
  noiNay: string;
  khuVucKhac: string;
}

/**
 * Khối "vì sao chọn nơi này".
 *
 * ⚠️ CỐ Ý ĐỂ TRỐNG. So sánh giá/m² và tiện ích với khu vực khác là tuyên bố về
 * thị trường — cần số liệu có nguồn, không phải cảm nhận. Giao diện đã dựng
 * xong và tự hiện trạng thái "đang cập nhật".
 */
export const soSanhKhuVuc: DongSoSanh[] = [];

export interface TaiLieu {
  ten: string;
  moTa: string;
  /** ID thư mục hoặc file trên Google Drive của chủ đầu tư. */
  driveId: string;
  loai: "thu-muc" | "tep";
}

/**
 * Tài liệu công bố cho NGƯỜI MUA.
 *
 * ⚠️ Bộ Drive của chủ đầu tư còn có "5. ĐÀO TẠO" và "4.CSBH" — tài liệu nội bộ
 * cho đội bán hàng (kịch bản tư vấn, chiến lược truyền thông, bảng tính hoa
 * hồng). CỐ Ý KHÔNG đưa vào đây: đăng công khai là lộ tài liệu nội bộ của đối
 * tác, và khách đọc chiến lược bán hàng thì phản tác dụng.
 *
 * Nếu owner muốn công bố thêm mục nào, thêm vào mảng này — trang tài liệu tự
 * hiện thêm thẻ, không phải sửa code.
 */
export const taiLieu: TaiLieu[] = [
  {
    ten: "Tổng mặt bằng",
    moTa: "Sơ đồ quy hoạch tổng thể, hệ tiện ích và mặt bằng từng khu.",
    driveId: "1kS8V72ciw5YlP0sURttsE-Zu8LWD_Npo",
    loai: "thu-muc",
  },
  {
    ten: "Mặt bằng căn",
    moTa: "Bản vẽ layout từng mẫu nhà, kèm diện tích.",
    driveId: "1iGYfdyn0fu8Y-l-jAzOE46JvSOyO_VIu",
    loai: "thu-muc",
  },
  {
    ten: "Tiêu chuẩn bàn giao",
    moTa: "Bảng tiêu chuẩn bàn giao nhà ở thấp tầng hoàn thiện.",
    driveId: "1PUJEQSk-t9oEp09EE0xa_vO2LjUl2_eS",
    loai: "thu-muc",
  },
  {
    ten: "Hồ sơ pháp lý",
    moTa: "Quyết định chấp thuận đầu tư, giao đất, bảo lãnh ngân hàng.",
    driveId: "1DdjQ5qGLNsW4PjBJYF7Qslx8aAzd9tjc",
    loai: "thu-muc",
  },
  {
    ten: "Tiến độ thi công",
    moTa: "Video và hình ảnh cập nhật hiện trạng công trường.",
    driveId: "1OEwKv182dOcBDThmO5oyCZmnWWWIi0JV",
    loai: "thu-muc",
  },
  {
    ten: "Thư viện phối cảnh",
    moTa: "Ảnh phối cảnh kiến trúc, tiện ích và cảnh quan độ phân giải cao.",
    driveId: "12HhGYrMQ115JoA_PNW8vraX44Hg4kEeJ",
    loai: "thu-muc",
  },
];

export function duongDanDrive(muc: TaiLieu): string {
  return muc.loai === "thu-muc"
    ? `https://drive.google.com/drive/folders/${muc.driveId}`
    : `https://drive.google.com/file/d/${muc.driveId}/view`;
}

/** Một căn trong bảng hàng. */
export interface CanHang {
  maCan: string;
  dongSanPham: string;
  dienTich: number;
  huong?: string;
  trangThai: "con" | "giu-cho" | "da-ban";
}

/**
 * Bảng hàng / quỹ căn.
 *
 * ⚠️ CỐ Ý ĐỂ TRỐNG. Đây là dữ liệu bán hàng thay đổi từng ngày và chỉ chủ đầu
 * tư mới có; bịa vài căn mẫu để "cho đẹp" là cách nhanh nhất khiến khách mất
 * niềm tin khi gọi lên hỏi. Giao diện bảng hàng đã dựng xong và tự hiện trạng
 * thái "chưa có dữ liệu" — đổ mảng này đầy là chạy ngay.
 */
export const bangHang: CanHang[] = [];

/** Một đợt trong tiến độ thanh toán. */
export interface DotThanhToan {
  ten: string;
  tyLe: string;
  moc: string;
}

/**
 * Tiến độ thanh toán theo đợt.
 *
 * ⚠️ CỐ Ý ĐỂ TRỐNG cho tới khi có chính sách bán hàng chính thức (thư mục
 * "4.CSBH / ĐANG ÁP DỤNG" trên Drive của chủ đầu tư). Tỉ lệ đóng tiền sai là
 * chuyện pháp lý, không phải chuyện trình bày.
 */
export const tienDoThanhToan: DotThanhToan[] = [];

/**
 * Thông tin liên hệ.
 *
 * ĐÃ CÓ SỐ. Trước đây ô này để trống, và hệ quả lan rộng hơn vẻ ngoài của nó:
 * nút gọi, nút Zalo nổi ở góc, thanh dính dưới màn hình di động, số trong dữ
 * liệu có cấu trúc — tất cả đều TỰ ẨN. Trang bán bất động sản tiền tỷ mà không
 * có chỗ nào bấm gọi thì mọi việc còn lại đều vô nghĩa.
 *
 * Zalo dùng chung số hotline: ở Việt Nam gần như luôn trùng, và bắt chủ trang
 * điền hai lần cùng một số là cách chắc chắn để một ngày nào đó hai ô lệch nhau.
 *
 * ĐÃ BỎ HẲN Ô EMAIL, theo quyết định của chủ trang — và đó là quyết định đúng
 * với tệp khách này. Người mua bất động sản ở Việt Nam gọi hoặc nhắn Zalo; một
 * dòng email trong chân trang gần như không ai bấm, nhưng lại chiếm chỗ và tạo
 * ra một đường liên hệ không ai trực. Thà có ít đường mà đường nào cũng có
 * người trả lời.
 */
// Không dùng `as const` ở đây: để trống thì TypeScript sẽ suy ra kiểu là chuỗi
// rỗng cố định, và mọi chỗ kiểm tra "đã có số chưa" đều bị coi là thừa.
export const lienHe: { hotline: string; zalo: string } = {
  hotline: "0941 328 658",
  zalo: "0941 328 658",
};

/* ===========================================================================
   PHÂN TÍCH ĐẦU TƯ — và vì sao mảng RỦI RO là mảng đáng giá nhất
   ---------------------------------------------------------------------------
   Mọi trang bán bất động sản đều có phần "tiềm năng đầu tư". Không trang nào
   có phần "rủi ro". Đó chính là lý do phần rủi ro ở đây đáng tiền.

   Nhà đầu tư có tiền không phải người ngây thơ. Họ BIẾT dự án nào cũng có rủi
   ro; đọc một trang chỉ toàn cơ hội thì kết luận rút ra không phải "dự án này
   an toàn" mà là "trang này giấu mình điều gì đó". Nói ra trước, bằng chữ của
   mình, vừa đúng vừa là cách duy nhất để phần cơ hội được đọc nghiêm túc.

   ⚠️ RÀNG BUỘC: mỗi mục dưới đây phải suy được từ dữ liệu đã có trong file này
   hoặc từ tình trạng dự án đã công bố. KHÔNG dự báo giá, KHÔNG con số lợi
   suất, KHÔNG so sánh với dự án khác — chưa có nguồn nào cho phép.
   =========================================================================== */

export interface LuanDiem {
  ten: string;
  /** Nói thẳng ở câu đầu, dẫn chứng ở câu sau. */
  noiDung: string;
  /** Căn cứ. Để trống nghĩa là chưa có căn cứ — và khi đó đừng viết mục này. */
  canCu: string;
}

export const coHoiDauTu: LuanDiem[] = [
  {
    ten: "Nằm trên trục hạ tầng đã có, không phải hạ tầng hứa hẹn",
    noiDung:
      "Dự án nằm trên tuyến cao tốc nối Hà Nội – Hải Phòng – Hạ Long, giữa hai cảng hàng không quốc tế Vân Đồn và Cát Bi, và trên đường ra cửa khẩu Móng Cái.",
    canCu:
      "Các tuyến và cảng hàng không này đều đã vận hành, không phụ thuộc vào tiến độ của chính dự án.",
  },
  {
    ten: "Quy mô đủ lớn để tự tạo ra nhu cầu tại chỗ",
    noiDung:
      "Một khu 6.206 ha với 9 phân khu và quy mô dân cư dự kiến 380.000 người không phụ thuộc vào dân cư sẵn có xung quanh như một dự án vài chục hecta.",
    canCu:
      "Số liệu đọc từ sơ đồ tổng mặt bằng chủ đầu tư, chưa đối chiếu hồ sơ gốc — xem mục rủi ro.",
  },
  {
    ten: "Tiện ích quy mô vùng, không phải tiện ích nội khu",
    noiDung:
      "Quần thể 12 sân golf 950 ha, công viên VinWonders 81 ha, trung tâm thương mại gắn ga đường sắt đô thị 73 ha — đây là hạng mục kéo người từ nơi khác đến, không chỉ phục vụ cư dân trong khu.",
    canCu:
      "Diện tích từng hạng mục đọc nguyên văn trên sơ đồ tổng mặt bằng chính thức.",
  },
  {
    ten: "Sở hữu lâu dài",
    noiDung:
      "Hình thức sở hữu lâu dài giữ được giá trị chuyển nhượng về sau, khác với sản phẩm có thời hạn vốn mất dần giá trị theo năm còn lại.",
    canCu: "Hồ sơ pháp lý do chủ đầu tư phát hành.",
  },
];

export const ruiRoDauTu: LuanDiem[] = [
  {
    ten: "Chưa có giá chính thức, nên chưa có cơ sở để tính hiệu quả",
    noiDung:
      "Không có bảng giá và chính sách bán hàng thì mọi phép tính về suất sinh lời đều là phỏng đoán. Đây là rủi ro lớn nhất ở thời điểm hiện tại.",
    canCu:
      "Chủ đầu tư chưa công bố bảng giá; trang này không đăng số phỏng đoán.",
  },
  {
    ten: "Quy mô lớn đồng nghĩa triển khai nhiều năm",
    noiDung:
      "Một khu hơn sáu nghìn hecta không hoàn thiện cùng lúc. Người mua ở giai đoạn đầu có thể sống cạnh công trường trong một khoảng thời gian dài trước khi khu vực quanh nhà mình thành hình.",
    canCu:
      "Dự án khởi công năm 2025 và đang trong giai đoạn xây dựng; kế hoạch phân kỳ chưa công bố.",
  },
  {
    ten: "Tiện ích trên bản vẽ là quy hoạch, không phải cam kết bàn giao",
    noiDung:
      "Các hạng mục lớn trên sơ đồ tổng mặt bằng thể hiện quy hoạch được duyệt. Thời điểm từng hạng mục đi vào hoạt động là chuyện khác, và chưa được công bố.",
    canCu:
      "Sơ đồ tổng mặt bằng không kèm mốc thời gian cho từng hạng mục.",
  },
  {
    ten: "Thanh khoản thứ cấp giai đoạn đầu thường thấp",
    noiDung:
      "Khu đô thị chưa có dân cư ổn định thì người mua lại chủ yếu vẫn là nhà đầu tư. Muốn bán ra trong ngắn hạn có thể phải chờ, hoặc phải chấp nhận mức giá thấp hơn kỳ vọng.",
    canCu:
      "Suy ra từ tình trạng dự án — đang xây dựng, chưa bàn giao. Không phải dự báo thị trường.",
  },
  {
    ten: "Số liệu quy mô chưa đối chiếu hồ sơ gốc",
    noiDung:
      "Tổng diện tích 6.206 ha và quy mô dân cư 380.000 người đọc từ sơ đồ tổng mặt bằng của chủ đầu tư. Trang này chưa đối chiếu với quyết định phê duyệt quy hoạch.",
    canCu: "Ghi rõ ngay tại chỗ hiển thị số liệu trên trang chủ.",
  },
];

/**
 * Những gì phải có trong tay TRƯỚC khi tính được hiệu quả đầu tư.
 *
 * Danh sách này vừa trung thực vừa là công cụ bán hàng — nó cho khách thấy
 * chính xác vì sao một cuộc gọi là bước bắt buộc, mà không phải hứa hẹn gì.
 */
export const canDeTinhHieuQua: string[] = [
  "Giá bán của đúng căn đang cân nhắc, không phải khoảng giá của cả dòng",
  "Chính sách bán hàng đang áp dụng tại thời điểm ký",
  "Tiến độ đóng tiền theo đợt, để tính chi phí vốn",
  "Các quyền lợi bạn đủ điều kiện nhận",
  "Mốc bàn giao dự kiến của đúng phân khu đó",
  "Tình hình giao dịch thực tế trong khu vực gần thời điểm mua",
];

/* ===========================================================================
   GIÁ THỰC TRẢ — phần bán hàng duy nhất KHÔNG cần dữ liệu chủ đầu tư
   ---------------------------------------------------------------------------
   Đây là chỗ gỡ nút thắt lớn nhất của cả trang.

   Trang có một mục "Bảng hàng & giá" mà chưa có giá, chưa có quỹ căn, chưa có
   chính sách — vì chủ đầu tư chưa công bố. Cách xử lý cũ là nói thật rồi mời
   để lại số. Đúng, nhưng yếu: khách chưa có lý do gì để tin rằng gọi thì hơn
   không gọi.

   Mảng này bán MỘT THỨ KHÁC: không bán con số của chủ đầu tư, mà bán VIỆC
   NGƯỜI TƯ VẤN LÀM VỚI con số đó. Sáu bước dưới đây không bước nào cần bảng
   giá — chúng là quy trình kiểm tra trước khi đặt cọc.

   ⚠️ RANH GIỚI CHỮ NGHĨA, không được vượt:

     ✗ "giá rẻ nhất thị trường"     — không kiểm chứng được, và hạ cấp thương hiệu
     ✗ "cam kết lợi nhuận"          — hứa điều không ai hứa được
     ✗ "chiết khấu tới X%"          — con số chưa công bố
     ✓ "kiểm tra xem có bỏ sót quyền lợi nào không"
     ✓ "tính ra số tiền thật sự phải trả"
     ✓ "mua đúng căn quan trọng hơn mua nhanh"

   Vế trái hứa một kết quả. Vế phải mô tả một việc làm. Chỉ vế phải là thứ giữ
   được lời.
   =========================================================================== */

export interface BuocGiaThucTra {
  ten: string;
  /** Việc cụ thể được làm. Động từ, không tính từ. */
  moTa: string;
  /** Điều gì hỏng nếu bỏ qua bước này. Đây mới là phần thuyết phục. */
  neuBoQua: string;
}

export const buocGiaThucTra: BuocGiaThucTra[] = [
  {
    ten: "Đối chiếu quỹ căn thật",
    moTa: "Kiểm tra căn bạn nhắm còn hay đã có người giữ chỗ, tại thời điểm bạn hỏi chứ không phải theo bảng in tuần trước.",
    neuBoQua:
      "Chọn xong mới biết căn đã bán, phải quyết lại vội trong lúc đang mất đà.",
  },
  {
    ten: "Xác nhận chính sách đang áp dụng",
    moTa: "Chính sách bán hàng thay theo đợt mở bán. Đối chiếu bản đang áp dụng đúng ngày bạn ký, không phải bản còn lưu trên mạng.",
    neuBoQua:
      "Tính dòng tiền theo một bảng tiến độ đã hết hiệu lực, sai ngay từ đợt đóng tiền đầu tiên.",
  },
  {
    // ⚠️ TÊN BƯỚC NÀY TỪNG LÀ "Rà soát quyền lợi BẠN ĐỦ ĐIỀU KIỆN". ĐỪNG QUAY LẠI.
    //
    // Nó đọc ra thành một điều kiện đầu vào: phải có sẵn quyền lợi thì mới có
    // gì để rà. Nhóm khách trang này muốn kéo lại đúng là người CHƯA có
    // voucher, chưa thuộc nhóm ưu đãi nào — nghe câu đó xong họ tự loại mình
    // ra trước khi kịp gọi.
    //
    // Cả trang mở đầu bằng "Chưa có voucher Vin? Hãy xem phương án của tôi",
    // rồi tới bước 03 lại nói ngược. Hai câu cùng một trang chống nhau, và câu
    // đứng sau thắng.
    ten: "Tìm hết các quyền lợi có thể áp dụng",
    moTa: "Chiết khấu thanh toán sớm, ưu đãi theo đợt mở bán, voucher, hỗ trợ lãi suất — mỗi loại một điều kiện riêng, và không loại nào tự động cộng vào. Chưa sẵn có quyền lợi nào thì vẫn còn nguyên phần này để rà.",
    neuBoQua:
      "Bỏ sót một quyền lợi vốn áp dụng được, và sau khi ký thì không xin lại được.",
  },
  {
    ten: "Tính ra số tiền thật sự phải trả",
    moTa: "Từ giá niêm yết trừ đi quyền lợi, cộng lại các khoản đi kèm, chia theo tiến độ — ra một con số duy nhất để so sánh.",
    neuBoQua:
      "So hai căn bằng giá niêm yết, trong khi số tiền thật sự phải trả lệch nhau theo hướng ngược lại.",
  },
  {
    ten: "So sánh nhiều phương án cạnh nhau",
    moTa: "Đặt các căn đang cân nhắc lên cùng một bảng: giá thực trả, dòng tiền theo đợt, hướng, vị trí trong khu, ưu và nhược.",
    neuBoQua:
      "Quyết theo tấm phối cảnh đẹp nhất thay vì theo phương án hợp với mình nhất.",
  },
  {
    ten: "Nói rõ nhược điểm của từng căn",
    moTa: "Căn nào cũng có điểm yếu — gần đường nội bộ, hướng nắng chiều, xa cổng chính. Biết trước thì trả giá đúng cho nó.",
    neuBoQua:
      "Phát hiện sau khi nhận nhà, lúc đó không đổi được và cũng không giảm giá được.",
  },
];

/**
 * BỘ THÔNG ĐIỆP CHỐT — năm câu cô lại toàn bộ điều trang này muốn nói.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * VÌ SAO KHAI Ở ĐÂY THAY VÌ GÕ THẲNG VÀO TỪNG TRANG
 *
 * Đây là những câu xuất hiện ở nhiều nơi nhất: trang chủ, trang voucher, trang
 * giá, trang giá thực trả, khối chốt cuối mỗi money page. Gõ tay ở từng chỗ thì
 * chỉ sau vài lần sửa là mỗi nơi một dị bản — và với câu bán hàng, dị bản không
 * phải chuyện thẩm mỹ: khách đọc ba trang thấy ba lời hứa hơi khác nhau sẽ
 * không nhớ được lời nào, mà chỉ nhớ cảm giác lỏng lẻo.
 *
 * Một chỗ khai, mọi nơi đọc theo. Sửa một câu là sửa khắp trang.
 *
 * ⚠️ RÀNG BUỘC CHỮ NGHĨA cho câu `voucher` và `truocKhiQuyetDinh`: hai câu này
 * mời khách xem một phương án, KHÔNG hứa một mức giảm. Được nói "xem phương án
 * của chúng tôi"; không được nói "chắc chắn có voucher", "giá thấp nhất",
 * "chiết khấu bí mật". Xem khối HỖ TRỢ QUYỀN LỢI ngay bên dưới.
 * ═══════════════════════════════════════════════════════════════════════════
 */
/**
 * Đợt ảnh hiện trạng gần nhất.
 *
 * ⚠️ KHAI Ở ĐÂY, ĐỪNG GÕ THÁNG VÀO TỪNG TRANG.
 *
 * Chuỗi "tháng 08/2026" từng nằm rải ở bảy chỗ: thẻ tiêu đề trang tiến độ,
 * phần mô tả, tiêu đề mảng ảnh, tiêu đề mảng ở trang vị trí, và ba dòng trong
 * `/llms.txt`. Mỗi chỗ là một cái đồng hồ đếm ngược tới lúc lạc hậu — và khi
 * có đợt ảnh mới, quên một chỗ là trang tự mâu thuẫn với chính nó.
 *
 * Tệ hơn: thẻ tiêu đề ghi cứng một tháng cụ thể là thứ Google đọc và hiện
 * trong kết quả tìm kiếm. Để nó cũ đi nghĩa là quảng cáo cho cả thế giới rằng
 * trang này không được cập nhật.
 *
 * ĐỔI ĐỢT ẢNH: sửa đúng hai dòng dưới đây, rồi chạy `npm run assets`.
 */
export const dotAnhTienDo = {
  /** Nhãn hiện trên trang, đúng như dấu thời gian nung trong ảnh. */
  nhan: "tháng 08/2026",
  /** Số tấm trong đợt. Dùng cho phần mô tả và `/llms.txt`. */
  soTam: 12,
} as const;

export const thongDiepChot = {
  /** Móc mạnh nhất của cả trang — nhắm tệp khách chưa có quyền lợi nào. */
  voucher: "Chưa có voucher Vin? Hãy xem phương án của tôi.",

  /**
   * Câu này ĐÃ ĐƯỢC SỬA, và chỗ sửa đáng ghi lại.
   *
   * Bản đầu là "Mỗi căn có một mức giá." — nghe gọn, nhưng nói sai trọng tâm:
   * nó khiến người đọc nghĩ việc cần làm là đi tìm căn rẻ. Trong khi điều thật
   * sự quyết định số tiền họ trả lại là PHƯƠNG ÁN MUA, thứ nằm ngoài bảng giá
   * và là thứ duy nhất người tư vấn giúp được.
   *
   * Bản này nói đúng điều đó, và nói bằng chữ "có thể" chứ không phải "sẽ" —
   * vì phương án tốt hơn là điều phải rà mới biết, không phải điều hứa trước.
   */
  cungMotCan:
    "Cùng một căn, phương án mua khác nhau có thể làm thay đổi số tiền thực trả.",

  /**
   * Câu mời hành động, đặt ở khối chốt cuối trang.
   *
   * DẤU SAO BỌC PHẦN IN NGHIÊNG — đây là quy ước của `SplitReveal`. Giữ câu ở
   * DẠNG CÓ DẤU ngay trong hằng số, thay vì khai hai bản (một để hiện, một để
   * làm tiêu đề), vì hai bản là hai chỗ để lệch nhau. Chỗ nào cần chữ trơn thì
   * gọi `chuTron()` bên dưới.
   *
   * Đã có một lần lệch thật: tiêu đề khối chốt từng ghi "phương án của riêng
   * anh/chị" trong khi câu chuẩn là "phương án của chúng tôi dành riêng
   * anh/chị". Hai câu, cùng một chỗ, khác nghĩa — và không ai phát hiện cho tới
   * khi đi soát.
   *
   * ⚠️ DẤU CHẤM NẰM TRONG CẶP SAO, và đó không phải chuyện tuỳ ý.
   * `SplitReveal` tách chuỗi theo khoảng trắng rồi nối lại bằng khoảng trắng.
   * Để dấu chấm ngoài cặp sao thì nó thành một "từ" riêng, và câu dựng ra là
   * "…anh/chị ." — thừa một khoảng trắng ngay trước dấu chấm, ở đúng dòng chữ
   * to nhất của khối.
   */
  truocKhiQuyetDinh:
    "Trước khi quyết định, hãy xem *phương án của chúng tôi dành riêng anh/chị.*",

  /** Câu nhắc thứ tự ưu tiên — chống lại sức ép "chốt nhanh kẻo hết căn". */
  muaDungCan: "Mua đúng căn quan trọng hơn mua nhanh.",

  /** Nhãn nút mạnh nhất. Dùng nguyên văn ở mọi nút chính dẫn tới biểu mẫu. */
  nutChinh: "Nhận phương án thực trả",
} as const;

/** Bỏ dấu sao nhấn mạnh, để dùng câu ở chỗ cần chữ trơn. */
export function chuTron(cau: string): string {
  return cau.replace(/\*/g, "");
}

/**
 * Câu định vị của mảng giá thực trả. Đặt riêng để không ai sửa thành khẩu
 * hiệu rỗng.
 *
 * ⚠️ `chinh` ĐỌC TỪ `thongDiepChot`, không khai lại.
 *
 * Trước đây hai chỗ cùng khai câu "Mua đúng căn quan trọng hơn mua nhanh",
 * lệch nhau đúng một dấu chấm — và cả hai cùng hiện trong MỘT mảng ở trang
 * chủ. Hai nguồn khai độc lập cho cùng một câu là hai thứ sẽ trôi khác nhau ở
 * lần sửa kế tiếp; đó chính là điều khối `thongDiepChot` sinh ra để chặn.
 *
 * Khai báo nằm SAU `thongDiepChot` trong file này là bắt buộc — JavaScript đọc
 * từ trên xuống, đảo thứ tự là lỗi lúc chạy.
 */
export const dinhViGiaThucTra = {
  chinh: chuTron(thongDiepChot.muaDungCan),
  // ⚠️ CÂU NÀY TỪNG MỞ ĐẦU BẰNG "Chúng tôi KHÔNG hứa giá rẻ nhất". ĐÃ BỎ.
  //
  // Ý thì đúng và trung thực, nhưng nó là câu đầu tiên người đọc gặp ở mảng
  // bán hàng mạnh nhất trang — và nó mở bằng một lời phủ định về chính mình.
  // Người đang cân nhắc đọc câu đó nhận được thông tin đầu tiên là "chỗ này
  // không rẻ nhất", trước khi kịp biết chỗ này làm được gì.
  //
  // Bản mới nói cùng một sự thật theo chiều khẳng định: số tiền thực trả đổi
  // theo cái gì, và việc của người tư vấn là dựng ra con số đó.
  //
  // KHÔNG được đổi thành lời hứa giá thấp — hàng rào duyệt nội dung chặn
  // "giá thấp nhất", "chiết khấu bí mật" và mọi cam kết tương tự.
  phu: "Cùng một căn, số tiền thực trả đổi theo chính sách đang áp dụng lúc ký và tiến độ thanh toán chọn theo. Việc của tôi là dựng đúng con số đó ra trước khi anh/chị đặt cọc.",

  /**
   * Câu phụ dùng RIÊNG cho khối trên TRANG CHỦ. Không dùng `phu` ở đó nữa.
   *
   * ⚠️ VÌ SAO PHẢI TÁCH LÀM HAI, DÙ HAI KHỐI CÓ CÙNG TIÊU ĐỀ.
   *
   * `phu` ở trên là câu MỞ ĐẦU của trang giá thực trả — chỗ người đọc vừa
   * đặt chân tới, chưa biết gì. Nhắc lại luận điểm ở đó là đúng việc.
   *
   * Nhưng trên trang chủ, khối này là chỗ thứ BA nói cùng một điều. Đo ngày
   * 07/09/2026 bằng cách bóc toàn bộ chữ trang chủ ra đọc: ý "cùng một căn,
   * số tiền đổi theo chính sách và tiến độ" xuất hiện NĂM LẦN, có hai lần gần
   * như trùng từng chữ. Người viết thật không lặp lại mình như thế trong một
   * trang; máy thì có, vì mỗi khối được sinh ra riêng lẻ.
   *
   * Một hằng số phục vụ hai ngữ cảnh khác nhau chính là cách sự trùng lặp đó
   * lọt lưới: sửa chỗ này thì hỏng chỗ kia, nên không ai dám sửa.
   *
   * Câu dưới đây làm đúng việc của nó ở trang chủ: DẪN VÀO sáu bước bên dưới,
   * thay vì nói lại điều đã nói ở hai khối trên.
   */
  phuTrangChu:
    "Sáu việc dưới đây làm xong trước khi anh/chị đặt cọc. Mỗi việc ghi kèm điều gì hỏng nếu bỏ qua nó.",
} as const;

/**
 * ĐỊNH VỊ THƯƠNG MẠI — tầng thứ hai, khác slogan dự án.
 *
 * `duAn.slogan` ("Nơi kỳ quan trở thành nhà") nói về DỰ ÁN, dùng ở mảng mở đầu
 * và thẻ tiêu đề. Câu dưới đây nói về CÁCH ĐỘI TƯ VẤN LÀM VIỆC, dùng ở các mảng
 * thương mại. Hai câu không chọi nhau vì nói hai việc khác nhau.
 *
 * Nội dung của nó phản ánh đúng tệp khách trọng tâm: người mua để Ở, nhưng vẫn
 * quan tâm căn mình chọn có giữ được giá trị và có dễ sang tay khi cần không.
 * Đó không phải nhà đầu tư, cũng không phải người mua chỉ nhìn vào chỗ ở.
 */
export const dinhViThuongMai = {
  chinh: "Mua để sống. Chọn để giữ giá trị.",
  phu: "Cùng một khoản tiền, căn bạn chọn quyết định cả chất lượng sống lẫn khả năng sang tay về sau. Hai việc đó không mâu thuẫn — nhưng phải chọn đúng ngay từ đầu, vì đổi căn sau khi ký thì không còn là lựa chọn nữa.",
} as const;


/* ===========================================================================
   HỖ TRỢ QUYỀN LỢI — mảng nhạy cảm nhất trên toàn bộ trang
   ---------------------------------------------------------------------------
   ⚠️ ĐỌC HẾT KHỐI NÀY TRƯỚC KHI SỬA MỘT CHỮ NÀO BÊN DƯỚI.

   Tệp khách nhắm tới: người muốn mua Vinhomes nhưng CHƯA có voucher hay quyền
   lợi nào trong tay. Đây là tệp lớn và gần như không trang nào nói với họ.

   ═══ ĐƯỢC NÓI ═══
     · Giá niêm yết không phải số tiền cuối cùng phải trả
     · Có nhiều loại quyền lợi, mỗi loại một bộ điều kiện riêng
     · Chúng tôi rà soát xem trường hợp của bạn đủ điều kiện những gì
     · Chúng tôi dựng phương án và tính ra con số thực trả

   ═══ TUYỆT ĐỐI KHÔNG NÓI ═══
     ✗ "chắc chắn có voucher" — hứa điều không nắm được
     ✗ "giá thấp nhất thị trường" — không kiểm chứng được
     ✗ "chiết khấu bí mật", "suất nội bộ" — nghe như đi cửa sau
     ✗ nguồn voucher đến từ đâu
     ✗ cơ chế gộp người hay bất kỳ cách thu xếp nội bộ nào

   Bốn dòng cuối không chỉ là chuyện giữ bí mật kinh doanh. Một trang công khai
   mô tả cách thu xếp quyền lợi là trang mời gọi cả người soi lẫn người bắt
   chước, và nó biến một dịch vụ tư vấn thành một mẹo — thứ ai cũng làm được và
   không ai trả tiền cho.
   =========================================================================== */

export interface BuocQuyenLoi {
  ten: string;
  moTa: string;
}

export const buocQuyenLoi: BuocQuyenLoi[] = [
  {
    ten: "Nghe trường hợp của bạn",
    moTa: "Bạn đã từng mua bất động sản Vinhomes chưa, mua cùng ai, dự định thanh toán ra sao, tiến độ nào hợp với dòng tiền của bạn. Mỗi câu trả lời mở hoặc đóng một nhóm điều kiện khác nhau.",
  },
  {
    ten: "Đối chiếu các nhóm quyền lợi đang có hiệu lực",
    moTa: "Chương trình bán hàng luôn có nhiều nhóm ưu đãi song song, mỗi nhóm một bộ điều kiện và một thời hạn riêng. Việc của chúng tôi là biết nhóm nào đang mở và trường hợp của bạn chạm được nhóm nào.",
  },
  {
    ten: "Dựng vài phương án, không phải một",
    moTa: "Cùng một căn có thể mua theo nhiều tiến độ thanh toán khác nhau, và mỗi tiến độ ra một con số thực trả khác nhau. Đưa cho bạn một phương án duy nhất là giấu mất phần so sánh.",
  },
  {
    ten: "Tính ra số tiền thật sự phải chuyển",
    moTa: "Từ giá niêm yết, trừ những quyền lợi bạn đủ điều kiện, cộng các khoản đi kèm, chia theo đợt. Ra một con số duy nhất để bạn đặt cạnh phương án của bất kỳ nơi nào khác.",
  },
  {
    ten: "Nói rõ điều kiện nào bạn chưa chạm tới",
    moTa: "Có nhóm quyền lợi bạn không đủ điều kiện, và chúng tôi nói ra thay vì để bạn kỳ vọng. Biết trước thì tính đúng; biết sau khi đã đặt cọc thì đã muộn.",
  },
];

/**
 * Những điều KHÔNG hứa, hiện công khai trên trang hỗ trợ quyền lợi.
 *
 * Mảng này trông như tự bắn vào chân, nhưng nó làm đúng hai việc: giữ trang
 * đứng trong ranh giới nói được, và khiến những gì trang CÓ hứa trở nên đáng
 * tin. Một bên nói rõ mình không làm được gì là bên có thể tin ở chỗ còn lại.
 */
export const khongHuaQuyenLoi: string[] = [
  "Không hứa bạn sẽ có voucher. Điều kiện do chủ đầu tư đặt ra, không do bên bán nào đặt ra.",
  "Không hứa giá thấp nhất thị trường. Giá do chủ đầu tư công bố, và ai bán cũng bán trên cùng bảng giá đó.",
  "Không có suất nội bộ hay đường đi tắt nào. Nếu ở đâu đó nói với bạn điều ngược lại, hãy hỏi họ điều kiện áp dụng là gì.",
  "Không thúc bạn quyết trong hôm nay. Một phương án tốt vẫn tốt vào tuần sau.",
];

/* ===========================================================================
   CÂU HỎI THƯỜNG GẶP
   ---------------------------------------------------------------------------
   Danh sách này chọn theo ĐÚNG những câu người mua thật hỏi trước khi gọi, kể
   cả những câu mà câu trả lời hiện nay là "chưa công bố".

   Giữ lại các câu chưa trả lời được là chủ ý, không phải sơ suất. Người mua vẫn
   sẽ hỏi "giá bao nhiêu" dù trang có nhắc tới giá hay không; im lặng không làm
   câu hỏi biến mất, chỉ làm nó thành lý do rời trang. Trả lời "chưa công bố, và
   đây là cách lấy khi có" giữ được cả sự thật lẫn cuộc trò chuyện.

   Mảng này còn được khai thành dữ liệu có cấu trúc FAQPage — xem
   `components/site/du-lieu-co-cau-truc.tsx`. Nghĩa là mỗi câu sửa ở đây cũng
   đổi luôn thứ mà máy tìm kiếm và trợ lý AI đọc được.
   =========================================================================== */

export interface CauHoi {
  hoi: string;
  /** Một đoạn văn. Trả lời thẳng ở câu đầu, giải thích ở câu sau. */
  dap: string;
}

export const cauHoiThuongGap: CauHoi[] = [
  {
    hoi: "Giá bán bao nhiêu?",
    dap: "Xem trang Quỹ căn — có bảng hàng thật với giá từng căn, kèm dấu thời gian đọc file. Mỗi căn hiện hai cột giá có nhãn rõ: giá trước thuế và giá đầy đủ đã gồm VAT cùng phí bảo trì. Đây là quỹ căn đang có tại thời điểm cập nhật, không phải bảng giá của toàn bộ dự án — dòng nào chưa mở bán thì chưa có trong bảng.",
  },
  {
    hoi: "Vì sao giá trên các trang khác nhau lại chênh nhau nhiều thế?",
    dap: "Hai lý do. Thứ nhất, phần lớn trang không ghi con số của họ là giá trước thuế hay giá đã gồm thuế và phí bảo trì — chênh lệch giữa hai cách báo khoảng 10% cộng phí bảo trì. Thứ hai, nhiều mức giá đang lan truyền là giá dự kiến của các đợt khác nhau chứ không phải quỹ căn hiện có. Bảng ở trang Quỹ căn ghi rõ cả hai cột và thời điểm đọc, để bạn so sánh được thay vì phải đoán.",
  },
  {
    /*
     * CÂU NÀY ĐẶT SỚM LÀ CHỦ Ý, và nó là câu FAQ riêng của trang này.
     *
     * Mọi trang bán dự án đều trả lời được "giá bao nhiêu", "chủ đầu tư là ai",
     * "sở hữu lâu dài không". Không trang nào trả lời câu dưới đây, vì nó chỉ
     * có nghĩa với một người tư vấn độc lập.
     *
     * Nó cũng vá đúng chỗ hở lớn nhất của trang: khối "Chưa có voucher Vin?"
     * mời người chưa có gì vào, nhưng nếu họ đi thẳng xuống phần câu hỏi thì
     * không có câu nào nói tiếp với họ.
     *
     * ⚠️ KHÔNG được viết thành "chắc chắn có voucher", không nêu mức chiết
     * khấu, không nói nguồn quyền lợi đến từ đâu. Hàng rào duyệt chặn ba thứ
     * đó, và chúng cũng là điều chủ trang đã dặn không công khai.
     */
    hoi: "Tôi chưa có voucher Vin thì sao?",
    dap: "Vẫn dựng được phương án. Voucher chỉ là một trong nhiều thứ làm số tiền thực trả đổi đi — chính sách bán hàng đang áp dụng lúc ký và tiến độ thanh toán chọn theo cũng tác động, và hai thứ đó không đòi hỏi bạn phải có sẵn gì. Việc của tôi là rà hết một lượt rồi dựng ra con số thực trả để bạn có cơ sở so sánh, kể cả khi bắt đầu từ con số không.",
  },
  {
    hoi: "Sở hữu lâu dài hay có thời hạn?",
    dap: "Sở hữu lâu dài. Căn cứ cuối cùng vẫn là hồ sơ pháp lý và hợp đồng mua bán do chủ đầu tư phát hành tại thời điểm giao dịch.",
  },
  {
    hoi: "Chủ đầu tư là ai?",
    dap: "Liên danh Tập đoàn Vingroup – Công ty CP Vinhomes. Toàn bộ quyết định chấp thuận đầu tư, giao đất và bảo lãnh ngân hàng nằm trong mục Hồ sơ pháp lý ở trang Tài liệu.",
  },
  {
    hoi: "Dự án đã khởi công chưa?",
    dap: "Đang xây dựng, khởi công năm 2025. Hình ảnh và video hiện trạng công trường được chủ đầu tư cập nhật theo đợt trong mục Tiến độ thi công.",
  },
  {
    hoi: "Xem hồ sơ pháp lý ở đâu, có phải đăng ký không?",
    dap: "Không cần đăng ký. Sáu bộ tài liệu do chủ đầu tư phát hành — tổng mặt bằng, mặt bằng căn, tiêu chuẩn bàn giao, hồ sơ pháp lý, tiến độ thi công, thư viện phối cảnh — mở trực tiếp ở trang Tài liệu.",
  },
  {
    hoi: "Tiến độ thanh toán chia thành mấy đợt?",
    dap: "Chưa công bố. Tỉ lệ đóng tiền theo đợt là điều khoản trong hợp đồng mua bán, nên chỉ đăng khi có chính sách bán hàng chính thức đang áp dụng — một bảng tiến độ cũ có thể khiến bạn tính sai dòng tiền.",
  },
  {
    hoi: "Diện tích các dòng sản phẩm ghi trên trang đã chính xác chưa?",
    dap: "Đó là số suy ra từ bộ bản vẽ mặt bằng của chủ đầu tư, chưa phải bảng hàng chính thức. Nên đối chiếu với tư vấn viên trước khi đặt cọc.",
  },
];

/* ===========================================================================
   AI ĐANG BÁN — phần quan trọng nhất của cả file này
   ---------------------------------------------------------------------------
   Trước bản này, trên toàn bộ trang không có một chữ nào nói ai lập ra nó.
   Chân trang chỉ ghi "Chủ đầu tư: Vinhomes", nên với người mới vào, trang đọc
   ra như trang chính thức của Vinhomes.

   Đó là vấn đề theo hai hướng cùng lúc:

   · VỀ NIỀM TIN — khách sắp chuyển vài chục tỷ sẽ hỏi "ai đứng sau trang này,
     tôi gọi cho ai". Không trả lời được câu đó thì mọi thứ đẹp phía trên đều
     không quy ra được một cuộc gọi.

   · VỀ PHÁP LÝ — để khách hiểu nhầm đây là trang của chủ đầu tư là rủi ro thật,
     không phải chuyện thẩm mỹ. Nói rõ mình là ai thì vừa an toàn hơn vừa đáng
     tin hơn.
   =========================================================================== */

/**
 * Một người tư vấn.
 *
 * ⚠️ KHÔNG CÓ TRƯỜNG ẢNH, và đó là chủ ý chứ không phải thiếu sót.
 *
 * Trường `anh` đã bị gỡ hẳn theo quyết định của chủ trang. Trước đây thiếu ảnh
 * thì khối dựng một ô xám cao bằng ba phần tư bề ngang, in chữ cái đầu của tên
 * vào giữa — thứ người xem đọc ra là "trang chưa làm xong".
 *
 * Bỏ hẳn trường này thay vì để trống là để chặn đường quay lại: còn trường thì
 * sớm muộn sẽ có người điền vào một tấm ảnh chân dung mua sẵn. Ảnh giả bị nhận
 * ra nhanh hơn nhiều so với người ta tưởng, và nhận ra một lần là mất niềm tin
 * ở mọi chỗ khác trên trang.
 *
 * Khối tư vấn giờ là một khối chữ: tên, chức danh, lời của chính người đó, và
 * số gọi được. Đọc ra như một trang hồ sơ.
 */
export interface NguoiTuVan {
  ten: string;
  chucDanh: string;
  dienThoai: string;
  /** Số Zalo. Thường trùng số điện thoại, tách riêng để đổi được độc lập. */
  zalo?: string;
  /** Một tới hai câu. Nói việc đã làm được, không nói tính từ. */
  gioiThieu?: string;
  /** Câu chốt in dưới phần giới thiệu. Tuỳ chọn. */
  cauChot?: string;
}

/**
 * Đội ngũ tư vấn.
 *
 * ⚠️ ĐỂ TRỐNG THÌ CẢ MẢNG "NGƯỜI TƯ VẤN" TỰ ẨN, ở trang chủ lẫn trang liên hệ.
 *
 * Đây là ô đáng điền nhất trong cả file. Một người thật có tên, có ảnh, có số
 * gọi được thuyết phục hơn hai mươi tấm phối cảnh nữa — vì phối cảnh trả lời
 * câu "dự án đẹp không", còn người tư vấn trả lời câu "tôi tin ai".
 *
 * Điền mẫu:
 *   { ten: "Nguyễn Văn A", chucDanh: "Chuyên viên tư vấn cao cấp",
 *     dienThoai: "0901 234 567", zalo: "0901234567" }
 *
 * ⚠️ KHÔNG có trường `anh`. Mẫu này từng ghi `anh: "tu-van-a"` — chép theo là
 * gãy TypeScript, vì kiểu `NguoiTuVan` đã bỏ hẳn trường ảnh. Xem ghi chú ngay
 * trên khai báo kiểu.
 */
export const doiNguTuVan: NguoiTuVan[] = [
  {
    ten: "Gia Giang",
    chucDanh: "Tư vấn lựa chọn sản phẩm & phương án mua",
    dienThoai: "0941 328 658",
    gioiThieu:
      // ⚠️ ĐÃ RÚT TỪ 63 TỪ XUỐNG 34. ĐỪNG VIẾT DÀI LẠI.
      //
      // Bản cũ mang đủ ba dấu hiệu của câu do máy viết:
      //   · một câu dài với ba mệnh đề song song nối bằng "và"
      //   · "anh/chị" ba lần trong một câu
      //   · và nhắc lại lần thứ sáu cái ý "đối chiếu chính sách, xây phương
      //     án thực trả" mà cả trang đã nói năm lần trước đó
      //
      // Bản này ngắn hơn một nửa và mang một Ý THẬT ở câu cuối — câu đó nói
      // được điều bản cũ không nói: vì sao phải hỏi trước khi tư vấn.
      "Tôi hỏi trước khi tư vấn: anh/chị muốn sống thế nào, và điều gì quan trọng nhất khi chọn. Chưa biết hai điều đó thì mọi căn tôi giới thiệu đều là đoán.",
    /**
     * Câu chốt — đặt sau phần giới thiệu, in khác đi.
     *
     * Nó nhắm đúng người khó nhất: người ĐÃ có một căn và một phương án bên
     * khác, đang định ký. Với họ, mọi lời giới thiệu đều muộn; thứ duy nhất
     * còn tác dụng là một lời mời rất nhỏ — nhìn thêm một phương án nữa trước
     * khi xuống tiền. Không chê bên kia, không hứa rẻ hơn.
     */
    cauChot:
      // Rút từ 33 từ xuống 26, và bỏ hai chữ "phương án" — chữ đó đã xuất
      // hiện dày đặc ở bảy nút bấm khác trên cùng trang. Mở bằng một câu hỏi
      // vì đây là chỗ duy nhất trên trang có một người thật đang nói.
      "Đang cân nhắc một căn ở đâu đó rồi? Gọi cho tôi trước khi đặt cọc — xem thêm một cách tính nữa thì không mất gì.",
  },
];

/**
 * Bên lập và vận hành trang.
 *
 * ⚠️ `ten` để trống thì mọi chỗ nhắc tới danh tính đều tự ẩn, TRỪ dòng miễn trừ
 * ở chân trang — dòng đó luôn hiện, vì phần cần nói nhất là "trang này không
 * phải trang chính thức của chủ đầu tư", và điều đó đúng dù đã điền hay chưa.
 */
export const benBan: {
  /** Tên pháp nhân hoặc tên đội ngũ. */
  ten: string;
  /** Mã số thuế, nếu là pháp nhân. Có thì hiện, không thì thôi. */
  maSoThue?: string;
  /** Địa chỉ văn phòng khách tới xem được. */
  vanPhong?: string;
  /**
   * Vai trò tự nhận.
   *
   * "Kênh thông tin & tư vấn ĐỘC LẬP" là cách nói vừa đúng vừa mạnh, và nó
   * không phải lựa chọn khiêm tốn bất đắc dĩ. Nó nói thẳng ra điều mà tám trang
   * đối thủ đang che — nhiều trang trong số đó tự đặt tiêu đề "Thông tin chính
   * thức chủ đầu tư" trong khi họ là đại lý. Chữ "độc lập" biến điểm yếu bề mặt
   * (không phải chủ đầu tư) thành điểm mạnh (không bị ràng buộc phải nói hay).
   */
  vaiTro: string;
  /**
   * Ba nhịp cách làm việc. Dùng làm xương sống của trang: mỗi nhịp ứng với một
   * nhóm nội dung thật, không phải khẩu hiệu treo tường.
   *
   *   Chọn đúng căn                  → bộ tìm căn + bảng quỹ căn
   *   Hiểu đúng chính sách           → trang chính sách + pháp lý
   *   Có phương án trước khi quyết   → giá thực trả + hỗ trợ quyền lợi
   */
  baNhip: readonly string[];
} = {
  ten: "Hạ Long Xanh 360",
  vaiTro: "Kênh thông tin & tư vấn độc lập",
  baNhip: [
    "Chọn đúng căn",
    "Hiểu đúng chính sách",
    "Có phương án trước khi quyết định",
  ],
};
