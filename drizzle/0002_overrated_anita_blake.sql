CREATE TABLE "dang_ky" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"ho_ten" varchar(160) NOT NULL,
	"dien_thoai" varchar(20) NOT NULL,
	"quan_tam" varchar(80),
	"ghi_chu" text,
	"ngan_sach" varchar(40),
	"trang_vao" varchar(300),
	"trang_gui" varchar(300),
	"tu_nguon" varchar(160),
	"utm_nguon" varchar(120),
	"utm_kenh" varchar(120),
	"utm_chien_dich" varchar(200),
	"utm_tu_khoa" varchar(200),
	"utm_noi_dung" varchar(200),
	"ma_quang_cao" varchar(200),
	"trang_thai" varchar(30) DEFAULT 'moi' NOT NULL,
	"ghi_chu_ban_hang" text,
	"tao_luc" timestamp with time zone DEFAULT now() NOT NULL,
	"cap_nhat_luc" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "dang_ky_chien_dich_idx" ON "dang_ky" USING btree ("utm_chien_dich","tao_luc");--> statement-breakpoint
CREATE INDEX "dang_ky_trang_thai_idx" ON "dang_ky" USING btree ("trang_thai","tao_luc");