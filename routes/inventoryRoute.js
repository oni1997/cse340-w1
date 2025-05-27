const express = require('express')
const router = express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to handle inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.getInventoryByClassificationId));

// Route to get vehicle detail view
router.get("/detail/:invId", invController.buildVehicleDetail);

module.exports = router