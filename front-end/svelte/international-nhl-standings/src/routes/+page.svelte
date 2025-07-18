<script lang="ts">
  import { onMount } from "svelte";
  import { fetchStandings } from "../api/standingsAPI";
  import { StandingsTable } from "../components/Table";
  import ViewSelector from "../components/ViewSelector.svelte";
  import ErrorBoundary from "../components/ErrorBoundary.svelte";
  import ErrorDisplay from "../components/ErrorDisplay.svelte";
  import { standingsStore } from "../stores/standingsStore";
  import { AppErrorHandler } from "../utils/errorHandler";

  let isLoading = true;
  let hasInitialError = false;

  const loadStandings = async () => {
    isLoading = true;
    hasInitialError = false;
    
    try {
      const fetchedStandings = await fetchStandings();
      standingsStore.set(fetchedStandings);
      isLoading = false;
    } catch (error) {
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
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-lg text-gray-600">Loading standings...</span>
        </div>
      {:else if hasInitialError}
        <div class="text-center py-12">
          <div class="text-red-600 mb-4">
            <svg class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">Failed to Load Standings</h2>
          <p class="text-gray-600 mb-4">We couldn't load the NHL standings. Please try again.</p>
          <button
            on:click={loadStandings}
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Retry
          </button>
        </div>
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
