<script>
  import { standingsStore } from "../stores/standingsStore";
  let standings = $standingsStore;
</script>

<style>
  /* Style for the table */
</style>

<table>
  <thead>
    <tr>
      <th>Team</th>
      <th>GP</th>
      <th>W</th>
      <th>OTW</th>
      <th>Points</th>
    </tr>
  </thead>
  <tbody>
    {#each standings as { team, gamesPlayed, wins, otWins, points }}
      <tr>
        <td>{team}</td>
        <td>{gamesPlayed}</td>
        <td>{wins}</td>
        <td>{otWins}</td>
        <td>{points}</td>
      </tr>
    {/each}
  </tbody>
</table>
