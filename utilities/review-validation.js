const { body, validationResult } = require("express-validator")
const utilities = require(".")
const reviewModel = require("../models/review-model")

const validate = {}

/*  **********************************
 *  Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    // Review title is required and must be string
    body("review_title")
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage("Review title must be between 5 and 100 characters."),

    // Review text is required
    body("review_text")
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Review must be between 10 and 1000 characters."),

    // Rating is required and must be 1-5
    body("review_rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5 stars."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add review
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { inv_id, review_title, review_text, review_rating } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const invModel = require("../models/inventory-model")
    const vehicle = await invModel.getVehicleById(inv_id)
    res.render("reviews/add-review", {
      errors,
      title: `Review ${vehicle[0].inv_make} ${vehicle[0].inv_model}`,
      nav,
      vehicle: vehicle[0],
      messages: null,
      review_title,
      review_text,
      review_rating
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to update review
 * ***************************** */
validate.checkUpdateReviewData = async (req, res, next) => {
  const { review_id, review_title, review_text, review_rating } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const reviewData = await reviewModel.getReviewById(review_id)
    const review = reviewData.rows[0]
    const invModel = require("../models/inventory-model")
    const vehicle = await invModel.getVehicleById(review.inv_id)
    res.render("reviews/edit-review", {
      errors,
      title: `Edit Review - ${vehicle[0].inv_make} ${vehicle[0].inv_model}`,
      nav,
      vehicle: vehicle[0],
      review: {
        ...review,
        review_title,
        review_text,
        review_rating
      },
      messages: null
    })
    return
  }
  next()
}

module.exports = validate
