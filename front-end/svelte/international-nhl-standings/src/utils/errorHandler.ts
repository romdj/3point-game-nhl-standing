import { errorStore } from '../stores/errorStore';
import type { AppError } from '../stores/errorStore';

export type ErrorContext = Record<string, unknown>;

export class AppErrorHandler {
  static handleApiError(error: unknown, context?: ErrorContext) {
    const message = error instanceof Error ? error.message : 'API request failed';
    
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
    errorStore.addError({
      message,
      type: 'validation',
      context
    });
  }

  static handleRuntimeError(error: unknown, context?: ErrorContext) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    
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