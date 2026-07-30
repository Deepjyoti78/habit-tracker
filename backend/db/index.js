import dotenv from 'dotenv';
dotenv.config();
import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database
const dbPath = path.join(__dirname, 'discipline.sqlite');
const db = new DatabaseSync(dbPath);

// Read and apply schema.sql on startup
try {
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    let schema = fs.readFileSync(schemaPath, 'utf8');
    // Convert PostgreSQL syntax to SQLite syntax
    schema = schema
      .replace(/SERIAL PRIMARY KEY/g, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/TEXT\[\]/g, 'TEXT')
      .replace(/NOW\(\)/gi, "CURRENT_TIMESTAMP");

    // Execute the modified schema to ensure tables exist
    db.exec(schema);
  }
} catch (err) {
  console.error("Error applying schema:", err);
}

// Create a fake pg Pool interface
const pool = {
  query: async (text, params) => {
    return new Promise((resolve, reject) => {
      try {
        // Replace PostgreSQL positional parameters ($1, $2) with SQLite placeholders (?)
        let sql = text.replace(/\$\d+/g, '?');

        // SQLite 3.35+ supports RETURNING clause
        const isSelectOrReturning = sql.trim().toUpperCase().startsWith('SELECT') || sql.toUpperCase().includes('RETURNING');

        // Handle arrays in parameters (PostgreSQL uses arrays, SQLite needs JSON strings)
        const mappedParams = (params || []).map(p => {
          if (Array.isArray(p)) return JSON.stringify(p);
          if (typeof p === 'boolean') return p ? 1 : 0;
          return p;
        });

        const stmt = db.prepare(sql);

        if (isSelectOrReturning) {
          let rows = stmt.all(...mappedParams);
          // Parse JSON arrays for active_days if they exist
          rows = rows.map(r => {
            if (r.active_days && typeof r.active_days === 'string') {
              try { r.active_days = JSON.parse(r.active_days); } catch(e) {}
            }
            // convert SQLite integer booleans back to true/false for frontend consistency
            if (r.reminder !== undefined) r.reminder = Boolean(r.reminder);
            if (r.done !== undefined) r.done = Boolean(r.done);
            if (r.completed !== undefined) r.completed = Boolean(r.completed);
            return r;
          });
          resolve({ rows, rowCount: rows.length });
        } else {
          const info = stmt.run(...mappedParams);
          resolve({ rows: [], rowCount: info.changes, insertId: info.lastInsertRowid });
        }
      } catch (err) {
        reject(err);
      }
    });
  }
};

export default pool;
