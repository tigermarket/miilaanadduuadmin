// lib/rate-limit.ts

// Simple in-memory store
const attemptsStore: Record<string, { count: number; expiresAt: number }> = {};

export async function checkRateLimit(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const key = `login_attempts:${ip}`;

  const now = Date.now();
  const windowMs = 60 * 1000; // 60 seconds
  const maxAttempts = 5;

  const entry = attemptsStore[key];

  if (!entry || entry.expiresAt < now) {
    // Reset window
    attemptsStore[key] = { count: 1, expiresAt: now + windowMs };
    return { rateLimited: false };
  }

  // Increment attempts
  entry.count += 1;

  const rateLimited = entry.count > maxAttempts;
  return { rateLimited };
}
