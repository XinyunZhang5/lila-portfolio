"use client";

import Link from "next/link";
import { useState } from "react";

import { PAGES, useBook } from "@/components/main/book-context";
import { ThemeToggle } from "@/components/main/theme-toggle";
import { SOCIALS } from "@/constants";

const CHAPTERS = PAGES.slice(1); // Home / Projects / More Me

export const Navbar = () => {
  const { page, go } = useBook();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 z-50 h-[64px] w-full border-b px-6 backdrop-blur-md md:px-10"
      style={{
        borderColor: "var(--hair)",
        backgroundColor: "color-mix(in srgb, var(--paper) 72%, transparent)",
      }}
    >
      <nav className="mx-auto flex h-full max-w-[1400px] items-center justify-between">
        {/* wordmark → back to the contents page */}
        <button
          onClick={() => go(0)}
          className="group flex items-baseline gap-2"
          aria-label="Table of contents"
        >
          <span
            className="text-[19px] text-[color:var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Lila Zhang
          </span>
          <span className="hidden text-[11px] tracking-[0.2em] text-[color:var(--accent)] sm:inline">
            ✦
          </span>
        </button>

        {/* chapter links */}
        <div className="hidden items-center gap-9 md:flex">
          {CHAPTERS.map((c, i) => {
            const p = i + 1;
            const activeChapter = page === p;
            return (
              <button
                key={c.key}
                onClick={() => go(p)}
                className="text-[14px] transition-colors"
                style={{
                  color: activeChapter
                    ? "var(--accent)"
                    : "var(--ink-soft)",
                }}
              >
                {c.label}
              </button>
            );
          })}
          <span
            className="h-4 w-px"
            style={{ backgroundColor: "var(--hair)" }}
          />
          {SOCIALS.map(({ link, name, icon: Icon }) => (
            <Link
              key={name}
              href={link}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={name}
              className="text-[color:var(--muted)] transition-colors hover:text-[color:var(--accent)]"
            >
              <Icon className="h-[18px] w-[18px]" />
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            className="text-2xl text-[color:var(--ink)]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? "×" : "☰"}
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="absolute left-0 top-[64px] flex w-full flex-col items-center gap-5 border-b py-6 backdrop-blur-md md:hidden"
          style={{
            borderColor: "var(--hair)",
            backgroundColor: "color-mix(in srgb, var(--paper) 94%, transparent)",
          }}
        >
          <button
            onClick={() => {
              go(0);
              setOpen(false);
            }}
            className="text-[15px] text-[color:var(--ink-soft)]"
          >
            Contents
          </button>
          {CHAPTERS.map((c, i) => (
            <button
              key={c.key}
              onClick={() => {
                go(i + 1);
                setOpen(false);
              }}
              className="text-[15px]"
              style={{
                color: page === i + 1 ? "var(--accent)" : "var(--ink-soft)",
              }}
            >
              {c.label}
            </button>
          ))}
          <div className="mt-2 flex gap-6">
            {SOCIALS.map(({ link, name, icon: Icon }) => (
              <Link
                key={name}
                href={link}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={name}
                className="text-[color:var(--muted)]"
              >
                <Icon className="h-6 w-6" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
