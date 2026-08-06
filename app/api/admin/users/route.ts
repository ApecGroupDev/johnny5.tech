import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const userCreateSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  name: z.string().min(1, "Name is required").max(100),
  role: z.enum(["admin", "user"]).optional().default("user"),
  active: z.boolean().optional().default(true),
  allowedApps: z.string().optional().default(""),
});

const userUpdateSchema = z.object({
  id: z.string(),
  email: z.string().email("Invalid email address").optional(),
  password: z.union([passwordSchema, z.literal("")]).optional(),
  name: z.string().min(1, "Name is required").max(100).optional(),
  role: z.enum(["admin", "user"]).optional(),
  active: z.boolean().optional(),
  allowedApps: z.string().optional(),
});

function validateCSRF(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host") || req.headers.get("x-forwarded-host");
  const referer = req.headers.get("referer");

  if (origin && host) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  
  if (referer && host) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  return false;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, active: true, allowedApps: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function DELETE(req: Request) {
  if (!validateCSRF(req)) {
    return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  
  if (id === session.user.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!validateCSRF(req)) {
    return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  
  // Rate limit admin user creation: 10 requests per 1 minute
  const { success } = rateLimit(`admin-user-create:${ip}`, 10, 60 * 1000);
  if (!success) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let parsed;
  try {
    parsed = userCreateSchema.parse(await req.json());
  } catch (err: any) {
    return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
  }

  const { email, password, name, role, active, allowedApps } = parsed;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email: email.toLowerCase(), password: hashedPassword, name, role, active, allowedApps },
    select: { id: true, name: true, email: true, role: true, active: true, allowedApps: true },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  if (!validateCSRF(req)) {
    return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let parsed;
  try {
    parsed = userUpdateSchema.parse(await req.json());
  } catch (err: any) {
    return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
  }

  const { id, email, password, name, role, active, allowedApps } = parsed;

  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Email already taken by another user" }, { status: 400 });
    }
  }

  const dataToUpdate: Record<string, unknown> = {};
  if (email) dataToUpdate.email = email.toLowerCase();
  if (name !== undefined) dataToUpdate.name = name;
  if (role) dataToUpdate.role = role;
  if (active !== undefined) dataToUpdate.active = active;
  if (allowedApps !== undefined) dataToUpdate.allowedApps = allowedApps;
  
  if (password && password !== "") {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, role: true, active: true, allowedApps: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
