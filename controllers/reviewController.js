const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ***************************
 *  Build add review view
 * ************************** */
reviewCont.buildAddReview = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const vehicle = await invModel.getVehicleById(inv_id)
    
    if (!vehicle || vehicle.length === 0) {
      req.flash("notice", "Vehicle not found.")
      return res.redirect("/")
    }
    
    const nav = await utilities.getNav()
    res.render("./reviews/add-review", {
      title: `Review ${vehicle[0].inv_make} ${vehicle[0].inv_model}`,
      nav,
      vehicle: vehicle[0],
      errors: null,
      messages: req.flash("notice"),
      review_title: "",
      review_text: "",
      review_rating: ""
    })
  } catch (error) {
    console.error("buildAddReview error:", error)
    next(error)
  }
}

/* ***************************
 *  Process add review
 * ************************** */
reviewCont.addReview = async function (req, res, next) {
  try {
    const { inv_id, review_title, review_text, review_rating } = req.body
    const account_id = res.locals.accountData.account_id
    
    // Check if user already reviewed this vehicle
    const existingReview = await reviewModel.checkExistingReview(inv_id, account_id)
    if (existingReview > 0) {
      req.flash("notice", "You have already reviewed this vehicle. You can edit your existing review.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }
    
    const result = await reviewModel.addReview(inv_id, account_id, review_title, review_text, review_rating)
    
    if (result && result.rows) {
      req.flash("notice", "Review added successfully!")
      res.redirect(`/inv/detail/${inv_id}`)
    } else {
      req.flash("notice", "Failed to add review. Please try again.")
      const vehicle = await invModel.getVehicleById(inv_id)
      const nav = await utilities.getNav()
      res.status(501).render("./reviews/add-review", {
        title: `Review ${vehicle[0].inv_make} ${vehicle[0].inv_model}`,
        nav,
        vehicle: vehicle[0],
        errors: null,
        messages: req.flash("notice"),
        review_title,
        review_text,
        review_rating
      })
    }
  } catch (error) {
    console.error("addReview error:", error)
    req.flash("notice", "Failed to add review. Please try again.")
    res.redirect(`/inv/detail/${req.body.inv_id}`)
  }
}

/* ***************************
 *  Build user reviews view
 * ************************** */
reviewCont.buildUserReviews = async function (req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id
    const reviews = await reviewModel.getReviewsByAccountId(account_id)
    
    const nav = await utilities.getNav()
    res.render("./reviews/user-reviews", {
      title: "My Reviews",
      nav,
      reviews: reviews.rows || [],
      errors: null,
      messages: req.flash("notice")
    })
  } catch (error) {
    console.error("buildUserReviews error:", error)
    next(error)
  }
}

/* ***************************
 *  Build edit review view
 * ************************** */
reviewCont.buildEditReview = async function (req, res, next) {
  try {
    const review_id = req.params.reviewId
    const account_id = res.locals.accountData.account_id
    
    const reviewData = await reviewModel.getReviewById(review_id)
    
    if (!reviewData || reviewData.rows.length === 0) {
      req.flash("notice", "Review not found.")
      return res.redirect("/reviews/")
    }
    
    const review = reviewData.rows[0]
    
    // Check if user owns this review
    if (review.account_id !== account_id) {
      req.flash("notice", "You can only edit your own reviews.")
      return res.redirect("/reviews/")
    }
    
    const vehicle = await invModel.getVehicleById(review.inv_id)
    const nav = await utilities.getNav()
    
    res.render("./reviews/edit-review", {
      title: `Edit Review - ${vehicle[0].inv_make} ${vehicle[0].inv_model}`,
      nav,
      vehicle: vehicle[0],
      review,
      errors: null,
      messages: req.flash("notice")
    })
  } catch (error) {
    console.error("buildEditReview error:", error)
    next(error)
  }
}

/* ***************************
 *  Process edit review
 * ************************** */
reviewCont.updateReview = async function (req, res, next) {
  try {
    const { review_id, review_title, review_text, review_rating } = req.body
    const account_id = res.locals.accountData.account_id
    
    // Verify ownership
    const reviewData = await reviewModel.getReviewById(review_id)
    if (!reviewData || reviewData.rows.length === 0 || reviewData.rows[0].account_id !== account_id) {
      req.flash("notice", "You can only edit your own reviews.")
      return res.redirect("/reviews/")
    }
    
    const result = await reviewModel.updateReview(review_id, review_title, review_text, review_rating)
    
    if (result && result.rows) {
      req.flash("notice", "Review updated successfully!")
      res.redirect("/reviews/")
    } else {
      req.flash("notice", "Failed to update review. Please try again.")
      res.redirect(`/reviews/edit/${review_id}`)
    }
  } catch (error) {
    console.error("updateReview error:", error)
    req.flash("notice", "Failed to update review. Please try again.")
    res.redirect("/reviews/")
  }
}

/* ***************************
 *  Process delete review
 * ************************** */
reviewCont.deleteReview = async function (req, res, next) {
  try {
    const review_id = req.params.reviewId
    const account_id = res.locals.accountData.account_id
    
    // Verify ownership
    const reviewData = await reviewModel.getReviewById(review_id)
    if (!reviewData || reviewData.rows.length === 0 || reviewData.rows[0].account_id !== account_id) {
      req.flash("notice", "You can only delete your own reviews.")
      return res.redirect("/reviews/")
    }
    
    const result = await reviewModel.deleteReview(review_id)
    
    if (result) {
      req.flash("notice", "Review deleted successfully!")
    } else {
      req.flash("notice", "Failed to delete review.")
    }
    
    res.redirect("/reviews/")
  } catch (error) {
    console.error("deleteReview error:", error)
    req.flash("notice", "Failed to delete review.")
    res.redirect("/reviews/")
  }
}

module.exports = reviewCont
