<script lang="ts">
  import VirtualList from "../../ui/VirtualList.svelte";
  import MessageRow from "./MessageRow.svelte";

  export let queueName = "";
  export let brokerName = "";
  export let messages = [];
  export let start = 0;
  export let end = 0;
  export let scrollToIndex = undefined;
  export let selectedMessages = {};

  function setCheckedState(msgId: string, checked: boolean) {
    selectedMessages[msgId] = checked;
  }
</script>

{#if messages.length > 0}
  <VirtualList items={messages} bind:start bind:end bind:scrollToIndex let:item let:index>
    <MessageRow message={item} {index} {queueName} {brokerName} {setCheckedState} />
  </VirtualList>
{/if}
