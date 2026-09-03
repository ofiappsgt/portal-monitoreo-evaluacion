import 'dotenv/config';
import { pool } from './db.js';
try {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (id VARCHAR(255) PRIMARY KEY, nombre VARCHAR(255) NOT NULL, role VARCHAR(100) NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  console.log('Migración completada.');
} finally { await pool.end(); }
