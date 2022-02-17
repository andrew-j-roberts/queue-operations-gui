import { get } from "svelte/store";
import { openPages, selectedPage } from "./stores";
import type { Page, Widget, BrokerSession } from "./types";
import { getLastValue } from "./utils";

// pages
export const noOpenPage: Page = { id: "none", type: "none" };
export const welcomePage: Page = { id: "About", type: "home" };
export function addBrokerPage(): Page {
  return { id: "Add new broker", type: "broker-add" };
}
export function brokerEditPage(name: string): Page {
  // TODO: include error handling in the routing to ensure broker exists in queue manager
  return { id: `${name} - edit`, type: "broker-edit", data: { name } };
}
export function brokerDetailPage(name: string): Page {
  return { id: `${name} - detail`, type: "broker-detail", data: { name } };
}
export function queueDetailPage(brokerName: string, queueName: string): Page {
  return { id: `${queueName} - detail`, type: "queue-detail", data: { brokerName, queueName } };
}
export function messageMovePage(brokerName: string, queueName: string, selectedMessages: object): Page {
  return { id: `${queueName} - move`, type: "message-move", data: { brokerName, queueName, selectedMessages } };
}
export function messageDetailPage(brokerName: string, queueName: string, selectedMessage: string): Page {
  return { id: `${queueName} - move`, type: "message-detail", data: { brokerName, queueName, selectedMessage } };
}

// widgets
export const noOpenWidget: Widget = { type: "none" };
export const queueManagerWidget: Widget = { type: "queues" };

// navigation options
export function navigate(page: Page) {
  openPages.open(page);
  selectedPage.set(page);
}

export function close(page: Page) {
  let openPagesCurrentVal = get(openPages);
  openPages.close(page);
  if (Object.keys(openPagesCurrentVal).length > 0) {
    selectedPage.set(getLastValue(openPagesCurrentVal));
  } else {
    selectedPage.set(noOpenPage);
  }
}
