import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { RowDataPacket } from 'mysql2/promise';
import conn from './db';

dotenv.config();

const app = express(); 
const PORT = process.env.PORT || 3000;

app.use(morgan("combined"));

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [rows] = await conn.query<RowDataPacket[]>('SELECT * FROM `user`');
        res.send(`Hello, ${rows[0].name}. Welcome to Express-mariadb-docker-typescript!`);
        console.log("DONE")
    } catch (err) {
        next(err);
    }
  });

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});