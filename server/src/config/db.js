const mongoose = require('mongoose');
const knex = require('knex');

let pgDb = null;

/**
 * Connect to MongoDB using Mongoose.
 * @returns {Promise<void>}
 */
const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/aptitudepro?authSource=admin';
    await mongoose.connect(uri);
    console.log('✅ MongoDB Connected (Tests, Results)');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    // Don't exit — let server start and retry via Mongoose reconnection logic
  }
};

/**
 * Connect to PostgreSQL using Knex.
 * @returns {Object} Knex instance
 */
const connectPostgres = () => {
  pgDb = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI || 'postgres://admin:password@localhost:5432/aptitudepro',
  });

  pgDb.raw('SELECT 1')
    .then(() => {
      console.log('✅ PostgreSQL Connected (Users, CMS, Logs)');
    })
    .catch(err => {
      console.error('❌ PostgreSQL Connection Error:', err.message);
    });

  return pgDb;
};

/**
 * Get the Knex (PostgreSQL) instance.
 * @returns {Object} Knex instance
 */
const getPgDb = () => pgDb;

module.exports = { connectMongoDB, connectPostgres, getPgDb };
