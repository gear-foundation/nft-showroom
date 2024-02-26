module.exports = class Data1708939752324 {
    name = 'Data1708939752324'

    async up(db) {
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_creation" TYPE numeric`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_transfer_token" TYPE numeric`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_close_auction" TYPE numeric`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_delete_collection" TYPE numeric`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_get_token_info" TYPE numeric`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "time_between_create_collections" TYPE numeric`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "marketplace_config" DROP COLUMN "gas_for_creation"`)
        await db.query(`ALTER TABLE "marketplace_config" ADD "gas_for_creation" integer NOT NULL DEFAULT '0'`)
        await db.query(`ALTER TABLE "marketplace_config" DROP COLUMN "gas_for_transfer_token"`)
        await db.query(`ALTER TABLE "marketplace_config" ADD "gas_for_transfer_token" integer NOT NULL DEFAULT '0'`)
        await db.query(`ALTER TABLE "marketplace_config" DROP COLUMN "gas_for_close_auction"`)
        await db.query(`ALTER TABLE "marketplace_config" ADD "gas_for_close_auction" integer NOT NULL DEFAULT '0'`)
        await db.query(`ALTER TABLE "marketplace_config" DROP COLUMN "gas_for_delete_collection"`)
        await db.query(`ALTER TABLE "marketplace_config" ADD "gas_for_delete_collection" integer NOT NULL DEFAULT '0'`)
        await db.query(`ALTER TABLE "marketplace_config" DROP COLUMN "gas_for_get_token_info"`)
        await db.query(`ALTER TABLE "marketplace_config" ADD "gas_for_get_token_info" integer NOT NULL DEFAULT '0'`)
    }
}
