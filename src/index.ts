// index.ts
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { Pool, RowDataPacket } from "mysql2/promise";
import pool from "./db";

dotenv.config();
const app = express();

const env = process.env.NODE_ENV ?? "production";

app.set("env", env);

const PORT = process.env.PORT ?? 3000;

app.use(morgan("combined"));

const getAllUsers = async function (pool: Pool): Promise<RowDataPacket[]> {
  const sqlQuery = "SELECT * FROM `user`";
  const [rows] = await pool.query<RowDataPacket[]>(sqlQuery);
  return rows;
};

// Wrapping the async database query function in a regular function
// Goal: avoid returning a Promise from our app.get() callback function;
// instead we return void, which is what app.get() expects.
app.get("/", (_req: Request, res: Response, next: NextFunction) => {
  getAllUsers(pool)
    .then((r: RowDataPacket[]) =>
      res.send(`Welcome, ${r[0].name}, to Express-TypeScript-MariaDB-Docker!`)
    )
    .catch(next); // catch any unhandled rejections
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
