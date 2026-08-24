import Image from "next/image";
import { projectImages, type ProjectImageName } from "@/data/images.generated";

interface ProjectImageProps {
  name: ProjectImageName;
  /** Ghi đè mô tả khi bối cảnh cần nói khác đi so với mô tả mặc định của ảnh. */
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Bọc `next/image` để mọi ảnh dự án luôn kèm sẵn kích thước thật và ảnh mờ
 * placeholder — hai thứ quyết định trang không bị giật layout khi ảnh nặng
 * đang tải. Lấy từ file sinh tự động nên không thể quên.
 */
export function ProjectImage({
  name,
  alt,
  className,
  sizes = "100vw",
  priority = false,
}: ProjectImageProps) {
  const anh = projectImages[name];
  return (
    <Image
      src={anh.src}
      alt={alt ?? anh.alt}
      width={anh.width}
      height={anh.height}
      placeholder="blur"
      blurDataURL={anh.blurDataURL}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
