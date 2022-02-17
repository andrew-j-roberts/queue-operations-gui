<script>
  import VirtualList from "../../ui/VirtualList.svelte";
  import LogRow from "./LogRow.svelte";

  export let logs = [];
  export let start = 0;
  export let end = 0;
  export let scrollToIndex = undefined;
</script>

<VirtualList items={logs} bind:start bind:end bind:scrollToIndex let:item>
  <LogRow log={item} />
</VirtualList>
