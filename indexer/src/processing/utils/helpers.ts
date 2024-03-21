import { ProgramMetadata } from '@gear-js/api';
import { HumanTypesRepr } from '@gear-js/api';
import { Enum, Vec } from '@polkadot/types';
import { Hash } from '@polkadot/types/interfaces';
import { config } from '../../config';

export interface StateReply extends Enum {
  isStorageIds: boolean;
  asStorageIds: Vec<Hash>;
  isName: boolean;
  asName: Text;
  isDescription: boolean;
  asDescription: Text;
}

export async function gearReadStateReq(programId: string, payload: string) {
  const body = {
    id: 1,
    jsonrpc: '2.0',
    method: 'gear_readState',
    params: [programId, payload],
  };

  const response = await fetch(config.node as string, {
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

export async function getCollectionName(
  meta: ProgramMetadata,
  programId: string,
  payload = '0x07',
) {
  console.log(programId, payload);
  const result = await gearReadStateReq(programId, payload);
  const data = meta.createType<StateReply>(
    (meta.types.state as HumanTypesRepr).output as number,
    result,
  );
  if (data.isName) {
    return data.asName.toString();
  }
  throw new Error('Invalid state');
}

export async function getCollectionDescription(
  meta: ProgramMetadata,
  programId: string,
  payload = '0x08',
) {
  const result = await gearReadStateReq(programId, payload);
  const data = meta.createType<StateReply>(
    (meta.types.state as HumanTypesRepr).output as number,
    result,
  );
  if (data.isDescription) {
    return data.asDescription.toString();
  }
  throw new Error('Invalid state');
}
