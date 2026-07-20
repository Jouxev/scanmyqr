"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type TiptapLogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
  priority?: boolean;
};

const sizeMap = {
  sm: {
    icon: 28,
    gap: "gap-2",
    wordmark: "text-lg",
  },
  md: {
    icon: 34,
    gap: "gap-2.5",
    wordmark: "text-2xl",
  },
  lg: {
    icon: 48,
    gap: "gap-3",
    wordmark: "text-4xl",
  },
  xl: {
    icon: 64,
    gap: "gap-4",
    wordmark: "text-5xl sm:text-6xl",
  },
} as const;

export function TiptapLogo({
  size = "md",
  showWordmark = true,
  className,
  wordmarkClassName,
  priority = false,
}: TiptapLogoProps) {
  const config = sizeMap[size];

  return (
    <div
      className={cn("inline-flex items-center", config.gap, className)}
      aria-label="TiptapCard"
    >
      <Image
        src="/brand/tiptap-icon.svg"
        alt=""
        width={config.icon}
        height={config.icon}
        priority={priority}
        className="shrink-0"
      />
      {showWordmark ? (
        <div
          className={cn(
            "leading-none tracking-tight",
            config.wordmark,
            wordmarkClassName
          )}
        >
          <span className="font-black text-slate-950">Tiptap</span>
          <span className="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-pink-500 bg-clip-text font-black text-transparent">
            Card
          </span>
        </div>
      ) : null}
    </div>
  );
}
