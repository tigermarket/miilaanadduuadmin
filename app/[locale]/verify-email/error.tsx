"use client";

import { resend } from "@/(server)/controllers/user";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to monitoring service
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center text-red-600 font-semibold">
        We couldn’t verify your email. The link may have expired or already been
        used.
      </h2>

      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={() => resend(error?.message)}
      >
        Resend Verification Email
      </button>
      <Link
        href="/support"
        className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
      >
        Contact Support
      </Link>
    </main>
  );
}
