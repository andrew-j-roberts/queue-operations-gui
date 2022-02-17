<script>
  import { tick } from "svelte";
  import SvgLog from "../../icons/SvgLog.svelte";
  import SvgMinus from "../../icons/SvgMinus.svelte";
  import { logs } from "../../stores";
  import LogList from "./LogList.svelte";
  import SvgExport from "../../icons/SvgExport.svelte";

  let expanded = false;

  function toggle() {
    expanded = !expanded;
  }

  // messenger scrolling behavior, scroll to bottom with every new log
  let scrollToIndex = undefined;

  $: $logs, scrollToIndex ? handleLogsChange() : () => {};

  async function handleLogsChange() {
    await tick();
    scrollToIndex($logs.length);
  }
</script>

<div id="container" class={`border-t bg-gray-100 p-4 border-gray-300`}>
  <div class="flex">
    <button
      class="mr-2  select-none flex items-center p-2 text-gray-700 border bg-white border-[#dddddd] hover:bg-gray-300 hover:text-gray-800 focus:bg-gray-300 focus:text-gray-800"
      on:click={toggle}
    >
      <div class="flex items-center justify-center w-6 h-6 mr-1">
        {#if expanded}
          <SvgMinus />
        {:else}
          <SvgLog />
        {/if}
      </div>
      {expanded ? "Hide" : "View"} Logs
    </button>
    <button
      class="select-none flex items-center p-2 text-gray-700 border bg-white border-[#dddddd] hover:bg-gray-300 hover:text-gray-800 focus:bg-gray-300 focus:text-gray-800"
      on:click={toggle}
    >
      <div class="flex items-center justify-center w-6 h-6 mr-1">
        <SvgExport />
      </div>
      Export Logs
    </button>
  </div>
  {#if expanded}
    <div class={`${expanded ? "h-[24rem]" : "h-0"} mt-2 bg-white p-2`}>
      <LogList bind:scrollToIndex logs={$logs} />
    </div>
  {/if}
</div>

<style>
  #container {
    height: min-content;
  }
</style>
