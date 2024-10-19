<script>
  import Table from "../components/Table.svelte";
  import { onMount } from "svelte";
  import { fetchStandings } from "../api/standingsAPI";
  import { standingsStore } from "../stores/standingsStore";

  onMount(async () => {
    const standings = await fetchStandings();
    standingsStore.set(standings);
  });
</script>

<main>
  <h1>NHL Standings</h1>
  <Table />
</main>
