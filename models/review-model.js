const pool = require("../database")

/* *****************************
*   Add new review
* *************************** */
async function addReview(inv_id, account_id, review_title, review_text, review_rating) {
  try {
    const sql = "INSERT INTO reviews (inv_id, account_id, review_title, review_text, review_rating) VALUES ($1, $2, $3, $4, $5) RETURNING *"
    return await pool.query(sql, [inv_id, account_id, review_title, review_text, review_rating])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Get reviews by vehicle ID
* *************************** */
async function getReviewsByVehicleId(inv_id) {
  try {
    const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
                 FROM reviews r 
                 JOIN account a ON r.account_id = a.account_id 
                 WHERE r.inv_id = $1 
                 ORDER BY r.review_date DESC`
    return await pool.query(sql, [inv_id])
  } catch (error) {
    console.error("getReviewsByVehicleId error: " + error)
  }
}

/* *****************************
*   Get reviews by account ID
* *************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `SELECT r.*, i.inv_make, i.inv_model, i.inv_year 
                 FROM reviews r 
                 JOIN inventory i ON r.inv_id = i.inv_id 
                 WHERE r.account_id = $1 
                 ORDER BY r.review_date DESC`
    return await pool.query(sql, [account_id])
  } catch (error) {
    console.error("getReviewsByAccountId error: " + error)
  }
}

/* *****************************
*   Get average rating for vehicle
* *************************** */
async function getAverageRating(inv_id) {
  try {
    const sql = "SELECT AVG(review_rating)::NUMERIC(3,2) as avg_rating, COUNT(*) as review_count FROM reviews WHERE inv_id = $1"
    return await pool.query(sql, [inv_id])
  } catch (error) {
    console.error("getAverageRating error: " + error)
  }
}

/* *****************************
*   Check if user already reviewed vehicle
* *************************** */
async function checkExistingReview(inv_id, account_id) {
  try {
    const sql = "SELECT * FROM reviews WHERE inv_id = $1 AND account_id = $2"
    const review = await pool.query(sql, [inv_id, account_id])
    return review.rowCount
  } catch (error) {
    console.error("checkExistingReview error: " + error)
  }
}

/* *****************************
*   Update existing review
* *************************** */
async function updateReview(review_id, review_title, review_text, review_rating) {
  try {
    const sql = "UPDATE reviews SET review_title = $1, review_text = $2, review_rating = $3 WHERE review_id = $4 RETURNING *"
    return await pool.query(sql, [review_title, review_text, review_rating, review_id])
  } catch (error) {
    console.error("updateReview error: " + error)
  }
}

/* *****************************
*   Get review by ID
* *************************** */
async function getReviewById(review_id) {
  try {
    const sql = "SELECT * FROM reviews WHERE review_id = $1"
    return await pool.query(sql, [review_id])
  } catch (error) {
    console.error("getReviewById error: " + error)
  }
}

/* *****************************
*   Delete review
* *************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM reviews WHERE review_id = $1"
    return await pool.query(sql, [review_id])
  } catch (error) {
    console.error("deleteReview error: " + error)
  }
}

module.exports = {
  addReview,
  getReviewsByVehicleId,
  getReviewsByAccountId,
  getAverageRating,
  checkExistingReview,
  updateReview,
  getReviewById,
  deleteReview
}
