import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT!;
export const ENV = process.env.ENV!;
export const POSTGRES_HOST = process.env.POSTGRES_HOST!;
export const POSTGRES_USER = process.env.POSTGRES_USER!;
export const POSTGRES_DB = process.env.POSTGRES_DB!;
export const POSTGRES_DB_TEST = process.env.POSTGRES_DB_TEST!;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD!;
export const SALT_ROUND = process.env.SALT_ROUND!;
export const SECRET_TOKEN = process.env.SECRET_TOKEN!;
