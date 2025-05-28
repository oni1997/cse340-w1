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
      return res.render("./inventory/detail", {
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
    const nav = await utilities.getNav()
    res.render("./inventory/detail", {
      title: "Vehicle Detail",
      nav,
      vehicleDetail: '<p class="notice">Sorry, there was an error loading the vehicle.</p>'
    })
  }
}

module.exports = invCont