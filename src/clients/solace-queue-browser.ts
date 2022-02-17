/**
 * solace-queue-browser.ts
 * @author Andrew Roberts
 */
import { get } from "svelte/store";
import solace from "solclientjs";
import { logs, queueManager } from "../stores";
import { getCurrentTimeYYMMDD_HHMMSS } from "../utils";
import type { BrokerSession, Log } from "../types";
import { StatusEnum } from "../types";

export async function connectSolaceQueueBrowser(brokerName: string, queueName: string) {
  // initialize queue browser references
  let session = null;
  let queueBrowser = null;

  // get connection details from queuemanager store
  const { dataCredentials } = get(queueManager)[brokerName];

  // initialize solclientjs
  let factoryProps = new solace.SolclientFactoryProperties();
  factoryProps.profile = solace.SolclientFactoryProfiles.version10;
  solace.SolclientFactory.init(factoryProps);

  // connect a queue browser session
  return new Promise((resolve, reject) => {
    // guard: if session is already connected, do not try to connect again.
    if (session !== null) {
      logError(brokerName, "Already connected.");
      reject("Already connected.");
    }
    // guard: check url protocol
    if (dataCredentials.hostUrl.indexOf("ws") != 0) {
      logError(brokerName, "hostUrl must begin with either ws:// or wss://.");
      reject("hostUrl must begin with either ws:// or wss://.");
    }

    try {
      // initialize solace session
      session = solace.SolclientFactory.createSession({
        url: dataCredentials.hostUrl,
        vpnName: dataCredentials.msgVpn,
        userName: dataCredentials.username,
        password: dataCredentials.password,
        connectRetries: 3,
        publisherProperties: {
          acknowledgeMode: solace.MessagePublisherAcknowledgeMode.PER_MESSAGE,
        },
      });
      session.connect();
      // initialize queuebrowser session
      // https://docs.solace.com/API-Developer-Online-Ref-Documentation/js/solace.Session.html#createQueueBrowser
      queueBrowser = session.createQueueBrowser({ queueDescriptor: { name: queueName, type: "QUEUE" } });
      // configure event handlers
      queueBrowser.on(solace.QueueBrowserEventName.CONNECT_FAILED_ERROR, function connectFailedErrorEventCb(error) {
        // details is an OperationError object
      });
      queueBrowser.on(solace.QueueBrowserEventName.DISPOSED, function disposedEventCb(error) {
        // details is an OperationError object
      });
      queueBrowser.on(solace.QueueBrowserEventName.DOWN, function downEventCb(error) {
        // details is an OperationError object
      });
      queueBrowser.on(solace.QueueBrowserEventName.DOWN_ERROR, function downErrorEventCb(error) {
        // details is an OperationError object
      });
      queueBrowser.on(solace.QueueBrowserEventName.GM_DISABLED, function gmDisabledEventCb(error) {
        // details is an OperationError object
      });
      queueBrowser.on(solace.QueueBrowserEventName.MESSAGE, async function messageEventCb(msg: any) {
        queueManager.save({
          ...get(queueManager)[brokerName],
          lastStatus: StatusEnum.success,
          lastStatusTimestamp: getCurrentTimeYYMMDD_HHMMSS(),
          messages: {
            ...get(queueManager)[brokerName].messages,
            // update the messages object, this "get" call was really tricky to figure out
            // if I passed the store by reference in the factory function, its properties wouldn't update on store writes
            [queueName]: get(queueManager)[brokerName].messages[queueName]
              ? { ...get(queueManager)[brokerName].messages[queueName], [`${msg.getGuaranteedMessageId().low}`]: msg }
              : { [`${msg.getGuaranteedMessageId().low}`]: msg },
          },
        });
      });
      queueBrowser.on(solace.QueueBrowserEventName.UP, function connectFailedErrorEventCb(error) {
        logInfo(brokerName, `QueueBrowser for '${queueName}' on '${brokerName}' connected.`);
      });
      // attempt to connect queuebrowser
      queueBrowser.connect();
      // resolve reference to connected queue browser
      resolve(queueBrowser);
    } catch (error) {
      logError(brokerName, error);
      reject();
    }
  });
}

function logInfo(brokerName: string, message: string) {
  const log: Log = { groupIds: ["info", brokerName], timestamp: getCurrentTimeYYMMDD_HHMMSS(), message };
  logs.write(log);
}

function logError(brokerName: string, message: string) {
  const log: Log = { groupIds: ["error", brokerName], timestamp: getCurrentTimeYYMMDD_HHMMSS(), message };
  logs.write(log);
}
