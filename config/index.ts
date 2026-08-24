import type { Metadata } from "next";

export const siteConfig: Metadata = {
  title: "Xinyun (Lila) Zhang | Portfolio",
  description:
    "Math + CS @ UIUC. Software engineer and maker. My philosophy? If it annoys me and I can't buy it, I build it.",
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
