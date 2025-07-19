/**
 * Shared constants used across frontend and backend
 */

// Network and API Constants
export const DEFAULT_PORTS = {
  GRAPHQL_SERVER: 4000,
  FRONTEND_DEV: 5173,
  FRONTEND_PROD: 3000,
} as const;

export const API_TIMEOUTS = {
  DEFAULT_REQUEST: 10000, // 10 seconds
  HEALTH_CHECK: 3000,     // 3 seconds
  CONNECTION_RETRY: 30000, // 30 seconds
} as const;

export const RETRY_LIMITS = {
  API_REQUESTS: 2,
  CONNECTION_ATTEMPTS: 3,
} as const;

// CORS Origins - centralized for consistent configuration
export const CORS_ORIGINS = {
  DEVELOPMENT: [
    'http://localhost:5173',
    'http://localhost:3000', 
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ] as string[],
  PRODUCTION: [
    'https://your-production-domain.com', // TODO: Update with actual production domain
  ] as string[],
};

// HTTP Headers and Methods
export const HTTP_HEADERS = {
  CORS_METHODS: 'GET, POST, OPTIONS',
  CORS_HEADERS: 'Content-Type, Authorization',
  CONTENT_TYPE_JSON: 'application/json',
} as const;

// NHL Season Constants
export const NHL_SEASON = {
  START_MONTH: 8,        // September (0-indexed)
  END_MONTH: 3,          // April (0-indexed)
  FALLBACK_SEASON: '2022-2023',
  DEFAULT_TEST_DATE: '2023-04-05',
} as const;

// Cache and Performance
export const CACHE_SETTINGS = {
  STANDINGS_TTL_MS: 5 * 60 * 1000,  // 5 minutes
  MAX_CACHE_SIZE: 50,
  DEBOUNCE_SEARCH_MS: 300,
  DEBOUNCE_RESIZE_MS: 250,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
  ROWS_PER_PAGE: 30,
} as const;

// Animation Durations (in milliseconds)
export const ANIMATIONS = {
  FADE: 500,
  SLIDE: 300,
  SORT: 200,
  QUICK: 150,
} as const;

// UI Status Colors (Tailwind classes)
export const STATUS_COLORS = {
  SUCCESS: 'bg-green-100 text-green-800',
  WARNING: 'bg-amber-100 text-amber-800', 
  ERROR: 'bg-red-100 text-red-800',
  INFO: 'bg-blue-100 text-blue-800',
  NEUTRAL: 'bg-gray-100 text-gray-800',
} as const;

// Button Styles (Tailwind classes)
export const BUTTON_STYLES = {
  BASE: 'px-4 py-2 rounded-lg transition-colors duration-200',
  PRIMARY: 'bg-blue-600 text-white hover:bg-blue-700',
  SECONDARY: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
  DANGER: 'bg-red-600 text-white hover:bg-red-700',
} as const;

// Error Styles (Tailwind classes)  
export const ERROR_STYLES = {
  CONTAINER: 'bg-red-50 border border-red-200 rounded-lg p-4',
  TITLE: 'text-red-800 font-semibold',
  MESSAGE: 'text-red-700',
  LINK: 'text-red-600 underline hover:text-red-800',
} as const;

// Common Sizing (Tailwind classes)
export const SIZES = {
  ICON_SMALL: 'w-4 h-4',
  ICON_MEDIUM: 'w-6 h-6', 
  ICON_LARGE: 'w-8 h-8',
  INDICATOR_DOT: 'w-2 h-2',
  SPINNER: 'w-5 h-5',
} as const;