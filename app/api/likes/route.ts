import { createHash } from "crypto";
import { NextResponse } from "next/server";

// Anonymous like counter. Likes live in one Redis set (Upstash, reached over
// its REST API so there is no client library to ship). Each member is a salted
// hash of the visitor's IP + browser, so one visitor counts once and nothing
// that identifies them is ever stored.
export const dynamic = "force-dynamic";

const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const SET = "likes";

const visitor = (req: Request) => {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const ua = req.headers.get("user-agent") ?? "";
  return createHash("sha256").update(`${TOKEN}|${ip}|${ua}`).digest("hex");
};

const redis = async (commands: (string | number)[][]) => {
  const res = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const out = (await res.json()) as { result?: number; error?: string }[];
  return out.map((r) => {
    if (r.error) throw new Error(r.error);
    return Number(r.result);
  });
};

// until the store is connected the heart still works, just without a count
const unconfigured = () => NextResponse.json({ configured: false });

export async function GET(req: Request) {
  if (!URL_ || !TOKEN) return unconfigured();
  try {
    const [count, liked] = await redis([
      ["SCARD", SET],
      ["SISMEMBER", SET, visitor(req)],
    ]);
    return NextResponse.json({ configured: true, count, liked: liked === 1 });
  } catch {
    return NextResponse.json({ configured: false }, { status: 502 });
  }
}

export async function POST(req: Request) {
  if (!URL_ || !TOKEN) return unconfigured();
  try {
    // SADD is a no-op for a member already in the set: that is the "once"
    const [, count] = await redis([
      ["SADD", SET, visitor(req)],
      ["SCARD", SET],
    ]);
    return NextResponse.json({ configured: true, count, liked: true });
  } catch {
    return NextResponse.json({ configured: false }, { status: 502 });
  }
}
