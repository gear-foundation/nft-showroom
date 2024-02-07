module.exports = class Data1707311416201 {
    name = 'Data1707311416201'

    async up(db) {
        await db.query(`ALTER TABLE "marketplace" ADD "address" text NOT NULL default ''`)
        await db.query(`ALTER TABLE "marketplace" ADD "metadata" text NOT NULL default ''`)
        await db.query(`ALTER TABLE "marketplace" ADD "nft_metadata" text NOT NULL default ''`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "marketplace" DROP COLUMN "address"`)
        await db.query(`ALTER TABLE "marketplace" DROP COLUMN "metadata"`)
        await db.query(`ALTER TABLE "marketplace" DROP COLUMN "nft_metadata"`)
    }
}
