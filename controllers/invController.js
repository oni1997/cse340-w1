const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.getInventoryByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    data
  })
}

const buildVehicleDetail = async function (req, res, next) {
  const invId = req.params.invId
  try {
    const vehicleData = await invModel.getVehicleById(invId)
    if (vehicleData) {
      const vehicleHtml = await utilities.buildVehicleDetail(vehicleData)
      let nav = await utilities.getNav()
      res.render("./inventory/detail", {
        title: vehicleData.inv_make + " " + vehicleData.inv_model,
        nav,
        vehicleHtml
      })
    } else {
      const err = new Error("Vehicle not found")
      err.status = 404
      next(err)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildVehicleDetail,
  getInventoryByClassificationId: invCont.getInventoryByClassificationId
}