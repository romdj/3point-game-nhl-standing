import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { viewTypeStore, type ViewType } from './viewStore';

describe('viewStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    viewTypeStore.set('conference');
  });

  it('should initialize with conference view', () => {
    const value = get(viewTypeStore);
    expect(value).toBe('conference');
  });

  it('should update to division view', () => {
    viewTypeStore.set('division');
    const value = get(viewTypeStore);
    expect(value).toBe('division');
  });

  it('should update to wildcard view', () => {
    viewTypeStore.set('wildcard');
    const value = get(viewTypeStore);
    expect(value).toBe('wildcard');
  });

  it('should update to league view', () => {
    viewTypeStore.set('league');
    const value = get(viewTypeStore);
    expect(value).toBe('league');
  });

  it('should handle view type transitions', () => {
    // Start with conference
    expect(get(viewTypeStore)).toBe('conference');
    
    // Change to division
    viewTypeStore.set('division');
    expect(get(viewTypeStore)).toBe('division');
    
    // Change to wildcard
    viewTypeStore.set('wildcard');
    expect(get(viewTypeStore)).toBe('wildcard');
    
    // Change to league
    viewTypeStore.set('league');
    expect(get(viewTypeStore)).toBe('league');
    
    // Back to conference
    viewTypeStore.set('conference');
    expect(get(viewTypeStore)).toBe('conference');
  });

  it('should work with update method', () => {
    viewTypeStore.set('conference');
    
    // Use update to change view
    viewTypeStore.update(currentView => {
      if (currentView === 'conference') {
        return 'division';
      }
      return currentView;
    });
    
    expect(get(viewTypeStore)).toBe('division');
  });

  it('should handle toggle-like functionality', () => {
    const toggleView = (current: ViewType): ViewType => {
      switch (current) {
        case 'conference':
          return 'division';
        case 'division':
          return 'wildcard';
        case 'wildcard':
          return 'league';
        case 'league':
          return 'conference';
        default:
          return 'conference';
      }
    };
    
    // Start with conference
    expect(get(viewTypeStore)).toBe('conference');
    
    // Toggle through all views
    viewTypeStore.update(toggleView);
    expect(get(viewTypeStore)).toBe('division');
    
    viewTypeStore.update(toggleView);
    expect(get(viewTypeStore)).toBe('wildcard');
    
    viewTypeStore.update(toggleView);
    expect(get(viewTypeStore)).toBe('league');
    
    viewTypeStore.update(toggleView);
    expect(get(viewTypeStore)).toBe('conference');
  });

  it('should maintain type safety with ViewType', () => {
    const validViews: ViewType[] = ['conference', 'division', 'wildcard', 'league'];
    
    validViews.forEach(view => {
      viewTypeStore.set(view);
      expect(get(viewTypeStore)).toBe(view);
    });
  });

  it('should preserve reference when not modified', () => {
    viewTypeStore.set('conference');
    const value1 = get(viewTypeStore);
    
    // Get value again without modification
    const value2 = get(viewTypeStore);
    
    // Should be the same value
    expect(value1).toBe(value2);
  });

  it('should create new value when updated', () => {
    viewTypeStore.set('conference');
    const value1 = get(viewTypeStore);
    
    // Update to same value
    viewTypeStore.set('conference');
    const value2 = get(viewTypeStore);
    
    // Values should be equal
    expect(value1).toBe(value2);
  });

  it('should handle rapid view changes', () => {
    const views: ViewType[] = ['conference', 'division', 'wildcard', 'league'];
    
    // Rapidly change views
    views.forEach(view => {
      viewTypeStore.set(view);
      expect(get(viewTypeStore)).toBe(view);
    });
    
    // Should end up with the last view
    expect(get(viewTypeStore)).toBe('league');
  });

  it('should support subscription pattern', () => {
    let subscribedValue: ViewType | null = null;
    
    // Subscribe to changes
    const unsubscribe = viewTypeStore.subscribe(value => {
      subscribedValue = value;
    });
    
    // Initial value should be set
    expect(subscribedValue).toBe('conference');
    
    // Change value
    viewTypeStore.set('division');
    expect(subscribedValue).toBe('division');
    
    // Change again
    viewTypeStore.set('wildcard');
    expect(subscribedValue).toBe('wildcard');
    
    // Cleanup
    unsubscribe();
  });

  it('should handle edge cases gracefully', () => {
    // Test with all valid view types
    const views: ViewType[] = ['conference', 'division', 'wildcard', 'league'];
    
    views.forEach(view => {
      viewTypeStore.set(view);
      const currentValue = get(viewTypeStore);
      expect(currentValue).toBe(view);
      expect(typeof currentValue).toBe('string');
    });
  });
});