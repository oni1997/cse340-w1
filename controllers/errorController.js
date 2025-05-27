const utilities = require("../utilities/")

const triggerError = async (req, res, next) => {
  try {
    throw new Error("Intentional 500 error")
  } catch (error) {
    error.status = 500
    next(error)
  }
}

module.exports = { triggerError }