/**
 * Application constants and configuration values
 */

export const API_ENDPOINTS = {
  NHL_STANDINGS: 'https://api-web.nhle.com/v1/standings',
} as const;

export const POINT_SYSTEMS = {
  NHL: {
    WIN: 2,
    OT_WIN: 2,
    OT_LOSS: 1,
    REGULATION_LOSS: 0,
  },
  INTERNATIONAL: {
    REGULATION_WIN: 3,
    OT_WIN: 2,
    OT_LOSS: 1,
    REGULATION_LOSS: 0,
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  FETCH_STANDINGS_FAILED: 'Failed to fetch standings data',
  INVALID_DATE_FORMAT: 'Invalid date format provided',
} as const;