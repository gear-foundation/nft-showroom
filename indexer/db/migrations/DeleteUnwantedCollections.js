export class DeleteUnwantedCollections202509150001 {
    name = 'DeleteUnwantedCollections202509150001'

    async up(db) {
        const ids = [
            '0xd47e3bad711edfdc12c5a8df7619189caef7418c05082d3938ff5feee584adb8',
            '0x4a59dc1d0353552ecca98631db9bf09ed4c0da513a785ca655735f3d5d7366a0',
            '0xdc9faf20e1987a2a4195e92019d9ac36d1acf699387e28a6f373d15c6a1e00a8',
            '0x25c44d74c34364ef32721ca248545d5a186beaf127691fa71238dde7c9994fe5',
            '0x55baa2d14fd1380c7b6c55a73697c77af8a354071984239866d6767cf4bfcb5a',
            '0x7403af2bd1f80c556008ad51b6f627781266d574d57bc19a662949c3418c6173',
            '0x54ee6109a8e8b72d3c254b10002640aa398ce2e020bafdcbdf909064735360a4',
            '0xd2626b1974dc891fbaaa5a0c7f04fa3051ba25f98fe9a3a676c247c9667851d8'
        ];

        console.log('Deleting unwanted collections...');
        
        await db.query(`DELETE FROM bid WHERE auction_id IN (
            SELECT a.id FROM auction a 
            JOIN nft n ON a.nft_id = n.id 
            WHERE n.collection_id = ANY($1)
        )`, [ids]);

        await db.query(`DELETE FROM auction WHERE nft_id IN (
            SELECT id FROM nft WHERE collection_id = ANY($1)
        )`, [ids]);

        await db.query(`DELETE FROM offer WHERE nft_id IN (
            SELECT id FROM nft WHERE collection_id = ANY($1)
        )`, [ids]);

        await db.query(`DELETE FROM sale WHERE nft_id IN (
            SELECT id FROM nft WHERE collection_id = ANY($1)
        )`, [ids]);

        await db.query(`DELETE FROM transfer WHERE nft_id IN (
            SELECT id FROM nft WHERE collection_id = ANY($1)
        )`, [ids]);

        await db.query(`DELETE FROM nft WHERE collection_id = ANY($1)`, [ids]);
        await db.query(`DELETE FROM collection WHERE id = ANY($1)`, [ids]);
        
        console.log('Collections deleted successfully');
    }

    async down(db) {
        console.log('This migration cannot be reverted');
    }
}
