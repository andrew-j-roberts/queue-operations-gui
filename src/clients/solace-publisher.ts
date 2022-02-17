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

export async function connectSolacePublisher(brokerName: string) {
  // initialize queue browser references
  let session = null;

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

      // define session event listeners
      session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
        logInfo(brokerName, `Successfully connected Solace publisher client to '${brokerName}'`);
      });
      session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (sessionEvent) {
        logError(
          brokerName,
          `Solace publisher failed to connect to message router: ${sessionEvent.infoStr} - check correct parameter values and connectivity!`
        );
      });
      session.on(solace.SessionEventCode.DISCONNECTED, function (sessionEvent) {
        logInfo(brokerName, `Solace publisher disconnected from '${brokerName}'`);
        if (session !== null) {
          session.dispose();
          session = null;
        }
      });
      function publish(id: string, payload: string, destinationQueueName: string) {
        if (session !== null) {
          let message = solace.SolclientFactory.createMessage();
          message.setDestination(solace.SolclientFactory.createDurableQueueDestination(destinationQueueName));
          message.setBinaryAttachment(payload);
          message.setDeliveryMode(solace.MessageDeliveryModeType.PERSISTENT);
          try {
            session.send(message);
            logInfo(brokerName, `Sent message '${id}' to '${destinationQueueName}' on '${brokerName}'`);
          } catch (error) {
            logError(brokerName, error.toString());
          }
        } else {
          logError(brokerName, "Cannot publish because not connected to Solace message router.");
        }
      }

      function disconnect() {
        if (session !== null) {
          try {
            session.disconnect();
          } catch (error) {
            logError(brokerName, error.toString());
          }
        } else {
          logError(brokerName, "Not connected to Solace message router — cannot disconnect.");
        }
      }

      session.connect();

      // only expose methods
      resolve({ publish, disconnect });
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
