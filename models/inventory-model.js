const pool = require("../database")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    const data = await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
    return data
  } catch (error) {
    console.error("getClassifications error: " + error)
    throw error
  }
}

/* ***************************
 *  Get all inventory items by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1
      ORDER BY i.inv_id ASC`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error)
    throw error
  }
}

/* ***************************
 *  Get classification by ID
 * ************************** */
async function getClassificationById(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification WHERE classification_id = $1",
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getClassificationById error: " + error)
    throw error
  }
}

/* ***************************
 *  Get vehicle by ID
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getVehicleById error: " + error)
    throw error
  }
}

// Make sure to export all functions
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getClassificationById,
  getVehicleById,
}