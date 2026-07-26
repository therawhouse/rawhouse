import pino from "pino";

/**
 * ============================================================================
 * THE RAW HOUSE - Pino Production Logger
 * ============================================================================
 * Provides high-performance structured JSON logging for monitoring:
 * - REST API route invocations
 * - Customer Auth & Session Events
 * - Razorpay Payment Verifications
 * - Database & ORM Exception tracebacks
 */

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: {
    env: process.env.NODE_ENV,
    app: "the-raw-house",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function logApiRequest(method: string, path: string, status: number, durationMs: number) {
  logger.info({
    type: "API_REQUEST",
    method,
    path,
    status,
    durationMs,
  });
}

export function logPaymentEvent(event: string, orderId: string, status: string, details?: any) {
  logger.info({
    type: "PAYMENT_EVENT",
    event,
    orderId,
    status,
    details,
  });
}

export function logError(context: string, error: any) {
  logger.error({
    type: "SYSTEM_ERROR",
    context,
    message: error?.message || error,
    stack: error?.stack,
  });
}
