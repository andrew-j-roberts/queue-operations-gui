<script>
  import { openPages, openWidget } from "../stores";
  import Toolbar from "./Toolbar.svelte";
  import TabsPanel from "./TabsPanel.svelte";
  import PageContainer from "./PageContainer.svelte";
  import WidgetsPanel from "./WidgetsPanel.svelte";
  import WidgetContainer from "./WidgetContainer.svelte";
  import Console from "../widgets/Console/Container.svelte";
</script>

<div class="grid grid-rows-[auto,1fr] w-screen h-screen">
  <Toolbar />
  <div class="grid grid-cols-[auto,1fr]">
    <!-- nav sidebar -->
    <WidgetsPanel />
    <!-- content -->
    <div class="flex">
      <!-- optional second sidebar -->
      {#if $openWidget.type != "none"}
        <WidgetContainer />
      {/if}
      <!-- tabs and page -->
      <div id="tabsAndPageContainer" class="flex flex-col w-full">
        <TabsPanel />
        {#if Object.keys($openPages).length > 0}
          <div id="pageContainer" class="w-full h-full min-h-0 p-4 overflow-y-auto bg-gray-100">
            <PageContainer />
          </div>
        {:else}
          <div class="w-full h-full min-h-0 bg-gray-700 logoBackground" />
        {/if}
        <Console />
      </div>
    </div>
  </div>
</div>

<style>
  .logoBackground {
    content: " ";
    background-image: url("/SvgSolaceToolkitLogo.svg");
    background-repeat: no-repeat;
    background-position: center;
  }

  /* full height - toolbar - tabs, not sure how to calc this any more elegantly */
  #pageContainer {
    max-height: calc(100vh - 5.5rem);
  }

  /* full height - toolbar, not sure how to calc this any more elegantly */
  #tabsAndPageContainer {
    max-height: calc(100vh - 2.5rem);
  }
</style>
