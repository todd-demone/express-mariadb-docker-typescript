import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { RowDataPacket } from 'mysql2/promise';
import conn from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req: Request, res: Response) => {
    const [rows, fields] = await conn.query<RowDataPacket[]>('SELECT * FROM `user`');
    res.send(`Hello, ${rows[0].name}. Welcome to Express-mariadb-docker-typescript!`);
  });

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});