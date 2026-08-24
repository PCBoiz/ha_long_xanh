CREATE TABLE "su_kien" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"loai" varchar(40) NOT NULL,
	"duong" varchar(300) NOT NULL,
	"chi_tiet" varchar(200),
	"xay_ra_luc" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "su_kien_loai_thoi_gian_idx" ON "su_kien" USING btree ("loai","xay_ra_luc");