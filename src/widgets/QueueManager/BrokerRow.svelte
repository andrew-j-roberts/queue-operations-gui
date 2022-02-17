<script>
  import SvgChevronDown from "../../icons/SvgChevronDown.svelte";
  import SvgChevronRight from "../../icons/SvgChevronRight.svelte";
  import SvgCircleWhite from "../../icons/SvgCircleWhite.svelte";
  import SvgCircleYellow from "../../icons/SvgCircleYellow.svelte";
  import SvgCircleGreen from "../../icons/SvgCircleGreen.svelte";
  import SvgCircleRed from "../../icons/SvgCircleRed.svelte";
  import SvgQueueRefresh from "../../icons/SvgQueueRefresh.svelte";
  import SvgServer from "../../icons/SvgServer.svelte";
  import SvgQueue from "../../icons/SvgQueue.svelte";
  import { navigate, brokerDetailPage, queueDetailPage } from "../../routes";
  import { fetchQueuesList } from "./queue-manager";

  export let session;
  export let expanded = false;

  function toggle() {
    // it's tightly coupled because i said so
    if (session.lastStatus == "ERROR" || session.lastStatus == "WAITING" || session.lastStatus == "NEW") {
      return;
    }
    expanded = !expanded;
  }
</script>

<div class={`flex items-center border-[#DDDDDD] ${expanded ? "" : "border-b"}`}>
  <button
    class="flex py-2"
    on:click={toggle}
    class:waiting={session.lastStatus == "WAITING" || session.lastStatus == "NEW"}
    class:loaded={session.lastStatus == "SUCCESS"}
    class:error={session.lastStatus == "ERROR"}
  >
    <div class="flex items-center justify-center mx-2">
      {#if expanded}
        <div class="w-6 h-6 text-gray-600">
          <SvgChevronDown />
        </div>
      {:else}
        <div class="w-6 h-6 text-gray-600">
          <SvgChevronRight />
        </div>
      {/if}
    </div>
    <span class="mx-2 select-none">
      {session.name}
    </span>
    <div class="flex items-center justify-center w-6 h-6 mx-2 text-gray-400 ">
      {#if session.lastStatus == "NEW"}
        <SvgCircleWhite />
      {:else if session.lastStatus == "WAITING"}
        <SvgCircleYellow />
      {:else if session.lastStatus == "SUCCESS"}
        <SvgCircleGreen />
      {:else if session.lastStatus == "ERROR"}
        <SvgCircleRed />
      {/if}
    </div>
  </button>
  <button
    class="flex items-center p-2 text-gray-700 hover:bg-gray-300 hover:text-gray-800 focus:bg-gray-300 focus:text-gray-800"
    data-tooltip={"Fetch queues"}
    on:click={() => fetchQueuesList(session)}
  >
    <div class="flex items-center justify-center w-6 h-6">
      <div class="w-6 h-6 pb-1 pl-1">
        <SvgQueueRefresh />
      </div>
    </div>
  </button>
  <button
    class="flex items-center p-2 text-gray-700 hover:bg-gray-300 hover:text-gray-800 focus:bg-gray-300 focus:text-gray-800"
    data-tooltip={"Broker details"}
    on:click={() => navigate(brokerDetailPage(session.name))}
  >
    <div class="w-6 h-6">
      <SvgServer />
    </div>
  </button>
</div>
{#if expanded}
  <div id="queues" class=" border-b border-[#DDDDDD]">
    {#if session.queues}
      {#each session.queues as queue}
        <button
          class="flex items-center w-full p-2 text-gray-700 hover:bg-gray-300 hover:text-gray-800 focus:bg-gray-300 focus:text-gray-800"
          on:click={() => navigate(queueDetailPage(session.name, queue.queueName))}
        >
          <div class="w-6 h-6 mr-2">
            <SvgQueue />
          </div>
          {queue.queueName}
        </button>
      {/each}
    {/if}
  </div>
{/if}

<style>
  ul {
    padding: 0.2em 0 0 0.5em;
    margin: 0 0 0 0.5em;
    list-style: none;
    border-left: 1px solid #eee;
  }

  li {
    padding: 0.2em 0;
  }

  .loaded,
  .new {
    @apply cursor-pointer hover:bg-gray-300;
  }

  .waiting {
    @apply cursor-wait;
  }

  .error {
    @apply cursor-not-allowed;
  }
</style>
