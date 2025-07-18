import { config as env } from './env';
import type { Standing } from '../domain/standing';

/**
 * Application-wide configuration management
 * Centralizes all configuration values with type safety and validation
 */
export class AppConfig {
  private static instance: AppConfig;

  // API Configuration
  public readonly api = {
    graphqlEndpoint: env.GRAPHQL_URL,
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
  };

  // UI Configuration
  public readonly ui = {
    animations: {
      fadeInDuration: 500,
      slideInDuration: 300,
      loaderSpinDuration: 1000,
    },
    table: {
      columnWidths: {
        teamName: 'w-48',
        smallStat: 'w-16',
        mediumStat: 'w-20',
        largeStat: 'w-24',
      },
      rowsPerPage: 30,
      sortAnimationDuration: 200,
    },
    themes: {
      default: 'cupcake',
      dark: 'sunset',
      storageKey: 'nhl-standings-theme',
    },
  };

  // NHL Configuration
  public readonly nhl = {
    wildcard: {
      divisionAutomaticQualifiers: 3,
      wildcardSpotsPerConference: 2,
      playoffRacePointThreshold: 7,
    },
    standings: {
      defaultSortKey: 'internationalSystemPoints' as keyof Standing,
      defaultSortOrder: 'desc' as const,
      defaultViewType: 'conference' as const,
    },
    pointSystems: {
      traditional: {
        win: 2,
        loss: 0,
        otLoss: 1,
      },
      international: {
        regulationWin: 3,
        otWin: 2,
        otLoss: 1,
        loss: 0,
      },
    },
  };

  // Performance Configuration
  public readonly performance = {
    cache: {
      standingsTtlMs: 5 * 60 * 1000, // 5 minutes
      maxCacheSize: 50,
    },
    debounce: {
      searchMs: 300,
      resizeMs: 250,
    },
    pagination: {
      defaultPageSize: 25,
      maxPageSize: 100,
    },
  };

  // Development Configuration
  public readonly development = {
    logging: {
      level: env.NODE_ENV === 'development' ? 'debug' : 'info',
      enableConsole: env.NODE_ENV === 'development',
      enablePerformanceLogging: env.NODE_ENV === 'development',
    },
    features: {
      enableExperimentalFeatures: env.NODE_ENV === 'development',
      enableTestData: env.NODE_ENV === 'test',
    },
  };

  private constructor() {
    this.validateConfig();
  }

  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  /**
   * Validate configuration on initialization
   */
  private validateConfig(): void {
    if (!this.api.graphqlEndpoint) {
      throw new Error('GraphQL endpoint is required');
    }

    if (this.api.timeout <= 0) {
      throw new Error('API timeout must be positive');
    }

    if (this.nhl.wildcard.divisionAutomaticQualifiers < 1) {
      throw new Error('Division automatic qualifiers must be at least 1');
    }

    if (this.nhl.wildcard.wildcardSpotsPerConference < 1) {
      throw new Error('Wildcard spots per conference must be at least 1');
    }
  }

  /**
   * Get configuration for a specific environment
   */
  public getEnvironmentConfig(): Record<string, unknown> {
    return {
      nodeEnv: env.NODE_ENV,
      apiEndpoint: this.api.graphqlEndpoint,
      isDevelopment: env.NODE_ENV === 'development',
      isProduction: env.NODE_ENV === 'production',
      isTest: env.NODE_ENV === 'test',
    };
  }

  /**
   * Get feature flags
   */
  public getFeatureFlags(): Record<string, boolean> {
    return {
      enableDarkMode: true,
      enableAnimations: true,
      enableAdvancedSorting: true,
      enablePositionTracking: true,
      enablePlayoffPredictions: this.development.features.enableExperimentalFeatures,
      enableTestData: this.development.features.enableTestData,
    };
  }

  /**
   * Override configuration for testing
   */
  public static createTestConfig(overrides: Partial<Record<string, unknown>> = {}): AppConfig {
    const config = new AppConfig();
    Object.assign(config, overrides);
    return config;
  }
}