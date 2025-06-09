const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
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

/* Helper function to check if image exists or use fallback */
Util.getImagePath = function(imagePath) {
  // If path is empty or undefined, use fallback
  if (!imagePath) {
    return '/images/svg/No_image_available.svg';
  }
  return imagePath;
}

/* ****************************************
 *  Build the vehicle detail view HTML
 * *************************************** */
Util.buildVehicleDetail = function(vehicle){
  let detail = '<div class="vehicle-detail">'
  detail += '<div class="vehicle-image">'
  detail += `<img src="${Util.getImagePath(vehicle.inv_image)}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">`
  detail += '</div>'
  detail += '<div class="vehicle-info">'
  detail += `<h2>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h2>`
  detail += `<p class="price">Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
  detail += `<p>Mileage: ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>`
  detail += `<p>Color: ${vehicle.inv_color}</p>`
  detail += `<p class="description">${vehicle.inv_description}</p>`
  detail += '</div>'
  detail += '</div>'
  return detail
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
      + ' details"><img src="' + Util.getImagePath(vehicle.inv_thumbnail) 
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

/* ****************************************
 *  Build the classification select list
 * *************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Middleware For Account Type Authorization (Task 2)
 **************************************** */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin && res.locals.accountData) {
    const accountType = res.locals.accountData.account_type
    if (accountType === 'Employee' || accountType === 'Admin') {
      next()
    } else {
      req.flash("notice", "You do not have permission to access this resource.")
      return res.redirect("/account/login")
    }
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = {
  getNav: Util.getNav,
  handleErrors: Util.handleErrors,
  buildVehicleDetail: Util.buildVehicleDetail,
  buildClassificationGrid: Util.buildClassificationGrid,
  buildClassificationList: Util.buildClassificationList,
  checkJWTToken: Util.checkJWTToken,
  checkLogin: Util.checkLogin,
  checkAccountType: Util.checkAccountType
}
