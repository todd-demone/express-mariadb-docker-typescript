// index.ts
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { RowDataPacket } from "mysql2/promise";
import conn from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(morgan("combined"));

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get("/", async (_req: Request, res: Response) => {
  const sqlQuery = "SELECT * FROM `user`";
  const [rows] = await conn.query<RowDataPacket[]>(sqlQuery);
  res.send(
    `Hello, ${rows[0].name}. Welcome to Express-mariadb-docker-typescript!`
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
