/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { GearApi, Program, HexString, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';
import {
  TransactionBuilder,
  ActorId,
  throwOnErrorReply,
  getServiceNamePrefix,
  getFnNamePrefix,
  ZERO_ADDRESS,
} from 'sails-js';

export class SailsProgram {
  public readonly registry: TypeRegistry;
  public readonly nft: Nft;
  private _program!: Program;

  constructor(
    public api: GearApi,
    programId?: `0x${string}`,
  ) {
    const types: Record<string, any> = {
      Config: {
        name: 'String',
        description: 'String',
        collection_tags: 'Vec<String>',
        collection_banner: 'String',
        collection_logo: 'String',
        user_mint_limit: 'Option<u32>',
        additional_links: 'Option<AdditionalLinks>',
        royalty: 'u16',
        payment_for_mint: 'u128',
        transferable: 'Option<u64>',
        sellable: 'Option<u64>',
        variable_meta: 'bool',
      },
      AdditionalLinks: {
        external_url: 'Option<String>',
        telegram: 'Option<String>',
        xcom: 'Option<String>',
        medium: 'Option<String>',
        discord: 'Option<String>',
      },
      ImageData: { limit_copies: 'Option<u32>' },
      NftState: {
        tokens: 'Vec<(u64, NftData)>',
        owners: 'Vec<([u8;32], Vec<u64>)>',
        token_approvals: 'Vec<(u64, [u8;32])>',
        config: 'Config',
        nonce: 'u64',
        img_links_and_data: 'Vec<(String, ImageData)>',
        collection_owner: '[u8;32]',
        total_number_of_tokens: 'Option<u64>',
        permission_to_mint: 'Option<Vec<[u8;32]>>',
        marketplace_address: '[u8;32]',
        admins: 'Vec<[u8;32]>',
      },
      NftData: {
        owner: '[u8;32]',
        name: 'String',
        description: 'String',
        metadata: 'Vec<String>',
        media_url: 'String',
        mint_time: 'u64',
      },
      TokenInfo: {
        token_owner: '[u8;32]',
        approval: 'Option<[u8;32]>',
        sellable: 'bool',
        collection_owner: '[u8;32]',
        royalty: 'u16',
      },
    };

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
    if (programId) {
      this._program = new Program(programId, api);
    }

    this.nft = new Nft(this);
  }

  public get programId(): `0x${string}` {
    if (!this._program) throw new Error(`Program ID is not set`);
    return this._program.id;
  }

  newCtorFromCode(
    code: Uint8Array | Buffer | HexString,
    collection_owner: ActorId,
    config: Config,
    img_links_and_data: Array<[string, ImageData]>,
    permission_to_mint: Array<ActorId> | null,
  ): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      ['New', collection_owner, config, img_links_and_data, permission_to_mint],
      '(String, [u8;32], Config, Vec<(String, ImageData)>, Option<Vec<[u8;32]>>)',
      'String',
      code,
      async (programId) => {
        this._program = await Program.new(programId, this.api);
      },
    );
    return builder;
  }

  newCtorFromCodeId(
    codeId: `0x${string}`,
    collection_owner: ActorId,
    config: Config,
    img_links_and_data: Array<[string, ImageData]>,
    permission_to_mint: Array<ActorId> | null,
  ) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      ['New', collection_owner, config, img_links_and_data, permission_to_mint],
      '(String, [u8;32], Config, Vec<(String, ImageData)>, Option<Vec<[u8;32]>>)',
      'String',
      codeId,
      async (programId) => {
        this._program = await Program.new(programId, this.api);
      },
    );
    return builder;
  }
}

export class Nft {
  constructor(private _program: SailsProgram) {}

