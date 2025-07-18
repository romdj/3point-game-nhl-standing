<script lang="ts">
  import { onMount } from "svelte";
  import { StandingsTable } from "../components/Table";
  import ViewSelector from "../components/ViewSelector.svelte";
  import ErrorBoundary from "../components/ErrorBoundary.svelte";
  import ErrorDisplay from "../components/ErrorDisplay.svelte";
  import { LoadingSpinner, ErrorMessage } from "../components/UI";
  import { standingsStore } from "../stores/standingsStore";
  import { AppErrorHandler } from "../utils/errorHandler";
  import { logger } from "../utils/logger";
  import { StandingsService } from "../business";

  let isLoading = true;
  let hasInitialError = false;

  const loadStandings = async () => {
    logger.info('Starting standings load', {}, 'Page', 'loadStandings');
    isLoading = true;
    hasInitialError = false;
    
    try {
      const standingsService = StandingsService.getInstance();
      const fetchedStandings = await standingsService.getStandings();
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
  <main class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">NHL Standings</h1>
      
      {#if isLoading}
        <LoadingSpinner size="lg" text="Loading NHL standings..." />
      {:else if hasInitialError}
        <ErrorMessage 
          title="Failed to Load Standings"
          message="We couldn't load the NHL standings. Please try again."
          retryAction={loadStandings}
          retryText="Retry"
        />
      {:else}
        <ErrorBoundary fallback="An error occurred while displaying the standings">
          <ViewSelector />
          <StandingsTable />
        </ErrorBoundary>
      {/if}
    </div>
  </main>
</ErrorBoundary>

<!-- Global error display -->
<ErrorDisplay />

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>
