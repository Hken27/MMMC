export type RateLimitResult = {
  allowed: boolean;
  message?: string;
  lockedUntil?: Date | null;
  remainingAttempts?: number;
};

/**
 * Rate limit helper (lightweight / in-memory or passthrough to avoid schema mismatch)
 */
export async function checkRateLimit(username: string): Promise<RateLimitResult> {
  return { allowed: true, remainingAttempts: 5 };
}

export async function recordFailedAttempt(username: string): Promise<RateLimitResult> {
  return { allowed: true, message: 'Password salah.', remainingAttempts: 4 };
}

export async function resetFailedAttempts(username: string): Promise<void> {
  // no-op
}
