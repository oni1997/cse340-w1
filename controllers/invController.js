const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    
    // Get the classification name directly
    const classificationData = await invModel.getClassificationById(classification_id)
    let className = "Unknown"
    
    // Check if we have classification data
    if (classificationData && classificationData.length > 0) {
      className = classificationData[0].classification_name
    }
    
    // Build the grid
    const grid = await utilities.buildClassificationGrid(data || [])
    let nav = await utilities.getNav()
    
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    console.error("Controller error:", error)
    const nav = await utilities.getNav()
    res.render("./inventory/classification", {
      title: "Vehicle Category",
      nav,
      grid: '<p class="notice">An error occurred while retrieving vehicles.</p>',
      errors: error.message
    })
  }
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const vehicleData = await invModel.getVehicleById(inv_id)
    
    if (!vehicleData || vehicleData.length === 0) {
      const nav = await utilities.getNav()
      return res.status(404).render("./inventory/detail", {
        title: "Vehicle Not Found",
        nav,
        vehicleDetail: '<p class="notice">Sorry, the requested vehicle was not found.</p>'
      })
    }
    
    const vehicleDetail = utilities.buildVehicleDetail(vehicleData[0])
    const nav = await utilities.getNav()
    const make = vehicleData[0].inv_make
    const model = vehicleData[0].inv_model
    
    res.render("./inventory/detail", {
      title: make + " " + model + " Detail",
      nav,
      vehicleDetail
    })
  } catch (error) {
    console.error("getVehicleById error:", error)
    next(error)
  }
}

/* ***************************
 *  Deliver inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    // Check if flash is available before using it
    const messages = req.flash ? req.flash("notice") : null
    
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      messages,
      errors: null,
    })
  } catch (error) {
    console.error("buildManagementView error:", error)
    next(error)
  }
}

/* ***************************
 *  Deliver add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const messages = req.flash("notice")
    
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages,
      errors: null,
    })
  } catch (error) {
    console.error("buildAddClassification error:", error)
    next(error)
  }
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    // console.log("Adding classification:", classification_name)
    
    const result = await invModel.addClassification(classification_name)
    // console.log("Add classification result:", result)
    
    if (result) {
      req.flash("notice", `Classification '${classification_name}' added successfully.`)
      // Rebuild the nav with the new classification
      const nav = await utilities.getNav()
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        messages: req.flash("notice"),
        errors: null,
      })
    } else {
      req.flash("notice", "Failed to add classification.")
      res.status(501).render("./inventory/add-classification", {
        title: "Add New Classification",
        nav: await utilities.getNav(),
        messages: req.flash("notice"),
        errors: null,
      })
    }
  } catch (error) {
    console.error("addClassification error:", error)
    req.flash("notice", "Failed to add classification.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav: await utilities.getNav(),
      messages: req.flash("notice"),
      errors: null,
    })
  }
}

/* ***************************
 *  Deliver add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    const messages = req.flash("notice")
    
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      messages,
      errors: null,
    })
  } catch (error) {
    console.error("buildAddInventory error:", error)
    next(error)
  }
}

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const {
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
    } = req.body
    
    const result = await invModel.addInventory(
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
    )
    
    if (result) {
      req.flash("notice", `Vehicle ${inv_make} ${inv_model} added successfully.`)
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav: await utilities.getNav(),
        messages: req.flash("notice"),
        errors: null,
      })
    } else {
      req.flash("notice", "Failed to add vehicle.")
      const nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(classification_id)
      res.status(501).render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        messages: req.flash("notice"),
        errors: null,
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
      })
    }
  } catch (error) {
    console.error("addInventory error:", error)
    req.flash("notice", "Failed to add vehicle.")
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      messages: req.flash("notice"),
      errors: null,
      ...req.body
    })
  }
}

module.exports = invCont
