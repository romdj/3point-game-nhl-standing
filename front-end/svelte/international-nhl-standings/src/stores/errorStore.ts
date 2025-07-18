import { writable } from 'svelte/store';

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
        id: crypto.randomUUID(),
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