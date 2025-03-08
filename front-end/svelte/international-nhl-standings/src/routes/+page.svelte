<script lang="ts">
  import { onMount } from "svelte";
  import { fetchStandings } from "../api/standingsAPI";
  import Table from "../components/Table.svelte";
  import ViewSelector from "../components/ViewSelector.svelte";
  import { standingsStore } from "../stores/standingsStore";

  onMount(async () => {
    const fetchedStandings = await fetchStandings();
    standingsStore.set(fetchedStandings);
  });
</script>

<main class="min-h-screen bg-gray-50 py-8">
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8">NHL Standings</h1>
    <ViewSelector />
    <Table />
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>
