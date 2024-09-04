// index.ts
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { RowDataPacket } from "mysql2/promise";
import conn from "./db";

dotenv.config();
const app = express();

const env = process.env.NODE_ENV ?? "production";

app.set("env", env);

const PORT = process.env.PORT ?? 3000;

app.use(morgan("combined"));

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  const sqlQuery = "SELECT * FROM `user`";
  try {
    const [rows] = await conn.query<RowDataPacket[]>(sqlQuery);
    res.send(
      `Hello, ${rows[0].name}. Welcome to Express-mariadb-docker-typescript!`
    );
  } catch (err) {
    next(err);
  }
});

if (env === "production") {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).send("Error: Internal Server Error");
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
