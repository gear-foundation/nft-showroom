module.exports = class Data1707479217496 {
    name = 'Data1707479217496'

    async up(db) {
        await db.query(`ALTER TABLE "auction" ADD "end_timestamp" TIMESTAMP WITH TIME ZONE`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "auction" DROP COLUMN "end_timestamp"`)
    }
}
