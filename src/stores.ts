import { Writable, writable, get, derived } from "svelte/store";
import type { Page, Widget, Log, BrokerSession } from "./types";
import { defaultBrokerSession } from "./types";
import { getCurrentTimeHHMMSS } from "./utils";

// ui, navigation
export const openWidget: Writable<Widget> = writable({ type: "queues" });
export const openPages: PagesStore = createPagesStore();
export const selectedPage: Writable<Page> = writable({ id: "", type: "none" });

interface PagesStore {
  subscribe: Writable<Record<string, Page>>["subscribe"];
  open: (page: Page) => void;
  close: (page: Page) => void;
}
function createPagesStore() {
  const { subscribe, set, update } = writable({});

  return {
    subscribe,
    open: (page: Page) =>
      update((pages: Record<string, Page>) => {
        return { ...pages, [page.id]: page };
      }),
    close: (page: Page) =>
      update((pages: Record<string, Page>) => {
        delete pages[page.id];
        return { ...pages };
      }),
  };
}

// queue manager
export const queueManager: QueueManagerStore = createQueueManagerStore();

interface QueueManagerStore {
  subscribe: Writable<Record<string, BrokerSession>>["subscribe"];
  save: (brokerSession: BrokerSession) => void;
  delete: (brokerSession: BrokerSession) => void;
}

function createQueueManagerStore(): QueueManagerStore {
  let defaultObj: Record<string, BrokerSession> = { ajr: defaultBrokerSession };
  const { subscribe, update } = writable(defaultObj);

  return {
    subscribe,
    save: (brokerSession: BrokerSession) =>
      update((brokerSessions: Record<string, BrokerSession>) => {
        return { ...brokerSessions, [brokerSession.name]: brokerSession };
      }),
    delete: (brokerSession: BrokerSession) =>
      update((brokerSessions: Record<string, BrokerSession>) => {
        delete brokerSessions[brokerSession.name];
        return { ...brokerSessions };
      }),
  };
}

export function existsInQueueManager(brokerSessionName: string): boolean {
  return !!get(queueManager)[brokerSessionName]; // return boolean value
}

// logs
export const logs: LogStore = createLogStore();

interface LogStore {
  subscribe: Writable<Log[]>["subscribe"];
  write: (log: Log) => void;
}

function createLogStore(): LogStore {
  let defaultObj: Log[] = [
    {
      groupIds: ["info"],
      message: "Started queue manager session.",
      timestamp: getCurrentTimeHHMMSS(),
    },
  ];
  const { subscribe, update } = writable(defaultObj);

  return {
    subscribe,
    write: (log: Log) => update((logs: Log[]) => [...logs, log]),
  };
}

// broker detail
export function createBrokerLogStore(name: string) {
  return derived(logs, ($logs) => $logs.filter((log: Log) => log.groupIds.includes(name)));
}

// selected messages
