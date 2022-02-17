import { tick } from "svelte";
import { BrokerSession, Log, StatusEnum } from "../../types";
import { logs, queueManager } from "../../stores";
import * as SempClient from "../../clients/semp-client";
import { getCurrentTimeHHMMSS, getCurrentTimestamp_UTC } from "../../utils";

export async function fetchQueuesList(session: BrokerSession) {
  try {
    // update broker session status to waiting
    queueManager.save({ ...session, lastStatus: StatusEnum.waiting, lastStatusTimestamp: getCurrentTimestamp_UTC() });
    await tick();
    // make request
    const { data: queues } = await SempClient.getQueues(session.managementCredentials);
    // update broker session status to success and log interaction with broker
    const infoLog: Log = {
      groupIds: ["info", session.name],
      message: `Fetched queues from '${session.name}'.`,
      timestamp: getCurrentTimeHHMMSS(),
    };
    logs.write(infoLog);
    // update broker session object to include fetched queues
    queueManager.save({
      ...session,
      lastStatus: StatusEnum.success,
      lastStatusTimestamp: getCurrentTimestamp_UTC(),
      queues,
    });
    // dev log
    console.dir(queues);
  } catch (error) {
    // log interaction with broker
    const errorLog: Log = {
      groupIds: ["error", session.name],
      message: `Error fetching queues from '${session.name}'.`,
      timestamp: getCurrentTimeHHMMSS(),
    };
    logs.write(errorLog);
    // update broker session status to error
    queueManager.save({ ...session, lastStatus: StatusEnum.error, lastStatusTimestamp: getCurrentTimestamp_UTC() });
  }
}
