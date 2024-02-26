module.exports = class Data1708938587449 {
    name = 'Data1708938587449'

    async up(db) {
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_creation" TYPE int USING (COALESCE("gas_for_creation", 0)), ALTER COLUMN "gas_for_creation" SET DEFAULT 0, ALTER COLUMN "gas_for_creation" SET NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_transfer_token" TYPE int USING (COALESCE("gas_for_transfer_token", 0)), ALTER COLUMN "gas_for_transfer_token" SET DEFAULT 0, ALTER COLUMN "gas_for_transfer_token" SET NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_close_auction" TYPE int USING (COALESCE("gas_for_close_auction", 0)), ALTER COLUMN "gas_for_close_auction" SET DEFAULT 0, ALTER COLUMN "gas_for_close_auction" SET NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_delete_collection" TYPE int USING (COALESCE("gas_for_delete_collection", 0)), ALTER COLUMN "gas_for_delete_collection" SET DEFAULT 0, ALTER COLUMN "gas_for_delete_collection" SET NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_get_token_info" TYPE int USING (COALESCE("gas_for_get_token_info", 0)), ALTER COLUMN "gas_for_get_token_info" SET DEFAULT 0, ALTER COLUMN "gas_for_get_token_info" SET NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "time_between_create_collections" TYPE int USING (COALESCE("time_between_create_collections", 0)), ALTER COLUMN "time_between_create_collections" SET DEFAULT 0, ALTER COLUMN "time_between_create_collections" SET NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "royalty_to_marketplace_for_mint" TYPE int USING (COALESCE("royalty_to_marketplace_for_mint", 0)), ALTER COLUMN "royalty_to_marketplace_for_mint" SET DEFAULT 0, ALTER COLUMN "royalty_to_marketplace_for_mint" SET NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "royalty_to_marketplace_for_trade" TYPE int USING (COALESCE("royalty_to_marketplace_for_trade", 0)), ALTER COLUMN "royalty_to_marketplace_for_trade" SET DEFAULT 0, ALTER COLUMN "royalty_to_marketplace_for_trade" SET NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "fee_per_uploaded_file" TYPE numeric USING (COALESCE("fee_per_uploaded_file", 0)), ALTER COLUMN "fee_per_uploaded_file" SET DEFAULT 0, ALTER COLUMN "fee_per_uploaded_file" SET NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "minimum_transfer_value" TYPE numeric USING (COALESCE("minimum_transfer_value", 0)), ALTER COLUMN "minimum_transfer_value" SET DEFAULT 0, ALTER COLUMN "minimum_transfer_value" SET NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "ms_in_block" TYPE int USING (COALESCE("ms_in_block", 0)), ALTER COLUMN "ms_in_block" SET DEFAULT 0, ALTER COLUMN "ms_in_block" SET NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_creation" DROP NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_transfer_token" DROP NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_close_auction" DROP NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_delete_collection" DROP NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "gas_for_get_token_info" DROP NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "time_between_create_collections" DROP NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "royalty_to_marketplace_for_mint" DROP NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "royalty_to_marketplace_for_trade" DROP NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "fee_per_uploaded_file" DROP NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "minimum_transfer_value" DROP NOT NULL`)
        await db.query(`ALTER TABLE "marketplace_config" ALTER COLUMN "ms_in_block" DROP NOT NULL`)
    }
}
