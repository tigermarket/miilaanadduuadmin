"use client";
import { verifyEmail } from "@/(server)/controllers/user";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");

  useEffect(() => {
    if (token && email) verifyEmail(token, email);
  }, [token, email]);

  return <div>Verifying your email…</div>;
}
