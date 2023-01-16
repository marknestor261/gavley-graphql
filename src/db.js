/**
 * @Author: Mark Okello
 * @Date:   14-01-2023 19:40:07
 * @Last Modified by:   Mark Okello
 * @Last Modified time: 14-01-2023 19:54:20
 */

require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createRfiduidTable = async () => {
    try {
      const queryText = `
        CREATE TABLE IF NOT EXISTS rfiduid (
          id SERIAL PRIMARY KEY,
          userid VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          rfiduid VARCHAR(255) NOT NULL
        );
      `;
      await pool.query(queryText);
      console.log('rfiduid table created');
    } catch (error) {
      console.log(error);
    }
  };

module.exports = { createRfiduidTable }

