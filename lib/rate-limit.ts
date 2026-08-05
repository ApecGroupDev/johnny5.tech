type RateLimitRecord = {
  count: number;
  resetAt: number;
};

// Global in-memory map for rate limiting. 
// In a serverless environment (like Vercel), this will reset on cold starts.
const rateLimitMap = new Map<string, RateLimitRecord>();

export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; limit: number; remaining: number; resetAt: number } {
  const now = Date.now();
  let record = rateLimitMap.get(identifier);

  // Clean up old record if it has expired
  if (record && now > record.resetAt) {
    rateLimitMap.delete(identifier);
    record = undefined;
  }

  if (!record) {
    record = { count: 1, resetAt: now + windowMs };
    rateLimitMap.set(identifier, record);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetAt: record.resetAt,
    };
  }

  // Increment count
  record.count += 1;

  if (record.count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  return {
    success: true,
    limit,
    remaining: limit - record.count,
    resetAt: record.resetAt,
  };
}
