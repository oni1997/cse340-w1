const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get vehicle by ID
 * ************************** */
async function getVehicleById(invId) {
  try {
    const data = await pool.query(
      'SELECT * FROM inventory WHERE inv_id = $1',
      [invId]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getVehicleById error " + error)
    throw error
  }
}

module.exports = {
  getClassifications,
  getVehicleById
}