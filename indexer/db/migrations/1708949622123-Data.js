module.exports = class Data1708949622123 {
    name = 'Data1708949622123'

    async up(db) {
        await db.query(`ALTER TABLE "marketplace_config" ADD "minimum_value_for_trade" numeric NOT NULL DEFAULT 0`)
        await db.query(`ALTER TABLE "marketplace_config" ADD "minimum_value_for_mint" numeric NOT NULL DEFAULT 0`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "marketplace_config" DROP COLUMN "minimum_value_for_trade"`)
        await db.query(`ALTER TABLE "marketplace_config" DROP COLUMN "minimum_value_for_mint"`)
    }
}
