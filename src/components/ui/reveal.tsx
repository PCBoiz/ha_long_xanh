"use client";

import type { ReactNode } from "react";
import { useInView } from "@/components/ui/use-in-view";

interface RevealProps {
  children: ReactNode;
  /** Trễ so với phần tử trước, tính bằng mili giây — dùng để xếp tầng. */
  delay?: number;
  className?: string;
}

/**
 * Hiện dần cả khối khi cuộn tới. Dùng cho ảnh và đoạn văn; riêng tiêu đề thì
 * dùng `SplitReveal` để chữ trồi lên theo từng từ.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const { ref, hien } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-shown={hien}
      style={
        delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined
      }
    >
      {children}
    </div>
  );
}
