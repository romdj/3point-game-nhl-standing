<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { errorStore } from '../stores/errorStore';
  import type { AppError } from '../stores/errorStore';

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

  export let fallback: string = 'Something went wrong. Please try again.';
  export let showDetails: boolean = false;
  export let retryAction: (() => void) | null = null;

  const dispatch = createEventDispatcher();

  let hasError = false;
  let errorDetails: AppError | null = null;

  // Global error handler for unhandled promise rejections
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    errorStore.addError({
      message: 'An unexpected error occurred',
      type: 'runtime',
      context: {
        reason: event.reason?.message || event.reason,
        stack: event.reason?.stack
      }
    });
    
    hasError = true;
    errorDetails = {
      id: generateUUID(),
      message: event.reason?.message || 'Unhandled promise rejection',
      type: 'runtime',
      timestamp: new Date(),
      context: { stack: event.reason?.stack }
    };
    
    dispatch('error', errorDetails);
  };

  // Global error handler for JavaScript errors
  const handleError = (event: ErrorEvent) => {
    console.error('JavaScript error:', event.error);
    
    errorStore.addError({
      message: event.error?.message || event.message,
      type: 'runtime',
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      }
    });
    
    hasError = true;
    errorDetails = {
      id: generateUUID(),
      message: event.error?.message || event.message,
      type: 'runtime',
      timestamp: new Date(),
      context: { 
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack 
      }
    };
    
    dispatch('error', errorDetails);
  };

  const handleRetry = () => {
    hasError = false;
    errorDetails = null;
    if (retryAction) {
      retryAction();
    }
  };

  onMount(() => {
    // Set up global error handlers
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
  });

  onDestroy(() => {
    // Clean up global error handlers
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  });

  // Reset error state when component content changes
  $: if (!hasError && errorDetails) {
    errorDetails = null;
  }
</script>

{#if hasError && errorDetails}
  <div class="error-boundary bg-red-50 border border-red-200 rounded-lg p-6 m-4">
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0">
        <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-sm font-medium text-red-800">
          Error Occurred
        </h3>
        <div class="mt-2 text-sm text-red-700">
          <p>{fallback}</p>
        </div>
        
        {#if showDetails && errorDetails}
          <div class="mt-4 bg-red-100 rounded-md p-3">
            <h4 class="text-xs font-medium text-red-800 mb-2">Error Details:</h4>
            <div class="text-xs text-red-700 space-y-1">
              <p><strong>Message:</strong> {errorDetails.message}</p>
              <p><strong>Type:</strong> {errorDetails.type}</p>
              <p><strong>Time:</strong> {errorDetails.timestamp.toLocaleString()}</p>
              {#if errorDetails.context?.filename}
                <p><strong>File:</strong> {errorDetails.context.filename}:{errorDetails.context.lineno}</p>
              {/if}
            </div>
          </div>
        {/if}
        
        <div class="mt-4 flex space-x-2">
          {#if retryAction}
            <button
              on:click={handleRetry}
              class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Try Again
            </button>
          {/if}
          <button
            on:click={() => hasError = false}
            class="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </div>
{:else}
  <slot />
{/if}

<style>
  .error-boundary {
    min-height: 100px;
  }
</style>