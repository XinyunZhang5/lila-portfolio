import type { Metadata } from "next";

export const siteConfig: Metadata = {
  title: "Xinyun (Lila) Zhang | Portfolio",
  description:
    "Software engineer and Math + CS student at UIUC. I build the tools I wish existed — macOS tools, full-stack web apps, on-device ML, and low-level systems.",
  keywords: [
    "Xinyun Zhang",
    "Lila Zhang",
    "software engineer",
    "portfolio",
    "UIUC",
    "full-stack",
    "systems programming",
    "rust",
    "react",
    "nextjs",
    "typescript",
    "ai",
    "machine learning",
  ] as Array<string>,
  authors: {
    name: "Xinyun (Lila) Zhang",
    url: "https://github.com/XinyunZhang5",
  },
} as const;
