// app/api/verify-email/route.ts
import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { connectedToMongodb } from "@/lib/db"; // your DB connect
import { User } from "@/models/User";

export async function POST(req: Request) {
  const { email, token } = await req.json();

  if (!email || !token) {
    return NextResponse.json(
      { error: "Missing token or email" },
      { status: 400 }
    );
  }

  await connectedToMongodb();

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!user.emailVerificationToken || !user.emailVerificationExpiry) {
    return NextResponse.json(
      { error: "No verification request" },
      { status: 400 }
    );
  }

  if (user.emailVerificationExpiry.getTime() < Date.now()) {
    return NextResponse.json({ error: "Token expired" }, { status: 400 });
  }

  const hashedIncoming = createHash("sha256").update(token).digest("hex");
  if (hashedIncoming !== user.emailVerificationToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();

  return NextResponse.json({ success: true });
}
