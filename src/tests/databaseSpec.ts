import { PoolClient } from 'pg';
import client from '../database';

describe('Testing connecting to PostgreSQL database:', () => {
    let conn: PoolClient;
    beforeAll(async () => {
        conn = await client.connect();
    });

    it('Should connect to database', async () => {
        try {
            const result = await conn.query('SELECT 1');
            expect(result).toBeTruthy();
        } catch (err) {
            fail(err);
        }
    });

    afterAll(async () => {
        conn.release();
    });
});
