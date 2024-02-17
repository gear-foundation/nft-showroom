module.exports = class Data1708174915413 {
    name = 'Data1708174915413'

    async up(db) {
        await db.query(`ALTER TABLE "collection" ADD "permission_to_mint" text array`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "collection" DROP COLUMN "permission_to_mint"`)
    }
}
