import {
    RateLimitConfig,
    RateLimitEntry,
    RateLimitResult,
} from '@/types/global';
import { NextResponse } from 'next/server';

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, 60 * 1000);

export const checkRateLimit = (
    identifier: string,
    config: RateLimitConfig = {}
): RateLimitResult => {
    const {
        windowMs = 15 * 60 * 1000, // Default: 15 minutes
        maxAttempts = 5, // Default: 5 attempts
        prefix = 'ratelimit',
    } = config;

    const key = `${prefix}:${identifier}`;
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs,
        });
        return {
            success: true,
            limit: maxAttempts,
            remaining: maxAttempts - 1,
            resetTime: now + windowMs,
        };
    }

    // Check if limit exceeded
    if (entry.count >= maxAttempts) {
        return {
            success: false,
            limit: maxAttempts,
            remaining: 0,
            resetTime: entry.resetTime,
        };
    }

    // Increment count
    entry.count++;
    return {
        success: true,
        limit: maxAttempts,
        remaining: maxAttempts - entry.count,
        resetTime: entry.resetTime,
    };
};

export const createRateLimitResponse = (
    result: RateLimitResult,
    customMessage?: string
): NextResponse => {
    const minutesUntilReset = Math.ceil(
        (result.resetTime - Date.now()) / 60000
    );
    const defaultMessage = `Too many requests. Please try again in ${minutesUntilReset} minute${
        minutesUntilReset !== 1 ? 's' : ''
    }.`;

    return NextResponse.json(
        {
            error: customMessage || defaultMessage,
        },
        {
            status: 429,
            headers: {
                'X-RateLimit-Limit': result.limit.toString(),
                'X-RateLimit-Remaining': result.remaining.toString(),
                'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
                'Retry-After': Math.ceil(
                    (result.resetTime - Date.now()) / 1000
                ).toString(),
            },
        }
    );
};

export const getClientIp = (req: Request): string => {
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIp = req.headers.get('x-real-ip');
    if (realIp) {
        return realIp.trim();
    }

    // Fallback identifier for development
    return 'dev-user';
};
