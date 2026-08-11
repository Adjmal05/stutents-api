import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "drims",
  password: process.env.DB_PASSWORD || "Adjmal@2007",
  database: process.env.DB_NAME || "students_api",
});

pool.on("error", (err) => {
  console.error("Erreur inattendue sur le pool PostgreSQL", err);
});
