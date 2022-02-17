import { getData } from "./http-client";
import { EventBrokerConnection, Log, Request, UserEnum } from "../types";
import { logs } from "../stores";
import { getCurrentTimeHHMMSS } from "../utils";

export async function getQueues(credentials: EventBrokerConnection) {
  const { type, hostUrl, msgVpn, username, password } = credentials;
  const getQueuesEndpoint = `msgVpns/${msgVpn}/queues`;

  // guard
  if (type != UserEnum.Management) {
    const errorLog: Log = {
      groupIds: ["error"],
      message:
        "getQueues was called with credentials for a data user instead of a management user, unhandled exception.",
      timestamp: getCurrentTimeHHMMSS(),
    };
    logs.write(errorLog);
    return [];
  }

  const sempRequest: Request = {
    baseUrl: hostUrl,
    endpoint: getQueuesEndpoint,
    basicAuthUsername: username,
    basicAuthPassword: password,
    headers: new Headers(),
  };
  const queuesList = await getData(sempRequest);

  return queuesList;
}

export async function getMessagesList(credentials: EventBrokerConnection, queueName: string) {
  const { type, hostUrl, msgVpn, username, password } = credentials;
  const getMessagesEndpoint = `msgVpns/${msgVpn}/queues/${queueName}/msgs`;

  // guard
  if (type != UserEnum.Management) {
    const errorLog: Log = {
      groupIds: ["error"],
      message:
        "getQueues was called with credentials for a data user instead of a management user, unhandled exception.",
      timestamp: getCurrentTimeHHMMSS(),
    };
    logs.write(errorLog);
    return [];
  }

  const sempRequest: Request = {
    baseUrl: hostUrl,
    endpoint: getMessagesEndpoint,
    basicAuthUsername: username,
    basicAuthPassword: password,
    headers: new Headers(),
  };
  const queuesList = await getData(sempRequest);

  return queuesList;
}
