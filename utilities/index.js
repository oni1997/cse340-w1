const invModel = require("../models/inventory-model")
const Util = {}

const baseController = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

function buildVehicleDetail(vehicle) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const mileageFormatter = new Intl.NumberFormat('en-US');

  const html = `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
      </div>
      <div class="vehicle-info">
        <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p class="price">Price: ${formatter.format(vehicle.inv_price)}</p>
        <p>Year: ${vehicle.inv_year}</p>
        <p>Mileage: ${mileageFormatter.format(vehicle.inv_miles)} miles</p>
        <p>Color: ${vehicle.inv_color}</p>
        <p class="description">${vehicle.inv_description}</p>
      </div>
    </div>
  `
  return html
}

module.exports = {
  getNav: Util.getNav,
  handleErrors: Util.handleErrors,
  buildVehicleDetail
}