<script lang="ts">
  import { logs, queueManager, existsInQueueManager, selectedPage } from "../stores";
  import { addBrokerPage, brokerEditPage, close } from "../routes";
  import { UserEnum, StatusEnum } from "../types";
  import type { BrokerSession, Log } from "../types";
  import { deepHasEmptyValue, getCurrentTimeHHMMSS, getCurrentTimestamp_UTC } from "../utils";

  const { name } = $selectedPage.data;
  let localFormState = { ...$queueManager[name] };

  function formIsInvalid() {
    let dirty = false;
    if (deepHasEmptyValue(localFormState)) {
      dirty = true;
    }
    return dirty;
  }

  let errorMessage = "";

  function save() {
    // guards
    if (formIsInvalid()) {
      errorMessage = "Incomplete form, please fill in all values.";
    } else {
      // add the broker session to the queue manager
      const brokerSession: BrokerSession = {
        ...localFormState,
        lastStatus: StatusEnum.waiting,
        lastStatusTimestamp: getCurrentTimestamp_UTC(),
      };
      queueManager.save(brokerSession);
      // write a log that it was successfully saved
      const log: Log = {
        groupIds: ["info", brokerSession.name],
        timestamp: getCurrentTimeHHMMSS(),
        message: `Edited '${brokerSession.name}' broker details.`,
      };
      logs.write(log);
      // close the page
      close(brokerEditPage(name));
    }
  }

  function cancel() {
    close(addBrokerPage());
  }
</script>

<h1 class="mb-4 text-xl text-gray-800">Edit broker details</h1>
<label class="block mb-1 font-semibold text-gray-800" for="name">Name</label>
<input
  name="name"
  type="text"
  class="w-1/2 px-3 py-2 mb-1 leading-tight text-gray-800 border rounded shadow appearance-none focus:shadow-outline"
  bind:value={localFormState.name}
/>
<div class="grid grid-cols-2 gap-8 mt-4 mb-20">
  <!-- management connection -->
  <div>
    <span
      data-tooltip={"Provide SEMP management connection details to be used by the queue manager to query the list of available queues, as well as to administratively remove messages from queues."}
      class="font-semibold text-gray-800 cursor-help"
      id="tooltip"
    >
      Management User Connection Details
    </span>
    <form class="grid gap-2 mt-4">
      <label class="block mb-1 text-sm font-semibold text-gray-800 " for="label">Type</label>
      <select
        class="w-full px-3 py-2 mb-1 leading-tight text-gray-800 border rounded shadow focus:shadow-outline"
        disabled
      >
        <option value="Management">Management</option>
      </select>
      <label class="block mb-1 text-sm font-semibold text-gray-800 " for="host">Host URL</label>
      <input
        class="w-full px-3 py-2 mb-1 leading-tight text-gray-800 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        name="hostUrl"
        type="text"
        bind:value={localFormState.managementCredentials.hostUrl}
      />
      <label class="block mb-1 text-sm font-semibold text-gray-800 " for="msgVpn">Message VPN</label>
      <input
        class="w-full px-3 py-2 mb-1 leading-tight text-gray-800 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        name="msgVpn"
        type="text"
        bind:value={localFormState.managementCredentials.msgVpn}
      />
      <label class="block mb-1 text-sm font-semibold text-gray-800 " for="username">Username</label>
      <input
        class="w-full px-3 py-2 mb-1 leading-tight text-gray-800 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        name="username"
        type="text"
        bind:value={localFormState.managementCredentials.username}
      />
      <label class="block mb-1 text-sm font-semibold text-gray-800 " for="host">Password</label>
      <input
        class="w-full px-3 py-2 mb-1 leading-tight text-gray-800 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        name="password"
        type="text"
        bind:value={localFormState.managementCredentials.password}
      />
    </form>
  </div>
  <!-- data connection -->
  <div>
    <span
      data-tooltip={"Provide client username connection details to be used by a queue browser to introspect message payloads, as well as to republish messages from dead message queues."}
      class="font-semibold text-gray-800 cursor-help"
      id="tooltip">Data User Connection Details</span
    >
    <form class="grid gap-2 mt-4">
      <label class="block mb-1 text-sm font-semibold text-gray-800 " for="label">Type</label>
      <select
        class="w-full px-3 py-2 mb-1 leading-tight text-gray-800 border rounded shadow focus:shadow-outline"
        disabled
      >
        <option value="Data">Data</option>
      </select>
      <label class="block mb-1 text-sm font-semibold text-gray-800 " for="host">Host URL</label>
      <input
        class="w-full px-3 py-2 mb-1 leading-tight text-gray-800 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        name="hostUrl"
        type="text"
        bind:value={localFormState.dataCredentials.hostUrl}
      />
      <label class="block mb-1 text-sm font-semibold text-gray-800 " for="msgVpn">Message VPN</label>
      <input
        class="w-full px-3 py-2 mb-1 leading-tight text-gray-800 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        name="msgVpn"
        type="text"
        bind:value={localFormState.dataCredentials.msgVpn}
      />
      <label class="block mb-1 text-sm font-semibold text-gray-800 " for="username">Username</label>
      <input
        class="w-full px-3 py-2 mb-1 leading-tight text-gray-800 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        name="username"
        type="text"
        bind:value={localFormState.dataCredentials.username}
      />
      <label class="block mb-1 text-sm font-semibold text-gray-800 " for="host">Password</label>
      <input
        class="w-full px-3 py-2 mb-1 leading-tight text-gray-800 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        name="password"
        type="text"
        bind:value={localFormState.dataCredentials.password}
      />
    </form>
  </div>
</div>
{#if errorMessage}
  <p class="text-red-600">{errorMessage}</p>
{:else}
  <br />
{/if}
<div class="flex items-center mt-2">
  <button
    on:click|preventDefault={save}
    type="submit"
    class="inline-flex items-center px-4 py-2 mr-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-green-600 border border-transparent rounded-md hover:bg-green-500 focus:bg-green-500 active:bg-green-700"
    >Save</button
  >
  <button
    on:click|preventDefault={cancel}
    class="inline-flex items-center px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-red-600 border border-transparent rounded-md hover:bg-red-500 focus:bg-red-500 active:bg-red-700"
    >Cancel</button
  >
</div>

<style>
  span#tooltip {
    text-decoration-style: dashed;
    text-decoration-line: underline;
    text-underline-offset: 3px;
  }
</style>
