// import mysql from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// let pool: mysql.Pool;

// const DB_HOST = process.env.DB_HOST;
// const SCREENER_DB_USER = process.env.SCREENER_DB_USER;
// const DB_PASSWORD = process.env.DB_PASSWORD;
// const DB_NAME = process.env.DB_NAME;

// if (!DB_HOST || !SCREENER_DB_USER || !DB_PASSWORD || !DB_NAME) {
//   throw new Error("Missing database environment variables");
// }

// export async function connectToDatabase() {
//   pool = mysql.createPool({
//     host: DB_HOST!,
//     user: SCREENER_DB_USER!,
//     password: DB_PASSWORD!,
//     database: DB_NAME!,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//   });

//   console.log("Connected to database");
// }

// export function getDB() {
//   if (!pool) {
//     throw new Error("Database not connected. Call connectToDatabase first.");
//   }
//   return pool;
// }




// /* 
// Here,
// Real connection happens later when query runs.
// what if i change the number from 0 to another number queueLimit: 0, 

// queueLimit: 0, //When all connections busy:Requests wait in queue. , 0 means Unlimited waiting queue. where the queue is created?

// connectionLimit: 10 -> Only 10 DB operations can happen simultaneously.
// */




import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

let pool: Pool;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable");
}

export async function connectToDatabase() {
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,          // same as connectionLimit
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  // pg doesn't connect until first query, so we test it manually
  const client = await pool.connect();
  client.release();
  console.log("Connected to database");
}

export function getDB() {
  if (!pool) {
    throw new Error("Database not connected. Call connectToDatabase first.");
  }
  return pool;
}