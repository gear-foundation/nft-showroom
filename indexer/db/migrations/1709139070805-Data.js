module.exports = class Data1709139070805 {
    name = 'Data1709139070805'

    async up(db) {
        await db.query(`ALTER TABLE "marketplace_config" ADD "max_creator_royalty" integer NOT NULL DEFAULT 0`)
        await db.query(`ALTER TABLE "marketplace_config" ADD "max_number_of_images" numeric NOT NULL DEFAULT 0`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "marketplace_config" DROP COLUMN "max_creator_royalty"`)
        await db.query(`ALTER TABLE "marketplace_config" DROP COLUMN "max_number_of_images"`)
    }
}
