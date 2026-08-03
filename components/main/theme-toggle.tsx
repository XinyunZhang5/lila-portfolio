"use client";

import { RxMoon, RxSun } from "react-icons/rx";

import { useBook } from "@/components/main/book-context";

type Props = {
  /** "chip" = bordered button for the nav, "bare" = plain icon for the cover */
  variant?: "chip" | "bare";
  className?: string;
};

export const ThemeToggle = ({ variant = "chip", className = "" }: Props) => {
  const { theme, toggleTheme } = useBook();
  const isNight = theme === "night";
  const Icon = isNight ? RxSun : RxMoon;
  const label = isNight ? "Day" : "Night";

  if (variant === "bare") {
    return (
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${label} mode`}
        title={`Switch to ${label} mode`}
        className={`text-[color:var(--muted)] transition-colors hover:text-[color:var(--accent)] ${className}`}
      >
        <Icon className="h-[22px] w-[22px]" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${label} mode`}
      className={`group flex items-center gap-2 rounded-full border border-[color:var(--hair)] px-3 py-1.5 text-[12px] tracking-[0.08em] text-[color:var(--ink-soft)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] ${className}`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <Icon className="h-[15px] w-[15px]" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};
