<script lang="ts">
  import { writable } from 'svelte/store';
  import { PointSystem } from '../domain/standing';

  export let selectedSystem = writable<PointSystem>(PointSystem.International);

  let sliderValue = $selectedSystem === PointSystem.NHL ? 0 : 1;

  function handleSliderChange(event: Event) {
    const target = event.target as HTMLInputElement;
    sliderValue = Number(target.value);
    selectedSystem.set(sliderValue === 0 ? PointSystem.NHL : PointSystem.International);
  }

  // Reactive statement to update the slider value based on the selected system
  $: sliderValue = $selectedSystem === PointSystem.NHL ? 0 : 1;

  // Reactive statement to update the label based on the selected system
  $: selectedSystemLabel = $selectedSystem === PointSystem.NHL ? 'NHL' : 'International';
</script>

<div class="mb-4">
  Selected System: {selectedSystemLabel}
  <input
    type="range"
    min="0"
    max="1"
    step="1"
    bind:value={sliderValue}
    on:input={handleSliderChange}
  />
</div>
