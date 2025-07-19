import { writable } from 'svelte/store';

// Simple UUID generator fallback
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface AppError {
  id: string;
  message: string;
  type: 'network' | 'validation' | 'runtime' | 'api';
  timestamp: Date;
  context?: Record<string, unknown>;
}

export interface ErrorState {
  errors: AppError[];
  isVisible: boolean;
}

const createErrorStore = () => {
  const { subscribe, set, update } = writable<ErrorState>({
    errors: [],
    isVisible: false
  });

  return {
    subscribe,
    
    addError: (error: Omit<AppError, 'id' | 'timestamp'>) => {
      const newError: AppError = {
        ...error,
        id: generateUUID(),
        timestamp: new Date()
      };
      
      update(state => ({
        errors: [...state.errors, newError],
        isVisible: true
      }));
    },

    removeError: (id: string) => {
      update(state => ({
        ...state,
        errors: state.errors.filter(error => error.id !== id)
      }));
    },

    clearErrors: () => {
      set({ errors: [], isVisible: false });
    },

    hideErrorDisplay: () => {
      update(state => ({
        ...state,
        isVisible: false
      }));
    }
  };
};

export const errorStore = createErrorStore();