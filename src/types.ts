import { getCurrentTimestamp_UTC } from "./utils";

/**
 * ui
 */
export interface Page {
  id: string;
  type: PageType;
  data?: any;
}
type PageType =
  | "none"
  | "home"
  | "broker-add"
  | "broker-edit"
  | "broker-detail"
  | "queue-detail"
  | "message-move"
  | "message-detail";

export interface Widget {
  type: WidgetType;
}
type WidgetType = "none" | "queues";

/**
 * app
 */

// connection
export interface EventBrokerConnection {
  type: UserEnum;
  hostUrl: string;
  msgVpn: string;
  username: string;
  password: string;
}
export enum UserEnum {
  Data = "DATA",
  Management = "MANAGEMENT",
}

// queue manager sessions
export interface BrokerSession {
  name: string;
  dataCredentials: EventBrokerConnection;
  managementCredentials: EventBrokerConnection;
  lastStatus: StatusEnum;
  lastStatusTimestamp: string;
  queues?: object[];
  queueBrowserRef?: any;
  messages?: Record<string, object>;
  sempMessages?: Record<string, object>;
  publisherRef?: any;
}
export enum StatusEnum {
  new = "NEW",
  waiting = "WAITING",
  success = "SUCCESS",
  error = "ERROR",
}
// export const defaultBrokerSession: BrokerSession = {
//   name: "localhost",
//   dataCredentials: {
//     type: UserEnum.Data,
//     hostUrl: "https://localhost:443",
//     msgVpn: "default",
//     username: "default",
//     password: "default",
//   },
//   managementCredentials: {
//     type: UserEnum.Management,
//     hostUrl: "http://localhost:8080/SEMP/v2/monitor",
//     msgVpn: "default",
//     username: "default",
//     password: "default",
//   },
//   lastStatus: StatusEnum.new,
//   lastStatusTimestamp: getCurrentTimestamp_UTC(),
//   queues: [],
//   queueBrowserRef: null,
//   messages: {},
//   sempMessages: {},
//   publisherRef: null,
// };
export const defaultBrokerSession: BrokerSession = {
  name: "ajr",
  dataCredentials: {
    type: UserEnum.Data,
    hostUrl: "wss://mr1bj0dfde8rbj.messaging.solace.cloud:443",
    msgVpn: "ajr",
    username: "solace-cloud-client",
    password: "ka9m91jhj8dr79s9b87ef8kfbs",
  },
  managementCredentials: {
    type: UserEnum.Management,
    hostUrl: "https://mr1bj0dfde8rbj.messaging.solace.cloud:943/SEMP/v2/monitor",
    msgVpn: "ajr",
    username: "ajr-admin",
    password: "ud29d25c8bjl3pf08dpkeq5pfb",
  },
  lastStatus: StatusEnum.new,
  lastStatusTimestamp: getCurrentTimestamp_UTC(),
  queues: [],
  queueBrowserRef: null,
  messages: {},
  sempMessages: {},
  publisherRef: null,
};

// log manager sessions

export interface Log {
  groupIds: string[];
  timestamp: string;
  message: string;
}

/**
 * clients
 */

// TODO: other forms of auth
export interface Request {
  baseUrl: string;
  endpoint: string;
  queryString?: string;
  basicAuthUsername: string;
  basicAuthPassword: string;
  headers: Headers;
  body?: string; // expects application to serialize
}
