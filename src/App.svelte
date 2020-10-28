<script lang="typescript">
  // Types
  import type { View, Spec, splitAccessPath } from "vega";

  // Imports
  import { onMount, tick } from "svelte";
  import embed from "vega-embed";

  // TODO: use these instead to make pretty
  // import RangeSlider from "svelte-range-slider-pips";
  // import Select from "svelte-select";

  // Local Imports
  import { beeswarmSpec } from "./beeswarm";

  // data
  import * as rf_model_tile_json from "../public/data/rf_model_tile_proba.json";
  import * as comp_model_tile_json from "../public/data/comp_model_tile_proba.json";

  enum Type {
    None,
    Number,
    String,
    Boolean,
  }

  let vegaBox: HTMLDivElement;
  let vegaView: View;


  // VARS
  const MIN_AGE = 17;
  const MAX_AGE = 91;

  let selected_age_idx: number = MIN_AGE;
  let selected_race_idx: number = 0;

  let race_inputs = [
    { id: 0, text: "White" },
    { id: 1, text: "Amer-Indian-Eskimo" },
    { id: 2, text: "Asian-Pac-Islander" },
    { id: 3, text: "Black" },
    { id: 4, text: "Other" },
  ];

  const rf_model_tile = rf_model_tile_json["values"];
  const comp_model_tile = comp_model_tile_json["values"];

  let mo = 0;
  let sl = 0;

  let mounted = false;

  function updateChart(a_i, r_i) {
    console.log("updating chart...");
    mo = rf_model_tile[a_i][r_i];
    sl = comp_model_tile[a_i][r_i];

    vegaView.data("vals", sl);
    // vegaView.data("mo_av", mo);

    vegaView.runAsync();
  }

  $: {
    if (mounted) {
      updateChart(selected_age_idx, selected_race_idx);
    }
  }

  onMount(() => {
    console.log("Mounting...");

    embed(vegaBox, beeswarmSpec as Spec).then((v) => {
      vegaView = v.view;
      mounted = true;
      console.log("Mounted!");
    });
  });
</script>

<style>
  :global(h1, h2, h3, h4, h5, h6) {
    margin: 10px 0px 0px 0px;
  }
  
  .container {
    height: 70vh;
    max-width: 1000px;
  }
  p {
    margin: 2rem 0rem 2rem 0rem;
  }
  
  #input-selections {
    border: 1px solid grey;
    padding: 1rem;
    background-color: #ebebeb;
  }

  #input-selections label, #input-selections p {
    display: inline-block;
    margin: 2px;
  }
  
</style>

<div class="container">

  <h1>Ensemble Vis with Beeswarm</h1>
  <p>Inputs below let you change age or race and see how this affects model. Overall model output (average of model when all points are assigned this label) is shown below</p>

  <p>The plot shows the average output of the "fake" data for each component ensemble.</p>
  
  <div id="input-selections">
    
    <label>
      Age
      <input type="number" bind:value={selected_age_idx}  min={MIN_AGE} max={MAX_AGE} />
      <input type="range" bind:value={selected_age_idx} min={MIN_AGE} max={MAX_AGE} />
    </label>

    <label>
      Race
        <select bind:value={selected_race_idx}>
          {#each race_inputs as r}
            <option value={r.id}>{r.text}</option>
          {/each}
        </select>

    </label>

    <p>Overall model output: {mo}</p>

  </div>

  <div class="vega" bind:this={vegaBox} />
</div>
