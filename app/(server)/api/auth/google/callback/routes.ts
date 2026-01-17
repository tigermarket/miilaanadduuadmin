import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code);
  // tokens contains access_token, refresh_token, expiry_date

  // Save refresh_token securely (DB or secret store)
  console.log("Tokens:", tokens);

  return NextResponse.json({ success: true });
}
