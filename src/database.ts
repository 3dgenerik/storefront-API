import { Pool } from 'pg';
import {
    ENV,
    POSTGRES_DB,
    POSTGRES_DB_TEST,
    POSTGRES_HOST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
} from './config';

let client: Pool = new Pool({});

if (ENV === 'dev') {
    client = new Pool({
        host: POSTGRES_HOST,
        user: POSTGRES_USER,
        database: POSTGRES_DB,
        password: POSTGRES_PASSWORD,
    });
}

if (ENV === 'test') {
    client = new Pool({
        host: POSTGRES_HOST,
        user: POSTGRES_USER,
        database: POSTGRES_DB_TEST,
        password: POSTGRES_PASSWORD,
    });
}

export default client;
