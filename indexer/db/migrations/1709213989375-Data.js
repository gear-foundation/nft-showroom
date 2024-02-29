module.exports = class Data1709213989375 {
    name = 'Data1709213989375'

    async up(db) {
        await db.query(`CREATE TABLE "marketplace_config" ("id" character varying NOT NULL, "gas_for_creation" numeric NOT NULL, "gas_for_transfer_token" numeric NOT NULL, "gas_for_close_auction" numeric NOT NULL, "gas_for_delete_collection" numeric NOT NULL, "gas_for_get_token_info" numeric NOT NULL, "time_between_create_collections" numeric NOT NULL, "royalty_to_marketplace_for_mint" integer NOT NULL, "royalty_to_marketplace_for_trade" integer NOT NULL, "fee_per_uploaded_file" numeric NOT NULL, "minimum_transfer_value" numeric NOT NULL, "minimum_value_for_trade" numeric NOT NULL, "minimum_value_for_mint" numeric NOT NULL, "ms_in_block" integer NOT NULL, "max_creator_royalty" integer NOT NULL, "max_number_of_images" numeric NOT NULL, "marketplace_id" character varying, CONSTRAINT "PK_73c68d1a502db50c13ff91f8ec3" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_49bd93aa35746a6971bb299ce3" ON "marketplace_config" ("marketplace_id") `)
        await db.query(`CREATE TABLE "collection_type" ("id" character varying NOT NULL, "description" text NOT NULL, "type" text NOT NULL, "meta_url" text NOT NULL, "meta_str" text NOT NULL, "marketplace_id" character varying, CONSTRAINT "PK_75c673f46e25c52205fae22130c" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_be423ee528eb245b57165bd597" ON "collection_type" ("marketplace_id") `)
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "tx_hash" text NOT NULL, "nft_id" character varying, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_52fc453ba5ff660f331db4b359" ON "transfer" ("nft_id") `)
        await db.query(`CREATE TABLE "sale" ("id" character varying NOT NULL, "owner" text NOT NULL, "new_owner" text, "price" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "status" text NOT NULL, "nft_id" character varying, CONSTRAINT "PK_d03891c457cbcd22974732b5de2" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_8524438f82167bcb795bcb8663" ON "sale" ("nft_id") `)
        await db.query(`CREATE TABLE "bid" ("id" character varying NOT NULL, "bidder" text NOT NULL, "price" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "auction_id" character varying, CONSTRAINT "PK_ed405dda320051aca2dcb1a50bb" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_9e594e5a61c0f3cb25679f6ba8" ON "bid" ("auction_id") `)
        await db.query(`CREATE TABLE "auction" ("id" character varying NOT NULL, "owner" text NOT NULL, "min_price" numeric NOT NULL, "new_owner" text, "last_price" numeric, "status" text NOT NULL, "duration_ms" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "end_timestamp" TIMESTAMP WITH TIME ZONE, "block_number" integer NOT NULL, "nft_id" character varying, CONSTRAINT "PK_9dc876c629273e71646cf6dfa67" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_cfb47e97e60c9d1462576f85a8" ON "auction" ("nft_id") `)
        await db.query(`CREATE TABLE "offer" ("id" character varying NOT NULL, "owner" text NOT NULL, "price" numeric NOT NULL, "status" text NOT NULL, "creator" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "nft_id" character varying, CONSTRAINT "PK_57c6ae1abe49201919ef68de900" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_71609884f4478ed41be6672a66" ON "offer" ("nft_id") `)
        await db.query(`CREATE TABLE "nft" ("id" character varying NOT NULL, "owner" text NOT NULL, "name" text NOT NULL, "minted_by" text NOT NULL, "description" text NOT NULL, "id_in_collection" integer NOT NULL, "media_url" text NOT NULL, "approved_account" text, "metadata" text, "on_sale" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "collection_id" character varying, CONSTRAINT "PK_8f46897c58e23b0e7bf6c8e56b0" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ffe58aa05707db77c2f20ecdbc" ON "nft" ("collection_id") `)
        await db.query(`CREATE TABLE "collection" ("id" character varying NOT NULL, "admin" text NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "additional_links" jsonb, "user_mint_limit" numeric, "tokens_limit" numeric, "payment_for_mint" numeric NOT NULL, "royalty" integer NOT NULL, "collection_logo" text NOT NULL, "collection_banner" text NOT NULL, "transferable" numeric, "approvable" boolean, "burnable" boolean, "sellable" numeric, "attendable" boolean, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "tags" text array NOT NULL, "permission_to_mint" text array, "marketplace_id" character varying, "type_id" character varying, CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_4698f01445e4833a95f214f862" ON "collection" ("marketplace_id") `)
        await db.query(`CREATE INDEX "IDX_75c673f46e25c52205fae22130" ON "collection" ("type_id") `)
        await db.query(`CREATE TABLE "marketplace_event" ("id" character varying NOT NULL, "type" text NOT NULL, "raw" text NOT NULL, "block_number" integer NOT NULL, "tx_hash" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "marketplace_id" character varying, CONSTRAINT "PK_805265912d311b94048601bd286" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_7fb5589ddd0a773530e3b05af0" ON "marketplace_event" ("marketplace_id") `)
        await db.query(`CREATE TABLE "marketplace" ("id" character varying NOT NULL, "admins" text array NOT NULL, "address" text NOT NULL, "metadata" text NOT NULL, "nft_metadata" text NOT NULL, "config_id" character varying, CONSTRAINT "PK_d9c9a956a1a45b27b56db53bfc8" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_73c68d1a502db50c13ff91f8ec" ON "marketplace" ("config_id") `)
        await db.query(`ALTER TABLE "marketplace_config" ADD CONSTRAINT "FK_49bd93aa35746a6971bb299ce37" FOREIGN KEY ("marketplace_id") REFERENCES "marketplace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "collection_type" ADD CONSTRAINT "FK_be423ee528eb245b57165bd597b" FOREIGN KEY ("marketplace_id") REFERENCES "marketplace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_52fc453ba5ff660f331db4b3591" FOREIGN KEY ("nft_id") REFERENCES "nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "sale" ADD CONSTRAINT "FK_8524438f82167bcb795bcb86637" FOREIGN KEY ("nft_id") REFERENCES "nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "bid" ADD CONSTRAINT "FK_9e594e5a61c0f3cb25679f6ba8d" FOREIGN KEY ("auction_id") REFERENCES "auction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "auction" ADD CONSTRAINT "FK_cfb47e97e60c9d1462576f85a88" FOREIGN KEY ("nft_id") REFERENCES "nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_71609884f4478ed41be6672a668" FOREIGN KEY ("nft_id") REFERENCES "nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "nft" ADD CONSTRAINT "FK_ffe58aa05707db77c2f20ecdbc3" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_4698f01445e4833a95f214f862b" FOREIGN KEY ("marketplace_id") REFERENCES "marketplace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_75c673f46e25c52205fae22130c" FOREIGN KEY ("type_id") REFERENCES "collection_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "marketplace_event" ADD CONSTRAINT "FK_7fb5589ddd0a773530e3b05af08" FOREIGN KEY ("marketplace_id") REFERENCES "marketplace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "marketplace" ADD CONSTRAINT "FK_73c68d1a502db50c13ff91f8ec3" FOREIGN KEY ("config_id") REFERENCES "marketplace_config"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "marketplace_config"`)
        await db.query(`DROP INDEX "public"."IDX_49bd93aa35746a6971bb299ce3"`)
        await db.query(`DROP TABLE "collection_type"`)
        await db.query(`DROP INDEX "public"."IDX_be423ee528eb245b57165bd597"`)
        await db.query(`DROP TABLE "transfer"`)
        await db.query(`DROP INDEX "public"."IDX_52fc453ba5ff660f331db4b359"`)
        await db.query(`DROP TABLE "sale"`)
        await db.query(`DROP INDEX "public"."IDX_8524438f82167bcb795bcb8663"`)
        await db.query(`DROP TABLE "bid"`)
        await db.query(`DROP INDEX "public"."IDX_9e594e5a61c0f3cb25679f6ba8"`)
        await db.query(`DROP TABLE "auction"`)
        await db.query(`DROP INDEX "public"."IDX_cfb47e97e60c9d1462576f85a8"`)
        await db.query(`DROP TABLE "offer"`)
        await db.query(`DROP INDEX "public"."IDX_71609884f4478ed41be6672a66"`)
        await db.query(`DROP TABLE "nft"`)
        await db.query(`DROP INDEX "public"."IDX_ffe58aa05707db77c2f20ecdbc"`)
        await db.query(`DROP TABLE "collection"`)
        await db.query(`DROP INDEX "public"."IDX_4698f01445e4833a95f214f862"`)
        await db.query(`DROP INDEX "public"."IDX_75c673f46e25c52205fae22130"`)
        await db.query(`DROP TABLE "marketplace_event"`)
        await db.query(`DROP INDEX "public"."IDX_7fb5589ddd0a773530e3b05af0"`)
        await db.query(`DROP TABLE "marketplace"`)
        await db.query(`DROP INDEX "public"."IDX_73c68d1a502db50c13ff91f8ec"`)
        await db.query(`ALTER TABLE "marketplace_config" DROP CONSTRAINT "FK_49bd93aa35746a6971bb299ce37"`)
        await db.query(`ALTER TABLE "collection_type" DROP CONSTRAINT "FK_be423ee528eb245b57165bd597b"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_52fc453ba5ff660f331db4b3591"`)
        await db.query(`ALTER TABLE "sale" DROP CONSTRAINT "FK_8524438f82167bcb795bcb86637"`)
        await db.query(`ALTER TABLE "bid" DROP CONSTRAINT "FK_9e594e5a61c0f3cb25679f6ba8d"`)
        await db.query(`ALTER TABLE "auction" DROP CONSTRAINT "FK_cfb47e97e60c9d1462576f85a88"`)
        await db.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_71609884f4478ed41be6672a668"`)
        await db.query(`ALTER TABLE "nft" DROP CONSTRAINT "FK_ffe58aa05707db77c2f20ecdbc3"`)
        await db.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_4698f01445e4833a95f214f862b"`)
        await db.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_75c673f46e25c52205fae22130c"`)
        await db.query(`ALTER TABLE "marketplace_event" DROP CONSTRAINT "FK_7fb5589ddd0a773530e3b05af08"`)
        await db.query(`ALTER TABLE "marketplace" DROP CONSTRAINT "FK_73c68d1a502db50c13ff91f8ec3"`)
    }
}