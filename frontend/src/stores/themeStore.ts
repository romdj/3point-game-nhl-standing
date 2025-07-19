/**
 * Theme store for managing DaisyUI theme switching
 */

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'cupcake' | 'sunset';

export interface ThemeConfig {
  name: Theme;
  displayName: string;
  isDark: boolean;
  description: string;
  primaryColor: string;
  secondaryColor: string;
}

export const themes: Record<Theme, ThemeConfig> = {
  cupcake: {
    name: 'cupcake',
    displayName: 'Cupcake',
    isDark: false,
    description: 'Light and sweet theme',
    primaryColor: '#65c3c8',
    secondaryColor: '#ef9fbc',
  },
  sunset: {
    name: 'sunset',
    displayName: 'Sunset',
    isDark: true,
    description: 'Dark theme with warm colors',
    primaryColor: '#FF865B',
    secondaryColor: '#FD6F9C',
  },
};

// Default theme
const DEFAULT_THEME: Theme = 'cupcake';

// Storage key for theme preference
const THEME_STORAGE_KEY = 'nhl-standings-theme';

// Create the store
function createThemeStore() {
  // Initialize with default theme
  const { subscribe, set, update } = writable<Theme>(DEFAULT_THEME);

  return {
    subscribe,
    
    // Set theme and persist to localStorage
    setTheme: (theme: Theme) => {
      set(theme);
      if (browser) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        document.documentElement.setAttribute('data-theme', theme);
      }
    },
    
    // Toggle between light and dark themes
    toggleTheme: () => {
      update(currentTheme => {
        const newTheme = currentTheme === 'cupcake' ? 'sunset' : 'cupcake';
        if (browser) {
          localStorage.setItem(THEME_STORAGE_KEY, newTheme);
          document.documentElement.setAttribute('data-theme', newTheme);
        }
        return newTheme;
      });
    },
    
    // Initialize theme from localStorage or system preference
    initializeTheme: () => {
      if (!browser) return;
      
      let savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      
      // If no saved theme, check system preference
      if (!savedTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        savedTheme = prefersDark ? 'sunset' : 'cupcake';
      }
      
      // Validate saved theme
      if (!themes[savedTheme]) {
        savedTheme = DEFAULT_THEME;
      }
      
      set(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // Only auto-switch if user hasn't manually selected a theme
        const hasManualSelection = localStorage.getItem(THEME_STORAGE_KEY);
        if (!hasManualSelection) {
          const systemTheme = e.matches ? 'sunset' : 'cupcake';
          set(systemTheme);
          document.documentElement.setAttribute('data-theme', systemTheme);
        }
      };
      
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      
      // Return cleanup function
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    },
    
    // Get current theme config
    getCurrentThemeConfig: (currentTheme: Theme): ThemeConfig => {
      return themes[currentTheme];
    },
    
    // Reset to default theme
    resetTheme: () => {
      set(DEFAULT_THEME);
      if (browser) {
        localStorage.removeItem(THEME_STORAGE_KEY);
        document.documentElement.setAttribute('data-theme', DEFAULT_THEME);
      }
    }
  };
}

export const themeStore = createThemeStore();

// Derived store for current theme config
export const currentThemeConfig = writable<ThemeConfig>(themes[DEFAULT_THEME]);

// Update theme config when theme changes
themeStore.subscribe(theme => {
  currentThemeConfig.set(themes[theme]);
});