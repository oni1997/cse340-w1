const utilities = require("../utilities/")

const triggerError = async (req, res, next) => {
  try {
    // Get the navigation before throwing the error
    const nav = await utilities.getNav()
    
    // Throw an intentional error for testing
    throw new Error("This is an intentional 500 error for testing purposes")
  } catch (error) {
    error.status = 500
    next(error)
  }
}

module.exports = { triggerError }
