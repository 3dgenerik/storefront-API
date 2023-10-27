import { IUser } from '../interface';
import client from '../database';
import bcrypt from 'bcrypt';
import { SALT_ROUND } from '../config';

export class UsersStore {
    private readonly SQL_GET_ALL_USERS = 'SELECT * FROM users_table';
    private readonly SQL_SHOW_USER_BY_ID =
        'SELECT * FROM users_table WHERE id = ($1)';
    private readonly SQL_CREATE_USER =
        'INSERT INTO users_table (first_name, last_name, password) VALUES($1, $2, $3) RETURNING *';
    private readonly SQL_AUTH_USER =
        'SELECT * FROM users_table WHERE first_name = $1 AND last_name = $2';
    private readonly SQL_DELETE_USER =
        'DELETE FROM users_table WHERE id = ($1) RETURNING *';

    private async passwordHash(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, Number(SALT_ROUND));
        return hash;
    }

    private async passwordHashCompare(
        password: string,
        hash: string,
    ): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    }

    async getAllUsers(): Promise<IUser[]> {
        const conn = await client.connect();
        const sql = this.SQL_GET_ALL_USERS;
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

    private async userExistById(id: number): Promise<boolean> {
        const allUsers = await this.getAllUsers();
        for (const user of allUsers) {
            if (user.id === id) return true;
        }
        return false;
    }

    async showUserById(id: number): Promise<IUser | null> {
        if (!(await this.userExistById(id))) return null;

        const conn = await client.connect();
        const sql = this.SQL_SHOW_USER_BY_ID;
        const result = await conn.query(sql, [id]);
        conn.release();
        return result.rows[0];
    }

    async createUser(user: IUser): Promise<IUser | null> {
        if (await this.userExist(user)) {
            return null;
        }
        const conn = await client.connect();
        const hash = await this.passwordHash(user.password);
        const sql = this.SQL_CREATE_USER;
        const result = await conn.query(sql, [
            user.first_name,
            user.last_name,
            hash,
        ]);
        conn.release();
        return result.rows[0];
    }

    async authUser(user: IUser): Promise<IUser | null> {
        if (!(await this.userExist(user))) return null;

        const conn = await client.connect();
        const sql = this.SQL_AUTH_USER;
        const result = await conn.query(sql, [user.first_name, user.last_name]);
        conn.release();

        const dbUser = result.rows[0] as IUser;

        if (!(await this.passwordHashCompare(user.password, dbUser.password)))
            return null;

        return dbUser;
    }

    async deleteUserById(id: number): Promise<IUser | null> {
        if (!(await this.userExistById(id))) return null;

        const conn = await client.connect();
        const sql = this.SQL_DELETE_USER;
        const result = await conn.query(sql, [id]);
        conn.release();
        return result.rows[0];
    }
}
