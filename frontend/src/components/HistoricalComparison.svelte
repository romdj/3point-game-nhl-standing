<script lang="ts">
  import { fetchStandingsComparison } from '../api/standingsAPI';
  import { getDefaultStandingsDate } from '../utils/seasonUtils';
  import { LoadingSpinner, ErrorMessage } from './UI';
  import StandingsComparisonTable from './Table/StandingsComparisonTable.svelte';
  import type { Standing } from '../domain/standing';
  import { logger } from '../utils/logger';

  let isLoading = false;
  let error: string | null = null;
  let showComparison = false;
  let currentDate = getDefaultStandingsDate();
  let historicalDate = getDefaultSeasonStart();
  let comparisonData: {
    current: Standing[];
    historical: Standing[];
    currentDate: string;
    historicalDate: string;
  } | null = null;

  function getDefaultSeasonStart(): string {
    const today = new Date();
    const currentYear = today.getFullYear();
    // NHL season typically starts in October
    const seasonStart = new Date(currentYear, 9, 1); // October 1st
    
    // If we're before October, use previous year's season
    if (today.getMonth() < 9) {
      seasonStart.setFullYear(currentYear - 1);
    }
    
    return seasonStart.toISOString().split('T')[0];
  }

  async function loadComparison() {
    if (!historicalDate || !currentDate) {
      error = 'Please select both dates';
      return;
    }

    if (historicalDate >= currentDate) {
      error = 'Historical date must be before current date';
      return;
    }

    isLoading = true;
    error = null;

    try {
      logger.info('Loading standings comparison', { currentDate, historicalDate }, 'HistoricalComparison');
      comparisonData = await fetchStandingsComparison(currentDate, historicalDate);
      showComparison = true;
      logger.info('Successfully loaded comparison data', { 
        currentCount: comparisonData.current.length,
        historicalCount: comparisonData.historical.length 
      }, 'HistoricalComparison');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load comparison data';
      logger.error('Failed to load comparison', { error, currentDate, historicalDate }, 'HistoricalComparison');
    } finally {
      isLoading = false;
    }
  }

  function resetComparison() {
    showComparison = false;
    comparisonData = null;
    error = null;
  }

  function handleDateChange() {
    if (showComparison) {
      resetComparison();
    }
  }

  $: if (currentDate || historicalDate) {
    handleDateChange();
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="text-center">
    <h2 class="text-2xl font-bold text-base-content mb-2">Historical Standings Comparison</h2>
    <p class="text-base-content/70">Compare standings from different dates to see team progress</p>
  </div>

  <!-- Date Selection -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h3 class="card-title text-lg mb-4">Select Dates to Compare</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="form-control">
          <label class="label" for="current-date">
            <span class="label-text font-medium">Current Date</span>
          </label>
          <input 
            id="current-date"
            type="date" 
            class="input input-bordered w-full" 
            bind:value={currentDate}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div class="form-control">
          <label class="label" for="historical-date">
            <span class="label-text font-medium">Historical Date</span>
          </label>
          <input 
            id="historical-date"
            type="date" 
            class="input input-bordered w-full" 
            bind:value={historicalDate}
            max={currentDate}
          />
        </div>
      </div>

      <div class="flex gap-2">
        <button 
          class="btn btn-primary flex-1" 
          on:click={loadComparison}
          disabled={isLoading || !currentDate || !historicalDate}
        >
          {#if isLoading}
            <span class="loading loading-spinner loading-sm"></span>
            Loading...
          {:else}
            Compare Standings
          {/if}
        </button>
        
        {#if showComparison}
          <button class="btn btn-outline" on:click={resetComparison}>
            Reset
          </button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Error Display -->
  {#if error}
    <ErrorMessage 
      title="Comparison Error"
      message={error}
      retryAction={loadComparison}
      retryText="Try Again"
    />
  {/if}

  <!-- Loading State -->
  {#if isLoading}
    <LoadingSpinner size="lg" text="Loading standings comparison..." />
  {/if}

  <!-- Comparison Results -->
  {#if showComparison && comparisonData}
    <div class="space-y-4">
      <!-- Summary Stats -->
      <div class="stats shadow w-full">
        <div class="stat">
          <div class="stat-title">Historical Date</div>
          <div class="stat-value text-lg">{new Date(comparisonData.historicalDate).toLocaleDateString()}</div>
          <div class="stat-desc">{comparisonData.historical.length} teams</div>
        </div>
        
        <div class="stat">
          <div class="stat-title">Current Date</div>
          <div class="stat-value text-lg">{new Date(comparisonData.currentDate).toLocaleDateString()}</div>
          <div class="stat-desc">{comparisonData.current.length} teams</div>
        </div>
        
        <div class="stat">
          <div class="stat-title">Time Difference</div>
          <div class="stat-value text-lg">
            {Math.round((new Date(comparisonData.currentDate).getTime() - new Date(comparisonData.historicalDate).getTime()) / (1000 * 60 * 60 * 24))} days
          </div>
          <div class="stat-desc">analysis period</div>
        </div>
      </div>

      <!-- Comparison Table -->
      <StandingsComparisonTable 
        historical={comparisonData.historical}
        current={comparisonData.current}
        historicalDate={comparisonData.historicalDate}
        currentDate={comparisonData.currentDate}
      />
    </div>
  {/if}
</div>