module.exports = class Data1707389319792 {
    name = 'Data1707389319792'

    async up(db) {
        await db.query(`ALTER TABLE "collection" ADD "additional_links" text`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "collection" DROP COLUMN "additional_links"`)
    }
}
