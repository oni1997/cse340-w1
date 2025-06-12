// Review routes
const express = require('express')
const router = new express.Router() 
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const reviewValidate = require("../utilities/review-validation")

// Route to build add review view (requires login)
router.get("/add/:invId", utilities.checkJWTToken, utilities.handleErrors(reviewController.buildAddReview))

// Process add review (requires login)
router.post(
  "/add",
  utilities.checkJWTToken,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
)

// Route to view user's reviews (requires login)
router.get("/", utilities.checkJWTToken, utilities.handleErrors(reviewController.buildUserReviews))

// Route to build edit review view (requires login)
router.get("/edit/:reviewId", utilities.checkJWTToken, utilities.handleErrors(reviewController.buildEditReview))

// Process edit review (requires login)
router.post(
  "/edit",
  utilities.checkJWTToken,
  reviewValidate.reviewRules(),
  reviewValidate.checkUpdateReviewData,
  utilities.handleErrors(reviewController.updateReview)
)

// Process delete review (requires login)
router.get("/delete/:reviewId", utilities.checkJWTToken, utilities.handleErrors(reviewController.deleteReview))

module.exports = router
