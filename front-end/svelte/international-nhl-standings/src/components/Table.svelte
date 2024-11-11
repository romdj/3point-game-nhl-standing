<script lang="ts">
  import { writable } from 'svelte/store';
  import { standingsStore } from '../stores/standingsStore';
  import type { Standing } from '../domain/standing';

  let standings: Standing[] = [];
  standingsStore.subscribe((value) => {
    standings = value;
    console.log('standings:', standings);
  });
  $: console.log('standings:', standings);
</script>

<table>
  <thead>
    <tr>
      <!-- <th>Team</th>
      <th>W</th>
      <th>OTW</th>
      <th>Points</th> -->
      <th>Team</th>
      <th>GP</th>
      <th>Points"</th>
      <th>Points (IIHF Ranking)</th>
      <th>Wins (Total)</th>
      <th>Wins (Regulation)</th>
      <th>Wins (Overtime)</th>
      <th>Losses (Total)</th>
      <th>Losses (Overtime)</th>
    </tr>
  </thead>
  <tbody>
    {#each $standingsStore as { gamesPlayed, otWins, internationalSystemPoints, teamName, points, wins, regulationWins, losses, otLosses }}
      <tr>
        <!-- <td>{team}</td>
        <td>{wins}</td>
        <td>{otWins}</td>
        <td>{points}</td> -->

        <td>{teamName}</td>
        <td>{gamesPlayed}</td>
        <td>{points}</td>
        <td>{internationalSystemPoints}</td>
        <td>{wins}</td>
        <td>{regulationWins}</td>
        <td>{otWins}</td>
        <td>{losses}</td>
        <td>{otLosses}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  /* Style for the table */
</style>
