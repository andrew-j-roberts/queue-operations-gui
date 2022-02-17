<script>
  import { queueManager } from "../../stores";

  import { getCurrentTimeYYMMDD_HHMMSS } from "../../utils";

  // TODO: translate this into a type
  // https://docs.solace.com/API-Developer-Online-Ref-Documentation/js/solace.Message.html#getGuaranteedMessageId
  export let message;
  export let index;
  export let brokerName;
  export let queueName;
  export let setCheckedState;
  export let checked = false;
  $: backgroundColor = checked == true ? "bg-blue-200" : index % 2 != 0 ? "bg-gray-100" : "bg-white";
  $: spooledTime = $queueManager[brokerName].sempMessages[queueName][message.getGuaranteedMessageId()]
    ? $queueManager[brokerName].sempMessages[queueName][message.getGuaranteedMessageId()].spooledTime
    : "loading...";

  $: console.dir($queueManager[brokerName].sempMessages[queueName]);

  function toggle() {
    checked = !checked;
    setCheckedState(`${message.getGuaranteedMessageId()}`, checked);
  }
</script>

<div
  class={`${backgroundColor} flex items-center py-1 select-none cursor-pointer ${
    checked ? "hover:bg-blue-300 focus:bg-blue-300" : "hover:bg-gray-300 focus:bg-gray-300"
  }`}
  on:click={toggle}
>
  <input type="checkbox" class="cursor-pointer w-14" bind:checked />
  <div class="w-10">{index}</div>
  <div class="w-36">{message.getGuaranteedMessageId()}</div>
  <div class="w-52">{spooledTime}</div>
  <div class="flex-grow">{message.getBinaryAttachment()}</div>
</div>
