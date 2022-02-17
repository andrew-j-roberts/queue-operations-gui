<script lang="ts">
  import { navigate, welcomePage } from "../routes";
  import SvgSolaceToolkitLogo from "../icons/SvgSolaceToolkitLogo.svelte";
</script>

<div class="flex items-center h-10 border-b bg-gray-50">
  <button
    aria-label="Welcome"
    class="flex items-center justify-center p-2 text-gray-700 border-r hover:bg-gray-200 focus:bg-gray-300"
    on:click={() => navigate(welcomePage)}
  >
    <div class="flex items-center justify-center w-6 h-6 ">
      <SvgSolaceToolkitLogo />
    </div>
  </button>
</div>
