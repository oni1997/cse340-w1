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

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const result = await pool.query(sql, [classification_name])
    return result.rowCount > 0
  } catch (error) {
    console.error("addClassification error: " + error)
    return false
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(
  classification_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color
) {
  try {
    const sql = `
      INSERT INTO inventory (
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    
    const result = await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    ])
    
    return result.rowCount > 0
  } catch (error) {
    console.error("addInventory error: " + error)
    return false
  }
}

/* ***************************
 *  Get classification by name
 * ************************** */
async function getClassificationByName(classification_name) {
  try {
    const data = await pool.query(
      "SELECT * FROM classification WHERE classification_name = $1",
      [classification_name]
    )
    return data.rows
  } catch (error) {
    console.error("getClassificationByName error: " + error)
    throw error
  }
}

// Make sure to export all functions
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  getClassificationById,
  addClassification,
  addInventory,
  getClassificationByName
}
