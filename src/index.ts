import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { RowDataPacket } from 'mysql2/promise';
import conn from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req: Request, res: Response) => {
    try {
        const [rows] = await conn.query<RowDataPacket[]>('SELECT * FROM `user`');
        res.send(`Hello, ${rows[0].name}. Welcome to Express-mariadb-docker-typescript!`);
    } catch (err) {
        console.log("ERROR: ", err);
    }
  });

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});