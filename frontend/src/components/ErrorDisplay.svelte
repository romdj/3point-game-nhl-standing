<script lang="ts">
  import { errorStore } from '../stores/errorStore';
  import type { AppError } from '../stores/errorStore';

  export let maxErrors: number = 3;
  export let autoHide: boolean = true;
  export let autoHideDelay: number = 5000;

  let timeouts: { [key: string]: number } = {};

  const getErrorIconType = (type: AppError['type']) => {
    switch (type) {
      case 'network':
        return 'clock';
      case 'api':
        return 'check';
      case 'validation':
        return 'warning';
      default:
        return 'error';
    }
  };

  const getErrorColor = (type: AppError['type']) => {
    switch (type) {
      case 'network':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'api':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'validation':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const handleDismiss = (errorId: string) => {
    if (timeouts[errorId]) {
      clearTimeout(timeouts[errorId]);
      delete timeouts[errorId];
    }
    errorStore.removeError(errorId);
  };

  const handleDismissAll = () => {
    Object.values(timeouts).forEach(timeout => clearTimeout(timeout));
    timeouts = {};
    errorStore.clearErrors();
  };

  // Auto-hide errors after delay
  $: if (autoHide && $errorStore.errors.length > 0) {
    $errorStore.errors.forEach(error => {
      if (!timeouts[error.id]) {
        timeouts[error.id] = setTimeout(() => {
          handleDismiss(error.id);
        }, autoHideDelay) as unknown as number;
      }
    });
  }

  // Limit number of displayed errors
  $: displayedErrors = $errorStore.errors.slice(0, maxErrors);
</script>

{#if $errorStore.isVisible && displayedErrors.length > 0}
  <div class="error-display fixed top-4 right-4 z-50 space-y-2 max-w-md">
    {#each displayedErrors as error (error.id)}
      <div class="error-toast transform transition-all duration-300 ease-in-out border rounded-lg p-4 shadow-lg {getErrorColor(error.type)}">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            {#if getErrorIconType(error.type) === 'clock'}
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            {:else if getErrorIconType(error.type) === 'check'}
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            {:else if getErrorIconType(error.type) === 'warning'}
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            {:else}
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            {/if}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium">
              {error.message}
            </p>
            <p class="text-xs mt-1 opacity-75">
              {error.timestamp.toLocaleTimeString()}
            </p>
          </div>
          <button
            on:click={() => handleDismiss(error.id)}
            class="flex-shrink-0 opacity-75 hover:opacity-100 focus:outline-none"
            aria-label="Dismiss error"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    {/each}
    
    {#if $errorStore.errors.length > maxErrors}
      <div class="text-center">
        <button
          on:click={handleDismissAll}
          class="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Dismiss all ({$errorStore.errors.length} errors)
        </button>
      </div>
    {/if}
  </div>
{/if}

<style>
  .error-display {
    pointer-events: none;
  }
  
  .error-toast {
    pointer-events: auto;
  }
  
  .error-toast:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
</style>