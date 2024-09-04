// index.ts
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { Pool, RowDataPacket } from "mysql2/promise";
import pool from "./db";

dotenv.config();
const PORT = process.env.PORT ?? 3000;

const app = express();

const env = process.env.NODE_ENV ?? "production";
app.set("env", env);

const db = pool;
app.set("db", db);

app.use(morgan("combined"));

const getAllUsers = async function (db: Pool): Promise<RowDataPacket[]> {
  const sqlQuery = "SELECT * FROM `user`";
  const [rows] = await db.query<RowDataPacket[]>(sqlQuery);
  return rows;
};

// Wrapping the async database query function in a regular function. Goal: avoid returning a Promise from our app.get() callback function; Instead we return void, which is what app.get() expects.
app.get("/", (_req: Request, res: Response, next: NextFunction) => {
  getAllUsers(db)
    .then((r: RowDataPacket[]) =>
      res.send(`Welcome, ${r[0].name}, to Express-TypeScript-MariaDB-Docker!`)
    )
    .catch(next); // send rejection to the error handling middleware
});

const errorHandler = function (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  res.status(500).send("Error: Internal Server Error");
};

if (env === "production") {
  app.use(errorHandler);
}

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
