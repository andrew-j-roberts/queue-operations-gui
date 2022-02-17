<script>
  import { openWidget } from "../stores";
  import QueuesWidget from "../widgets/QueueManager/Container.svelte";
</script>

<div class="h-full p-4 bg-gray-100 border-r border-gray-300">
  {#if $openWidget.type == "queues"}
    <QueuesWidget />
  {/if}
</div>
