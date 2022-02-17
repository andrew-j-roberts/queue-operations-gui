<script lang="ts">
  import { onMount } from "svelte";
  import { selectedPage, queueManager, logs } from "../stores";
  import { connectSolaceQueueBrowser } from "../clients/solace-queue-browser";
  import MessagesList from "../widgets/MessageManager/MessagesList.svelte";
  import { getCurrentTimeYYMMDD_HHMMSS } from "../utils";
  import { getMessagesList } from "../clients/semp-client";
  import { StatusEnum } from "../types";
  import type { Log } from "../types";
  import SvgRefresh from "../icons/SvgRefresh.svelte";
  import SvgDuplicate from "../icons/SvgDuplicate.svelte";
  import SvgEye from "../icons/SvgEye.svelte";
  import SvgInfo from "../icons/SvgInfo.svelte";
  import { navigate, messageMovePage } from "../routes";

  $: ({ brokerName, queueName } = $selectedPage.data);
  $: brokerSession = $queueManager[brokerName];
  $: $selectedPage.data, connectQueueBrowser(), getSEMPMessageList();
  $: msgs = brokerSession.messages[queueName] ? Object.values(brokerSession.messages[queueName]) : [];

  let selectedMessages;

  async function connectQueueBrowser() {
    const ref = await connectSolaceQueueBrowser(brokerName, queueName);
    queueManager.save({
      ...brokerSession,
      lastStatus: StatusEnum.success,
      lastStatusTimestamp: getCurrentTimeYYMMDD_HHMMSS(),
      queueBrowserRef: ref,
    });
  }

  async function getSEMPMessageList() {
    // make request
    const { data: sempMessages } = await getMessagesList(brokerSession.managementCredentials, queueName);
    // format response into dict
    let _sempMessages = {};
    for (const sempMessage of sempMessages) {
      _sempMessages[sempMessage.msgId] = sempMessage;
    }
    // update broker session status to success and log interaction with broker
    const infoLog: Log = {
      groupIds: ["info", brokerName, queueName],
      message: `Fetched SEMP messages metadata from queue '${queueName}' on '${brokerName}'.`,
      timestamp: getCurrentTimeYYMMDD_HHMMSS(),
    };
    logs.write(infoLog);

    queueManager.save({
      ...brokerSession,
      sempMessages: { ...brokerSession.sempMessages, [queueName]: { ..._sempMessages } },
    });
  }

  async function refreshQueueBrowser() {
    brokerSession.queueBrowserRef.disconnect();
    const ref = await connectSolaceQueueBrowser(brokerName, queueName);
    queueManager.save({
      ...brokerSession,
      lastStatus: StatusEnum.success,
      lastStatusTimestamp: getCurrentTimeYYMMDD_HHMMSS(),
      queueBrowserRef: ref,
    });
  }

  function disconnectQueueBrowser() {}
</script>

<h1 class="text-xl text-gray-800">Queue details</h1>
<h2 class="mt-2 text-xl">{queueName}</h2>
<div class="flex items-center mt-4">
  <h3 class="mr-1 text-lg">Messages</h3>
  <button
    class="flex items-center justify-center p-2 text-gray-700 hover:bg-gray-300 hover:text-gray-800 focus:bg-gray-300 focus:text-gray-800"
    data-tooltip={`Fetch`}
    on:click={() => refreshQueueBrowser()}
  >
    <div class="w-6 h-6">
      <SvgRefresh />
    </div>
  </button>
  <button
    class="flex items-center justify-center p-2 text-gray-700 hover:bg-gray-300 hover:text-gray-800 focus:bg-gray-300 focus:text-gray-800"
    data-tooltip={`Move selected messages`}
    on:click={() => navigate(messageMovePage(brokerName, queueName, selectedMessages))}
  >
    <div class="w-6 h-6">
      <SvgDuplicate />
    </div>
  </button>
  <button
    class="flex items-center justify-center p-2 text-gray-700 hover:bg-gray-300 hover:text-gray-800 focus:bg-gray-300 focus:text-gray-800"
    data-tooltip={`See details`}
    on:click={() => refreshQueueBrowser()}
  >
    <div class="w-6 h-6">
      <SvgInfo />
    </div>
  </button>
</div>
<div class="flex py-2 mt-2 bg-gray-300">
  <div class="w-14" />
  <div class="w-10">#</div>
  <div class="w-36">msgId</div>
  <div class="w-52">spooledTime</div>
  <div class="flex-grow">payload preview</div>
</div>
<div class="w-full bg-white messagesTable">
  <MessagesList messages={msgs} {queueName} {brokerName} bind:selectedMessages />
</div>

<style>
  .messagesTable {
    height: calc(100% - 12rem);
  }
</style>
