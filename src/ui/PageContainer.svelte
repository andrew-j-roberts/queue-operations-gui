<script>
  import { selectedPage } from "../stores";
  import WelcomePage from "../pages/WelcomePage.svelte";
  import BrokerAddPage from "../pages/BrokerAddPage.svelte";
  import BrokerDetailPage from "../pages/BrokerDetailPage.svelte";
  import BrokerEditPage from "../pages/BrokerEditPage.svelte";
  import QueueDetailPage from "../pages/QueueDetailPage.svelte";
  import MessageDetailPage from "../pages/MessageDetailPage.svelte";
  import MessageMovePage from "../pages/MessageMovePage.svelte";
</script>

{#if $selectedPage.type == "home"}
  <WelcomePage />
{:else if $selectedPage.type == "broker-add"}
  <BrokerAddPage />
{:else if $selectedPage.type == "broker-detail"}
  <BrokerDetailPage />
{:else if $selectedPage.type == "broker-edit"}
  <BrokerEditPage />
{:else if $selectedPage.type == "queue-detail"}
  <QueueDetailPage />
{:else if $selectedPage.type == "message-move"}
  <MessageMovePage />
{:else if $selectedPage.type == "message-detail"}
  <MessageDetailPage />
{/if}
