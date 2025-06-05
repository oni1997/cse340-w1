// Inventory routes
const express = require('express')
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const validate = require("../utilities/validation")

// Route to get inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to get vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildVehicleDetail))

// Route to inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Route to add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Process add classification
router.post(
  "/add-classification",
  (req, res, next) => {
    // console.log("Raw request body:", req.body);
    // console.log("Classification name from form:", req.body.classification_name);
    next();
  },
  // Validation rules
  [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name")
      .isAlphanumeric()
      .withMessage("Classification name can only contain letters and numbers, no spaces or special characters")
      .custom(async (classification_name) => {
        const classExists = await validate.checkExistingClassification(classification_name)
        if (classExists) {
          throw new Error("Classification name already exists. Please use a different name")
        }
        return true
      }),
  ],
  // Process request after validation
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // console.log("Validation errors:", errors.array());
      const nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: errors.array(),
        messages: null,
      })
      return
    }
    next()
  },
  utilities.handleErrors(invController.addClassification)
)

// Process add inventory
router.post(
  "/add-inventory",
  // Validation rules
  [
    body("classification_id")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please select a classification"),
    
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a make"),
    
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a model"),
    
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide a 4-digit year")
      .isNumeric()
      .withMessage("Year must be numeric"),
    
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description"),
    
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an image path"),
    
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail path"),
    
    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a price")
      .isNumeric()
      .withMessage("Price must be numeric"),
    
    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide mileage")
      .isNumeric()
      .withMessage("Mileage must be numeric"),
    
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color"),
  ],
  // Process request after validation
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(req.body.classification_id)
      res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: errors.array(),
        messages: null,
        ...req.body
      })
      return
    }
    next()
  },
  utilities.handleErrors(invController.addInventory)
)

module.exports = router
