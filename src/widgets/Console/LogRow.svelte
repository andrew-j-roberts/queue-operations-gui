<script>
  export let log;
  let groupIdsString = log.groupIds.join(", ");
</script>

<div class="w-full grid grid-cols-[auto,auto,1fr] items-center gap-2 pt-2">
  <div class="text-gray-400"><span class="text-pink-700">{log.timestamp}</span> -</div>
  <div class="text-gray-400"><span class="text-green-700">{groupIdsString}</span> -</div>
  <div class="text-gray-800">{log.message}</div>
</div>
