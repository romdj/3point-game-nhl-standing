<script lang="ts">
  import { onMount } from "svelte";
  import { fetchStandings } from "../api/standingsAPI";
  import { StandingsTable } from "../components/Table";
  import ViewSelector from "../components/ViewSelector.svelte";
  import ErrorBoundary from "../components/ErrorBoundary.svelte";
  import ErrorDisplay from "../components/ErrorDisplay.svelte";
  import { standingsStore } from "../stores/standingsStore";
  import { AppErrorHandler } from "../utils/errorHandler";
  import { logger } from "../utils/logger";

  let isLoading = true;
  let hasInitialError = false;

  const loadStandings = async () => {
    logger.info('Starting standings load', {}, 'Page', 'loadStandings');
    isLoading = true;
    hasInitialError = false;
    
    try {
      const fetchedStandings = await fetchStandings();
      standingsStore.set(fetchedStandings);
      logger.info('Successfully loaded standings', 
        { standingsCount: fetchedStandings.length }, 
        'Page', 
        'loadStandings'
      );
      isLoading = false;
    } catch (error) {
      logger.error('Failed to load standings', 
        { error: error instanceof Error ? error.message : String(error) }, 
        'Page', 
        'loadStandings'
      );
      AppErrorHandler.handleRuntimeError(error, { 
        operation: 'initial-load',
        component: 'page' 
      });
      hasInitialError = true;
      isLoading = false;
    }
  };

  onMount(loadStandings);
</script>

<ErrorBoundary fallback="Failed to load the NHL standings application" retryAction={loadStandings}>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-base-content mb-2">NHL Standings</h1>
      <p class="text-base-content/70 text-lg">
        Explore how the standings would look with the 3-point system
      </p>
    </div>
    
    {#if isLoading}
      <div class="flex justify-center items-center py-12">
        <div class="loading loading-spinner loading-lg text-primary"></div>
        <span class="ml-3 text-lg text-base-content">Loading standings...</span>
      </div>
    {:else if hasInitialError}
      <div class="text-center py-12">
        <div class="alert alert-error max-w-lg mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 class="font-bold">Failed to Load Standings</h3>
            <div class="text-xs">We couldn't load the NHL standings. Please try again.</div>
          </div>
        </div>
        <button
          on:click={loadStandings}
          class="btn btn-primary mt-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry
        </button>
      </div>
    {:else}
      <ErrorBoundary fallback="An error occurred while displaying the standings">
        <div class="space-y-6">
          <ViewSelector />
          <StandingsTable />
        </div>
      </ErrorBoundary>
    {/if}
  </div>
</ErrorBoundary>

<!-- Global error display -->
<ErrorDisplay />
