const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      pc_number TEXT NOT NULL,
      current_round INTEGER DEFAULT 1,
      total_score INTEGER DEFAULT 0,
      start_time INTEGER,
      completion_time INTEGER,
      total_elapsed_seconds INTEGER DEFAULT 0,
      solved_challenges TEXT DEFAULT '[]',
      active_session INTEGER DEFAULT 1,
      last_active INTEGER
    );

    CREATE TABLE IF NOT EXISTS round_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id INTEGER NOT NULL,
      round_number INTEGER NOT NULL,
      start_time INTEGER,
      end_time INTEGER,
      elapsed_seconds INTEGER
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id INTEGER NOT NULL,
      round_number INTEGER NOT NULL,
      submitted_flag TEXT,
      is_correct INTEGER,
      timestamp INTEGER
    );
  `);
}

module.exports = { db, initDb };
