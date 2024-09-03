// import mysql from 'mysql2/promise';
import mysql, { ConnectionOptions, RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();


const access: ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const conn = mysql.createConnection(access);
console.log("SUCCESS!!!!!!");
// SELECT
conn.query<RowDataPacket[]>('SELECT * FROM `user`;', (_err, rows) => {
    console.log(rows);
    /**
     * @rows: [ { test: 2 } ]
     */
  });

export default conn;