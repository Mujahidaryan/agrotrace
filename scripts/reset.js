#!/usr/bin/env node
// scripts/reset.js
// Drops and recreates the public schema, then runs migrate + seed.
// DANGER: destroys all data. Only for dev/staging environments.
// Guards against accidental production use.

require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set');
  process.exit(1);
}

// Refuse to run against Railway production URL pattern without explicit override
if (DATABASE_URL.includes('railway.app') && !process.env.ALLOW_PRODUCTION_RESET) {
  console.error('ERROR: Refusing to reset a railway.app database.');
  console.error('Set ALLOW_PRODUCTION_RESET=true to override (do not do this in production).');
  process.exit(1);
}

console.log('Resetting database schema...');
execSync(`psql "${DATABASE_URL}" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"`, { stdio: 'inherit' });
console.log('Running migrations...');
execSync(`node ${path.join(__dirname, 'migrate.js')}`, { stdio: 'inherit' });
console.log('Seeding...');
execSync(`node ${path.join(__dirname, 'seed.js')}`, { stdio: 'inherit' });
console.log('\n✓ Reset complete.');
