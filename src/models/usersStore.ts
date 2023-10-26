import { IUser } from '../interface';
import client from '../database';
import bcrypt from 'bcrypt';
import { SALT_ROUND } from '../config';

export class UsersStore {
    async passwordHash(password: string):Promise<string> {
        const hash = await bcrypt.hash(password, Number(SALT_ROUND))
        return hash
    }

    async getAllUsers(): Promise<IUser[]> {
        const conn = await client.connect();
        const sql = 'SELECT * FROM users_table';
        const result = await conn.query(sql);
        conn.release();
        return result.rows;
    }

    async createUser(user: IUser):Promise<IUser>{
        const conn = await client.connect();
        const sql = 'INSERT INTO users_table (firstName, lastName, password) VALUES($1, $2, $3)';
        const result = await conn.query(sql, [user.firstName, user.lastName, ])
    }
}
