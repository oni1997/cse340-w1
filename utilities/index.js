const invModel = require("../models/inventory-model")
const Util = {}

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

/* ****************************************
 *  Build the vehicle detail view HTML
 * *************************************** */
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

/* ****************************************
 *  Build the classification view HTML
 * *************************************** */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display" style="display: flex; flex-wrap: wrap; justify-content: space-around; padding: 0; list-style-type: none; gap: 1.5rem; margin: 2rem 0;">'
    data.forEach(vehicle => { 
      grid += '<li style="width: 300px; padding: 1.25rem; background-color: #f8f9fa; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.15); transition: all 0.3s ease; display: flex; flex-direction: column; align-items: center; height: 100%;">'
      grid +=  '<a href="/inv/detail/' + vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
      + ' on CSE Motors" style="width: 100%; height: auto; border-radius: 6px; margin-bottom: 1rem; object-fit: cover; aspect-ratio: 16/9;"></a>'
      grid += '<div class="namePrice" style="display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%;">'
      grid += '<h2 style="margin: 0.75rem 0; color: #2c3e50; font-size: 1.3rem; font-weight: 600;">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
      grid += '<span style="font-weight: bold; color: #e74c3c; font-size: 1.2rem; padding: 0.5rem 1rem; background-color: #f1f1f1; border-radius: 4px; margin-top: 0.5rem; margin-bottom: 0.5rem;">$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      // Add year and color information
      grid += '<p class="vehicle-year" style="margin: 0.3rem 0; font-size: 0.9rem; color: #555; font-weight: 500;">Year: ' + vehicle.inv_year + '</p>'
      grid += '<p class="vehicle-color" style="margin: 0.3rem 0; font-size: 0.9rem; color: #555; font-weight: 500;">Color: ' + vehicle.inv_color + '</p>'
      // Add a short description (truncated if too long)
      if(vehicle.inv_description) {
        const shortDesc = vehicle.inv_description.length > 100 ? 
          vehicle.inv_description.substring(0, 100) + '...' : 
          vehicle.inv_description;
        grid += '<p class="vehicle-desc" style="margin-top: 0.8rem; font-size: 0.85rem; line-height: 1.4; color: #666; text-align: left;">' + shortDesc + '</p>'
      }
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

module.exports = {
  getNav: Util.getNav,
  handleErrors: Util.handleErrors,
  buildVehicleDetail,
  buildClassificationGrid: Util.buildClassificationGrid
}
