#!/usr/bin/env node
// scripts/migrate.js
// Runs all SQL migration files in order against DATABASE_URL.
// Usage: node scripts/migrate.js
// In CI: DATABASE_URL is injected as a secret.

require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set');
  process.exit(1);
}

const migrationsDir = path.join(__dirname);
const sqlFiles = fs
  .readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

console.log(`Running ${sqlFiles.length} migration(s)...`);

for (const file of sqlFiles) {
  const filePath = path.join(migrationsDir, file);
  console.log(`  → ${file}`);
  try {
    execSync(`psql "${DATABASE_URL}" -f "${filePath}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`FAILED on ${file}`);
    process.exit(1);
  }
}

console.log('Migrations complete.');
