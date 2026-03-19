import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Redis connection
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || 'http://localhost:8000';
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || 'default-token';

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

// Define type for rate limit response
type LimitResponse = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

// Define rate limiters for different email types
export const emailRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 emails per hour
  analytics: true,
});

export const contactRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 contact messages per hour
  analytics: true,
});

export const newsletterRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, '1 h'), // 2 newsletter subscriptions per hour
  analytics: true,
});

// Helper function to check rate limit
export async function checkRateLimit(identifier: string, type: 'email' | 'contact' | 'newsletter'): Promise<LimitResponse> {
  let limit: LimitResponse;
  switch (type) {
    case 'email':
      limit = await emailRateLimit.limit(identifier);
      break;
    case 'contact':
      limit = await contactRateLimit.limit(identifier);
      break;
    case 'newsletter':
      limit = await newsletterRateLimit.limit(identifier);
      break;
    default:
      throw new Error('Invalid rate limit type');
  }
  
  if (!limit.success) {
    throw new Error('Demasiadas solicitudes. Por favor, espera un momento antes de intentarlo de nuevo.');
  }
  
  return limit;
}
