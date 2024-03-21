import { config } from '../config';

export function getDate(ts: string) {
  const date = new Date(Number(ts));
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date
    .getDate()
    .toString()
    .padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

export async function gearReadStateReq(programId: string, payload: string) {
  const body = {
    id: 1,
    jsonrpc: '2.0',
    method: 'gear_readState',
    params: [programId, payload],
  };

  const response = await fetch(config.node, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (json.result) {
    return json.result;
  } else {
    console.log(json.error);
    throw new Error(json.error);
  }
}

export async function gearReadStateBatchReq(
  programIds: string[],
  payload: string,
) {
  const body = {
    id: 1,
    jsonrpc: '2.0',
    method: 'gear_readStateBatch',
    params: [programIds.map((programId) => [programId, payload])],
  };

  const response = await fetch(config.node, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (json.result) {
    return json.result;
  } else {
    console.log(json.error);
    throw new Error(json.error);
  }
}
