import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { themeStore, themes } from './themeStore';

// Mock browser environment
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

const mockMatchMedia = vi.fn(() => ({
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

const mockDocumentElement = {
  setAttribute: vi.fn(),
};

// Mock browser globals
vi.stubGlobal('localStorage', mockLocalStorage);
vi.stubGlobal('matchMedia', mockMatchMedia);
Object.defineProperty(global, 'document', {
  value: {
    documentElement: mockDocumentElement,
  },
});

// Mock browser environment check
vi.mock('$app/environment', () => ({
  browser: true,
}));

describe('themeStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have cupcake as default theme', () => {
    expect(get(themeStore)).toBe('cupcake');
  });

  it('should update theme and persist to localStorage', () => {
    themeStore.setTheme('sunset');

    expect(get(themeStore)).toBe('sunset');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('nhl-standings-theme', 'sunset');
    expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'sunset');
  });

  it('should toggle between themes', () => {
    // Reset to cupcake first
    themeStore.setTheme('cupcake');
    expect(get(themeStore)).toBe('cupcake');

    // Toggle to sunset
    themeStore.toggleTheme();
    expect(get(themeStore)).toBe('sunset');

    // Toggle back to cupcake
    themeStore.toggleTheme();
    expect(get(themeStore)).toBe('cupcake');
  });

  it('should reset theme to default', () => {
    themeStore.setTheme('sunset');
    expect(get(themeStore)).toBe('sunset');

    themeStore.resetTheme();
    expect(get(themeStore)).toBe('cupcake');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('nhl-standings-theme');
  });

  it('should provide theme configurations', () => {
    expect(themes.cupcake).toBeDefined();
    expect(themes.sunset).toBeDefined();

    expect(themes.cupcake.isDark).toBe(false);
    expect(themes.sunset.isDark).toBe(true);

    expect(themes.cupcake.displayName).toBe('Cupcake');
    expect(themes.sunset.displayName).toBe('Sunset');
  });

  it('should handle system theme preference', () => {
    // Mock system dark theme preference
    const mockSystemMatchMedia = vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    vi.stubGlobal('matchMedia', mockSystemMatchMedia);

    themeStore.initializeTheme();

    // Should detect system preference for dark theme
    expect(mockSystemMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });
});
