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

const asyncGetAllUsers = async function (pool: Pool): Promise<RowDataPacket[]> {
  // removed try-catch here to avoid redundancy (two places - here and error middleware);
  // instead of dealing with errors here, I delegated
  // error handling to the wrapper callback function in app.get()
  // (using async/await's `.catch` method - i.e., `.catch(next)`)
  // and my errorHandler middleware
  const sqlQuery = "SELECT * FROM `user`";
  const [rows] = await pool.query<RowDataPacket[]>(sqlQuery);
  return rows;
};

// Wrapping the async handler in a regular function
// Goal: avoid returning a Promise from our async/await function;
// instead we return void, which is what app.get() expects.
app.get("/", (_req: Request, res: Response, next: NextFunction) => {
  // If there are any unhandled promise rejections after calling this async function, they are caught and passed to next().
  asyncGetAllUsers(pool)
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
