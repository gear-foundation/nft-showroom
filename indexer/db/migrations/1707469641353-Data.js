module.exports = class Data1707469641353 {
    name = 'Data1707469641353'

    async up(db) {
        await db.query(`ALTER TABLE "collection" DROP COLUMN "transferable"`)
        await db.query(`ALTER TABLE "collection" ADD "transferable" numeric`)
        await db.query(`ALTER TABLE "collection" DROP COLUMN "sellable"`)
        await db.query(`ALTER TABLE "collection" ADD "sellable" numeric`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "collection" ADD "transferable" boolean`)
        await db.query(`ALTER TABLE "collection" DROP COLUMN "transferable"`)
        await db.query(`ALTER TABLE "collection" ADD "sellable" boolean`)
        await db.query(`ALTER TABLE "collection" DROP COLUMN "sellable"`)
    }
}
