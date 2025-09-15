import { strict as assert } from 'assert';

export const checkEnv = (envName: string, defaultValue?: string) => {
  const env = process.env[envName] ?? defaultValue;
  if (env) {
    return env;
  }
  assert.notStrictEqual(env, undefined, `${envName} is not specified`);
  return env as string;
};

export const config = {
  node: checkEnv('NODE_URL'),
  nfts: {
    cb: checkEnv(
      'NFT_CB_PROGRAM',
      '0xcefdca25159fd78f5fd09c77628c4fc6fc6b46414b42949b877849decf048a96',
    ),
    vit: checkEnv(
      'NFT_VIT_PROGRAM',
      '0xc0628afe3bdd1653d32601f3c3405316fdc39ac357cdfaef0490de67ecedde7b',
    ),
    draft: checkEnv(
      'NFT_DRAFT_PROGRAM',
      '0x3d3b543237c2eb33ea01a74737bdcdcd43d24909c10d9c949a91a1614447834c',
    ),
    vitMigratedAtBlock: checkEnv('VIT_MIGRATED_AT_BLOCK', '0'),
    cbMigratedAtBlock: checkEnv('CB_MIGRATED_AT_BLOCK', '0'),
    vitMigratedTS: Number(checkEnv('VIT_MIGRATED_TS', '0')),
    cbMigratedTs: Number(checkEnv('CB_MIGRATED_TS', '0')),
    old: checkEnv('NFT_OLD', '').split(','),
  },
  marketplaceProgram: checkEnv('MARKETPLACE_PROGRAM'),
  rateLimit: Number.parseInt(checkEnv('RATE_LIMIT', '100')),
  dnsApiUrl:
    process.env.DNS_API_URL || 'https://dns-explorer.gear.foundation',
  dnsProgramName: process.env.DNS_PROGRAM_NAME || 'nft-showroom.vara.network',
};
