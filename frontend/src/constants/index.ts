/**
 * Frontend application constants
 * @deprecated Use AppConfig for centralized configuration management
 */

// NHL-specific constants
export const NHL_CONFERENCES = {
  EASTERN: 'Eastern',
  WESTERN: 'Western',
} as const;

export const NHL_DIVISIONS = {
  EASTERN: {
    ATLANTIC: 'Atlantic',
    METROPOLITAN: 'Metropolitan',
  },
  WESTERN: {
    PACIFIC: 'Pacific',
    CENTRAL: 'Central',
  },
} as const;

export const VIEW_TYPES = {
  CONFERENCE: 'conference',
  DIVISION: 'division',
  WILDCARD: 'wildcard',
  LEAGUE: 'league',
} as const;

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

// Static fallback constants (use appConfig directly for new code)
export const DEFAULT_SORT_KEY = 'internationalSystemPoints';
export const DEFAULT_SORT_ORDER = SORT_ORDERS.DESC;

export const WILDCARD_CONSTANTS = {
  PLAYOFF_RACE_POINT_THRESHOLD: 7,
  WILDCARD_SPOTS_PER_CONFERENCE: 2,
  DIVISION_AUTOMATIC_QUALIFIERS: 3,
} as const;

export const ANIMATION_DURATIONS = {
  FADE: 500,
  SLIDE: 300,
} as const;

export const TABLE_COLUMN_WIDTHS = {
  TEAM_NAME: 'w-48',
  SMALL_STAT: 'w-16',
  MEDIUM_STAT: 'w-20',
  POWERPLAY_STAT: 'w-24',
} as const;