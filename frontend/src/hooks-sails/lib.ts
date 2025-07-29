/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { GearApi, Program, HexString, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';
import { TransactionBuilder, throwOnErrorReply, getServiceNamePrefix, getFnNamePrefix, ZERO_ADDRESS } from 'sails-js';

export class SailsProgram {
  public readonly registry: TypeRegistry;
  public readonly nftShowroom: NftShowroom;
  private _program!: Program;

  constructor(
    public api: GearApi,
    programId?: `0x${string}`,
  ) {
    const types: Record<string, any> = {
      Config: {
        gas_for_creation: 'u64',
        gas_for_mint: 'u64',
        gas_for_transfer_token: 'u64',
        gas_for_close_auction: 'u64',
        gas_for_delete_collection: 'u64',
        gas_for_get_info: 'u64',
        time_between_create_collections: 'u64',
        royalty_to_marketplace_for_trade: 'u16',
        royalty_to_marketplace_for_mint: 'u16',
        ms_in_block: 'u32',
        fee_per_uploaded_file: 'u128',
        max_creator_royalty: 'u16',
        max_number_of_images: 'u64',
      },
      Offer: { collection_address: '[u8;32]', token_id: 'u64', creator: '[u8;32]' },
      StorageState: {
        admins: 'Vec<[u8;32]>',
        collection_to_owner: 'Vec<([u8;32], (String, [u8;32]))>',
        time_creation: 'Vec<([u8;32], u64)>',
        type_collections: 'Vec<(String, TypeCollectionInfo)>',
        sales: 'Vec<(([u8;32], u64), NftInfoForSale)>',
        auctions: 'Vec<(([u8;32], u64), Auction)>',
        offers: 'Vec<(Offer, u128)>',
        config: 'Config',
        minimum_value_for_trade: 'u128',
        allow_message: 'bool',
        allow_create_collection: 'bool',
      },
      TypeCollectionInfo: {
        code_id: '[u8;32]',
        idl_link: 'String',
        type_description: 'String',
        allow_create: 'bool',
      },
      NftInfoForSale: { price: 'u128', token_owner: '[u8;32]', collection_owner: '[u8;32]', royalty: 'u16' },
      Auction: {
        owner: '[u8;32]',
        started_at: 'u64',
        ended_at: 'u64',
        current_price: 'u128',
        current_winner: '[u8;32]',
        collection_owner: '[u8;32]',
        royalty: 'u16',
      },
      CollectionInfo: { owner: '[u8;32]', type_name: 'String', idl_link: 'String' },
    };

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
    if (programId) {
      this._program = new Program(programId, api);
    }

    this.nftShowroom = new NftShowroom(this);
  }

  public get programId(): `0x${string}` {
    if (!this._program) throw new Error(`Program ID is not set`);
    return this._program.id;
  }

  newCtorFromCode(code: Uint8Array | Buffer | HexString, config: Config): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      ['New', config],
      '(String, Config)',
      'String',
      code,
      async (programId) => {
        this._program = await Program.new(programId, this.api);
      },
    );
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`, config: Config) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      ['New', config],
      '(String, Config)',
      'String',
      codeId,
      async (programId) => {
        this._program = await Program.new(programId, this.api);
      },
    );
    return builder;
  }
}

export class NftShowroom {
  constructor(private _program: SailsProgram) {}

  public acceptOffer(offer: Offer): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'AcceptOffer', offer],
      '(String, String, Offer)',
      'Null',
      this._program.programId,
    );
  }

  public addAdmins(users: Array<ActorId>): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'AddAdmins', users],
      '(String, String, Vec<[u8;32]>)',
      'Null',
      this._program.programId,
    );
  }

  public addBid(collection_address: ActorId, token_id: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'AddBid', collection_address, token_id],
      '(String, String, [u8;32], u64)',
      'Null',
      this._program.programId,
    );
  }

  public addExternalCollection(collection_address: ActorId, type_name: string): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'AddExternalCollection', collection_address, type_name],
      '(String, String, [u8;32], String)',
      'Null',
      this._program.programId,
    );
  }

  public addNewCollection(
    code_id: CodeId,
    idl_link: string,
    type_name: string,
    type_description: string,
    allow_create: boolean,
  ): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'AddNewCollection', code_id, idl_link, type_name, type_description, allow_create],
      '(String, String, [u8;32], String, String, String, bool)',
      'Null',
      this._program.programId,
    );
  }

  public allowCreateCollection(allow: boolean): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'AllowCreateCollection', allow],
      '(String, String, bool)',
      'Null',
      this._program.programId,
    );
  }

  public allowMessage(allow: boolean): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'AllowMessage', allow],
      '(String, String, bool)',
      'Null',
      this._program.programId,
    );
  }

  public balanceOut(): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'BalanceOut'],
      '(String, String)',
      'Null',
      this._program.programId,
    );
  }

  public buy(collection_address: ActorId, token_id: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'Buy', collection_address, token_id],
      '(String, String, [u8;32], u64)',
      'Null',
      this._program.programId,
    );
  }

  public cancelAuction(collection_address: ActorId, token_id: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'CancelAuction', collection_address, token_id],
      '(String, String, [u8;32], u64)',
      'Null',
      this._program.programId,
    );
  }

  public cancelOffer(collection_address: ActorId, token_id: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'CancelOffer', collection_address, token_id],
      '(String, String, [u8;32], u64)',
      'Null',
      this._program.programId,
    );
  }

  public cancelSale(collection_address: ActorId, token_id: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'CancelSale', collection_address, token_id],
      '(String, String, [u8;32], u64)',
      'Null',
      this._program.programId,
    );
  }

  public closeAuction(collection_address: ActorId, token_id: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'CloseAuction', collection_address, token_id],
      '(String, String, [u8;32], u64)',
      'Null',
      this._program.programId,
    );
  }

  public createAuction(
    collection_address: ActorId,
    token_id: number | string | bigint,
    min_price: number | string | bigint,
    duration: number,
  ): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'CreateAuction', collection_address, token_id, min_price, duration],
      '(String, String, [u8;32], u64, u128, u32)',
      'Null',
      this._program.programId,
    );
  }

  public createCollection(type_name: string, payload: `0x${string}`): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'CreateCollection', type_name, payload],
      '(String, String, String, Vec<u8>)',
      'Null',
      this._program.programId,
    );
  }

  public createOffer(collection_address: ActorId, token_id: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'CreateOffer', collection_address, token_id],
      '(String, String, [u8;32], u64)',
      'Null',
      this._program.programId,
    );
  }

  public deleteAdmin(user: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'DeleteAdmin', user],
      '(String, String, [u8;32])',
      'Null',
      this._program.programId,
    );
  }

  public deleteCollection(collection_address: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'DeleteCollection', collection_address],
      '(String, String, [u8;32])',
      'Null',
      this._program.programId,
    );
  }

  public deleteCollectionType(type_name: string): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'DeleteCollectionType', type_name],
      '(String, String, String)',
      'Null',
      this._program.programId,
    );
  }

  public mint(collection_address: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'Mint', collection_address],
      '(String, String, [u8;32])',
      'Null',
      this._program.programId,
    );
  }

  public sell(
    collection_address: ActorId,
    token_id: number | string | bigint,
    price: number | string | bigint,
  ): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['NftShowroom', 'Sell', collection_address, token_id, price],
      '(String, String, [u8;32], u64, u128)',
      'Null',
      this._program.programId,
    );
  }

  public updateConfig(
    gas_for_creation: number | string | bigint | null,
    gas_for_mint: number | string | bigint | null,
    gas_for_transfer_token: number | string | bigint | null,
    gas_for_close_auction: number | string | bigint | null,
    gas_for_delete_collection: number | string | bigint | null,
    gas_for_get_info: number | string | bigint | null,
    time_between_create_collections: number | string | bigint | null,
    royalty_to_marketplace_for_trade: number | null,
    royalty_to_marketplace_for_mint: number | null,
    ms_in_block: number | null,
    fee_per_uploaded_file: number | string | bigint | null,
    max_creator_royalty: number | null,
    max_number_of_images: number | string | bigint | null,
  ): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      [
        'NftShowroom',
        'UpdateConfig',
        gas_for_creation,
        gas_for_mint,
        gas_for_transfer_token,
        gas_for_close_auction,
        gas_for_delete_collection,
        gas_for_get_info,
        time_between_create_collections,
        royalty_to_marketplace_for_trade,
        royalty_to_marketplace_for_mint,
        ms_in_block,
        fee_per_uploaded_file,
        max_creator_royalty,
        max_number_of_images,
      ],
      '(String, String, Option<u64>, Option<u64>, Option<u64>, Option<u64>, Option<u64>, Option<u64>, Option<u64>, Option<u16>, Option<u16>, Option<u32>, Option<u128>, Option<u16>, Option<u64>)',
      'Null',
      this._program.programId,
    );
  }

  public async all(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<StorageState> {
    const payload = this._program.registry.createType('(String, String)', ['NftShowroom', 'All']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, StorageState)', reply.payload);
    return result[2].toJSON() as unknown as StorageState;
  }

  public async getAdmins(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Array<ActorId>> {
    const payload = this._program.registry.createType('(String, String)', ['NftShowroom', 'GetAdmins']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, Vec<[u8;32]>)', reply.payload);
    return result[2].toJSON() as unknown as Array<ActorId>;
  }

  public async getAllCollections(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Array<[ActorId, [string, ActorId]]>> {
    const payload = this._program.registry.createType('(String, String)', ['NftShowroom', 'GetAllCollections']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType(
      '(String, String, Vec<([u8;32], (String, [u8;32]))>)',
      reply.payload,
    );
    return result[2].toJSON() as unknown as Array<[ActorId, [string, ActorId]]>;
  }

  public async getAllowCreateCollection(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<boolean> {
    const payload = this._program.registry
      .createType('(String, String)', ['NftShowroom', 'GetAllowCreateCollection'])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, bool)', reply.payload);
    return result[2].toJSON() as unknown as boolean;
  }

  public async getAllowMessage(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<boolean> {
    const payload = this._program.registry.createType('(String, String)', ['NftShowroom', 'GetAllowMessage']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, bool)', reply.payload);
    return result[2].toJSON() as unknown as boolean;
  }

  public async getCollectionInfo(
    collection_address: ActorId,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<CollectionInfo | null> {
    const payload = this._program.registry
      .createType('(String, String, [u8;32])', ['NftShowroom', 'GetCollectionInfo', collection_address])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, Option<CollectionInfo>)', reply.payload);
    return result[2].toJSON() as unknown as CollectionInfo | null;
  }

  public async getCollectionsInfo(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Array<[string, TypeCollectionInfo]>> {
    const payload = this._program.registry
      .createType('(String, String)', ['NftShowroom', 'GetCollectionsInfo'])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType(
      '(String, String, Vec<(String, TypeCollectionInfo)>)',
      reply.payload,
    );
    return result[2].toJSON() as unknown as Array<[string, TypeCollectionInfo]>;
  }

  public async getConfig(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Config> {
    const payload = this._program.registry.createType('(String, String)', ['NftShowroom', 'GetConfig']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, Config)', reply.payload);
    return result[2].toJSON() as unknown as Config;
  }

  public async getMinimumValueForTrade(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<bigint> {
    const payload = this._program.registry
      .createType('(String, String)', ['NftShowroom', 'GetMinimumValueForTrade'])
      .toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, u128)', reply.payload);
    return result[2].toBigInt() as unknown as bigint;
  }

  public subscribeToInitializedEvent(
    callback: (data: {
      time_between_create_collections: number | string | bigint;
      royalty_to_marketplace_for_trade: number;
      royalty_to_marketplace_for_mint: number;
      minimum_value_for_trade: number | string | bigint;
      fee_per_uploaded_file: number | string | bigint;
      max_creator_royalty: number;
      max_number_of_images: number | string | bigint;
    }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'Initialized') {
        callback(
          this._program.registry
            .createType(
              '(String, String, {"time_between_create_collections":"u64","royalty_to_marketplace_for_trade":"u16","royalty_to_marketplace_for_mint":"u16","minimum_value_for_trade":"u128","fee_per_uploaded_file":"u128","max_creator_royalty":"u16","max_number_of_images":"u64"})',
              message.payload,
            )[2]
            .toJSON() as unknown as {
            time_between_create_collections: number | string | bigint;
            royalty_to_marketplace_for_trade: number;
            royalty_to_marketplace_for_mint: number;
            minimum_value_for_trade: number | string | bigint;
            fee_per_uploaded_file: number | string | bigint;
            max_creator_royalty: number;
            max_number_of_images: number | string | bigint;
          },
        );
      }
    });
  }

  public subscribeToNewCollectionAddedEvent(
    callback: (data: {
      code_id: CodeId;
      idl_link: string;
      type_name: string;
      type_description: string;
    }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'NewCollectionAdded') {
        callback(
          this._program.registry
            .createType(
              '(String, String, {"code_id":"[u8;32]","idl_link":"String","type_name":"String","type_description":"String"})',
              message.payload,
            )[2]
            .toJSON() as unknown as {
            code_id: CodeId;
            idl_link: string;
            type_name: string;
            type_description: string;
          },
        );
      }
    });
  }

  public subscribeToCollectionCreatedEvent(
    callback: (data: { type_name: string; collection_address: ActorId }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'CollectionCreated') {
        callback(
          this._program.registry
            .createType('(String, String, {"type_name":"String","collection_address":"[u8;32]"})', message.payload)[2]
            .toJSON() as unknown as {
            type_name: string;
            collection_address: ActorId;
          },
        );
      }
    });
  }

  public subscribeToMintedEvent(
    callback: (data: { collection_address: ActorId; minter: ActorId }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'Minted') {
        callback(
          this._program.registry
            .createType('(String, String, {"collection_address":"[u8;32]","minter":"[u8;32]"})', message.payload)[2]
            .toJSON() as unknown as {
            collection_address: ActorId;
            minter: ActorId;
          },
        );
      }
    });
  }

  public subscribeToSaleNftEvent(
    callback: (data: {
      collection_address: ActorId;
      token_id: number | string | bigint;
      price: number | string | bigint;
      owner: ActorId;
    }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'SaleNft') {
        callback(
          this._program.registry
            .createType(
              '(String, String, {"collection_address":"[u8;32]","token_id":"u64","price":"u128","owner":"[u8;32]"})',
              message.payload,
            )[2]
            .toJSON() as unknown as {
            collection_address: ActorId;
            token_id: number | string | bigint;
            price: number | string | bigint;
            owner: ActorId;
          },
        );
      }
    });
  }

  public subscribeToSaleNftCanceledEvent(
    callback: (data: { collection_address: ActorId; token_id: number | string | bigint }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'SaleNftCanceled') {
        callback(
          this._program.registry
            .createType('(String, String, {"collection_address":"[u8;32]","token_id":"u64"})', message.payload)[2]
            .toJSON() as unknown as {
            collection_address: ActorId;
            token_id: number | string | bigint;
          },
        );
      }
    });
  }

  public subscribeToNftSoldEvent(
    callback: (data: {
      collection_address: ActorId;
      token_id: number | string | bigint;
      price: number | string | bigint;
      current_owner: ActorId;
    }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'NftSold') {
        callback(
          this._program.registry
            .createType(
              '(String, String, {"collection_address":"[u8;32]","token_id":"u64","price":"u128","current_owner":"[u8;32]"})',
              message.payload,
            )[2]
            .toJSON() as unknown as {
            collection_address: ActorId;
            token_id: number | string | bigint;
            price: number | string | bigint;
            current_owner: ActorId;
          },
        );
      }
    });
  }

  public subscribeToAuctionCreatedEvent(
    callback: (data: {
      collection_address: ActorId;
      token_id: number | string | bigint;
      min_price: number | string | bigint;
      duration_ms: number;
    }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'AuctionCreated') {
        callback(
          this._program.registry
            .createType(
              '(String, String, {"collection_address":"[u8;32]","token_id":"u64","min_price":"u128","duration_ms":"u32"})',
              message.payload,
            )[2]
            .toJSON() as unknown as {
            collection_address: ActorId;
            token_id: number | string | bigint;
            min_price: number | string | bigint;
            duration_ms: number;
          },
        );
      }
    });
  }

  public subscribeToAuctionClosedEvent(
    callback: (data: {
      collection_address: ActorId;
      token_id: number | string | bigint;
      price: number | string | bigint;
      current_owner: ActorId;
    }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'AuctionClosed') {
        callback(
          this._program.registry
            .createType(
              '(String, String, {"collection_address":"[u8;32]","token_id":"u64","price":"u128","current_owner":"[u8;32]"})',
              message.payload,
            )[2]
            .toJSON() as unknown as {
            collection_address: ActorId;
            token_id: number | string | bigint;
            price: number | string | bigint;
            current_owner: ActorId;
          },
        );
      }
    });
  }

  public subscribeToBidAddedEvent(
    callback: (data: {
      collection_address: ActorId;
      token_id: number | string | bigint;
      current_price: number | string | bigint;
    }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'BidAdded') {
        callback(
          this._program.registry
            .createType(
              '(String, String, {"collection_address":"[u8;32]","token_id":"u64","current_price":"u128"})',
              message.payload,
            )[2]
            .toJSON() as unknown as {
            collection_address: ActorId;
            token_id: number | string | bigint;
            current_price: number | string | bigint;
          },
        );
      }
    });
  }

  public subscribeToAuctionCanceledEvent(
    callback: (data: { collection_address: ActorId; token_id: number | string | bigint }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'AuctionCanceled') {
        callback(
          this._program.registry
            .createType('(String, String, {"collection_address":"[u8;32]","token_id":"u64"})', message.payload)[2]
            .toJSON() as unknown as {
            collection_address: ActorId;
            token_id: number | string | bigint;
          },
        );
      }
    });
  }

  public subscribeToOfferCreatedEvent(
    callback: (data: {
      collection_address: ActorId;
      token_id: number | string | bigint;
      price: number | string | bigint;
    }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'OfferCreated') {
        callback(
          this._program.registry
            .createType(
              '(String, String, {"collection_address":"[u8;32]","token_id":"u64","price":"u128"})',
              message.payload,
            )[2]
            .toJSON() as unknown as {
            collection_address: ActorId;
            token_id: number | string | bigint;
            price: number | string | bigint;
          },
        );
      }
    });
  }

  public subscribeToOfferCanceledEvent(
    callback: (data: { collection_address: ActorId; token_id: number | string | bigint }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'OfferCanceled') {
        callback(
          this._program.registry
            .createType('(String, String, {"collection_address":"[u8;32]","token_id":"u64"})', message.payload)[2]
            .toJSON() as unknown as {
            collection_address: ActorId;
            token_id: number | string | bigint;
          },
        );
      }
    });
  }

  public subscribeToOfferAcceptedEvent(
    callback: (data: { offer: Offer }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'OfferAccepted') {
        callback(
          this._program.registry
            .createType('(String, String, {"offer":"Offer"})', message.payload)[2]
            .toJSON() as unknown as {
            offer: Offer;
          },
        );
      }
    });
  }

  public subscribeToCollectionDeletedEvent(
    callback: (data: { collection_address: ActorId }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'CollectionDeleted') {
        callback(
          this._program.registry
            .createType('(String, String, {"collection_address":"[u8;32]"})', message.payload)[2]
            .toJSON() as unknown as {
            collection_address: ActorId;
          },
        );
      }
    });
  }

  public subscribeToAdminsAddedEvent(
    callback: (data: { users: Array<ActorId> }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'AdminsAdded') {
        callback(
          this._program.registry
            .createType('(String, String, {"users":"Vec<[u8;32]>"})', message.payload)[2]
            .toJSON() as unknown as {
            users: Array<ActorId>;
          },
        );
      }
    });
  }

  public subscribeToAdminDeletedEvent(
    callback: (data: { user: ActorId }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'AdminDeleted') {
        callback(
          this._program.registry
            .createType('(String, String, {"user":"[u8;32]"})', message.payload)[2]
            .toJSON() as unknown as {
            user: ActorId;
          },
        );
      }
    });
  }

  public subscribeToConfigUpdatedEvent(
    callback: (data: {
      gas_for_creation: number | string | bigint | null;
      gas_for_mint: number | string | bigint | null;
      gas_for_transfer_token: number | string | bigint | null;
      gas_for_close_auction: number | string | bigint | null;
      gas_for_delete_collection: number | string | bigint | null;
      gas_for_get_info: number | string | bigint | null;
      time_between_create_collections: number | string | bigint | null;
      royalty_to_marketplace_for_trade: number | null;
      royalty_to_marketplace_for_mint: number | null;
      ms_in_block: number | null;
      minimum_value_for_trade: number | string | bigint | null;
      fee_per_uploaded_file: number | string | bigint | null;
      max_creator_royalty: number | null;
      max_number_of_images: number | string | bigint | null;
    }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'ConfigUpdated') {
        const configUpdatedType =
          '(String, String, {"gas_for_creation":"Option<u64>","gas_for_mint":"Option<u64>","gas_for_transfer_token":"Option<u64>","gas_for_close_auction":"Option<u64>","gas_for_delete_collection":"Option<u64>","gas_for_get_info":"Option<u64>","time_between_create_collections":"Option<u64>","royalty_to_marketplace_for_trade":"Option<u16>","royalty_to_marketplace_for_mint":"Option<u16>","ms_in_block":"Option<u32>","minimum_value_for_trade":"Option<u128>","fee_per_uploaded_file":"Option<u128>","max_creator_royalty":"Option<u16>","max_number_of_images":"Option<u64>"})';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (this._program.registry as any).createType(configUpdatedType, message.payload)[2].toJSON();
        callback(result);
      }
    });
  }

  public subscribeToBalanceHasBeenWithdrawnEvent(
    callback: (data: { value: number | string | bigint }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'BalanceHasBeenWithdrawn') {
        callback(
          this._program.registry
            .createType('(String, String, {"value":"u128"})', message.payload)[2]
            .toJSON() as unknown as {
            value: number | string | bigint;
          },
        );
      }
    });
  }

  public subscribeToValueSentEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'ValueSent') {
        callback(null);
      }
    });
  }

  public subscribeToAllowMessageChangedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'AllowMessageChanged') {
        callback(null);
      }
    });
  }

  public subscribeToAllowCreateCollectionChangedEvent(
    callback: (data: null) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (
        getServiceNamePrefix(payload) === 'NftShowroom' &&
        getFnNamePrefix(payload) === 'AllowCreateCollectionChanged'
      ) {
        callback(null);
      }
    });
  }

  public subscribeToCollectionTypeDeletedEvent(
    callback: (data: { type_name: string }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'NftShowroom' && getFnNamePrefix(payload) === 'CollectionTypeDeleted') {
        callback(
          this._program.registry
            .createType('(String, String, {"type_name":"String"})', message.payload)[2]
            .toJSON() as unknown as {
            type_name: string;
          },
        );
      }
    });
  }
}
