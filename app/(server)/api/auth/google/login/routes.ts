import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // ensures refresh_token is returned
    scope: ["https://mail.google.com/"], // Gmail full access
  });

  return NextResponse.redirect(url);
}
