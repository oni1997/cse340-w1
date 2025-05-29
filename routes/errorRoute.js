const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")

// Route to trigger a 500 error for testing
router.get("/trigger-error", errorController.triggerError)

// Add a route for 404 errors
router.get("*", (req, res, next) => {
  const err = new Error("Page not found")
  err.status = 404
  next(err)
})

module.exports = router
