module.exports = class Data1707392979676 {
    name = 'Data1707392979676'

    async up(db) {
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "admin" SET NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "name" SET NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "description" SET NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "payment_for_mint" SET NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "royalty" SET NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "collection_logo" SET NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "collection_banner" SET NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "created_at" SET NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "tags" SET NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "admin" DROP NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "name" DROP NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "description" DROP NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "payment_for_mint" DROP NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "royalty" DROP NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "collection_logo" DROP NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "collection_banner" DROP NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "created_at" DROP NOT NULL`)
        await db.query(`ALTER TABLE "collection" ALTER COLUMN "tags" DROP NOT NULL`)
    }
}
