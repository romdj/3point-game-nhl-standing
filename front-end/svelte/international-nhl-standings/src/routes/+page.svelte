<script lang="ts">
  import { onMount } from "svelte";
  import { fetchStandings } from "../api/standingsAPI";
  import Table from "../components/Table.svelte";
  import { standingsStore } from "../stores/standingsStore";


  onMount(async () => {
    const fetchedStandings = await fetchStandings();
    standingsStore.set(fetchedStandings);
  });
</script>

<main>
  <h1>NHL Standings</h1>
  <Table />
</main>
