// @ts-nocheck
import { ActorId, TransactionBuilder, getServiceNamePrefix, getFnNamePrefix, ZERO_ADDRESS } from 'sails-js';
import { GearApi, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';

export interface ContractInfo {
  admins: Array<ActorId>;
  program_id: ActorId;
  registration_time: string;
}

export class Program {
  public readonly registry: TypeRegistry;
  public readonly dns: Dns;

  constructor(public api: GearApi, public programId?: `0x${string}`) {
    const types: Record<string, any> = {
      ContractInfo: {"admins":"Vec<[u8;32]>","program_id":"[u8;32]","registration_time":"String"},
    }

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.dns = new Dns(this);
  }

  newCtorFromCode(code: Uint8Array | Buffer): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      'New',
      'String',
      'String',
      code,
    );

    this.programId = builder.programId;
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      'New',
      'String',
      'String',
      codeId,
    );

    this.programId = builder.programId;
    return builder;
  }
}

export class Dns {
  constructor(private _program: Program) {}

  public addAdminToProgram(name: string, new_admin: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Dns', 'AddAdminToProgram', name, new_admin],
      '(String, String, String, [u8;32])',
      'Null',
      this._program.programId
    );
  }

  public addNewProgram(name: string, program_id: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Dns', 'AddNewProgram', name, program_id],
      '(String, String, String, [u8;32])',
      'Null',
      this._program.programId
    );
  }

  public changeProgramId(name: string, new_program_id: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Dns', 'ChangeProgramId', name, new_program_id],
      '(String, String, String, [u8;32])',
      'Null',
      this._program.programId
    );
  }

  public deleteMe(): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Dns', 'DeleteMe'],
      '(String, String)',
      'Null',
      this._program.programId
    );
  }

  public deleteProgram(name: string): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Dns', 'DeleteProgram', name],
      '(String, String, String)',
      'Null',
      this._program.programId
    );
  }

  public removeAdminFromProgram(name: string, admin_to_remove: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Dns', 'RemoveAdminFromProgram', name, admin_to_remove],
      '(String, String, String, [u8;32])',
      'Null',
      this._program.programId
    );
  }

  public async allContracts(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<Array<[string, ContractInfo]>> {
    const payload = this._program.registry.createType('(String, String)', ['Dns', 'AllContracts']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Vec<(String, ContractInfo)>)', reply.payload);
    return result[2].toJSON() as unknown as Array<[string, ContractInfo]>;
  }

  public async getAllAddresses(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<Array<ActorId>> {
    const payload = this._program.registry.createType('(String, String)', ['Dns', 'GetAllAddresses']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Vec<[u8;32]>)', reply.payload);
    return result[2].toJSON() as unknown as Array<ActorId>;
  }

  public async getAllNames(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<Array<string>> {
    const payload = this._program.registry.createType('(String, String)', ['Dns', 'GetAllNames']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Vec<String>)', reply.payload);
    return result[2].toJSON() as unknown as Array<string>;
  }

  public async getContractInfoByName(name: string, originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<ContractInfo | null> {
    const payload = this._program.registry.createType('(String, String, String)', ['Dns', 'GetContractInfoByName', name]).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Option<ContractInfo>)', reply.payload);
    return result[2].toJSON() as unknown as ContractInfo | null;
  }

  public async getNameByProgramId(program_id: ActorId, originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<string | null> {
    const payload = this._program.registry.createType('(String, String, [u8;32])', ['Dns', 'GetNameByProgramId', program_id]).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Option<String>)', reply.payload);
    return result[2].toJSON() as unknown as string | null;
  }

  public subscribeToNewProgramAddedEvent(callback: (data: { name: string; contract_info: ContractInfo }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Dns' && getFnNamePrefix(payload) === 'NewProgramAdded') {
        callback(this._program.registry.createType('(String, String, {"name":"String","contract_info":"ContractInfo"})', message.payload)[2].toJSON() as unknown as { name: string; contract_info: ContractInfo });
      }
    });
  }

  public subscribeToProgramIdChangedEvent(callback: (data: { name: string; contract_info: ContractInfo }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Dns' && getFnNamePrefix(payload) === 'ProgramIdChanged') {
        callback(this._program.registry.createType('(String, String, {"name":"String","contract_info":"ContractInfo"})', message.payload)[2].toJSON() as unknown as { name: string; contract_info: ContractInfo });
      }
    });
  }

  public subscribeToProgramDeletedEvent(callback: (data: { name: string }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Dns' && getFnNamePrefix(payload) === 'ProgramDeleted') {
        callback(this._program.registry.createType('(String, String, {"name":"String"})', message.payload)[2].toJSON() as unknown as { name: string });
      }
    });
  }

  public subscribeToAdminAddedEvent(callback: (data: { name: string; contract_info: ContractInfo }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Dns' && getFnNamePrefix(payload) === 'AdminAdded') {
        callback(this._program.registry.createType('(String, String, {"name":"String","contract_info":"ContractInfo"})', message.payload)[2].toJSON() as unknown as { name: string; contract_info: ContractInfo });
      }
    });
  }

  public subscribeToAdminRemovedEvent(callback: (data: { name: string; contract_info: ContractInfo }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Dns' && getFnNamePrefix(payload) === 'AdminRemoved') {
        callback(this._program.registry.createType('(String, String, {"name":"String","contract_info":"ContractInfo"})', message.payload)[2].toJSON() as unknown as { name: string; contract_info: ContractInfo });
      }
    });
  }
}