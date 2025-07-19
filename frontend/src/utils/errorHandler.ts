import { errorStore } from '../stores/errorStore';
import type { AppError } from '../stores/errorStore';
import { logger } from './logger';

export type ErrorContext = Record<string, unknown>;

export class AppErrorHandler {
  static handleApiError(error: unknown, context?: ErrorContext) {
    const message = error instanceof Error ? error.message : 'API request failed';
    
    logger.error(`API Error: ${message}`, {
      ...context,
      originalError: error instanceof Error ? error.stack : String(error)
    }, 'ErrorHandler', 'handleApiError');
    
    errorStore.addError({
      message,
      type: 'api',
      context: {
        ...context,
        originalError: error instanceof Error ? error.stack : String(error)
      }
    });
  }

  static handleNetworkError(error: unknown, context?: ErrorContext) {
    const message = error instanceof Error ? error.message : 'Network request failed';
    
    logger.error(`Network Error: ${message}`, {
      ...context,
      originalError: error instanceof Error ? error.stack : String(error)
    }, 'ErrorHandler', 'handleNetworkError');
    
    errorStore.addError({
      message,
      type: 'network',
      context: {
        ...context,
        originalError: error instanceof Error ? error.stack : String(error)
      }
    });
  }

  static handleValidationError(message: string, context?: ErrorContext) {
    logger.warn(`Validation Error: ${message}`, context, 'ErrorHandler', 'handleValidationError');
    
    errorStore.addError({
      message,
      type: 'validation',
      context
    });
  }

  static handleRuntimeError(error: unknown, context?: ErrorContext) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    logger.error(`Runtime Error: ${message}`, {
      ...context,
      originalError: error instanceof Error ? error.stack : String(error)
    }, 'ErrorHandler', 'handleRuntimeError');
    
    errorStore.addError({
      message,
      type: 'runtime',
      context: {
        ...context,
        originalError: error instanceof Error ? error.stack : String(error)
      }
    });
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    errorType: AppError['type'] = 'runtime',
    context?: ErrorContext
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      switch (errorType) {
        case 'api':
          AppErrorHandler.handleApiError(error, context);
          break;
        case 'network':
          AppErrorHandler.handleNetworkError(error, context);
          break;
        case 'validation':
          AppErrorHandler.handleValidationError(
            error instanceof Error ? error.message : 'Validation failed',
            context
          );
          break;
        default:
          AppErrorHandler.handleRuntimeError(error, context);
      }
      return null;
    }
  }
}

// Convenience function for wrapping async operations
export const withErrorHandling = AppErrorHandler.withErrorHandling;