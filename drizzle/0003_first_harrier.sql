ALTER TABLE "bai_viet" ADD COLUMN "trang_thai" varchar(10) DEFAULT 'cho' NOT NULL;--> statement-breakpoint
ALTER TABLE "bai_viet" ADD COLUMN "duyet_luc" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "bai_viet_trang_thai_idx" ON "bai_viet" USING btree ("trang_thai");