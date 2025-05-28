// Inventory routes
const express = require('express')
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to get inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to get vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildVehicleDetail))

module.exports = router