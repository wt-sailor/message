import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from '../config/database';

const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up database...');

    // Read and execute schema
    const schemaPath = join(__dirname, '../../sql/schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    await pool.query(schema);

    console.log('✅ Database schema created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();