  public addAdmin(admin: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'AddAdmin', admin],
      '(String, String, [u8;32])',
      'Null',
      this._program.programId,
    );
  }

  public addMetadata(nft_id: number | string | bigint, metadata: string): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'AddMetadata', nft_id, metadata],
      '(String, String, u64, String)',
      'Null',
      this._program.programId,
    );
  }

  public addUsersForMint(users: Array<ActorId>): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'AddUsersForMint', users],
      '(String, String, Vec<[u8;32]>)',
      'Null',
      this._program.programId,
    );
  }

  public approve(to: ActorId, token_id: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'Approve', to, token_id],
      '(String, String, [u8;32], u64)',
      'Null',
      this._program.programId,
    );
  }

  public changeConfig(config: Config): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'ChangeConfig', config],
      '(String, String, Config)',
      'Null',
      this._program.programId,
    );
  }

  public changeImgLink(nft_id: number | string | bigint, img_link: string): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'ChangeImgLink', nft_id, img_link],
      '(String, String, u64, String)',
      'Null',
      this._program.programId,
    );
  }

  public changeMetadata(nft_id: number | string | bigint, metadata: Array<string>): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'ChangeMetadata', nft_id, metadata],
      '(String, String, u64, Vec<String>)',
      'Null',
      this._program.programId,
    );
  }

  public deleteMetadata(nft_id: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'DeleteMetadata', nft_id],
      '(String, String, u64)',
      'Null',
      this._program.programId,
    );
  }

  public deleteUserForMint(user: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'DeleteUserForMint', user],
      '(String, String, [u8;32])',
      'Null',
      this._program.programId,
    );
  }

  public expand(additional_links: Array<[string, ImageData]>): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'Expand', additional_links],
      '(String, String, Vec<(String, ImageData)>)',
      'Null',
      this._program.programId,
    );
  }

  public liftRestrictionsMint(): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'LiftRestrictionsMint'],
      '(String, String)',
      'Null',
      this._program.programId,
    );
  }

  public mint(minter: ActorId, img_link_id: number | string | bigint | null): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'Mint', minter, img_link_id],
      '(String, String, [u8;32], Option<u64>)',
      'Null',
      this._program.programId,
    );
  }

  public removeAdmin(admin: ActorId): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'RemoveAdmin', admin],
      '(String, String, [u8;32])',
      'Null',
      this._program.programId,
    );
  }

  public revokeApprove(token_id: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'RevokeApprove', token_id],
      '(String, String, u64)',
      'Null',
      this._program.programId,
    );
  }

  public transferFrom(from: ActorId, to: ActorId, token_id: number | string | bigint): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['Nft', 'TransferFrom', from, to, token_id],
      '(String, String, [u8;32], [u8;32], u64)',
      'Null',
      this._program.programId,
    );
  }

  public async all(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<NftState> {
    const payload = this._program.registry.createType('(String, String)', ['Nft', 'All']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, NftState)', reply.payload);
    return result[2].toJSON() as unknown as NftState;
  }

  public async canDelete(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<boolean> {
    const payload = this._program.registry.createType('(String, String)', ['Nft', 'CanDelete']).toHex();
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

  public async collectionOwner(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<ActorId> {
    const payload = this._program.registry.createType('(String, String)', ['Nft', 'CollectionOwner']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, [u8;32])', reply.payload);
    return result[2].toJSON() as unknown as ActorId;
  }

  public async config(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Config> {
    const payload = this._program.registry.createType('(String, String)', ['Nft', 'Config']).toHex();
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

  public async description(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<string> {
    const payload = this._program.registry.createType('(String, String)', ['Nft', 'Description']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, String)', reply.payload);
    return result[2].toString() as unknown as string;
  }

  public async getPaymentForMint(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<bigint> {
    const payload = this._program.registry.createType('(String, String)', ['Nft', 'GetPaymentForMint']).toHex();
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

  public async getTokenInfo(
    token_id: number | string | bigint,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<TokenInfo> {
    const payload = this._program.registry
      .createType('(String, String, u64)', ['Nft', 'GetTokenInfo', token_id])
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
    const result = this._program.registry.createType('(String, String, TokenInfo)', reply.payload);
    return result[2].toJSON() as unknown as TokenInfo;
  }

  public async getTokensIdByOwner(
    owner_id: ActorId,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Array<number | string | bigint>> {
    const payload = this._program.registry
      .createType('(String, String, [u8;32])', ['Nft', 'GetTokensIdByOwner', owner_id])
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
    const result = this._program.registry.createType('(String, String, Vec<u64>)', reply.payload);
    return result[2].toJSON() as unknown as Array<number | string | bigint>;
  }

  public async getTokensInfoByOwner(
    owner_id: ActorId,
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Array<NftData>> {
    const payload = this._program.registry
      .createType('(String, String, [u8;32])', ['Nft', 'GetTokensInfoByOwner', owner_id])
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
    const result = this._program.registry.createType('(String, String, Vec<NftData>)', reply.payload);
    return result[2].toJSON() as unknown as Array<NftData>;
  }

  public async imgLinksAndData(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Array<[string, ImageData]>> {
    const payload = this._program.registry.createType('(String, String)', ['Nft', 'ImgLinksAndData']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, Vec<(String, ImageData)>)', reply.payload);
    return result[2].toJSON() as unknown as Array<[string, ImageData]>;
  }

  public async marketplaceAddress(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<ActorId> {
    const payload = this._program.registry.createType('(String, String)', ['Nft', 'MarketplaceAddress']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, [u8;32])', reply.payload);
    return result[2].toJSON() as unknown as ActorId;
  }

  public async name(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<string> {
    const payload = this._program.registry.createType('(String, String)', ['Nft', 'Name']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, String)', reply.payload);
    return result[2].toString() as unknown as string;
  }

  public async nonce(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<bigint> {
    const payload = this._program.registry.createType('(String, String)', ['Nft', 'Nonce']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, u64)', reply.payload);
    return result[2].toBigInt() as unknown as bigint;
  }

  public async permissionToMint(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<Array<ActorId> | null> {
    const payload = this._program.registry.createType('(String, String)', ['Nft', 'PermissionToMint']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, Option<Vec<[u8;32]>>)', reply.payload);
    return result[2].toJSON() as unknown as Array<ActorId> | null;
  }

  public async totalNumberOfTokens(
    originAddress?: string,
    value?: number | string | bigint,
    atBlock?: `0x${string}`,
  ): Promise<number | string | bigint | null> {
    const payload = this._program.registry.createType('(String, String)', ['Nft', 'TotalNumberOfTokens']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock,
    });
    throwOnErrorReply(reply.code, reply.payload.toU8a(), this._program.api.specVersion, this._program.registry);
    const result = this._program.registry.createType('(String, String, Option<u64>)', reply.payload);
    return result[2].toJSON() as unknown as number | string | bigint | null;
  }

  public subscribeToTransferredEvent(
    callback: (data: {
      owner: ActorId;
      recipient: ActorId;
      token_id: number | string | bigint;
    }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'Transferred') {
        callback(
          this._program.registry
            .createType(
              '(String, String, {"owner":"[u8;32]","recipient":"[u8;32]","token_id":"u64"})',
              message.payload,
            )[2]
            .toJSON() as unknown as { owner: ActorId; recipient: ActorId; token_id: number | string | bigint },
        );
      }
    });
  }

  public subscribeToMintedEvent(
    callback: (data: { token_id: number | string | bigint; nft_data: NftData }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'Minted') {
        callback(
          this._program.registry
            .createType('(String, String, {"token_id":"u64","nft_data":"NftData"})', message.payload)[2]
            .toJSON() as unknown as { token_id: number | string | bigint; nft_data: NftData },
        );
      }
    });
  }

  public subscribeToInitializedEvent(
    callback: (data: {
      config: Config;
      total_number_of_tokens: number | string | bigint | null;
      permission_to_mint: Array<ActorId> | null;
    }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'Initialized') {
        callback(
          this._program.registry
            .createType(
              '(String, String, {"config":"Config","total_number_of_tokens":"Option<u64>","permission_to_mint":"Option<Vec<[u8;32]>>"})',
              message.payload,
            )[2]
            .toJSON() as unknown as {
            config: Config;
            total_number_of_tokens: number | string | bigint | null;
            permission_to_mint: Array<ActorId> | null;
          },
        );
      }
    });
  }

  public subscribeToApprovedEvent(
    callback: (data: { to: ActorId; token_id: number | string | bigint }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'Approved') {
        callback(
          this._program.registry
            .createType('(String, String, {"to":"[u8;32]","token_id":"u64"})', message.payload)[2]
            .toJSON() as unknown as { to: ActorId; token_id: number | string | bigint },
        );
      }
    });
  }

  public subscribeToApprovalRevokedEvent(
    callback: (data: { token_id: number | string | bigint }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'ApprovalRevoked') {
        callback(
          this._program.registry
            .createType('(String, String, {"token_id":"u64"})', message.payload)[2]
            .toJSON() as unknown as { token_id: number | string | bigint },
        );
      }
    });
  }

  public subscribeToExpandedEvent(
    callback: (data: {
      additional_links: Array<[string, ImageData]>;
      total_number_of_tokens: number | string | bigint | null;
    }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'Expanded') {
        callback(
          this._program.registry
            .createType(
              '(String, String, {"additional_links":"Vec<(String, ImageData)>","total_number_of_tokens":"Option<u64>"})',
              message.payload,
            )[2]
            .toJSON() as unknown as {
            additional_links: Array<[string, ImageData]>;
            total_number_of_tokens: number | string | bigint | null;
          },
        );
      }
    });
  }

  public subscribeToConfigChangedEvent(
    callback: (data: { config: Config }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'ConfigChanged') {
        callback(
          this._program.registry
            .createType('(String, String, {"config":"Config"})', message.payload)[2]
            .toJSON() as unknown as { config: Config },
        );
      }
    });
  }

  public subscribeToUsersForMintAddedEvent(
    callback: (data: { users: Array<ActorId> }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'UsersForMintAdded') {
        callback(
          this._program.registry
            .createType('(String, String, {"users":"Vec<[u8;32]>"})', message.payload)[2]
            .toJSON() as unknown as { users: Array<ActorId> },
        );
      }
    });
  }

  public subscribeToUserForMintDeletedEvent(
    callback: (data: { user: ActorId }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'UserForMintDeleted') {
        callback(
          this._program.registry
            .createType('(String, String, {"user":"[u8;32]"})', message.payload)[2]
            .toJSON() as unknown as { user: ActorId },
        );
      }
    });
  }

  public subscribeToLiftRestrictionMintEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'LiftRestrictionMint') {
        callback(null);
      }
    });
  }

  public subscribeToAdminAddedEvent(callback: (data: { admin: ActorId }) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'AdminAdded') {
        callback(
          this._program.registry
            .createType('(String, String, {"admin":"[u8;32]"})', message.payload)[2]
            .toJSON() as unknown as { admin: ActorId },
        );
      }
    });
  }

  public subscribeToAdminRemovedEvent(
    callback: (data: { admin: ActorId }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'AdminRemoved') {
        callback(
          this._program.registry
            .createType('(String, String, {"admin":"[u8;32]"})', message.payload)[2]
            .toJSON() as unknown as { admin: ActorId },
        );
      }
    });
  }

  public subscribeToMetadataAddedEvent(
    callback: (data: { nft_id: number | string | bigint; metadata: string }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'MetadataAdded') {
        callback(
          this._program.registry
            .createType('(String, String, {"nft_id":"u64","metadata":"String"})', message.payload)[2]
            .toJSON() as unknown as { nft_id: number | string | bigint; metadata: string },
        );
      }
    });
  }

  public subscribeToImageLinkChangedEvent(
    callback: (data: { nft_id: number | string | bigint; img_link: string }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'ImageLinkChanged') {
        callback(
          this._program.registry
            .createType('(String, String, {"nft_id":"u64","img_link":"String"})', message.payload)[2]
            .toJSON() as unknown as { nft_id: number | string | bigint; img_link: string },
        );
      }
    });
  }

  public subscribeToMetadataChangedEvent(
    callback: (data: { nft_id: number | string | bigint; metadata: Array<string> }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'MetadataChanged') {
        callback(
          this._program.registry
            .createType('(String, String, {"nft_id":"u64","metadata":"Vec<String>"})', message.payload)[2]
            .toJSON() as unknown as { nft_id: number | string | bigint; metadata: Array<string> },
        );
      }
    });
  }

  public subscribeToMetadataDeletedEvent(
    callback: (data: { nft_id: number | string | bigint }) => void | Promise<void>,
  ): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'Nft' && getFnNamePrefix(payload) === 'MetadataDeleted') {
        callback(
          this._program.registry
            .createType('(String, String, {"nft_id":"u64"})', message.payload)[2]
            .toJSON() as unknown as { nft_id: number | string | bigint },
        );
      }
    });
  }
}
