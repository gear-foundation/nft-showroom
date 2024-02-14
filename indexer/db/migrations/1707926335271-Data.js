module.exports = class Data1707926335271 {
    name = 'Data1707926335271'

    async up(db) {
        await db.query(`ALTER TABLE "nft" ADD "minted_by" text NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "nft" DROP COLUMN "minted_by"`)
    }
}
