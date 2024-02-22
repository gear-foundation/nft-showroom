module.exports = class Data1708614382580 {
    name = 'Data1708614382580'

    async up(db) {
        await db.query(`ALTER TABLE "marketplace_config" ADD "royalty_to_marketplace_for_mint" integer`)
        await db.query(`ALTER TABLE "marketplace_config" ADD "royalty_to_marketplace_for_trade" integer`)
        await db.query(`ALTER TABLE "marketplace_config" ADD "fee_per_uploaded_file" numeric`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "marketplace_config" DROP COLUMN "royalty_to_marketplace_for_mint"`)
        await db.query(`ALTER TABLE "marketplace_config" DROP COLUMN "royalty_to_marketplace_for_trade"`)
        await db.query(`ALTER TABLE "marketplace_config" DROP COLUMN "fee_per_uploaded_file"`)
    }
}
