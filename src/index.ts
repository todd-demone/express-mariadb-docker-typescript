// index.ts
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { Pool, RowDataPacket } from "mysql2/promise";
import pool from "./db";

dotenv.config();
const PORT = process.env.PORT ?? 3000;

const app = express();

app.set(
  "env",
  process.env.NODE_ENV === "production" ? "production" : "development"
);

app.set("db", pool);

app.use(morgan("combined"));

const getAllUsers = async function (req: Request): Promise<RowDataPacket[]> {
  const sqlQuery = "SELECT * FROM `user`";
  const db = req.app.get("db") as Pool;
  const [rows] = await db.query<RowDataPacket[]>(sqlQuery);
  return rows;
};

// Wrapping the async database query function in a regular function. Goal: avoid returning a Promise from our app.get() callback function; Instead we return void, which is what app.get() expects.
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  getAllUsers(req)
    .then((r: RowDataPacket[]) =>
      res.send(`Welcome, ${r[0].name}, to Express-TypeScript-MariaDB-Docker!`)
    )
    .catch(next); // send rejection to the error handling middleware
});

const errorHandler = function (
  _err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  res.status(500).send("Error: Internal Server Error");
};

if (app.get("env") === "production") {
  app.use(errorHandler);
}

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
