import { IUser } from '../interface';
import client from '../database';
import bcrypt from 'bcrypt';
import { SALT_ROUND } from '../config';

export class UsersStore {
    private async passwordHash(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, Number(SALT_ROUND));
        return hash;
    }

    async getAllUsers(): Promise<IUser[]> {
        const conn = await client.connect();
        const sql = 'SELECT * FROM users_table';
        const result = await conn.query(sql);
        conn.release();
        return result.rows;
    }

    private async userExist(newUser: IUser): Promise<boolean> {
        const allUsers = await this.getAllUsers();
        for (const user of allUsers) {
            if (
                user.first_name === newUser.first_name &&
                user.last_name === newUser.last_name
            ) {
                return true;
            }
        }
        return false;
    }

    async createUser(user: IUser): Promise<IUser | null> {
        if (await this.userExist(user)) {
            return null;
        }
        const conn = await client.connect();
        const hash = await this.passwordHash(user.password);
        const sql =
            'INSERT INTO users_table (first_name, last_name, password) VALUES($1, $2, $3) RETURNING *';
        const result = await conn.query(sql, [
            user.first_name,
            user.last_name,
            hash,
        ]);
        conn.release();
        return result.rows[0];
    }
}
