<script lang="ts">
  import { selectedPage, queueManager } from "../stores";
  import { connectSolacePublisher } from "../clients/solace-publisher";
  import { StatusEnum } from "../types";
  import { getCurrentTimeYYMMDD_HHMMSS } from "../utils";

  $: ({ brokerName, queueName, selectedMessages } = $selectedPage.data);
  $: brokerSession = $queueManager[brokerName];
  $: queueNames = brokerSession.queues.map((queue) => queue["queueName"]);
  $: $selectedPage.data, connectPublisher();

  let destinationQueue = "";

  async function connectPublisher() {
    const ref = await connectSolacePublisher(brokerName);
    queueManager.save({
      ...brokerSession,
      lastStatus: StatusEnum.success,
      lastStatusTimestamp: getCurrentTimeYYMMDD_HHMMSS(),
      publisherRef: ref,
    });
  }

  function moveMessages() {
    for (const messageId of Object.keys(selectedMessages)) {
      brokerSession.publisherRef.publish(
        messageId,
        brokerSession["messages"][queueName][messageId].getBinaryAttachment(),
        destinationQueue
      );
      brokerSession.queueBrowserRef.removeMessageFromQueue(brokerSession["messages"][queueName][messageId]);
    }
  }
</script>

<!-- handle unforeseen error state -->
{#if brokerSession}
  <h1 class="text-xl text-gray-800">Move selected messages</h1>
  <h2 class="mt-2 text-xl">From {queueName}...</h2>
  <div class="flex mt-2">
    {#each Object.keys(selectedMessages) as messageId}
      <div class="mr-2 bg-white border border-gray-400 rounded-md">
        {messageId}
      </div>
    {/each}
  </div>
  <h2 class="mt-2 text-xl">To...</h2>
  <select
    class="w-full px-3 py-2 mb-1 leading-tight text-gray-800 border rounded shadow focus:shadow-outline"
    bind:value={destinationQueue}
  >
    {#each queueNames as queueName}
      <option value={queueName}>{queueName}</option>
    {/each}
  </select>
  <div class="flex mt-6">
    <button
      class="flex items-center justify-center p-2 text-gray-700 hover:bg-gray-300 hover:text-gray-800 focus:bg-gray-300 focus:text-gray-800"
      data-tooltip={`Move!`}
      on:click={() => moveMessages()}
    >
      Move Messages
    </button>
  </div>
{:else}
  <div>Broker session not found. Close this page and re-open from queue manager panel.</div>
{/if}
