<script lang="ts">
  import SvgAdd from "../../icons/SvgAdd.svelte";
  import SvgExport from "../../icons/SvgExport.svelte";
  import SvgFolderOpen from "../../icons/SvgFolderOpen.svelte";
  import { navigate, addBrokerPage } from "../../routes";
  import { logs, queueManager } from "../../stores";
  import BrokerRow from "./BrokerRow.svelte";
</script>

<div class="flex flex-col h-full bg-gray-100 w-96">
  <div class="flex items-center justify-between">
    <h1 class="mb-2 text-xl">Queue Manager</h1>
  </div>
  <div class="flex items-center mb-2">
    <button
      class="select-none mb-2 mr-2 flex items-center p-2 bg-white text-gray-700 border border-[#dddddd] hover:bg-gray-300 hover:text-gray-800 focus:bg-gray-300 focus:text-gray-800"
      on:click={() => {
        navigate(addBrokerPage());
      }}
    >
      <div class="flex items-center justify-center w-6 h-6 mr-1">
        <SvgAdd />
      </div>
      New Broker
    </button>
  </div>
  <div class="flex flex-col flex-grow">
    {#each Object.keys($queueManager) as brokerId}
      <BrokerRow session={$queueManager[brokerId]} />
    {/each}
  </div>
  <div class="flex items-center">
    <button
      class="select-none mr-2 flex items-center p-2 text-gray-700 bg-white border border-[#dddddd] hover:bg-gray-300 hover:text-gray-800 focus:bg-gray-300 focus:text-gray-800"
      on:click={() => navigate(addBrokerPage())}
    >
      <div class="flex items-center justify-center w-6 h-6 pr-1">
        <SvgFolderOpen />
      </div>
      Import Brokers
    </button>
    <button
      class="select-none mr-2 flex items-center p-2 text-gray-700 bg-white border border-[#dddddd] hover:bg-gray-300 hover:text-gray-800 focus:bg-gray-300 focus:text-gray-800"
      on:click={() => navigate(addBrokerPage())}
    >
      <div class="flex items-center justify-center w-6 h-6 pr-1">
        <SvgExport />
      </div>
      Export Brokers
    </button>
  </div>
</div>

<style>
  table {
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #dddddd;
  }
</style>
