<script lang="ts">
  export let title: string = 'Error';
  export let message: string;
  export let retryAction: (() => void) | null = null;
  export let retryText: string = 'Retry';
  export let type: 'error' | 'warning' | 'info' = 'error';

  const typeClasses = {
    error: 'alert-error',
    warning: 'alert-warning', 
    info: 'alert-info'
  };

  const iconClasses = {
    error: 'text-error',
    warning: 'text-warning',
    info: 'text-info'
  };
</script>

<div class="alert {typeClasses[type]} shadow-lg max-w-2xl mx-auto">
  <div class="flex flex-col items-center text-center">
    <!-- Icon -->
    <div class="{iconClasses[type]} mb-4">
      {#if type === 'error'}
        <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      {:else if type === 'warning'}
        <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      {:else}
        <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      {/if}
    </div>

    <!-- Content -->
    <div>
      <h3 class="text-lg font-semibold mb-2">{title}</h3>
      <p class="text-sm opacity-80 mb-4">{message}</p>
      
      {#if retryAction}
        <button 
          on:click={retryAction}
          class="btn btn-sm btn-outline"
        >
          {retryText}
        </button>
      {/if}
    </div>
  </div>
</div>