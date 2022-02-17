<script lang="ts">
  import { tick } from "svelte";
  import { brokerEditPage, navigate } from "../routes";
  import { selectedPage, queueManager, logs, createBrokerLogStore } from "../stores";
  import type { BrokerSession } from "../types";
  import SvgConfig from "../icons/SvgConfig.svelte";
  import SvgExport from "../icons/SvgExport.svelte";
  import LogList from "../widgets/Console/LogList.svelte";

  const { name } = $selectedPage.data;
  const brokerLogStore = createBrokerLogStore(name);

  // messenger scrolling behavior, scroll to bottom with every new log
  let scrollToIndex = undefined;

  $: $brokerLogStore, scrollToIndex ? handleLogsChange() : () => {};

  async function handleLogsChange() {
    await tick();
    scrollToIndex($brokerLogStore.length);
  }

  const brokerSession: BrokerSession = $queueManager[name];
</script>

<!-- handle unforeseen error state -->
{#if brokerSession}
  <h1 class="text-xl text-gray-800">Broker details</h1>
  <h2 class="mt-2 text-xl">{name}</h2>
  <!-- credentials section -->
  <div class="flex items-center mt-4">
    <h3 class="mr-1 text-lg">Credentials</h3>
    <button
      class="flex items-center justify-center p-2 text-gray-700 hover:bg-gray-300 hover:text-gray-800 focus:bg-gray-300 focus:text-gray-800"
      data-tooltip={`Edit`}
      on:click={() => navigate(brokerEditPage(name))}
    >
      <div class="w-6 h-6">
        <SvgConfig />
      </div>
    </button>
  </div>
  <div class="grid w-full grid-cols-2 mt-2 text-gray-800 bg-white">
    <!-- data credentials -->
    <div class="border-r border-gray-400 border-dotted">
      <div class="w-full bg-gray-300">
        <div class="p-2">
          <h4>Management User</h4>
        </div>
      </div>
      <div class="p-2 mt-2">
        <div class="flex items-center text-sm">
          <div class="w-24 mr-2 font-semibold text-gray-800">Host URL</div>
          <div>{brokerSession.managementCredentials.hostUrl}</div>
        </div>
        <div class="flex items-center mt-1 text-sm">
          <div class="w-24 mr-2 font-semibold text-gray-800">Message VPN</div>
          <div>{brokerSession.managementCredentials.msgVpn}</div>
        </div>
        <div class="flex items-center mt-1 text-sm">
          <div class="w-24 mr-2 font-semibold text-gray-800">Username</div>
          <div>{brokerSession.managementCredentials.username}</div>
        </div>
        <div class="flex items-center mt-1 text-sm">
          <div class="w-24 mr-2 font-semibold text-gray-800">Password</div>
          <div>{brokerSession.managementCredentials.password}</div>
        </div>
      </div>
    </div>
    <!-- data credentials -->
    <div>
      <div class="w-full bg-gray-300">
        <div class="p-2">
          <h4>Data User</h4>
        </div>
      </div>
      <div class="p-2 mt-2">
        <div class="flex items-center text-sm">
          <div class="w-24 mr-2 font-semibold text-gray-800">Host URL</div>
          <div>{brokerSession.dataCredentials.hostUrl}</div>
        </div>
        <div class="flex items-center mt-1 text-sm">
          <div class="w-24 mr-2 font-semibold text-gray-800">Message VPN</div>
          <div>{brokerSession.dataCredentials.msgVpn}</div>
        </div>
        <div class="flex items-center mt-1 text-sm">
          <div class="w-24 mr-2 font-semibold text-gray-800">Username</div>
          <div>{brokerSession.dataCredentials.username}</div>
        </div>
        <div class="flex items-center mt-1 text-sm">
          <div class="w-24 mr-2 font-semibold text-gray-800">Password</div>
          <div>{brokerSession.dataCredentials.password}</div>
        </div>
      </div>
    </div>
  </div>
  <!-- logs section -->
  <div class="flex items-center mt-4">
    <h3 class="mr-1 text-lg">Logs</h3>
    <button
      class="flex items-center justify-center p-2 text-gray-700 hover:bg-gray-300 hover:text-gray-800 focus:bg-gray-300 focus:text-gray-800"
      data-tooltip={`Export`}
      on:click={() => navigate(brokerEditPage(name))}
    >
      <div class="w-6 h-6">
        <SvgExport />
      </div>
    </button>
  </div>
  <div class="h-[24rem] mt-2 bg-white p-2">
    <LogList bind:scrollToIndex logs={$brokerLogStore} />
  </div>
{:else}
  <div>Broker session not found. Close this page and re-open from queue manager panel.</div>
{/if}
