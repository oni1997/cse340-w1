const fs = require('fs')
const path = require('path')
require('dotenv').config()
const { Pool } = require("pg")

/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If app is in production, let use the default SSL
 *************** */
let pool
if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params)
        return res
      } catch (error) {
        throw error
      }
    },
    async rebuildDatabase() {
      try {
        const sqlPath = path.join(__dirname, 'database_rebuild.sql')
        const sql = fs.readFileSync(sqlPath, 'utf8')
        await pool.query(sql)
        // console.log("Database rebuild script executed successfully.")
      } catch (err) {
        console.error("Error running database rebuild script:", err)
      }
    }
  }
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
}

module.exports = pool