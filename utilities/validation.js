const invModel = require("../models/inventory-model")

const validate = {}

/* ******************************
 * Check if classification name exists
 * ***************************** */
validate.checkExistingClassification = async (classification_name) => {
  try {
    // console.log("Checking if classification exists:", classification_name);
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await invModel.getClassificationByName(classification_name)
    // console.log("Classification check result:", classification);
    return classification.length > 0
  } catch (error) {
    console.error("checkExistingClassification error: " + error)
    return false
  }
}

module.exports = validate
