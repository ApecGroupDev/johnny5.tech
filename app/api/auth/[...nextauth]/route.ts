import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

const handler = NextAuth(authOptions);

export async function POST(req: Request, res: any) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  
  // Rate limit login attempts: 5 requests per 1 minute
  const { success } = rateLimit(`login:${ip}`, 5, 60 * 1000);
  
  if (!success) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  return handler(req, res);
}

export { handler as GET };
