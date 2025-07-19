export enum LogLevel {
  _DEBUG = 0,
  _INFO = 1,
  _WARN = 2,
  _ERROR = 3,
  _NONE = 4
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  component?: string;
  operation?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxStorageEntries: number;
  includeStackTrace: boolean;
}

class Logger {
  private config: LoggerConfig;
  private logs: LogEntry[] = [];

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel._INFO,
      enableConsole: true,
      enableStorage: false,
      maxStorageEntries: 100,
      includeStackTrace: false,
      ...config
    };

    // Set log level based on environment
    if (typeof window !== 'undefined') {
      const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname.includes('dev');
      
      if (isDevelopment) {
        this.config.level = LogLevel._DEBUG;
        this.config.enableStorage = true;
      } else {
        this.config.level = LogLevel._WARN;
        this.config.enableStorage = false;
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    component?: string,
    operation?: string
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date(),
      context,
      component,
      operation
    };
  }

  private formatLogMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const component = entry.component ? `[${entry.component}]` : '';
    const operation = entry.operation ? `(${entry.operation})` : '';
    
    return `${timestamp} ${levelName} ${component}${operation} ${entry.message}`;
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    // Console logging
    if (this.config.enableConsole) {
      const formattedMessage = this.formatLogMessage(entry);
      const consoleArgs: unknown[] = [formattedMessage];
      
      if (entry.context) {
        consoleArgs.push(entry.context);
      }

      switch (entry.level) {
        case LogLevel._DEBUG:
          console.debug(...consoleArgs);
          break;
        case LogLevel._INFO:
          console.info(...consoleArgs);
          break;
        case LogLevel._WARN:
          console.warn(...consoleArgs);
          break;
        case LogLevel._ERROR:
          console.error(...consoleArgs);
          if (this.config.includeStackTrace) {
            console.trace();
          }
          break;
      }
    }

    // Storage logging
    if (this.config.enableStorage) {
      this.logs.push(entry);
      
      // Trim logs if exceeding max entries
      if (this.logs.length > this.config.maxStorageEntries) {
        this.logs = this.logs.slice(-this.config.maxStorageEntries);
      }
    }
  }

  debug(message: string, context?: Record<string, unknown>, component?: string, operation?: string): void {
    const entry = this.createLogEntry(LogLevel._DEBUG, message, context, component, operation);
    this.log(entry);
  }

  info(message: string, context?: Record<string, unknown>, component?: string, operation?: string): void {
    const entry = this.createLogEntry(LogLevel._INFO, message, context, component, operation);
    this.log(entry);
  }

  warn(message: string, context?: Record<string, unknown>, component?: string, operation?: string): void {
    const entry = this.createLogEntry(LogLevel._WARN, message, context, component, operation);
    this.log(entry);
  }

  error(message: string, context?: Record<string, unknown>, component?: string, operation?: string): void {
    const entry = this.createLogEntry(LogLevel._ERROR, message, context, component, operation);
    this.log(entry);
  }

  // Utility methods
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.component === component);
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return this.logs.map(entry => this.formatLogMessage(entry)).join('\n');
  }

  setLogLevel(level: LogLevel): void {
    this.config.level = level;
  }

  getConfig(): LoggerConfig {
    return { ...this.config };
  }
}

// Create singleton instance
export const logger = new Logger();

// Performance logging utility
export class PerformanceLogger {
  private static measurements: Map<string, number> = new Map();

  static start(operation: string): void {
    this.measurements.set(operation, performance.now());
  }

  static end(operation: string, component?: string): void {
    const startTime = this.measurements.get(operation);
    if (startTime) {
      const duration = performance.now() - startTime;
      logger.debug(`Operation completed in ${duration.toFixed(2)}ms`, 
        { operation, duration }, 
        component, 
        operation
      );
      this.measurements.delete(operation);
    }
  }

  static measure<T>(operation: string, fn: () => T, component?: string): T {
    this.start(operation);
    try {
      const result = fn();
      this.end(operation, component);
      return result;
    } catch (error) {
      this.end(operation, component);
      throw error;
    }
  }

  static async measureAsync<T>(operation: string, fn: () => Promise<T>, component?: string): Promise<T> {
    this.start(operation);
    try {
      const result = await fn();
      this.end(operation, component);
      return result;
    } catch (error) {
      this.end(operation, component);
      throw error;
    }
  }
}