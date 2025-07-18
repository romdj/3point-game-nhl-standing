import pino from 'pino';
import { config } from '../config/env.js';

// Create logger instance based on environment
const logger = pino({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: config.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  } : undefined,
  base: {
    service: 'nhl-standings-api',
    version: '1.0.0'
  }
});

export { logger };

// Performance logging utility
export class PerformanceLogger {
  private static measurements: Map<string, number> = new Map();

  static start(operation: string): void {
    this.measurements.set(operation, performance.now());
  }

  static end(operation: string, context?: Record<string, unknown>): void {
    const startTime = this.measurements.get(operation);
    if (startTime) {
      const duration = performance.now() - startTime;
      logger.debug({
        operation,
        duration: `${duration.toFixed(2)}ms`,
        ...context
      }, `Operation ${operation} completed`);
      this.measurements.delete(operation);
    }
  }

  static measure<T>(operation: string, fn: () => T, context?: Record<string, unknown>): T {
    this.start(operation);
    try {
      const result = fn();
      this.end(operation, context);
      return result;
    } catch (error) {
      this.end(operation, { ...context, error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  static async measureAsync<T>(operation: string, fn: () => Promise<T>, context?: Record<string, unknown>): Promise<T> {
    this.start(operation);
    try {
      const result = await fn();
      this.end(operation, context);
      return result;
    } catch (error) {
      this.end(operation, { ...context, error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }
}