CREATE TABLE "bai_viet" (
	"slug" varchar(200) PRIMARY KEY NOT NULL,
	"tieu_de" varchar(300) NOT NULL,
	"mo_ta" varchar(600) NOT NULL,
	"ngay_dang" varchar(10) NOT NULL,
	"chuyen_muc" varchar(40) NOT NULL,
	"noi_dung" text,
	"nhan_luc" timestamp with time zone DEFAULT now() NOT NULL,
	"cap_nhat_luc" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "bai_viet_ngay_dang_idx" ON "bai_viet" USING btree ("ngay_dang");