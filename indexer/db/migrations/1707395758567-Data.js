module.exports = class Data1707395758567 {
    name = 'Data1707395758567'

    async up(db) {
        await db.query(`ALTER TABLE "collection" DROP COLUMN "additional_links"`)
        await db.query(`ALTER TABLE "collection" ADD "additional_links" jsonb`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "collection" ADD "additional_links" text`)
        await db.query(`ALTER TABLE "collection" DROP COLUMN "additional_links"`)
    }
}
