/**
 * Frontend debugging utility
 * Helps debug frontend state, data flow, and component issues
 */

import { logger } from '../utils/logger.js';

export interface DebugInfo {
  timestamp: string;
  userAgent: string;
  url: string;
  localStorage: Record<string, any>;
  sessionStorage: Record<string, any>;
  environment: {
    isDevelopment: boolean;
    nodeEnv: string;
  };
}

export class FrontendDebugger {

  /**
   * Gather general frontend debug information
   */
  static gatherDebugInfo(): DebugInfo {
    const info: DebugInfo = {
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node.js',
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
      localStorage: {},
      sessionStorage: {},
      environment: {
        isDevelopment: process.env.NODE_ENV === 'development',
        nodeEnv: process.env.NODE_ENV || 'unknown',
      },
    };

    // Safely access browser storage
    if (typeof window !== 'undefined') {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            info.localStorage[key] = localStorage.getItem(key);
          }
        }
      } catch (e) {
        logger.warn('Cannot access localStorage:', e);
      }

      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) {
            info.sessionStorage[key] = sessionStorage.getItem(key);
          }
        }
      } catch (e) {
        logger.warn('Cannot access sessionStorage:', e);
      }
    }

    return info;
  }

  /**
   * Test NHL-specific frontend functionality
   */
  static async testNHLFrontend(): Promise<void> {
    logger.section('NHL Frontend Debug Test');

    // Test if we can import season utils
    try {
      logger.info('Testing season utils import...');

      // Dynamic import to avoid build issues
      const seasonUtils = await import('../../front-end/src/utils/seasonUtils.js');

      logger.success('Season utils imported successfully');

      // Test season logic
      const currentDate = new Date();
      const seasonYear = seasonUtils.getCurrentNHLSeasonYear(currentDate);
      const defaultDate = seasonUtils.getDefaultStandingsDate(currentDate);

      logger.info('Season logic test:', {
        currentDate: currentDate.toISOString().split('T')[0],
        seasonYear,
        defaultDate,
      });

    } catch (error) {
      logger.error('Cannot import season utils:', error);
    }

    // Test GraphQL client configuration
    try {
      logger.info('Testing GraphQL client import...');

      const { client } = await import('../../front-end/src/api/graphqlClient.js');

      logger.success('GraphQL client imported successfully');
      logger.info('GraphQL client URL:', client.url);

    } catch (error) {
      logger.error('Cannot import GraphQL client:', error);
    }
  }

  /**
   * Attach debug functions to window for browser console access
   */
  static attachToWindow(): void {
    if (typeof window !== 'undefined') {
      (window as any).nhlDebug = {
        gatherInfo: FrontendDebugger.gatherDebugInfo,
        testFrontend: FrontendDebugger.testNHLFrontend,
        logger,
      };
      logger.success('Debug utilities attached to window.nhlDebug');
    } else {
      logger.warn('Not in browser environment, cannot attach to window');
    }
  }

  /**
   * Run a comprehensive frontend debug session
   */
  static async runDebugSession(): Promise<void> {
    logger.section('NHL Frontend Debug Session');

    // Gather basic info
    const debugInfo = FrontendDebugger.gatherDebugInfo();
    logger.info('Debug info gathered:', debugInfo);

    // Test NHL frontend
    await FrontendDebugger.testNHLFrontend();

    // Attach to window for further debugging
    FrontendDebugger.attachToWindow();

    logger.success('Debug session completed');
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  FrontendDebugger.runDebugSession();
}
