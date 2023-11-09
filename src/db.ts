import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({
    user: process.env.user,
    host: process.env.host,
    database: 'web2_lab1_63uh',
    password: process.env.password,
    port: 5432,
    ssl : true
})

export async function userInfo(username: string, password: string){
    const result = await pool.query("select * from lab2 where username = '" + username + "' and password = '" + password + "'");
    return result.rows;
}

export async function userInfoSafe(username: string, password: string){
    const result = await pool.query("select * from lab2 where username = $1 and password = $2", [username, password]);
    return result.rows;
}